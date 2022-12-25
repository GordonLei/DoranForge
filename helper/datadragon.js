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
