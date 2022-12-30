/*
Helper file for Meraki-Analytics' LoL Static Data
*/
import axios from "axios";
import { objectMap } from "./misc";
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
    critPerLevel: 0,
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
      tooltip: combinedDescriptions[ability],
    };
  });
  //  console.log(formatted);
  return formatted;
};

export const parse = () => {};
