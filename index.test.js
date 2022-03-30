const { getValidHeading } = require('./src/headings');

//headings.js | getValidHeading()

test('[getValidHeading()] Returns Same heading',  () => {
  expect(getValidHeading("h2", "h1")).toBe("h2");
});

test('[getValidHeading()] Change Heading to fit structure', () => {
  expect(getValidHeading("h5", "h1")).toBe("h2");
});

test('[getValidHeading()] Allow returning to higher headings', () => {
  expect(getValidHeading("h1", "h4")).toBe("h1");
});

//TODO more tests :)
