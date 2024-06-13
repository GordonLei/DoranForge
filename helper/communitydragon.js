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
  console.log("CWD is:", process.cwd());
  //
  const latestChampionJsonURL = `${process.cwd()}/data/lolstaticdata/${process.env.leaguePatch}/champions.json`;
  if (existsSync(latestChampionJsonURL)) {
    console.log("in if statement");
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
  console.log("In get champion Images");
  const data = await getAllChampionJson(patchVersion);
  console.log("retrieved data in get champion Images", data, data === null);
  const idArray = [];
  for (const key of Object.keys(data)) {
    idArray.push({
      id: data[key].id,
      name: data[key].name,
      iconPath: data[key].icon,
      defaultLoadingScreenPath: data[key].skins[0].loadScreenPath,
    });
  }
  console.log("Completed get champion Images");
  return idArray;
};
