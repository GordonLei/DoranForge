/*

Helper functions that do not fall into a category

*/

//  map an object with a function to return a new object
export const objectMap = (obj, fn) => {
  let mappedObject = {};
  //  console.log(Object.entries(obj));
  for (const [key, value] of Object.entries(obj)) {
    mappedObject[key] = fn(key, value);
  }

  return mappedObject;
};

//  mape an object with a function but return the result as an array
export const objectMapArray = (obj, fn) => {
  const mappedArray = [];
  //  console.log(Object.entries(obj));
  for (const [key, value] of Object.entries(obj)) {
    mappedArray.push(fn(key, value));
  }

  return mappedArray;
};

//  case insensitive replace a word in the string
export const caseInsensitiveReplace = (currStr, replaced, replacement) => {
  const reg = new RegExp(new RegExp(replaced + "s?"), "gi");
  return currStr.replace(reg, replacement);
};

//  find if a word is in the base (case insensitive)
//  ONLY USED FOR IN A SWITCH/CASE statement
export const findWord = (base, find) => {
  base = base.trim().toLowerCase();
  find = find.trim().toLowerCase();
  if (base.includes(find)) {
    return base;
  }
};

//  check if an array is a subset of another
export const checkSubset = (baseArray, subsetArray) => {
  baseArray = baseArray.map((each) => {
    return each.trim().toLowerCase();
  });
  subsetArray = subsetArray.map((each) => {
    return each.trim().toLowerCase();
  });
  return subsetArray.every((val) => baseArray.includes(val));
};
