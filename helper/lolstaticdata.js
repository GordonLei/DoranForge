/*
Helper file for Meraki-Analytics' LoL Static Data
*/
//  libraries
import axios from "axios";
import { round } from "lodash";
//  helper functions
import {
  objectMap,
  caseInsensitiveReplace,
  findWord,
  checkSubset,
} from "./misc";

//

/*
get the related champion data from the JSON contained in merakianalytics
*/
export const getChampionInfo = async (patchVersion, name) => {
  const lolStaticDataURL = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${name}.json`;
  return axios
    .get(lolStaticDataURL)
    .then((response) => {
      //  ideally something to save the data into a file + folder
      const { data } = response;
      //    for now, just check if the patchVersion matches the version from merakianalytics
      if (data.icon.split("/")[4] === patchVersion) {
        return data;
      }
      throw new Error(
        "need to consult Merakianalytics; might be a mismatch in Patch # + need to update"
      );
    })
    .catch((err) => {
      console.log(
        "==========\n",
        "Error in getChampionJson\n",
        err,
        "\n",
        "==========\n"
      );
    });
};
/* seperate base stats and perLevel stats from the champion json */
export const parseStats = (stats) => {
  const baseStats = {
    health: stats.health.flat,
    mana: stats.mana.flat,
    armor: stats.armor.flat,
    magicResistance: stats.magicResistance.flat,
    healthRegen: stats.healthRegen.flat,
    manaRegen: stats.manaRegen.flat,
    attackDamage: stats.attackDamage.flat,
    attackSpeed: stats.attackSpeed.flat,
    moveSpeed: stats.movespeed.flat,
    attackRange: stats.attackRange.flat,
    abilityPower: 0,
    crit: 0,
  };

  const perLevelStats = {
    healthPerLevel: stats.health.perLevel,
    manaPerLevel: stats.mana.perLevel,
    armorPerLevel: stats.armor.perLevel,
    magicResistancePerLevel: stats.magicResistance.perLevel,
    healthRegenPerLevel: stats.healthRegen.perLevel,
    manaRegenPerLevel: stats.manaRegen.perLevel,
    attackDamagePerLevel: stats.attackDamage.perLevel,
    attackSpeedPerLevel: stats.attackSpeed.perLevel,
    moveSpeedPerLevel: stats.movespeed.perLevel,
    attackRangePerLevel: stats.attackRange.perLevel,
    abilityPowerPerLevel: 0,
    critPerLevel: 0,
  };
  return { baseStats, perLevelStats };
};

//  create an object where for each key / ability,
//    all the ability  descriptions are combined into one message
export const combineAbilityDescriptions = (abilitiesObject) => {
  const combinedAbilityDescriptionsObject = objectMap(
    abilitiesObject,
    (key, value) =>
      //  now map through the array that is the value of the key
      //    recall that the key-value pair looks like "P"-[{name:...}, {}, ...]
      value
        .map((eachAbilityComponent) =>
          //  recall eachAbilityComponent has an effects array that contains descriptions
          eachAbilityComponent.effects
            .map(
              (eachEffectComponent) =>
                //  recall eachEffectComponent like {description: ..., leveling:[...], ... }
                eachEffectComponent.description
            )
            .join(" ")
        )
        .join(" ")
  );
  return combinedAbilityDescriptionsObject;
};

//  combine the names of abilities if applicable (if the name contains multiple words)
export const combineNames = (abilitiesObject) => {
  const combinedNamesObject = objectMap(abilitiesObject, (key, value) =>
    //  now map through the array that is the value of the key
    //    recall that the key-value pair looks like "P"-[{name:...}, {}, ...]
    value.map((eachAbilityComponent) => eachAbilityComponent.name).join(" ")
  );
  return combinedNamesObject;
};

//  Master function to create an object where abilities + passives are mapped  to letters / buttons
export const formatAbilities = (abilitiesObject) => {
  //  final formatted object
  const formatted = { P: {}, Q: {}, W: {}, E: {}, R: {} };
  const abilityID = ["P", "Q", "W", "E", "R"];
  //  add the descriptions
  const combinedDescriptions = combineAbilityDescriptions(abilitiesObject);
  const combinedNames = combineNames(abilitiesObject);
  //  do everything for formatting
  //  basically  for each letter, make the value within FORMATTED...
  //    contain the full name
  //    contain the full ability  description
  //    contain the full ability tooltip (iirc this is the most descriptive form)
  abilityID.forEach((ability) => {
    formatted[ability] = {
      ...formatAbilities[ability],
      name: combinedNames[ability],
      description: combinedDescriptions[ability],
      tooltip: combinedDescriptions[ability],
    };
  });
  return formatted;
};

//  add the number values into the text. basically  calculate the  numbers
const numerize = (
  text,
  currentStats = {
    health: 1,
    mana: 1,
    armor: 1,
    magicResistance: 1,
    healthRegen: 1,
    manaRegen: 1,
    attackDamage: 1,
    attackSpeed: 1,
    moveSpeed: 1,
    attackRange: 1,
    crit: 0,
    abilityPower: 0,
  },
  baseStats = {
    health: 1,
    mana: 1,
    armor: 1,
    magicResistance: 1,
    healthRegen: 1,
    manaRegen: 1,
    attackDamage: 1,
    attackSpeed: 1,
    moveSpeed: 1,
    attackRange: 1,
    crit: 0,
    abilityPower: 0,
  }
) => {
  const oldText = text;
  const modifierComponents = oldText.split("+").map((each) => each.trim());
  console.log("MODIFIERS:", modifierComponents);
  const numerizedText = modifierComponents.reduce(
    (accumulator, currentValue) => {
      //    if current value is a number and is NOT a percent, just add it
      if (!currentValue.includes("%") && parseFloat(currentValue)) {
        return accumulator + parseFloat(currentValue, 10);
      }
      //  split the value to seperate number and stat value
      const baseArray = currentValue.split(" ");
      //  remove percent sign
      baseArray[0] = baseArray[0].replace("%", "");
      //  If this value is not a number, an error occured
      if (Number.isNaN(parseFloat(baseArray[0]))) {
        console.log("ERROR IN LOLSTATDATA NUMERIZE");
        return -1;
      }
      //  if you are AP AND AD, calculate the mix-dmg ratio
      if (checkSubset(baseArray, ["ap", "ad"])) {
        return (
          accumulator +
          (parseFloat(baseArray[0]) / 100.0) * currentStats.attackDamage +
          (parseFloat(baseArray[0]) / 100.0) * currentStats.abilityPower
        );
      }
      if (checkSubset(baseArray, ["bonus", "ad"])) {
        return (
          accumulator +
          (parseFloat(baseArray[0]) / 100.0) *
            (currentStats.attackDamage - baseStats.attackDamage)
        );
      }
      if (checkSubset(baseArray, ["bonus", "ap"])) {
        return (
          accumulator +
          (parseFloat(baseArray[0]) / 100.0) *
            (currentStats.abilityPower - baseStats.abilityPower)
        );
      }
      if (checkSubset(baseArray, ["ad"])) {
        return (
          accumulator +
          (parseFloat(baseArray[0]) / 100.0) * currentStats.attackDamage
        );
      }
      if (checkSubset(baseArray, ["ap"])) {
        //  console.log(currentStats["abilityPower"]);
        return (
          accumulator +
          (parseFloat(baseArray[0]) / 100.0) * currentStats.abilityPower
        );
      }
      //
      console.log("POTENTIAL ERROR in Numerize Function", baseArray);
      return accumulator;
    },
    0
  );
  console.log("NT: ", numerizedText);
  console.log("MC: ", modifierComponents);
  if (!numerizedText) {
    return oldText;
  }
  //  return the calculated value with the calculation equation next to it
  return `${round(numerizedText, 2)} (or ${oldText})`;
};

const modifyAttribute = (championName, attribute) => {
  //  check for special cases where the Stylize functions will not catch
  if (
    (attribute.includes("cast damage") ||
      attribute.includes("sweetspot damage") ||
      attribute.includes("total")) &&
    championName === "Aatrox"
  ) {
    return `${attribute.replace("damage", "")}physical damage`;
  }
  return attribute;
};

//  do steps before stlyzing text, such as formatting text
const prepStylize = (
  championName,
  abilitiesObject,

  currentStats,
  baseStats,
  pointAllocation = {
    Q: 1,
    W: 1,
    E: 1,
    R: 1,
  }
) => {
  const skillNames = {
    Q: [],
    W: [],
    E: [],
    R: [],
    P: [],
  };
  const prepped = objectMap(abilitiesObject, (key, value) => {
    //  for each ability, get  the tooltip and map...

    /*

    Note the structure of a Champion JSON looks like this 
    { ...,
      abilities: {
        "P": [
          {name:..., icon:..., 
                effects: [
                  {
                    description: ""
                    leveling: []
                  }
                ]
            , }
        ]
      }
      
    }
    */

    const tooltip = value
      .map((eachAbilityComponent) => {
        //  get the Skill Button based on the image
        const skillButtonName = eachAbilityComponent.icon
          .split("/")
          .slice(-1)[0]
          .toUpperCase();
        //  find how many points have been allocated
        const allocatedPoints = pointAllocation[skillButtonName];
        //  update the SkillName object  that represents the Champion's abilities
        skillNames[skillButtonName].push(eachAbilityComponent.name);
        //  recall eachAbilityComponent has an effects array that contains descriptions
        return eachAbilityComponent.effects.map((eachEffectComponent) => {
          //  recall eachEffectComponent like {description: ..., leveling:[...], ... }
          // THIS IS WHERE WE MODIFY THE DESCRIPTIONS
          let modifiedDescription = eachEffectComponent.description;
          //  map through the leveling which represents the numerical values that change when you skill up
          eachEffectComponent.leveling.map((eachLevelComponent) => {
            //  map through the modifiers based on point allocation
            const attribute = modifyAttribute(
              championName,
              eachLevelComponent.attribute.toLowerCase()
            );
            //  for each of the numerical value that changes in a skill, create an array of strings
            //    that combines the values and units
            //  this represents an array with all the numerical changes to a skill at a specific point allocation
            const modifiers = eachLevelComponent.modifiers.map(
              (modifierObject) =>
                //  console.log(modifierObject);
                `${modifierObject.values[allocatedPoints - 1]}${
                  modifierObject.units[allocatedPoints - 1]
                }`
            );
            //  console.log(modifiers);
            //  replace the attribute with the modifiers
            //  join each modifier
            const joinedModifiers = modifiers.join(" + ");
            //  now replace the equations with numbers in the modifier
            const numerizedModifiers = numerize(
              joinedModifiers,
              currentStats,
              baseStats
            );
            //  create a string representation of the modifier that is to be parsed
            const replacement = `<${attribute}> ${numerizedModifiers} </${attribute}>`;
            //  replace any of the modifiers in the description with the replacement
            modifiedDescription = caseInsensitiveReplace(
              modifiedDescription,
              attribute,
              replacement
            );
            const keyword = [
              "total",
              "maximum",
              "cast",
              "sweetspot",
              "healing",
            ];
            //  for now, if the decription has some of these keywords and they are not replaced, add it to the end of the description
            for (let i = 0; i < keyword.length; i += 1) {
              if (attribute.includes(keyword[i])) {
                modifiedDescription += `<seperate> ${replacement} </seperate> `;
                break;
              }
            }
            //  does not matter what we return here. this is here to solve ESLINT error
            return 0;
          });
          return modifiedDescription;
        });
      })
      .flat(); //  now flatten the outputs
    return { tooltip };
  });
  //  now add the names

  prepped.P.name = skillNames.P.join(" ");
  prepped.Q.name = skillNames.Q.join(" ");
  prepped.W.name = skillNames.W.join(" ");
  prepped.E.name = skillNames.E.join(" ");
  prepped.R.name = skillNames.R.join(" ");

  return prepped;
};

//  this will parse through a description and add colors to the numbers + type
const lolTextParser = (propText, skillButtonName) => {
  let text = propText;
  //  this will represent a sentence
  const sentence = [];
  //  look for flags that look like <attribute> ... </attribute>
  while (text.indexOf("<") !== -1) {
    let startIndex = text.indexOf("<");
    let endIndex = text.indexOf(">");
    let keyword = text.substring(startIndex + 1, endIndex);
    let seperateFlag = false;
    //  take anything before the marker and
    sentence.push({
      format: "normal",
      text: text.substring(0, startIndex),
    });
    //  check for a flag of newline ???
    if (keyword === "seperate") {
      sentence.push({
        format: "seperate",
        text: "",
      });
      text = text.replace("<seperate>", "").replace("</seperate>", "");
      startIndex = text.indexOf("<");
      endIndex = text.indexOf(">");
      keyword = text.substring(startIndex + 1, endIndex);
      seperateFlag = true;
    }
    //  find the end of the keyword
    const closer = text.indexOf(`</${keyword}>`);
    //  push the thing within the text
    sentence.push({
      format: seperateFlag ? `seperate ${keyword}` : keyword,
      text: `${text.substring(endIndex + 1, closer)} ${keyword}`,
    });
    //  add 3 to account for 2 chars of </, 1 char for the space the closing >
    text = text.substring(closer + keyword.length + 3);
  }
  //  push the remainder as normal formatted text
  sentence.push({ format: "normal", text });
  //  console.log("SENTENCE:", sentence);
  // now create the divs
  //  colorize words with specific meanings
  return sentence.map((item, index) => {
    const potentialClass = item.format.includes("seperate")
      ? " seperateStat "
      : "";
    switch (item.format) {
      case findWord(item.format, "heal"):
        return (
          <span
            className={`text-green-700 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {item.text}
          </span>
        );
      case findWord(item.format, "slow"):
        return (
          <span
            className={`text-cyan-400 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {item.text}
          </span>
        );
      case findWord(item.format, "magic damage"):
        return (
          <span
            className={`text-blue-700 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {item.text}
          </span>
        );
      case findWord(item.format, "physical damage"):
      case findWord(item.format, "attack damage"):
        return (
          <span
            className={`text-red-800 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {item.text}
          </span>
        );

      case findWord(item.format, "movement speed"):
        return (
          <span
            className={`text-yellow-500 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {item.text}
          </span>
        );
      case findWord(item.format, "seperate"):
        return <br key={`${skillButtonName}_${index}`} />;
      case findWord(item.format, "normal"):
      default:
        return <span key={`${skillButtonName}_${index}`}> {item.text} </span>;
    }
  });
};
//  master "stylize" function that replaces equations and add colors
const stylize = (abilitiesObject) => {
  const ao = abilitiesObject;
  const skillButonNames = ["P", "Q", "W", "E", "R"];
  skillButonNames.forEach((name) => {
    ao[name].tooltip = ao[name].tooltip.map((part) =>
      lolTextParser(part, name)
    );
  });

  return ao;
};

//  Master function that parses champion ability formation with the stats and return desired information
export const parse = (
  championName,
  abilitiesObject,
  pointAllocation,
  currentStats,
  baseStats
) => {
  let parsedAO;
  //  prepare for anything prior to stylize
  parsedAO = prepStylize(
    championName,
    abilitiesObject,
    currentStats,
    baseStats,
    pointAllocation
  );
  //  parsedAO = convertToStats(parsedAO, stats);
  //  now add the specific stylizations
  parsedAO = stylize(parsedAO);
  //  console.log(parsedAO);
  return parsedAO;
};

/*

*/

export const getAllItemInfo = async () => {
  const lolStaticDataURL = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json`;
  return axios
    .get(lolStaticDataURL)
    .then((response) => {
      //  ideally something to save the data into a file + folder
      const { data } = response;
      //    for now, just check if the patchVersion matches the version from merakianalytics
      if (data) {
        return data;
      }
      throw new Error("need to consult DDragon");
    })
    .catch((err) => {
      console.log(
        "==========\n",
        "Error in getChampionJson\n",
        err,
        "\n",
        "==========\n"
      );
    });
};
