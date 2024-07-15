import "../../src/styles/events.scss";
// import "../assets/icons/events_img";
import i18n from "i18n";

console.log("Это страница о нас");

const menuToggle = document.querySelector("#menuToggle");
const sideMenu = document.querySelector(".menuContent");
const selectIcon = document.querySelector(".selectIcon");
menuToggle.addEventListener("click", () => {
  const isOpen = sideMenu.classList.toggle("open");

  if (isOpen) {
    menuToggle.innerHTML = "&times;";
    menuToggle.style.left = "10px";
    menuToggle.style.top = "10px";
    selectIcon.style.display = "block";
  }else {
    menuToggle.innerHTML = "☰";
    menuToggle.style.left = "15px";
    menuToggle.style.top = "30px";
    selectIcon.style.display = "none";
  }
});
