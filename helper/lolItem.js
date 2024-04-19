/*
Helper file to interact with lol item data
*/

//  from a dictionary of statistics, form a dict with key-value pair of the stat as the key
//    and the amount gained + progression type as the value (the return value as being a string)

export const extractItemStatFromDict = (statDict) => {
  const extractedStatDict = {};
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [stat, statValueDict] of Object.entries(statDict)) {
    /* eslint-disable-next-line no-restricted-syntax */
    for (const [progressionType, value] of Object.entries(statValueDict)) {
      if (value > 0) {
        extractedStatDict[stat] = `${value} ${progressionType} `;
      }
    }
  }
  return extractedStatDict;
};

//  same thing as extractItemStatFromDict but return the result as an array
export const extractItemStatFromDictAsTuple = (statDict) => {
  const extractedStatDict = {};
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [stat, statValueDict] of Object.entries(statDict)) {
    /* eslint-disable-next-line no-restricted-syntax */
    for (const [progressionType, value] of Object.entries(statValueDict)) {
      if (value > 0) {
        extractedStatDict[stat] = [value, `${progressionType}`];
      }
    }
  }
  return extractedStatDict;
};

//  same thing as extractItemStatFromDict but return the result as an object
export const extractItemStatFromDictAsDict = (statDict) => {
  const extractedStatDict = {};
  /* eslint-disable-next-line no-restricted-syntax */
  for (const [stat, statValueDict] of Object.entries(statDict)) {
    /* eslint-disable-next-line no-restricted-syntax */
    for (const [progressionType, value] of Object.entries(statValueDict)) {
      if (value > 0) {
        extractedStatDict[stat] = {
          text: `${value} ${progressionType}`,
          value,
          progressionType,
        };
      }
    }
  }
  return extractedStatDict;
};

//  check if the item is currently  in the inventory
export const checkInInventory = (currentInventory, item) => {
  const itemID = item.id;
  for (let i = 0; i < currentInventory.length; i += 1) {
    if (currentInventory[i].id === itemID) {
      return true;
    }
  }
  return false;
};

//  make sure the selected item can be purchased based onn restrictions
/* eslint-disable-next-line no-unused-vars */
export const validateInventory = (currentInventory, newItem) => {
  if (currentInventory.length >= 6) {
    return false;
  }
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)

  //
  //  if everything looks fine, then return true
  return true;
};

//  DO NOT NEED THIS FUNCTION. Made temporarily when validateInventory was not made
//  if validateInventory works, then return a new state containing the item
export const reduxValidateInventory = (state, newItem) => {
  //  Need to validate only one Mythic + Mythic component
  //  Need to validate one Unique
  //  Need to validate any special interactions (ex. no navori + shojin)
  if (validateInventory(state, newItem)) {
    return [...state, newItem];
  }
  return [...state];
};

//  skeleton of a function that was going to be used but now not sure
//  export const generateInventoryComponentInfo = (state) => ({});

//  stylize the stats of an item
export const stylizeStats = (statName, statValue) => {
  const value = statValue.split(" ")[0];
  const progressionType = statValue.split(" ")[1];
  switch (statName) {
    case "attackDamage":
      return {
        name: statName,
        text: `${statValue} ${statName}`,
        value,
        progressionType,
      };
    default:
      return {
        name: statName,
        text: `${statValue} ${statName}`,
        value,
        progressionType,
      };
  }
};

//  MASTER function to return an array of item stats that is fully stylized
export const parseItemStats = (itemStats) => {
  const parsedItemStats = extractItemStatFromDict(itemStats);
  return Object.entries(parsedItemStats).map(([key, value]) =>
    stylizeStats(key, value)
  );
};

//  ===============================================================
//  Parse item descriptions to get number values

//  find the beginning and end index of {{}} or [[]] for parsing item JSON
const findStartEndIndex = (effectString) => {
  //  define variables
  let squareStartIndex = effectString.indexOf("[[");
  let curlyStartIndex = effectString.indexOf("{{");
  let startIndex;
  let endIndex;
  const counter = { "[[": 0, "{{": 0 };
  //  pick the symbol that comes first
  if (squareStartIndex !== -1 && curlyStartIndex !== -1) {
    startIndex = Math.min(squareStartIndex, curlyStartIndex);
    //  set the correct starting type
    startIndex === squareStartIndex
      ? (counter["[["] += 1)
      : (counter["{{"] += 1);
  } else if (squareStartIndex !== -1) {
    startIndex = squareStartIndex;
    counter["[["] += 1;
  } else {
    startIndex = curlyStartIndex;
    counter["{{"] += 1;
  }
  effectString = effectString.slice(startIndex + 2);
  endIndex = startIndex + 2;
  while (counter["[["] > 0 || counter["{{"] > 0) {
    //  reset start values
    squareStartIndex = effectString.indexOf("[[");
    curlyStartIndex = effectString.indexOf("{{");
    const squareEndIndex = effectString.indexOf("]]");
    const curlyEndIndex = effectString.indexOf("}}");
    const indexes = [
      squareStartIndex,
      squareEndIndex,
      curlyStartIndex,
      curlyEndIndex,
    ].filter((curr) => curr >= 0);
    const minIndex = Math.min(...indexes);
    switch (minIndex) {
      case squareStartIndex:
        counter["[["] += 1;
        break;
      case curlyStartIndex:
        counter["{{"] += 1;
        break;
      case squareEndIndex:
        counter["[["] -= 1;
        break;
      case curlyEndIndex:
        counter["{{"] -= 1;
        break;
      default:
        console.log("POTENTIAL ERROR IN FINDING START AND END INDEXES");
        console.log(effectString);
    }
    endIndex += minIndex + 2;
    effectString = effectString.slice(minIndex + 2);
  }
  return [startIndex, endIndex - 2];
};

