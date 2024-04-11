/*

This is the menu that displays the Stat information 

*/

"use client";

//  imports
//    npm packages
import Image from "next/image";
import { useEffect } from "react";
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
function StatsMenu({ championData, baseStats, perLevelStats }) {
  //
  const currentStats = useSelector(statsSelector);
  //
  const dispatch = useDispatch();
  //  function to update the Store to the new level
  function handleLevelUpdateStats(tempLevel) {
    const newLevel = parseInt(tempLevel, 10);
    dispatch(updateLevel({ newLevel, baseStats, perLevelStats }));
  }

  useEffect(() => {
    dispatch(setStats({ ...baseStats }));
  }, [baseStats, dispatch]);
  //
  return (
    <div className="flex flex-row  place-content-center m-16">
      {/* This section is the header */}
      <div>
        {/* Name and title */}
        <div className="relative h-[64px] w-[64px]">
          <Image
            src={`${championData.icon.replace("http", "https")}`}
            alt={championData.name}
            fill
            sizes="64px"
          />
        </div>
        <div>{championData.name}</div>
        <div>{championData.title}</div>
        {/* Level selector */}
        <div>
          <label htmlFor="level">
            Current Level:{" "}
            <select
              name="level"
              id="level"
              onChange={(event) => handleLevelUpdateStats(event.target.value)}
            >
              {Array.from(Array(18).keys()).map((level) => (
                <option key={`level_${level + 1}`} value={level + 1}>
                  {level + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {/* Stat Window */}
      <div className="grid grid-cols-4 ">
        {objectMapArray(currentStats, (key, value) => {
          if (key !== "level") {
            return <div key={`${key}_${value}`}>{`${key} ${value}`}</div>;
          }
          return false;
        })}
      </div>
    </div>
  );
}
export default StatsMenu;
