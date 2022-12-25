import { useState } from "react";
import Layout from "../../components/layout";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function ChampionPage() {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <Layout>
      <div>
        <Header title="Develop. Preview. Ship. 🚀" />

        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <button onClick={handleClick}>Like ({likes})</button>
      </div>
    </Layout>
  );
}
