/*
Helper code for CommunityDragon JSON files
*/

//  libraries
//    base JS packages
import { existsSync, readFileSync } from "fs";
import axios from "axios";

/*
Retrieve data from ddragon's champion.json
*/
export const getAllChampionJson = async () => {
  let championData;
  //
  const latestChampionJsonURL = `${process.cwd()}/data/lolstaticdata/${process.env.leaguePatch}/champions.json`;
  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    championData = JSON.parse(data);
    // Pass data to the page via props
  } else {
    const lolStaticDataChampionJsonURL = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json`;
    championData = axios
      .get(lolStaticDataChampionJsonURL)
      .then((response) => response.data.data)
      .catch((err) => {
        console.log(
          "==========\n",
          "Error in getChampionJson\n",
          err,
          "\n",
          "==========\n"
        );
      });
  }
  return championData;
};

/*
Return an array with the IDs of the Champions from champions.json

Champion ID is the parsed name 
*/
/*
Return an array with the IDs of the Champions from champions.json

Champion ID is the parsed name 
*/
export const getChampionImages = async (patchVersion) => {
  const data = await getAllChampionJson(patchVersion);
  const idArray = [];
  for (const key of Object.keys(data)) {
    idArray.push({
      id: data[key].id,
      name: data[key].name,
      iconPath: data[key].icon,
      defaultLoadingScreenPath: data[key].skins[0].loadScreenPath,
    });
  }
  return idArray;
};
