import { getChampionIDArray } from "../../helper/datadragon";
import Link from "next/link";

//  page data is fetched once and cached, not refetched on every load
export const dynamic = "force-static";

//  migrated getStaticProps to app router (changed name to getStaticData)
const getStaticData = async () => {
  const championIDArray = await getChampionIDArray(process.env.leaguePatch);
  //  get a list of champion icons
  const championIconArray = championIDArray.map((id) => {
    return {
      id,
      link: `http://ddragon.leagueoflegends.com/cdn/${process.env.leaguePatch}/img/champion/${id}.png`,
    };
  });
  //  console.log(championIconArray);
  // Pass data to the page via props
  return { props: { championIconArray } };
};

const ChampionIndexPage = async () => {
  const { props } = await getStaticData();
  //  console.log(props.championIconArray);
  return (
    <div>
      <div className="grid grid-cols-9 gap-4">
        {props.championIconArray.map(({ id, link }, index) => {
          return (
            <Link href={`/champions/${encodeURIComponent(id)}`} key={index}>
              <img src={link} alt={link} key={index} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChampionIndexPage;
