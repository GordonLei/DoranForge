console.log("UE");
const modalState = (event) => {
  console.log("In modalState");
  if (shop.contains("hidden")) {
    // Show modal
    //    card_panel.classList.remove('hidden')
    //    card_panel.classList.add('block')
    shop.remove("hidden");
    console.log("I AM HERE");
    // Delete button
    //    card_open.classList.add('hidden')
    //    card_open.classList.remove('block')
    // Start animation open
    //    card_panel.classList.add('card_open')
  }
};
const buttonOpenShop = document.getElementById("openShop");
const shop = document.getElementById("shop");
console.log(buttonOpenShop, shop);
buttonOpenShop.addEventListener("click", modalState);
