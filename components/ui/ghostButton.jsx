"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function GhostButton({ propStyles }) {
  const router = useRouter();
  const buttonStyles = {
    "border-type": "border-solid",
    "border-length": "border-2",
    "border-color": "border-gold-4",
    "text-color": "text-gold-1",
    "hover-background-color": "hover:bg-gold-4 ",
    text: "",
    onPressRedirect: "/",
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
      onPress={() => {
        router.push(buttonStyles.onPressRedirect);
      }}
    >
      {buttonStyles.text}
    </Button>
  );
}

export default GhostButton;
