/*

This is the menu  that displays the Skills information

*/

"use client";

//  imports
//    npm packages
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
//    helper functions
import { objectMapArray } from "@/helper/misc";
import { parse } from "@/helper/lolstaticdata";
//    lib folder functions
import { statsSelector } from "@/lib/storeFeatures/stats/statsSlice";
//
const basePA = {
  Q: 1,
  W: 1,
  E: 1,
  R: 1,
};

//  Skills Menu component
function SkillsMenu({ name, abilities, baseStats }) {
  //
  const fa = parse(name, abilities, basePA, baseStats, baseStats);
  //  enable using the stats selector
  const currentStats = useSelector(statsSelector);

  //
  const [currentAbilities, setAbility] = useState(fa);
  const [pointAllocation, setPointAllocation] = useState(basePA);

  //
  function handleSkillAllocation(key, numPoints) {
    //  console.log(numPoints - 1);
    setPointAllocation({
      ...pointAllocation,
      [key]: numPoints,
    });
  }
  //  update the abilities text when pointAllocation is updated
  useEffect(() => {
    setAbility(
      //  eslint-disable-next-line comma-dangle
      parse(name, abilities, pointAllocation, currentStats, baseStats)
    );
  }, [name, abilities, baseStats, pointAllocation, currentStats]);

  return (
    <div>
      {objectMapArray(currentAbilities, (key, value) => (
        <div key={`${key}_skill`} className="m-4 border-t-2">
          <div key={`${key}_name`}>
            <h1>{`${key === "P" ? "Passive" : key}: ${value.name}`}</h1>
            {key !== "P" && (
              <select
                name="level"
                id="level"
                key={`${key}_select`}
                onChange={(event) =>
                  handleSkillAllocation(key, event.target.value)
                }
              >
                {Array.from(Array(key === "R" ? 3 : 5).keys()).map((level) => (
                  <option key={`${key}_level_${level + 1}`} value={level + 1}>
                    {level + 1}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div key={`${key}_tooltip_parent`}>
            {/* console.log(key, each[0].props.children[1].length, index) */}
            {value.tooltip.map((each) => (
              <div
                key={`${key}_tooltip_${each[0].props.children[1].split(" ").slice(0, 5).join("-")}`}
              >
                {each}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default SkillsMenu;