//  STEP 1: Prep anything you have to remove from the item effect
const prepStylize = (currentPassive, isActive = false) => {
  //  currentPassive is the Passive object
  //    effect is the text description
  let { effects } = currentPassive;
  const passiveArray = [];

  //  push the name
  passiveArray.push({ format: "name", text: currentPassive.name, isActive });

  while (effects.indexOf("[[") !== -1 || effects.indexOf("{{") !== -1) {
    const [startIndex, endIndex] = findStartEndIndex(effects);
    //  const endIndex = startIndex + effects.slice(startIndex).indexOf(" ") + 1;
    //  take anything before the marker and
    passiveArray.push({
      format: "normal",
      text: effects.substring(0, startIndex),
    });
    //  NOW WE CAN RETRIEVE THE SPECIAL SYNTAX
    const specialSyntax = effects.slice(startIndex, endIndex);
    console.log(
      "specialSyntax",
      specialSyntax,
      specialSyntax.slice(0, 2) === "[["
    );
    if (specialSyntax.slice(0, 2) === "[[") {
      //  remove the special character [[]]
      const textItem = specialSyntax.slice(2);
      passiveArray.push({ format: "attack effect", text: textItem });
    } else {
      //  only other option should be "{"
      //  remove the special character {{}}
      const textItem = specialSyntax.slice(2);
      const modifiers = [
        textItem.slice(0, textItem.indexOf("|")),
        textItem.slice(textItem.indexOf("|") + 1),
      ];

      switch (modifiers[0]) {
        case "rd": {
          const middle = Math.round(modifiers[1].length / 2);

          //  melee values + remove the {{}}
          const meleeStringValue = modifiers[1]
            .slice(0, middle)
            .slice(2)
            .slice(0, -2)
            .split("|")[1]
            .split(" ");
          const rangedStringValue = modifiers[1]
            .slice(middle + 1)
            .slice(2)
            .slice(0, -2)
            .split("|")[1]
            .split(" ");
          const damageType = meleeStringValue[1].slice(0, -1);
          passiveArray.push({
            format: `${damageType}`,
            range: "melee",
            text: meleeStringValue[0],
          });
          passiveArray.push({
            format: `${damageType}`,
            range: "ranged",
            text: rangedStringValue[0],
          });
          break;
        }
        case "as": {
          //  might have to do some parsing
          if (modifiers[1].includes("{{")) {
            modifiers[1] = modifiers[1].replace("{{", "");
          }
          if (modifiers[1].includes("}}")) {
            modifiers[1] = modifiers[1].replace("}}", "");
          }
          if (modifiers[1].includes("|")) {
            const [formatType, rest] = modifiers[1].split("|");
            passiveArray.push({ format: formatType, text: rest });
          } else {
            passiveArray.push({ format: modifiers[1], text: modifiers[1] });
          }

          break;
        }
        case "tip": {
          //  not sure what to do with this yet
          passiveArray.push({ format: "tip", text: modifiers[1] });
          break;
        }
        case "fd": {
          passiveArray.push({ format: "fd", text: modifiers[1] });
          break;
        }
        default: {
          console.log(
            "--------------\n",
            "DEFAULT ITEM option in prepStylize. This should not happen\n",
            `START INDEX:${startIndex}\n`,
            `END INDEX:${endIndex}\n`,
            effects
          );
          console.log("MODIFIERS: \n", modifiers[0], "\n", modifiers[1]);
          passiveArray.push({ format: "error", text: modifiers[1] });
        }
      }
    }

    effects = effects.slice(endIndex + 2); // add 2 to remove the last }} or ]]
  }
  //  add the remainer to the passive array
  passiveArray.push({ format: "normal", effects });
  return passiveArray;
};

//  Step 2: replace any segments (ex. AD) with the stat value
const numerize = (formattedPassives, currentStats) => {
  const numerizedPassives = formattedPassives.map((eachPassive) =>
    eachPassive.map((eachEffect) => {
      let text;
      switch (eachEffect.format) {
        case "AD":
          text = `${(
            (parseFloat(eachEffect.text.slice(0, -1)) / 100.0) *
            currentStats.attackDamage
          ).toFixed(2)} or (${eachEffect.text} AD)`;
          break;
        //  idk what to do with attack effect yet
        case "attack effect":
          text = eachEffect.text;
          break;
        case "fd":
        case "name":
        case "normal":
          text = eachEffect.text;
          break;
        case "error":
          text = eachEffect.text;
          break;
        //  default should generally not happen. is a catch all
        default:
          text = eachEffect.text;
          console.log(
            "Potential error in Numerize Item data. Format is ",
            eachEffect.format
          );
          break;
      }
      return { ...eachEffect, text };
    })
  );
  return numerizedPassives;
};

