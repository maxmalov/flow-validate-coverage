# flow-lint-coverage
[![Build Status](https://travis-ci.org/maxmalov/flow-lint-coverage.svg?branch=master)](https://travis-ci.org/maxmalov/flow-lint-coverage)

Simple utility to check whether flow coverage of a single javascript file satisfies the specified threshold

## Installation

```
npm install maxmalov/flow-lint-coverage
```

## Usage

```
npx flow-lint-coverage -i ./foo.js -t 80 -f ./node_modules/.bin/flow
```

See `npx flow-lint-coverage --help` for detailed help.

### Lint staged example

This tool is designed mostly for [lint-staged](https://github.com/okonet/lint-staged) integration. This will prevent you from committing files with low flow coverage:

```json
{
  "lint-staged": {
    "*.js": [
      "flow-lint-coverage -t 85 -f ./node_modules/.bin/flow -i"
    ]
  }
}
```
