#!/usr/bin/env node

import process from 'node:process';
import util from 'node:util';
import meow from 'meow';
import boxen from 'boxen';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import uniqueRandomArray from 'unique-random-array';
import asciiArt from './ascii.json' with { type: "json" };
const log = console.log;

process.emitWarning = () => {};

const chalkColors = {
  black: '#000',
  grey: '#9d9c9c',
  white: '#b9bfca',
  green: '#a8cc8c',
  red: '#e88388',
  blue: '#71bef2',
  yellow: '#dbab79',
  magenta: '#d290e4'
};

/* Return a random ASCII item. */
export function randomASCII() {
  var arrayOfItems = uniqueRandomArray(asciiArt);

  return arrayOfItems();
}

/* Return all ASCII items. */
export function allASCII() {
  return asciiArt;
}

/* Search keywords and return a random ASCII that contains it. (ex: `vehicles` or `empire`) */
export function keywordASCII(inputKeyword) {
  var items = [];
  for(var i=0;i<asciiArt.length;i++) {
    if(asciiArt[i].keywords.toLowerCase().indexOf(inputKeyword) != -1) {
      items = items.concat(asciiArt[i]);
    }
  }

  var arrayOfItems = uniqueRandomArray(items);

  return arrayOfItems();
}

/* Return specific ASCII by it's title. */
function titleASCII(inputTitle) {
  var item = '';
  for(var i=0;i<asciiArt.length;i++) {
    if(asciiArt[i].title.toLowerCase() === inputTitle) {
      item = asciiArt[i];
    }
  }

  return item;
}

export function displayASCII(ascii) {
  if(ascii && ascii.title != undefined) {
    let displayString = "\n";

    if(!cli.flags.style.includes('ascii-only')) {
      displayString += chalk.yellow("A long time ago in a galaxy far,\nfar away....\n\n");
      displayString += chalk.bgYellow.bold.black("    " + ascii.title + "    \n\n");
    }

    if(cli.flags.style.includes('box')) {
      displayString += boxen(chalk.hex(chalkColors[ascii.color]).bold(ascii.art + "\n"), {padding: 1, borderColor: ascii.color}) + "\n";
    } else {
      displayString += chalk.hex(chalkColors[ascii.color]).bold(ascii.art + "\n");
    }

    if(!cli.flags.style.includes('ascii-only')) {
      displayString += terminalLink('\n❯ Read more on Wookieepedia.', ascii.link);
    }

    displayString += "\n";

    if(cli.flags.style.includes('no-color')) {
      displayString = util.stripVTControlCharacters(displayString);
    }

    log(displayString);
  } else {
    log(chalk.red.bold('It\'s a big galaxy but we couldn\'t find what you were looking for.'));
  }
}

const cli = meow('\n Usage ' +
                 '\n $ starwars-cli [options] ' +
                 '\n Options ' +
                 '\n     --help      Provides usage help ' +
                 '\n     --all      Shows all ASCII items ' +
                 '\n     <keyword> --search      Shows a random ASCII for the keyword ' +
                 '\n     <title>      Shows the specific ASCII ' +
                 '\n     --style      box, no-color, ascii-only ' +
                 '\n Examples ' +
                 '\n     $ starwars-cli R2-D2 --search' +
                 '\n              ___ ' +
                 '\n             / ()\\ ' +
                 '\n           _|_____|_ ' +
                 '\n          | | === | | ' +
                 '\n          |_|  O  |_| ' +
                 '\n           ||  O  || ' +
                 '\n           ||__*__|| ' +
                 '\n          |~ \\___/ ~| ' +
                 '\n          /=\\ /=\\ /=\\ ' +
                 '\n       ___[_]_[_]_[_]___ ',
                 {
                  importMeta: import.meta,
                  flags: {
                    style: {
                      type: 'string',
                      default: [],
                      isMultiple: true
                    }
                  }
                 });

let ascii = randomASCII();

if(cli.input[0] != undefined && cli.flags.search) {
  /* Get by keyword. */

  let inputKeyword = cli.input[0].toLowerCase();
  var keywordascii = keywordASCII(inputKeyword);
  displayASCII(keywordascii);
} else if(cli.flags.all) {
  var asciiItems = allASCII();
  for(var i=0;i<asciiItems.length;i++) {
    displayASCII(asciiItems[i]);
  }
} else if(cli.input[0] != undefined && cli.flags.search === undefined && cli.flags.all === undefined) {
  /* Get by title. */

  var inputTitle = cli.input[0].toLowerCase();
  var titleascii = titleASCII(inputTitle);
  displayASCII(titleascii);
} else if(cli.input[0] == undefined) {
  ascii = randomASCII();
  displayASCII(ascii);
}
