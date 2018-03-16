#!/usr/bin/env node

const yargs = require('yargs');
const execa = require('execa');
const { genCheckFlowStatus } = require('flow-annotation-check');

const argv = yargs
  .usage('Usage: $0 [options]')
  .example('$0 -t 85 -i ./foo.js', 'Validates flow coverage of foo.js is greater or equal to 85%')
  .option('input', {
    alias: 'i',
    describe: 'Load this file'
  })
  .option('threshold', {
    alias: 't',
    describe: 'The minimum coverage below which the command will fail'
  })
  .option('flow-path', {
    alias: 'f',
    describe: 'Custom flow binary path'
  })
  .demandOption(['threshold', 'input'])
  .help()
  .argv;

const { f: flowPath, threshold, input: file } = argv;

function error(msg) {
  console.error(msg);
  process.exitCode = 1;
}

(async () => {
  try {
    const flowBin = flowPath || 'flow';
    const flowStatus = await genCheckFlowStatus(flowBin, file);

    // skip files w/o flow annotation
    if (flowStatus === 'no flow') {
      return;
    }

    const { stdout } = await execa(flowBin, ['coverage', file, '--json']);
    const { expressions: { covered_count, uncovered_count} } = JSON.parse(stdout);
    const coverage = (covered_count / (covered_count + uncovered_count)) * 100;

    if (coverage < threshold) {
      error(`${file}: coverage ${coverage.toFixed(2)}% is below the specified threshold ${threshold}%`);
    }
  } catch (e) {
    error(e);
  }
})();
