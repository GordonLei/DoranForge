/*

This is the menu that displays the Stat information 

*/

"use client";

//  imports
//    npm packages
import Image from "next/image";
import { Select, SelectItem } from "@nextui-org/react";
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
    const newLevel = Number.isNaN(parseFloat(tempLevel))
      ? parseInt(tempLevel.split("_")[1], 10)
      : parseInt(tempLevel, 10);
    dispatch(updateLevel({ newLevel, baseStats, perLevelStats }));
  }

  useEffect(() => {
    dispatch(setStats({ ...baseStats }));
  }, [baseStats, dispatch]);
  //
  return (
    <div className="flex flex-row  place-content-center m-16">
      {/* This section is the header */}
      <div className="lg:mx-32">
        {/* Name and title */}
        <div className="relative h-[64px] w-[64px]">
          <Image
            src={`${championData.icon.replace("http", "https")}`}
            alt={championData.name}
            fill
            sizes="64px"
          />
        </div>
        <h3 className="text-gold-2">{championData.name}</h3>
        <h4 className="text-gold-5">{championData.title}</h4>
        {/* Level selector */}
        <div>
          <div className="flex flex-row">
            <Select
              name="level"
              id="level"
              className="my-8 max-w-64"
              label="Champion Level: "
              placeholder="Select a Champion Level"
              defaultSelectedKeys={[`level_1`]}
              onChange={(event) => handleLevelUpdateStats(event.target.value)}
            >
              {Array.from(Array(18).keys()).map((level) => (
                <SelectItem
                  key={`level_${level + 1}`}
                  value={level + 1}
                  textValue={level + 1}
                >
                  {level + 1}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      {/* Stat Window */}
      <div className="grid grid-cols-4 " key="statMenu">
        {objectMapArray(currentStats, (key, value) => {
          if (key !== "level") {
            return (
              <div className="" key={`${key}_stat_line`}>
                <Image
                  src={`/images/${key}.png`}
                  alt={championData.name}
                  width={16}
                  height={16}
                  key={`/images/${key}.png`}
                />
                <div key={`${key}_${value}`}>
                  <span
                    className="text-gold-4"
                    key={`${key}_${value}_span_1`}
                  >{`${key}`}</span>{" "}
                  <span
                    className="text-grey-1"
                    key={`${key}_${value}_span_2`}
                  >{`${value}`}</span>
                </div>
              </div>
            );
          }
          return false;
        })}
      </div>
    </div>
  );
}
export default StatsMenu;
