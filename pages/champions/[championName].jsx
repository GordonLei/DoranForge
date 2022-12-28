import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import {
  getChampionInfo,
  parseStats,
  formatSkillsAndPassive,
} from "../../helper/datadragon";
import { objectMapArray } from "../../helper/misc";
import { round } from "lodash";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ChampionPage(props) {
  //  states
  const [stats, setStat] = useState({});
  const [currentLevel, setLevel] = useState(1);
  const [currentSkills, setSkill] = useState({});
  const [currentPassive, setPassive] = useState({});
  //  prepare the base level data
  const { baseStats, perLevelStats } = parseStats(props.championInfo.stats);
  const { unparsedSkills, unparsedPassive } = formatSkillsAndPassive(
    props.championInfo
  );
  //  set the stats to baseStats
  useEffect(() => {
    setStat(baseStats);
  }, []);
  //  handle updating stats
  function handleLevelUpdateStats(newLevel) {
    console.log("HERE");
    const diffLevel = newLevel - currentLevel;
    setStat({
      hp: round(stats.hp + diffLevel * perLevelStats.hpPerLevel, 2),
      mp: round(stats.mp + diffLevel * perLevelStats.mpPerLevel, 2),
      armor: round(stats.armor + diffLevel * perLevelStats.armorPerLevel, 2),
      magicResist: round(
        stats.magicResist + diffLevel * perLevelStats.magicResistPerLevel,
        2
      ),
      hpRegen: round(
        stats.hpRegen + diffLevel * perLevelStats.hpRegenPerLevel,
        2
      ),
      mpRegen: round(
        stats.mpRegen + diffLevel * perLevelStats.mpRegenPerLevel,
        2
      ),
      attackDamage: round(
        stats.attackDamage + diffLevel * perLevelStats.attackDamagePerLevel,
        2
      ),
      attackSpeed: round(stats.attackSpeed, 2),
      moveSpeed: round(stats.moveSpeed, 2),
      attackRange: round(stats.attackRange, 2),
      crit: round(stats.crit + diffLevel * perLevelStats.critPerLevel, 2),
    });
    setLevel(newLevel);
  }

  //  render portion
  return (
    <Layout>
      <div>
        <Header title="Develop. Preview. Ship. 🚀" />
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
      {/* Passive Description */}
      <div>
        <div key={`Passive_name`}> {`Passive: ${unparsedPassive.name}`}</div>
        <div key={`Passive_tooltip`}> {`${unparsedPassive.tooltip}`}</div>
      </div>
      {/* Skill Description */}
      <div>
        {objectMapArray(unparsedSkills, (key, value) => {
          return (
            <div>
              <div key={`${key}_name`}> {`${key}: ${value.name}`}</div>
              <div key={`${key}_tooltip`}> {`${value.tooltip}`}</div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const championInfo = await getChampionInfo(
    process.env.leaguePatch,
    context.params["championName"]
  );
  // Pass data to the page via props
  return { props: { championInfo } };
}
