"use client";

/*
This is the menu that displays the Stat information 
*/

//  imports
//    npm packages
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//    lib folder functions
import {
  setStats,
  updateLevel,
  statsSelector,
} from "@/lib/storeFeatures/stats/statsSlice";
//    helper functions
import { objectMapArray } from "@/helper/misc";

//  Stats Menu component
const StatsMenu = ({ championData, baseStats, perLevelStats }) => {
  //
  const currentStats = useSelector(statsSelector);
  //  prepare the base level data
  //  const [baseStats, setBaseStats] = useState(baseStatsProp);
  //  const [perLevelStats, setPerLevelStats] = useState(perLevelStatsProp);
  //  function to update the Store to the new level
  function handleLevelUpdateStats(newLevel) {
    newLevel = parseInt(newLevel);
    dispatch(updateLevel({ newLevel, baseStats, perLevelStats }));
  }
  //
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setStats({ ...baseStats }));
  }, []);
  //
  return (
    <div
      className={`flex flex-row  place-content-center ${
        /*
      overflowScroll
        ? ""
        : " overflow-y-scroll overscroll-y-none overflow-hidden"
    */ "x"
      }`}
    >
      {/*This section is the header*/}
      <div>
        {/*Name and title*/}
        <div>
          <img src={`${championData.icon}`} alt={championData.name} />
        </div>
        <div>{championData.name}</div>
        <div>{championData.title}</div>
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
  );
};
export default StatsMenu;
