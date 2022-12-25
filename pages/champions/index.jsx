import { useState } from "react";
import Layout from "../../components/layout";
import { getChampionIDArray } from "../../helper/datadragon";
import Link from "next/link";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ChampionIndexPage(props) {
  //  console.log(props.championIconArray);
  return (
    <Layout>
      <div>
        <Header title="Develop. Preview. Ship. 🚀" />
        <div className="grid grid-cols-9 gap-4">
          {props.championIconArray.map(({ id, link }, index) => {
            return (
              <Link href={`/champions/${encodeURIComponent(id)}`}>
                <img src={link} alt={link} key={index} />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
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
}
