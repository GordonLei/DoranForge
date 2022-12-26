/*
export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
*/

export const objectMapArray = (obj, fn) => {
  const mappedArray = [];
  //  console.log(Object.entries(obj));
  for (const [key, value] of Object.entries(obj)) {
    mappedArray.push(fn(key, value));
  }

  return mappedArray;
};
