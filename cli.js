#!/usr/bin/env node

const yargs = require('yargs');
const execa = require('execa');

const argv = yargs
  .usage('Usage: $0 [options] file')
  .example('$0 -t 85 ./foo.js', 'Validates foo.js flow coverage against the specified threshold')
  .alias('t', 'threshold')
  .describe('t', 'The minimum coverage below which the command will fail')
  .alias('f', 'flow-path')
  .describe('f', 'Custom flow binary path')
  .help()
  .argv;

const { f: flowPath, t: threshold, _: [file] } = argv;

const covRegex = /Covered: ([^%]+)%/;

function error(msg) {
  console.error(msg);
  process.exitCode = 1;
}

(async () => {
  try {
    const { stdout } = await execa(flowPath || 'flow', ['coverage', file]);
    const lines = stdout.split('\n');
    const report = lines[lines.length - 2];
    const [ _, coverage ] = report.match(covRegex);
    const numeric = Number(coverage);

    if (isNaN(numeric)) {
      error('Cannot parse flow coverage info');
      return;
    }

    if (numeric < threshold) {
      error(`${file}: coverage ${numeric}% is below the specified threshold ${threshold}%`);
    }
  } catch (e) {
    error(e);
  }
})();
