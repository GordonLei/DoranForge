export const objectMap = (obj, fn) => {
  let mappedObject = {};
  //  console.log(Object.entries(obj));
  for (const [key, value] of Object.entries(obj)) {
    mappedObject[key] = fn(key, value);
  }

  return mappedObject;
};

export const objectMapArray = (obj, fn) => {
  const mappedArray = [];
  //  console.log(Object.entries(obj));
  for (const [key, value] of Object.entries(obj)) {
    mappedArray.push(fn(key, value));
  }

  return mappedArray;
};
