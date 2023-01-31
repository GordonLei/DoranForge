/*
Helper file for Meraki-Analytics' LoL Static Data
*/
import axios from "axios";
import {
  objectMap,
  caseInsensitiveReplace,
  findWord,
  checkSubset
} from "./misc";
import { round } from "lodash";
//

/*
get the related champion data from the JSON
*/
export const getChampionInfo = async (patchVersion, name) => {
  const lolStaticDataURL = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${name}.json`;
  return await axios
    .get(lolStaticDataURL)
    .then((response) => {
      //  ideally something to save the data into a file + folder
      const data = response.data;
      //    for now, just check if the patchVersion matches the version from merakianalytics
      if (data.icon.split("/")[4] === patchVersion) {
        return data;
      } else {
        throw new Error("need to consult DDragon");
      }
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
    crit: 0
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
    critPerLevel: 0
  };
  return { baseStats, perLevelStats };
};

export const combineAbilityDescriptions = (abilitiesObject) => {
  const combinedAbilityDescriptionsObject = objectMap(
    abilitiesObject,
    (key, value) => {
      //  now map through the array that is the value of the key
      //    recall that the key-value pair looks like "P"-[{name:...}, {}, ...]
      return value
        .map((eachAbilityComponent) => {
          //  recall eachAbilityComponent has an effects array that contains descriptions
          return eachAbilityComponent.effects
            .map((eachEffectComponent) => {
              //  recall eachEffectComponent like {description: ..., leveling:[...], ... }
              return eachEffectComponent.description;
            })
            .join(" ");
        })
        .join(" ");
    }
  );
  return combinedAbilityDescriptionsObject;
};

export const combineNames = (abilitiesObject) => {
  const combinedNamesObject = objectMap(abilitiesObject, (key, value) => {
    //  now map through the array that is the value of the key
    //    recall that the key-value pair looks like "P"-[{name:...}, {}, ...]
    return value
      .map((eachAbilityComponent) => {
        return eachAbilityComponent.name;
      })
      .join(" ");
  });
  return combinedNamesObject;
};

export const formatAbilities = (abilitiesObject) => {
  let formatted = { P: {}, Q: {}, W: {}, E: {}, R: {} };
  const abilityID = ["P", "Q", "W", "E", "R"];
  //  add the descriptions
  const combinedDescriptions = combineAbilityDescriptions(abilitiesObject);
  const combinedNames = combineNames(abilitiesObject);
  //  do everything
  abilityID.forEach((ability) => {
    formatted[ability] = {
      ...formatAbilities[ability],
      name: combinedNames[ability],
      description: combinedDescriptions[ability],
      tooltip: combinedDescriptions[ability]
    };
  });
  //  console.log(formatted);
  //  console.log(prepStylize(abilitiesObject));
  return formatted;
};

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
    abilityPower: 0
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
    abilityPower: 0
  }
) => {
  const oldText = text;
  const modifierComponents = oldText.split("+").map((each) => {
    return each.trim();
  });
  const numerizedText = modifierComponents.reduce(
    (accumulator, currentValue) => {
      //  if isNaN returns true, then the variable is NOT a valid number
      //  console.log(currentValue);

      if (!isNaN(currentValue)) {
        return accumulator + parseInt(currentValue);
      } else {
        const baseArray = currentValue.split(" ");
        //  console.log("BA", baseArray);
        if (checkSubset(baseArray, ["ap", "ad"])) {
          return (
            accumulator +
            (parseFloat(baseArray[0]) / 100.0) * currentStats["attackDamage"] +
            (parseFloat(baseArray[0]) / 100.0) * currentStats["abilityPower"]
          );
        } else if (checkSubset(baseArray, ["bonus", "ad"])) {
          return (
            accumulator +
            (parseFloat(baseArray[0]) / 100.0) *
              (currentStats["attackDamage"] - baseStats["attackDamage"])
          );
        } else if (checkSubset(baseArray, ["bonus", "ap"])) {
          return (
            accumulator +
            (parseFloat(baseArray[0]) / 100.0) *
              (currentStats["abilityPower"] - baseStats["abilityPower"])
          );
        } else if (checkSubset(baseArray, ["ad"])) {
          return (
            accumulator +
            (parseFloat(baseArray[0]) / 100.0) * currentStats["attackDamage"]
          );
        } else if (checkSubset(baseArray, ["ap"])) {
          //  console.log(currentStats["abilityPower"]);
          return (
            accumulator +
            (parseFloat(baseArray[0]) / 100.0) * currentStats["abilityPower"]
          );
        }
      }
    },
    0
  );
  //  console.log(numerizedText);
  //  console.log(modifierComponents);
  if (!numerizedText) {
    return oldText;
  }
  return `${round(numerizedText, 2)} (or ${oldText})`;
};

const modifyAttribute = (championName, attribute) => {
  //  check for special cases
  if (
    (attribute.includes("cast damage") ||
      attribute.includes("sweetspot damage") ||
      attribute.includes("total")) &&
    championName === "Aatrox"
  ) {
    return attribute.replace("damage", "") + "physical damage";
  }
  return attribute;
};

const prepStylize = (
  championName,
  abilitiesObject,
  pointAllocation = {
    Q: 1,
    W: 1,
    E: 1,
    R: 1
  },
  currentStats,
  baseStats
) => {
  const skillNames = {
    Q: [],
    W: [],
    E: [],
    R: [],
    P: []
  };
  const prepped = objectMap(abilitiesObject, (key, value) => {
    const tooltip = value
      .map((eachAbilityComponent) => {
        const skillButtonName = eachAbilityComponent.icon
          .split("/")
          .slice(-1)[0]
          .toUpperCase();
        const allocatedPoints = pointAllocation[skillButtonName];
        skillNames[skillButtonName].push(eachAbilityComponent.name);
        //  recall eachAbilityComponent has an effects array that contains descriptions
        return eachAbilityComponent.effects.map((eachEffectComponent) => {
          //  recall eachEffectComponent like {description: ..., leveling:[...], ... }
          // THIS IS WHERE WE MODIFY THE DESCRIPTIONS
          let modifiedDescription = eachEffectComponent.description;
          //  map through the leveling
          eachEffectComponent.leveling.map((eachLevelComponent) => {
            //  map through the modifiers based on point allocation

            const attribute = modifyAttribute(
              championName,
              eachLevelComponent.attribute.toLowerCase()
            );

            //  const attribute = eachLevelComponent.attribute.toLowerCase();
            //  console.log(attribute);

            const modifiers = eachLevelComponent.modifiers.map(
              (modifierObject) => {
                //  console.log(modifierObject);
                return `${modifierObject.values[allocatedPoints - 1]}${
                  modifierObject.units[allocatedPoints - 1]
                }`;
              }
            );
            //  console.log(modifiers);
            //  replace the attribute with the modifiers

            const joinedModifiers = modifiers.join(" + ");
            const numerizedModifiers = numerize(
              joinedModifiers,
              currentStats,
              baseStats
            );

            const replacement = `<${attribute}> ${numerizedModifiers} </${attribute}>`;
            //  console.log(replacement);
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
              "healing"
            ];
            //  console.log(attribute);
            for (let i = 0; i < keyword.length; i++) {
              if (attribute.includes(keyword[i])) {
                modifiedDescription += `<seperate> ${replacement} </seperate> `;
                break;
              }
            }
          });
          return modifiedDescription;
        });
      })
      .flat(); //  now flatten the outputs
    return { tooltip };
  });
  //  now add the names

  prepped["P"].name = skillNames["P"].join(" ");
  prepped["Q"].name = skillNames["Q"].join(" ");
  prepped["W"].name = skillNames["W"].join(" ");
  prepped["E"].name = skillNames["E"].join(" ");
  prepped["R"].name = skillNames["R"].join(" ");

  return prepped;
};

const lolTextParser = (text, skillButtonName) => {
  const sentence = [];
  while (text.indexOf("<") !== -1) {
    let startIndex = text.indexOf("<");
    let endIndex = text.indexOf(">");
    let keyword = text.substring(startIndex + 1, endIndex);
    let seperateFlag = false;
    //  take anything before the marker and
    sentence.push({
      format: "normal",
      text: text.substring(0, startIndex)
    });

    if (keyword === "seperate") {
      sentence.push({
        format: "seperate",
        text: ""
      });
      text = text.replace("<seperate>", "").replace("</seperate>", "");
      startIndex = text.indexOf("<");
      endIndex = text.indexOf(">");
      keyword = text.substring(startIndex + 1, endIndex);
      seperateFlag = true;
    }

    const closer = text.indexOf(`</${keyword}>`);
    //  push the thing within the text
    sentence.push({
      format: seperateFlag ? `seperate ${keyword}` : keyword,
      text: text.substring(endIndex + 1, closer) + " " + keyword
    });
    //  add 3 to account for 2 chars of </, 1 char for the space the closing >
    text = text.substring(closer + keyword.length + 3);
  }
  //  push the remainder as normal formatted text
  sentence.push({ format: "normal", text });
  //  console.log("SENTENCE:", sentence);
  //now create the divs

  return sentence.map(({ format, text }, index) => {
    const potentialClass = format.includes("seperate") ? " seperateStat " : "";
    switch (format) {
      case findWord(format, "heal"):
        return (
          <span
            className={`text-green-700 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {text}
          </span>
        );
      case findWord(format, "slow"):
        return (
          <span
            className={`text-cyan-400 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {text}
          </span>
        );
      case findWord(format, "magic damage"):
        return (
          <span
            className={`text-blue-700 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {text}
          </span>
        );
      case findWord(format, "physical damage"):
      case findWord(format, "attack damage"):
        return (
          <span
            className={`text-red-800 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {text}
          </span>
        );

      case findWord(format, "movement speed"):
        return (
          <span
            className={`text-yellow-500 ${potentialClass}`}
            key={`${skillButtonName}_${index}`}
          >
            {text}
          </span>
        );
      case findWord(format, "seperate"):
        return <br key={`${skillButtonName}_${index}`}></br>;
      case findWord(format, "normal"):
      default:
        return <span key={`${skillButtonName}_${index}`}> {text} </span>;
    }
  });
};

const stylize = (abilitiesObject) => {
  const skillButonNames = ["P", "Q", "W", "E", "R"];
  skillButonNames.forEach((name) => {
    abilitiesObject[name].tooltip = abilitiesObject[name].tooltip.map(
      (part) => {
        return lolTextParser(part, name);
      }
    );
  });

  return abilitiesObject;
};

export const parse = (
  championName,
  abilitiesObject,
  pointAllocation,
  currentStats,
  baseStats
) => {
  let parsedAO;
  parsedAO = prepStylize(
    championName,
    abilitiesObject,
    pointAllocation,
    currentStats,
    baseStats
  );
  //  parsedAO = convertToStats(parsedAO, stats);
  parsedAO = stylize(parsedAO);
  //  console.log(parsedAO);
  return parsedAO;
};

/*

*/

export const getAllItemInfo = async () => {
  const lolStaticDataURL = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json`;
  return await axios
    .get(lolStaticDataURL)
    .then((response) => {
      //  ideally something to save the data into a file + folder
      const data = response.data;
      //    for now, just check if the patchVersion matches the version from merakianalytics
      if (data) {
        return data;
      } else {
        throw new Error("need to consult DDragon");
      }
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
