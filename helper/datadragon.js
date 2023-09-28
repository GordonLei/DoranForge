/*
Helper code for DataDragon JSON files
*/

import axios from "axios";
const ddragonBaseURL = `http://ddragon.leagueoflegends.com/cdn/`;

/*
Retrieve data from ddragon's champion.json
*/
export const getChampionJson = async (patchVersion) => {
  const ddragonChampionJsonURL = `${ddragonBaseURL}${patchVersion}/data/en_US/champion.json`;
  return await axios
    .get(ddragonChampionJsonURL)
    .then((response) => {
      return response.data.data;
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

/*
Return an array with the names of the Champions from champions.json
*/
export const getChampionNamesArray = async (patchVersion) => {
  const data = await getChampionJson(patchVersion);
  const nameArray = [];
  for (const key of Object.keys(data)) {
    nameArray.push(data[key].name);
  }
  return nameArray;
};

/*
Return an array with the IDs of the Champions from champions.json

Champion ID is the parsed name 
*/
export const getChampionIDArray = async (patchVersion) => {
  const data = await getChampionJson(patchVersion);
  const idArray = [];
  for (const key of Object.keys(data)) {
    idArray.push(data[key].id);
  }
  return idArray;
};

/*
get the related champion data from their respective JSON
*/
export const getChampionInfo = async (patchVersion, name) => {
  const ddragonChampionURL = `${ddragonBaseURL}${patchVersion}/data/en_US/champion/${name}.json`;
  return await axios
    .get(ddragonChampionURL)
    //  get the data field from response's data
    .then((response) => {
      return response.data.data[name];
    })
    .catch((err) => {
      console.log(
        "==========\n",
        "Error in getChampionInfo\n",
        err,
        "\n",
        "==========\n"
      );
    });
};

/*
seperate the baseStats and perLevelStats from a champion data
*/
export const parseStats = (stats) => {
  const baseStats = {
    hp: stats.hp,
    mp: stats.mp,
    armor: stats.armor,
    magicResist: stats.spellblock,
    hpRegen: stats.hpregen,
    mpRegen: stats.mpregen,
    attackDamage: stats.attackdamage,
    attackSpeed: stats.attackspeed,
    moveSpeed: stats.movespeed,
    attackRange: stats.attackrange,
    crit: stats.crit
  };
  const perLevelStats = {
    hpPerLevel: stats.hpperlevel,
    mpPerLevel: stats.mpperlevel,
    armorPerLevel: stats.armorperlevel,
    magicResistPerLevel: stats.spellblockperlevel,
    hpRegenPerLevel: stats.hpregenperlevel,
    mpRegenPerLevel: stats.mpregenperlevel,
    critPerLevel: stats.critperlevel,
    attackDamagePerLevel: stats.attackdamageperlevel,
    attackSpeedPerLevel: stats.attackspeedperlevel
  };
  return { baseStats, perLevelStats };
};

/*
format the data to map skills to buttons and then add the passive information
*/
export const formatSkillsAndPassive = (championInfo) => {
  let unparsedSkills = {};
  const skillNames = ["Q", "W", "E", "R"];
  for (let index = 0; index < skillNames.length; index++) {
    unparsedSkills[skillNames[index]] = championInfo.spells[index];
  }
  const unparsedPassive = championInfo.passive;
  return { unparsedSkills, unparsedPassive };
};
