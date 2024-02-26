"use client";

import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import Inventory from "../../components/inventory";
import { getChampionInfo, parseStats, parse } from "../../helper/lolstaticdata";
import { objectMapArray } from "../../helper/misc";
import { existsSync, readFileSync } from "fs";
import { useDispatch, useSelector } from "react-redux";
import { setStats, updateLevel, statsSelector } from "../../store/statsSlice";

export default function ChampionPage(props) {
  //  enable using the stats selector
  const currentStats = useSelector(statsSelector);
  //  toggle the shop overlay on or off
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
    R: 1,
  };
  //  prepare the base level data by renaming the received baseStats to baseStatsTemp etc.
  const { baseStats: baseStatsTemp, perLevelStats: perLevelStatsTemp } =
    parseStats(props.championData.stats);

  console.log("PLS", perLevelStatsTemp);

  //  prepare the base level data
  const [baseStats, setBaseStats] = useState(baseStatsTemp);
  const [perLevelStats, setPerLevelStats] = useState(perLevelStatsTemp);

  const fa = parse(
    props.championData.name,
    props.championData.abilities,
    basePA,
    baseStats,
    baseStats
  ); // formatAbilities(props.championData.abilities);
  //  states
  //  const [stats, setStat] = useState(baseStats);

  //  const [currentLevel, setLevel] = useState(1);
  const [currentAbilities, setAbility] = useState(fa);
  const [pointAllocation, setPointAllocation] = useState(basePA);
  const [overflowScroll, setOverflowScroll] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setStats({ ...baseStats }));
  }, []);

  function handleSkillAllocation(key, numPoints) {
    //  console.log(numPoints - 1);
    setPointAllocation({
      ...pointAllocation,
      [key]: numPoints,
    });
  }

  function handleLevelUpdateStats(newLevel) {
    newLevel = parseInt(newLevel);
    dispatch(updateLevel({ newLevel, baseStats, perLevelStats }));
  }

  //  update the abilities text when pointAllocation is updated
  useEffect(() => {
    setAbility(
      parse(
        props.championData.name,
        props.championData.abilities,
        pointAllocation,
        currentStats,
        baseStats
      )
    );
  }, [pointAllocation, currentStats]);

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
              {objectMapArray(currentStats, (key, value) => {
                if (key !== "level") {
                  return <div key={`${key}_${value}`}>{`${key} ${value}`}</div>;
                }
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
          /* inventory={inventory} */
          setOverflowScroll={setOverflowScroll}
          setHidden={setHidden}
          /* setInventory={setInventory} */
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
  console.log(latestChampionJsonURL);
  if (existsSync(latestChampionJsonURL)) {
    const data = readFileSync(latestChampionJsonURL);
    championData = JSON.parse(data);
  } else {
    championData = await getChampionInfo(
      process.env.leaguePatch,
      context.params["championName"]
    );
  }
  //

  // Pass data to the page via props
  return { props: { championData } };
}
