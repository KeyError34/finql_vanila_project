import "../../src/styles/main.scss";

import { displayEvents } from "./function";
import { setupMenuToggle } from "./function";
import {
  filterEventsByCity,
  filterEventsByTitel,
  filterEventsByType,
  performSearch,
  handleSearchButtonClick,
  eventsStore,
} from "./function";

console.log("Это главная страница");

const cityInput = document.querySelector("#city-input");

const searchLokation = document.querySelector(".searchLokation");
const searchEventBtn = document.querySelector(".searchEventBtn ");

const searchEventMedia = document.querySelector(".searchEventMedia");

const searchEvent = document.querySelector(".searchEvent");

document.addEventListener("DOMContentLoaded", () => {
  setupMenuToggle("#menuToggle", ".menuContent", ".selectIcon");

  displayEvents(eventsStore, ".meetUpEventDescription");

  cityInput.addEventListener("input", () => {
    performSearch(
      eventsStore,
      cityInput,
      filterEventsByCity,
      ".meetUpEventDescription"
    );
  });

  cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(
        eventsStore,
        cityInput,
        filterEventsByCity,
        ".meetUpEventDescription"
      );
      cityInput.value = "";
    }
  });
  searchEvent.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(
        eventsStore,
        searchEvent,
        filterEventsByTitel,
        ".meetUpEventDescription"
      );
      searchEvent.value = "";
    }
  });
  searchLokation.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(
        eventsStore,
        searchLokation,
        filterEventsByCity,
        ".meetUpEventDescription"
      );
      searchLokation.value = "";
    }
  });
  searchEventMedia.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(
        eventsStore,
        searchEventMedia,
        filterEventsByTitel,
        ".meetUpEventDescription"
      );
      searchEventMedia.value = "";
    }
  });

  searchEvent.addEventListener("input", () => {
    performSearch(
      eventsStore,
      searchEvent,
      filterEventsByTitel,
      ".meetUpEventDescription"
    );
  });
  searchEventMedia.addEventListener("input", () => {
    performSearch(
      eventsStore,
      searchEventMedia,
      filterEventsByTitel,
      ".meetUpEventDescription"
    );
  });

  searchLokation.addEventListener("input", () => {
    performSearch(
      eventsStore,
      searchLokation,
      filterEventsByCity,
      ".meetUpEventDescription"
    );
  });

  searchEventBtn.addEventListener(
    "click",
    handleSearchButtonClick(
      eventsStore,
      searchEvent,
      searchLokation,
      filterEventsByTitel,
      filterEventsByCity,
      displayEvents,
      ".meetUpEventDescription"
    )
  );

  const onlineEvents = filterEventsByType(eventsStore, "online");
  displayEvents(onlineEvents, ".meetUpEventSoonAll");
});
