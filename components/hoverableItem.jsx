/*
This component is an item that can be hovered to show its relevant information
*/

"use client";

//  libraries
//    npm packages
import { Divider, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useSelector } from "react-redux";
//    helper folder functions
import { parseItemData } from "@/helper/lolItem";
//    lib folder functions
import { statsSelector } from "@/lib/storeFeatures/stats/statsSlice";
//    components

//  Inventory component
export default function HoverableItem({
  itemData,
  itemPPId = 0,
  onClickEvent = null,
}) {
  //
  const currentStats = useSelector(statsSelector);
  const parsedItemData = parseItemData("", currentStats, itemData);

  /*
  return the component
  */
  return (
    <Tooltip
      className="bg-hextech-black text-grey-1 border-2 border-gold-4"
      content={
        <div className="flex flex-col p-2">
          <div className="">
            {/* Header */}
            <div className="flex flex-row space-x-4">
              {/* Div for image */}
              <div
                className="relative h-[64px] w-[64px]"
                key={`${itemData.id} item`}
              >
                {itemData.requiredAlly === "Ornn" && (
                  <Image
                    src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
                    alt={`${itemData.name} ornn border`}
                    key={`${itemData.id} ornn border ${itemPPId}`}
                    onClick={onClickEvent}
                    className="z-50 absolute"
                    fill="true"
                    sizes="64px"
                  />
                )}
                <Image
                  src={itemData.icon}
                  alt={`${itemData.name} png`}
                  key={`${itemData.id}-${itemPPId}`}
                  onClick={onClickEvent}
                  className="z-40"
                  fill="true"
                  sizes="64px"
                />
              </div>
              {/* Name of item and gold cost */}
              <div className="flex flex-col">
                <h4 className="text-gold-4">{itemData.name}</h4>
                <div className="text-gold-2 flex flex-row space-x-2">
                  <div className="w-5 h-5 relative">
                    <Image
                      src={`/images/gold.png`}
                      alt={`/images/gold.png`}
                      layout="fill"
                      key={`/images/gold.png`}
                    />
                  </div>
                  <div>{itemData.shop.prices.total} </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="my-4 bg-gold-4" />
          {/* Stats */}
          <div className="flex flex-col mb-4">
            {parsedItemData.statArray.map((eachStat, index) => {
              //  do some parsing
              let currStatName = eachStat.name;
              if (currStatName === "criticalStrikeChance") {
                currStatName = "crit";
              }
              return (
                <div
                  key={`${index}-${currStatName}`}
                  className="flex flex-row space-x-2"
                >
                  <div className="w-5 h-5 relative">
                    <Image
                      src={`/images/${currStatName}.png`}
                      alt={`/images/${currStatName}.png`}
                      layout="fill"
                      key={`/images/${currStatName}.png`}
                    />
                  </div>
                  <span className="text-gold-1">{eachStat.value}</span>
                  <span> {eachStat.name}</span>
                </div>
              );
            })}
          </div>
          {/* Active / Passives */}
          <div className="flex flex-col space-y-4">
            {/* Actives */}
            {console.log("EACH ACTIVE: ", parsedItemData.active)}
            {parsedItemData.active.map((eachActive, index) => (
              <div key={`${index}-${eachActive.name}`}>
                {console.log("EAN", eachActive.name)}
                {eachActive.text}
              </div>
            ))}
            {/* Passives */}
            {parsedItemData.passives.map((eachPassive, index) => (
              <div key={`${index}-${eachPassive.name}`}>
                {console.log("EPN", eachPassive.name, eachPassive.text)}
                {eachPassive.text}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="relative h-[64px] w-[64px]" key={`${itemData.id} item`}>
        {itemData.requiredAlly === "Ornn" && (
          <Image
            src="https://raw.communitydragon.org/13.19/game/assets/items/itemmodifiers/bordertreatmentornn.png"
            alt={`${itemData.name} ornn border`}
            key={`${itemData.id} ornn border ${itemPPId}`}
            onClick={onClickEvent}
            className="z-50 absolute"
            fill="true"
            sizes="64px"
          />
        )}
        <Image
          src={itemData.icon}
          alt={`${itemData.name} png`}
          key={`${itemData.id}-${itemPPId}`}
          onClick={onClickEvent}
          className="z-40"
          fill="true"
          sizes="64px"
        />
      </div>
    </Tooltip>
  );
}
