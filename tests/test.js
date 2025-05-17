import test from 'ava';
import { allASCII, randomASCII, keywordASCII } from '../index.js';

test('displays random ascii', t => {
	const starwarsAscii = randomASCII();

	if(starwarsAscii.title && starwarsAscii.keywords && starwarsAscii.art && starwarsAscii.color && starwarsAscii.link) {
		t.pass();
	} else {
		t.fail();
	}
});

test('displays all ascii', t => {
	const starwarsAscii = allASCII();

	t.snapshot(starwarsAscii);
});

test('displays ascii from search', t => {
	const starwarsAscii = keywordASCII('starwarslogo');

	t.snapshot(starwarsAscii);
});

test('displays ascii from search that does not exist', t => {
	const starwarsAscii = keywordASCII('trek');

	t.snapshot(starwarsAscii);
});
