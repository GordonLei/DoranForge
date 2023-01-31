import Image from "next/image";
export default function Shop({ setStat, currentItems }) {
  /*
  need something to update stats
  */
  return (
    <>
      <main>Pineapple</main>
      <Image
        src="/images/temp_openInventory.png"
        alt="me"
        width="64"
        height="64"
      />
    </>
  );
}
