"use client";

/*
This component is an item that can be hovered to show its relevant information
*/

//  libraries
//    npm packages
import { Divider, Tooltip } from "@nextui-org/react";
import Image from "next/image";
//    helper folder functions
import { extractItemStatFromDict } from "@/helper/lolItem";
//    components

//  Inventory component
export default function HoverableItem({
  itemData,
  itemPPId = 0,
  onClickEvent = null,
}) {
  //
  /*
  return the component
  */
  return (
    <Tooltip
      content={
        <div className="bg-white flex flex-row">
          <div>
            {/* Header */}
            <div className="flex flex-row">
              {/* Div for image */}
              <div
                className="relative h-[16px] w-[16px]"
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
                    sizes="16px"
                  />
                )}
                <Image
                  src={itemData.icon}
                  alt={`${itemData.name} png`}
                  key={`${itemData.id}-${itemPPId}`}
                  onClick={onClickEvent}
                  className="z-40"
                  fill="true"
                  sizes="16px"
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
            {console.log(extractItemStatFromDict(itemData.stats))}
          </div>
          <div>{/* Active / Passives */}</div>
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
