#!/usr/bin/env node

const log = console.log;
const meow = require('meow');
const boxen = require('boxen');
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const terminalLink = require('terminal-link');
const uniqueRandomArray = require('unique-random-array');
const asciiArt = require('./ascii.json');

module.exports={
  random: randomASCII,
  all: allASCII,
  keyword: keywordASCII
};

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
function randomASCII() {
  var arrayOfItems = uniqueRandomArray(asciiArt);

  return arrayOfItems();
}

/* Return all ASCII items. */
function allASCII() {
  return asciiArt;
}

/* Search keywords and return a random ASCII that contains it. (ex: `vehicles` or `empire`) */
function keywordASCII(inputKeyword) {
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

function displayASCII(ascii) {
  if(ascii.title != undefined) {
    displayString = "\n";

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
      displayString = stripAnsi(displayString);
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
                 '\n     $ starwars-cli R2-D2 ' +
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
                  flags: {
                    style: {
                      type: 'string',
                      default: [],
                      isMultiple: true
                    }
                  }
                 });

ascii = randomASCII();

if(cli.input[0] != undefined && cli.flags.search) {
  /* Get by keyword. */

  inputKeyword = cli.input[0].toLowerCase();
  var keywordascii = keywordASCII(inputKeyword);
  displayASCII(keywordascii);
} else if(cli.flags.all) {
  var asciiItems = allASCII();
  for(i=0;i<asciiItems.length;i++) {
    displayASCII(asciiItems[i]);
  }
} else if(cli.input[0] != undefined && cli.flags.search === undefined && cli.flags.all === undefined) {
  /* Get by title. */

  inputTitle = cli.input[0].toLowerCase();
  var titleascii = titleASCII(inputTitle);
  displayASCII(titleascii);
} else if(cli.input[0] == undefined) {
  ascii = randomASCII();
  displayASCII(ascii);
}
