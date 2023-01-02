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

export const caseInsensitiveReplace = (currStr, replaced, replacement) => {
  const reg = new RegExp(new RegExp(replaced + "s?"), "gi");
  return currStr.replace(reg, replacement);
};

export const findWord = (base, find) => {
  base = base.trim().toLowerCase();
  find = find.trim().toLowerCase();
  if (base.includes(find)) {
    return base;
  }
};

export const checkSubset = (baseArray, subsetArray) => {
  baseArray = baseArray.map((each) => {
    return each.trim().toLowerCase();
  });
  subsetArray = subsetArray.map((each) => {
    return each.trim().toLowerCase();
  });
  return subsetArray.every((val) => baseArray.includes(val));
};
