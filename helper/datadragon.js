import axios from "axios";

const ddragonBaseURL = `http://ddragon.leagueoflegends.com/cdn/`;

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

export const getChampionNamesArray = async (patchVersion) => {
  const data = await getChampionJson(patchVersion);
  const nameArray = [];
  for (const key of Object.keys(data)) {
    nameArray.push(data[key].name);
  }
  return nameArray;
};

/*
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
get the related champion data from the JSON
*/
export const getChampionInfo = async (patchVersion, name) => {
  const ddragonChampionURL = `${ddragonBaseURL}${patchVersion}/data/en_US/champion/${name}.json`;
  return await axios
    .get(ddragonChampionURL)
    //  get the data field from response's data
    .then((response) => {
      //  console.log(JSON.parse(JSON.stringify(response.data.data[name])));
      //  return JSON.parse(JSON.stringify(response.data.data[name]));
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
    crit: stats.crit,
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
    attackSpeedPerLevel: stats.attackspeedperlevel,
  };
  return { baseStats, perLevelStats };
};
/*
export const getParsedChampionInfo = async (patchVersion, name) => {
  const championInfo = await getChampionInfo(patchVersion, na);
  return {
    name: championInfo.name,
    title: championInfo.title,
    image: championInfo.image, 
    tags: championInfo.tags,

  }
};
*/
