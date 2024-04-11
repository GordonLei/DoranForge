/*

This is the menu  that displays the Skills information

*/

"use client";

//  imports
//    npm packages
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image, Select, SelectItem } from "@nextui-org/react";
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
    //  I do not know why SelectItem uses the key as its value
    //    need to parse this
    //  If numPoints is a num, return it, else do the special parse

    setPointAllocation({
      ...pointAllocation,
      [key]: Number.isNaN(parseFloat(numPoints))
        ? numPoints.split("_")[2]
        : numPoints,
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
    <div className="m-16">
      {objectMapArray(currentAbilities, (key, value) => (
        <div key={`${key}_skill`} className="m-4 p-8 border-t-2">
          <div key={`${key}_name`}>
            <div className="flex flex-row space-x-8">
              <Image width={64} alt="Ornn Passive Icon" src={`${value.icon}`} />
              <h1 className="text-gold-2">{`${key === "P" ? "Passive" : key}: ${value.name}`}</h1>
            </div>

            {key !== "P" && (
              <Select
                name="level"
                id="level"
                key={`${key}_select`}
                className="my-8 max-w-32"
                label="Skill Level"
                placeholder="Select a skill level"
                defaultSelectedKeys={[`${key}_level_1`]}
                onChange={(event) =>
                  handleSkillAllocation(key, event.target.value)
                }
              >
                {Array.from(Array(key === "R" ? 3 : 5).keys()).map((level) => (
                  <SelectItem
                    key={`${key}_level_${level + 1}`}
                    value={level + 1}
                    textValue={level + 1}
                  >
                    {level + 1}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
          <div key={`${key}_tooltip_parent`} className="my-4">
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
