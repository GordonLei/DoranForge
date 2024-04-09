import { Button, Image } from "@nextui-org/react";

export default function HomePage() {
  return (
    <div className="flex flex-row justify-center items-center space-x-64 h-[calc(100vh-88px)]">
      <div className="flex-col space-y-16 text-center">
        <h1 className="text-gold-4">Hextech</h1>
        <div>Theorycraft your next build</div>
        <div className="">
          <Button color="primary" variant="ghost">
            Start Build
          </Button>
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
