import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  //Find the absolute path of the data directory
  const dataDirectory = path.join(
    process.cwd(),
    `data/lolstaticdata/12.23.1/`
    //`data/lolstaticdata/${req.body.patchVersion}`
  );
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    `${dataDirectory}champions/Akali.json`,
    //  dataDirectory + "/champions.json",
    "utf8"
  );
  console.log("FILECONTENT", fileContents);
  //Return the content of the data file in json format
  res.status(200).json(fileContents);
}

export async function handleSpecificChampionJSON(req, res) {
  //Find the absolute path of the data directory
  const dataDirectory = path.join(
    process.cwd(),
    `data/lolstaticdata/${req.body.patchVersion}`
  );
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    `${dataDirectory}/champions/${req.body.name}.json"`,
    "utf8"
  );
  //Return the content of the data file in json format
  res.status(200).json(fileContents);
}
