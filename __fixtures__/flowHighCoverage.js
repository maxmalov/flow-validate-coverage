// @flow

function map<T, R>(array: $ReadOnlyArray<T>, fn: (item: T) => R): $ReadOnlyArray<R> {
  const result = [];
  for (const item of array) {
    result.push(fn(item));
  }
  return result;
}
