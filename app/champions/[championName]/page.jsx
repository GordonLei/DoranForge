/*
This is the SPECIFIC champion page
*/

//  libraries
//    base JS packages
import { existsSync, readFileSync } from "fs";
//    helper packages
import { getChampionInfo, parseStats } from "@/helper/lolstaticdata";
//    components
import Inventory from "@/components/inventory";
import StatsMenu from "@/components/statsMenu";
import SkillsMenu from "@/components/skillsMenu";

//  external functions

//  retrieve the Champion-specific JSON
async function getChampionData(championName) {
  let championData;
  //
  const latestChampionJsonURL = `${process.cwd()}/data/lolstaticdata/${process.env.leaguePatch}/champions/${championName}.json`;
  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    championData = JSON.parse(data);
  } else {
    championData = await getChampionInfo(process.env.leaguePatch, championName);
  }

  // Pass data to the page via props
  return championData;
}

/*
Return the actual component
*/
const ChampionPage = async ({ params }) => {
  //  call function to retrieve champion-specific information
  const championData = await getChampionData(params.championName);
  //  take all the releveant information from the championData stats
  const { baseStats, perLevelStats } = parseStats(championData.stats);
  /*
  render the pages
  */
  return (
    <div className="flex flex-row ">
      {/* Page contents */}
      <div>
        <StatsMenu
          championData={championData}
          baseStats={baseStats}
          perLevelStats={perLevelStats}
        />
        <SkillsMenu
          name={championData.name}
          abilities={championData.abilities}
          baseStats={baseStats}
        />
      </div>
      {/* Inventory bar */}
      <Inventory />
    </div>
  );
};

export default ChampionPage;
