/*
This is the root page that shows all the champions in a grid
*/

//  imports
//    npm packages
import { getChampionImages } from "@/helper/communitydragon";
import ChampionSelectCard from "@/components/ui/championSelectCard";

//
//  page data is fetched once and cached, not refetched on every load
export const dynamic = "force-static";

//  migrated getStaticProps to app router (changed name to getStaticData)
const getStaticData = async () => {
  console.log(process.env.leaguePatch);
  const championInfo = await getChampionImages(process.env.leaguePatch);
  // Pass data to the page via props
  console.log("done with await");
  return { props: { championInfo } };
};

const ChampionIndexPage = async () => {
  const { props } = await getStaticData();
  //  console.log(props.championIconArray);
  return (
    <div className="">
      <div className="grid grid-cols-5 gap-4 place-items-center my-16">
        {props.championInfo.map(
          ({ id, name, iconPath, defaultLoadingScreenPath }) => (
            <ChampionSelectCard
              key={`${name}-${id}-csCard`}
              id={id}
              name={name}
              iconPath={iconPath}
              defaultLoadingScreenPath={defaultLoadingScreenPath}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ChampionIndexPage;
