const execa = require('execa');
const bin = require.resolve('./cli');
const { noFlow, flowLow, flowHigh } = require('./__fixtures__');

const run = args => execa(bin, args);

function expectToFailWith(e, expectedMessage) {
  expect(e.code).toEqual(1);
  expect(e.stderr).toEqual(expect.stringContaining(expectedMessage));
}

test('input file is required', async () => {
  expect.hasAssertions();
  try {
    await run(['-t20']);
  } catch (e) {
    expectToFailWith(e, 'Missing required argument: input');
  }
});

test('threshold is required', async () => {
  expect.hasAssertions();
  try {
    await run([`-i${noFlow}`]);
  } catch (e) {
    expectToFailWith(e, 'Missing required argument: threshold');
  }
});

test('should skip file w/o flow annotation by default', async () => {
  await run(['-t85', `-i${noFlow}`]);
});

test('should fail on file w/o flow annotation', async () => {
  expect.hasAssertions();
  try {
    await run(['-a', '-t85', `-i${noFlow}`]);
  } catch (e) {
    expectToFailWith(e, 'is below the specified threshold');
  }
});

test('should fail on file with low coverage', async () => {
  expect.hasAssertions();
  try {
    await run(['-t85', `-i${flowLow}`]);
  } catch (e) {
    expectToFailWith(e, 'is below the specified threshold');
  }
});

test('should pass on file with high coverage', async () => {
  await run(['-t85', `-i${flowHigh}`]);
});
