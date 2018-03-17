function map(array, fn) {
  const result = [];
  for (const item of array) {
    result.push(fn(item));
  }
  return result;
}
