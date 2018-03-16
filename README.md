# flow-validate-coverage

Simple utility to check whether flow coverage of a single javascript file satisfies the specified threshold

## Installation

```
npm install maxmalov/flow-validate-coverage
```

## Usage

```
npx flow-validate-coverage -i ./foo.js -t 80 -f ./node_modules/.bin/flow
```

See `npx flow-validate-coverage --help` for detailed help.

### Lint staged example

This tool is designed mostly for [lint-staged](https://github.com/okonet/lint-staged) integration. This will prevent you from committing files with low flow coverage:

```json
{
  "lint-staged": {
    "*.js": [
      "flow-validate-coverage -t 85 -f ./node_modules/.bin/flow -i"
    ]
  }
}
```
