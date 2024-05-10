/*
This is the home page 
*/

//  imports
//    npm packages
import { Image } from "@nextui-org/react";
//    components
import GhostButton from "@/components/ui/ghostButton";

//  page layout
export default function HomePage() {
  return (
    <div className="flex flex-row justify-center items-center space-x-64 h-[calc(100vh-88px)]">
      <div className="flex-col space-y-16 text-center">
        <h1 className="text-gold-4">HextechForge</h1>
        <div>Theorycraft your next build</div>
        <div className="">
          <GhostButton
            propStyles={{ text: "Start Build", onPressRedirect: "/champions" }}
          />
        </div>
      </div>
      <div>
        <Image
          width={300}
          alt="Ornn Passive Icon"
          src="/images/OrnnPassive.png"
        />
      </div>
    </div>
  );
}
