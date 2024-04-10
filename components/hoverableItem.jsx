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
import { extractItemStatFromDict, parseItemData } from "@/helper/lolItem";
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
      content={
        <div className="bg-white flex flex-col">
          <div>
            {/* Header */}
            <div className="flex flex-row">
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
                <div>{itemData.name}</div>
                <div>{itemData.shop.prices.total} </div>
              </div>
            </div>
          </div>
          <Divider className="my-4" />
          {/* Stats */}
          <div className="flex flex-col">
            {parsedItemData.statArray.map((eachStat, index) => (
              <div key={`${index}-${eachStat.name}`}>{eachStat.text}</div>
            ))}
          </div>
          {/* Active / Passives */}
          <div className="flex flex-col">
            {/* Actives */}
            {parsedItemData.active.map((eachActive, index) => (
              <div key={`${index}-${eachActive.name}`}>{eachActive.text}</div>
            ))}
            {/* Passives */}
            {parsedItemData.passives.map((eachPassive, index) => (
              <div key={`${index}-${eachPassive.name}`}>{eachPassive.text}</div>
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
