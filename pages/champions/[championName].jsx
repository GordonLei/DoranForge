import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import Inventory from "../../components/inventory";
import {
  getchampionData,
  getAllItemInfo,
  parseStats,
  formatAbilities,
  parse
} from "../../helper/lolstaticdata";
import { objectMapArray } from "../../helper/misc";
import { growthStatisticCalculation } from "../../helper/lol";
import { round } from "lodash";
import { existsSync, readFileSync } from "fs";

export default function ChampionPage(props) {
  const setHidden = () => {
    console.log(document.body.style.overflow);
    if (document.body.style.overflow !== "hidden") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  };

  //  starting states
  const basePA = {
    Q: 1,
    W: 1,
    E: 1,
    R: 1
  };
  //  prepare the base level data
  const { baseStats, perLevelStats } = parseStats(props.championData.stats);
  const fa = parse(
    props.championData.name,
    props.championData.abilities,
    basePA,
    baseStats,
    baseStats
  ); // formatAbilities(props.championData.abilities);
  //  states
  const [stats, setStat] = useState(baseStats);
  const [currentLevel, setLevel] = useState(1);
  const [currentAbilities, setAbility] = useState(fa);
  const [pointAllocation, setPointAllocation] = useState(basePA);
  const [overflowScroll, setOverflowScroll] = useState(true);
  const [inventory, setInventory] = useState([
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    },
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    },
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    },
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    },
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    },
    {
      id: -1,
      name: "blank",
      link: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/Aatrox.png`
    }
  ]);
  //  handle updating stats
  function handleLevelUpdateStats(newLevel) {
    newLevel = parseInt(newLevel);
    setStat({
      ...stats,
      health: round(
        stats.health +
          growthStatisticCalculation(
            perLevelStats.healthPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),

      mana: round(
        stats.mana +
          growthStatisticCalculation(
            perLevelStats.manaPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      armor: round(
        stats.armor +
          growthStatisticCalculation(
            perLevelStats.armorPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      magicResistance: round(
        stats.magicResistance +
          growthStatisticCalculation(
            perLevelStats.magicResistancePerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      healthRegen: round(
        stats.healthRegen +
          growthStatisticCalculation(
            perLevelStats.healthRegenPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      manaRegen: round(
        stats.manaRegen +
          growthStatisticCalculation(
            perLevelStats.manaRegenPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      attackDamage: round(
        stats.attackDamage +
          growthStatisticCalculation(
            perLevelStats.attackDamagePerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      attackSpeed: round(
        stats.attackSpeed +
          growthStatisticCalculation(
            perLevelStats.attackSpeedPerLevel,
            newLevel
          ),
        2
      ),
      moveSpeed: round(
        stats.moveSpeed +
          growthStatisticCalculation(
            perLevelStats.moveSpeedPerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      attackRange: round(
        stats.attackRange +
          growthStatisticCalculation(
            perLevelStats.attackRangePerLevel,
            currentLevel,
            newLevel
          ),
        2
      ),
      crit: round(stats.crit, 2)
    });
    setLevel(newLevel);
    //  console.log(stats);
  }

  function handleSkillAllocation(key, numPoints) {
    //  console.log(numPoints - 1);
    setPointAllocation({
      ...pointAllocation,
      [key]: numPoints
    });
  }

  //  update the abilities text when pointAllocation is updated
  useEffect(() => {
    setAbility(
      parse(
        props.championData.name,
        props.championData.abilities,
        pointAllocation,
        stats,
        baseStats
      )
    );
  }, [pointAllocation, stats]);

  //  render portion
  return (
    <Layout>
      <div className="flex flex-row">
        <div>
          <div className="text-yellow-500">dasdsa</div>
          <div className="text-cyan-400">dasdsa</div>
          <div className="text-blue-700">dasdsa</div>
          <div className="text-green-700">dasdsa</div>
          <div className="text-red-800">dasdsa</div>
          <div
            className={`flex flex-row  place-content-center ${
              overflowScroll
                ? ""
                : " overflow-y-scroll overscroll-y-none overflow-hidden"
            }`}
          >
            {/*This section is the header*/}
            <div>
              <div>
                <img
                  src={`${props.championData.icon}`}
                  alt={props.championData.name}
                />
              </div>
              <div>{props.championData.name}</div>
              <div>{props.championData.title}</div>
              {/*Level selector*/}
              <div>
                <label htmlFor="level">Current Level:</label>
                <select
                  name="level"
                  id="level"
                  onChange={(event) =>
                    handleLevelUpdateStats(event.target.value)
                  }
                >
                  {Array.from(Array(18).keys()).map((level) => {
                    return (
                      <option key={`level_${level + 1}`} value={level + 1}>
                        {level + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/*Stat Window*/}
            <div className="grid grid-cols-4 ">
              {objectMapArray(stats, (key, value) => {
                return <div key={`${key}_${value}`}>{`${key} ${value}`}</div>;
              })}
            </div>
          </div>
          {/* Skill Description */}

          <div
            className={`${
              overflowScroll
                ? ""
                : " overflow-y-scroll overscroll-y-none overflow-hidden"
            }`}
          >
            {objectMapArray(currentAbilities, (key, value) => {
              return (
                <div key={`${key}_skill`} className="border-t-2 m-4">
                  <div key={`${key}_name`}>
                    {`${key === "P" ? "Passive" : key}: ${value.name}`}
                    {key !== "P" && (
                      <select
                        name="level"
                        id="level"
                        key={`${key}_select`}
                        onChange={(event) =>
                          handleSkillAllocation(key, event.target.value)
                        }
                      >
                        {Array.from(Array(key === "R" ? 3 : 5).keys()).map(
                          (level) => {
                            return (
                              <option
                                key={`${key}_level_${level + 1}`}
                                value={level + 1}
                              >
                                {level + 1}
                              </option>
                            );
                          }
                        )}
                      </select>
                    )}
                  </div>
                  <div key={`${key}_tooltip`}>
                    {value.tooltip.map((each, index) => {
                      return <div key={`${key}_tooltip_${index}`}>{each}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Inventory
          inventory={inventory}
          setOverflowScroll={setOverflowScroll}
          setHidden={setHidden}
        />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  //  let unparsedItemData;
  let championData;
  const latestItemJsonURL =
    process.cwd() + `/data/lolstaticdata/${process.env.leaguePatch}/items.json`;
  //
  const latestChampionJsonURL =
    process.cwd() +
    `/data/lolstaticdata/${process.env.leaguePatch}/champions/${context.params["championName"]}.json`;

  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    championData = JSON.parse(data);
  } else {
    championData = await getchampionData(
      process.env.leaguePatch,
      context.params["championName"]
    );
  }
  //

  // Pass data to the page via props
  return { props: { championData } };
}