//  Optional Step: maybe not necessary. check if item has special conditions
/* eslint-disable-next-line no-unused-vars */
const modifyAttribute = (itemName, attribute) => attribute;

//  Step 3: this will colorize the text and leave it in its final form
const colorizeAndFinalize = (numerizedPassives) => {
  const colorizedPassives = numerizedPassives.map((eachPassive) => {
    const passiveName = eachPassive[0].text;
    const passiveText = eachPassive.map((eachEffect, index) => {
      switch (eachEffect.format) {
        //  attack damage
        case "AD":
        case "physical damage": {
          if (eachEffect.range && eachEffect.range === "melee") {
            return (
              <span
                key={`${passiveName}_${index}_melee`}
                className="text-red-800"
              >
                {" "}
                melee {eachEffect.text} /
              </span>
            );
          }
          if (eachEffect.range && eachEffect.range === "ranged") {
            return (
              <span
                key={`${passiveName}_${index}_ranged`}
                className="text-red-800"
              >
                {" "}
                ranged {eachEffect.text}{" "}
              </span>
            );
          }
          if (!eachEffect.range) {
            return (
              <span
                key={`${passiveName}_${index}_none`}
                className="text-red-800"
              >
                {eachEffect.text}
              </span>
            );
          }
          break;
        }

        //  attack effect
        case "attack effect": {
          return (
            <span key={`${passiveName}_${index}_ae`}>{eachEffect.text}</span>
          );
        }
        //  specific tip effects
        case "tip effect": {
          return (
            <span key={`${passiveName}_${index}_tip`}>{eachEffect.text}</span>
          );
        }
        //  name
        case "name": {
          return (
            <div
              key={`${passiveName}_${index}_name`}
              className={`font-bold ${eachEffect.isActive ? "text-gold-4" : "text-gold-1"}`}
            >
              {eachEffect.isActive && "Active - "}
              {eachEffect.text}
            </div>
          );
        }
        //  normal
        case "normal": {
          return (
            <span key={`${passiveName}_${index}_normal`}>
              {eachEffect.text}
            </span>
          );
        }
        //  error case
        case "error": {
          return (
            <span
              key={`${passiveName}_${index}_error`}
              className="text-orange-700"
            >
              {eachEffect.text}
            </span>
          );
        }

        //  default catch-all for errors
        default: {
          console.log(
            "potential error in ColorizeAndFinalize. format is: ",
            eachEffect.format,
            "and text is ",
            eachEffect.text
          );
          return (
            <span key={`${passiveName}_${index}_default`}>
              {eachEffect.text}
            </span>
          );
        }
      }
      //
      console.log("Possible error in colorize and finalize");
      return <span key={`${passiveName}_${index}`}>{eachEffect.text}</span>;
    });
    return { name: passiveName, text: passiveText };
  });
  return colorizedPassives;
};

//  MASTER FUNCTION to parse item passive / active descriptions
const parseItemPA = (passives, active, currentStats) => {
  //  go through the passives
  //  prep to be stylized
  let formattedPassives = passives.map((eachPassive) =>
    prepStylize(eachPassive)
  );
  //  replace the %s with numbers
  formattedPassives = numerize(formattedPassives, currentStats);
  //  add the desired colors
  formattedPassives = colorizeAndFinalize(formattedPassives);
  //  ==============================================================================
  //  go through the active
  //  prep to be stylized
  let formattedActive = active.map((eachActive) =>
    prepStylize(eachActive, true)
  );
  //  replace the %s with numbers
  formattedActive = numerize(formattedActive, currentStats);
  //  add the desired colors
  formattedActive = colorizeAndFinalize(formattedActive);

  //  return everything
  return { passives: formattedPassives, active: formattedActive };
};

//    This will return an object with every information you need in an object to display information
export const parseItemData = (championName, currentStats, itemData) => {
  const masterRes = {};
  //  get name and ID
  masterRes.name = itemData.name;
  masterRes.id = itemData.id;
  masterRes.requiredAlly = itemData.requiredAlly;
  masterRes.icon = itemData.icon;
  masterRes.simpleDescription = itemData.simpleDescription;
  masterRes.totalPrice = itemData.shop.prices.total;
  //  get the item stat information
  const parsedItemStats = extractItemStatFromDict(itemData.stats);
  const statArray = Object.entries(parsedItemStats).map(([key, value]) =>
    stylizeStats(key, value)
  );
  masterRes.statArray = statArray;
  //  console.log(itemData);
  //  this following section is related to parsing item passive and actives
  const { passives, active } = parseItemPA(
    itemData.passives,
    itemData.active,
    currentStats
  );
  masterRes.passives = passives;
  masterRes.active = active;
  return masterRes;
};
