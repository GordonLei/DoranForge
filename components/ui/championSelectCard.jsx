"use client";

import Link from "next/link";
import Image from "next/image";

export default function ChampionSelectCard({
  id,
  name,
  iconPath,
  defaultLoadingScreenPath,
}) {
  /*
<a href={`/champions/${encodeURIComponent(id)}`}>
  */
  return (
    <Link
      href={`/champions/${name}`}
      key={`champ_${id}`}
      className="container relative h-80 max-w-40"
    >
      <div className="container relative h-80 max-w-40">
        <Image
          alt="nextui logo"
          src={defaultLoadingScreenPath}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md max-h-80 max-w-40"
        />
        <div className="w-full max-w-40 max-h-16 p-2 absolute bottom-0 left-0 flex flex-row bg-blue-4 z-40 items-center justify-center rounded-b-md border-b">
          <Image
            alt="nextui logo"
            height={32}
            width={32}
            radius="sm"
            src={iconPath}
          />
          <div className="text-center ml-4">{name}</div>
        </div>
      </div>
    </Link>
  );
}

/*


*/
