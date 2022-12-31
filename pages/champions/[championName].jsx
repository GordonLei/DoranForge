import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import {
  getChampionInfo,
  parseStats,
  formatAbilities,
  parse,
} from "../../helper/lolstaticdata";
import { objectMapArray } from "../../helper/misc";
import { growthStatisticCalculation } from "../../helper/lol";
import { round } from "lodash";
import { existsSync, readFileSync } from "fs";

//
function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ChampionPage(props) {
  //

  //  starting states
  const basePA = {
    Q: 1,
    W: 1,
    E: 1,
    R: 1,
  };
  const fa = parse(props.championInfo.abilities, basePA); // formatAbilities(props.championInfo.abilities);
  const { baseStats, perLevelStats } = parseStats(props.championInfo.stats);
  //  states
  const [stats, setStat] = useState(baseStats);
  const [currentLevel, setLevel] = useState(1);
  const [currentAbilities, setAbility] = useState(fa);
  const [pointAllocation, setPointAllocation] = useState(basePA);
  //  prepare the base level data

  //  handle updating stats
  function handleLevelUpdateStats(newLevel) {
    newLevel = parseInt(newLevel);
    setStat({
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
      crit: round(stats.crit, 2),
    });
    setLevel(newLevel);
    console.log(stats);
  }

  function handleSkillAlocation(key, numPoints) {
    console.log(numPoints - 1);
    setPointAllocation({
      ...pointAllocation,
      [key]: numPoints,
    });
  }

  //  update the abilities text when pointAllocation is updated
  useEffect(() => {
    setAbility(parse(props.championInfo.abilities, pointAllocation));
  }, [pointAllocation]);

  //  render portion
  return (
    <Layout>
      <div className="text-red-800">dasdsa</div>
      <div>
        {/*This section is the header*/}
        <div>
          <div>{props.championInfo.name}</div>
          <div>{props.championInfo.title}</div>
        </div>
        {/*Level selector*/}
        <div>
          <label htmlFor="level">Current Level:</label>
          <select
            name="level"
            id="level"
            onChange={(event) => handleLevelUpdateStats(event.target.value)}
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
        {/*Stat Window*/}
        <div className="grid grid-cols-4">
          {objectMapArray(stats, (key, value) => {
            return <div key={`${key}_${value}`}>{`${key} ${value}`}</div>;
          })}
        </div>
      </div>
      {/* Skill Description */}

      <div>
        {objectMapArray(currentAbilities, (key, value) => {
          return (
            <div key={`${key}_skill`}>
              <div key={`${key}_name`}>
                {`${key === "P" ? "Passive" : key}: ${value.name}`}
                {key !== "P" && (
                  <select
                    name="level"
                    id="level"
                    key={`${key}_select`}
                    onChange={(event) =>
                      handleSkillAlocation(key, event.target.value)
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
              <div key={`${key}_tooltip`}>{value.tooltip}</div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const latestChampionJsonURL =
    process.cwd() +
    `/data/lolstaticdata/${process.env.leaguePatch}/champions/${context.params["championName"]}.json`;
  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    const championInfo = JSON.parse(data);
    //  combineAbilityDescriptions(championInfo.abilities);
    //  console.log(championInfo);
    return { props: { championInfo } };
  } else {
    const championInfo = await getChampionInfo(
      process.env.leaguePatch,
      context.params["championName"]
    );
    // Pass data to the page via props
    return { props: { championInfo } };
  }
}
