function Header({ title }) {
  return <h1>{title || "Default title"}</h1>;
}

export default function HomePage() {
  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
      <div>
        This is the landing page for testing operations. Basically useless since
        there is nothing here but welcome!
      </div>
    </div>
  );
}
