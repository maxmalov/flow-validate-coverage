// @flow

function map<T, R>(array: Array<any>, fn: Function): Array<any> {
  const result = [];
  for (const item of array) {
    result.push(fn(item));
  }
  return result;
}
