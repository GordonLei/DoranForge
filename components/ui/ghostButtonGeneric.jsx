/*

This are ghost buttons (buttons that are transparent background until hover/press)

*/

"use client";

//  imports
//    npm packages
import { Button } from "@nextui-org/react";

//  The actual component
function GhostButtonGeneric({ propStyles }) {
  //  default button styles that will be replaced by the prop
  const buttonStyles = {
    "border-type": "border-solid",
    "border-length": "border-2",
    "border-color": "border-gold-4",
    "text-color": "text-gold-1",
    "hover-background-color": "hover:bg-gold-4 ",
    text: "",
    onPressFunc: () => {},
    ...propStyles,
  };
  return (
    <Button
      className={`bg-transparent 
        ${buttonStyles["border-type"]} 
        ${buttonStyles["border-length"]} 
        ${buttonStyles["border-color"]} 
        ${buttonStyles["text-color"]} 
        ${buttonStyles["hover-background-color"]}
        hover:bg-opacity-25`}
      onPress={buttonStyles.onPressFunc}
    >
      {buttonStyles.text}
    </Button>
  );
}

export default GhostButtonGeneric;
