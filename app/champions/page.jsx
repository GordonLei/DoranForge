/*
This is the root page that shows all the champions in a grid
*/

//  imports
//    npm packages
import Image from "next/image";
import Link from "next/link";
import { getChampionIDArray } from "../../helper/datadragon";

//  page data is fetched once and cached, not refetched on every load
export const dynamic = "force-static";

//  migrated getStaticProps to app router (changed name to getStaticData)
const getStaticData = async () => {
  const championIDArray = await getChampionIDArray(process.env.leaguePatch);
  //  get a list of champion icons
  const championIconArray = championIDArray.map((id) => ({
    id,
    link: `https://ddragon.leagueoflegends.com/cdn/${process.env.leaguePatch}/img/champion/${id}.png`,
  }));
  // Pass data to the page via props
  return { props: { championIconArray } };
};

const ChampionIndexPage = async () => {
  const { props } = await getStaticData();
  //  console.log(props.championIconArray);
  return (
    <div className="">
      <div className="grid grid-cols-9 gap-4">
        {props.championIconArray.map(({ id, link }) => (
          <Link
            href={`/champions/${encodeURIComponent(id)}`}
            key={`champ_${id}`}
            className="relative h-[64px] w-[64px]"
          >
            <Image
              src={link}
              alt={link}
              key={`champ_${id}_image`}
              fill
              sizes="64px"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChampionIndexPage;
