import Inventory from "@/components/inventory";
import { getChampionInfo, parseStats, parse } from "@/helper/lolstaticdata";
import { existsSync, readFileSync } from "fs";

import StatsMenu from "@/components/statsMenu";
import SkillsMenu from "@/components/skillsMenu";

async function getChampionData(championName) {
  //  let unparsedItemData;
  let championData;
  const latestItemJsonURL =
    process.cwd() + `/data/lolstaticdata/${process.env.leaguePatch}/items.json`;
  //
  const latestChampionJsonURL =
    process.cwd() +
    `/data/lolstaticdata/${process.env.leaguePatch}/champions/${championName}.json`;
  console.log("HERE");
  console.log("JSON URL IS THIS: ", latestChampionJsonURL);
  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    championData = JSON.parse(data);
  } else {
    championData = await getChampionInfo(process.env.leaguePatch, championName);
  }

  // Pass data to the page via props
  return championData;
}

const ChampionPage = async ({ params }) => {
  //
  const championData = await getChampionData(params.championName);
  console.log("PROPS: ", championData);
  //  take all the releveant information from the championData stats
  const { baseStats, perLevelStats } = parseStats(championData.stats);
  /*
  const [overflowScroll, setOverflowScroll] = useState(true);
  */
  //  const dispatch = useDispatch();

  //  render portion
  return (
    <div className="flex flex-row">
      <div>
        <div className="text-yellow-500">dasdsa</div>
        <div className="text-cyan-400">dasdsa</div>
        <div className="text-blue-700">dasdsa</div>
        <div className="text-green-700">dasdsa</div>
        <div className="text-red-800">dasdsa</div>
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
      <Inventory
      /* inventory={inventory} */
      /* setOverflowScroll={setOverflowScroll} */
      /* setHidden={setHidden} */
      /* setInventory={setInventory} */
      />
    </div>
  );
};

export default ChampionPage;
