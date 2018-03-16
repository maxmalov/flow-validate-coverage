#!/usr/bin/env node

const yargs = require('yargs');
const execa = require('execa');
const { getStatus } = require('flow-annotation-check');

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

function error(msg) {
  console.error(msg);
  process.exitCode = 1;
}

(async () => {
  try {
    const flowStatus = await getStatus(file);

    // skip files w/o flow annotation
    if (flowStatus === 'no flow') {
      return;
    }

    const { stdout } = await execa(flowPath || 'flow', ['coverage', file, '--json']);
    const { expressions: { covered_count, uncovered_count} } = JSON.parse(stdout);
    const coverage = covered_count / (covered_count + uncovered_count);

    if (coverage < threshold) {
      error(`${file}: coverage ${coverage.toFixed(2)}% is below the specified threshold ${threshold}%`);
    }
  } catch (e) {
    error(e);
  }
})();
