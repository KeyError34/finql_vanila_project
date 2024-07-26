import "../styles/events.scss";
import { displayEvents } from "./function";
import { setupMenuToggle } from "./function";
import {
  filterEventsByCity,
  filterEventsByTitel,
  performSearch,
  handleSearchButtonClick,
  eventsStore,
} from "./function";

import L from "leaflet";

const searchEvent = document.querySelector(".searchEvent"); // Поле ввода города

const searchLokation = document.querySelector(".searchLokation"); // Еще одно поле ввода (полагаю, для другой фильтрации)
const searchEventBtn = document.querySelector(".searchEventBtn "); // Еще одна кнопка поиска

const searchEventMedia = document.querySelector(".searchEventMedia");

let map;
let markers = [];

// Функция инициализации карты Leaflet
function initMap() {
  map = L.map("map").setView([37.7128, -122.4194], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  displayEvents(eventsStore, ".eventList", true);
}

function updateMapMarkers(events) {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  events.forEach((event) => {
    if (event.type === "offline") {
      const marker = L.marker([event.latitude, event.longitude]).addTo(map);
      marker.bindPopup(event.title);
      markers.push(marker);
    }
  });
}

// Функция фильтрации и отображения событий
function filterEvents() {
  const typeFilter = document.querySelector(".typeFilter").value;
  const distanceFilter = document.querySelector(".distanceFilter").value;
  const categoryFilter = document.querySelector(".categoryFilter").value;

  let filteredEvents = eventsStore;

  if (typeFilter !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.type === typeFilter
    );
  }

  if (distanceFilter !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.distance <= parseInt(distanceFilter)
    );
  }

  if (categoryFilter !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.category === categoryFilter
    );
  }

  updateMapMarkers(filteredEvents);
  displayEvents(filteredEvents, ".eventList", true);
}

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  setupMenuToggle("#menuToggle", ".menuContent", ".selectIcon");
  initMap();
  filterEvents(); // Вызов фильтрации и отображения событий при загрузке
  document
    .querySelector(".typeFilter")
    .addEventListener("change", filterEvents);
  document
    .querySelector(".distanceFilter")
    .addEventListener("change", filterEvents);
  document
    .querySelector(".categoryFilter")
    .addEventListener("change", filterEvents);

  searchLokation.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное действие (перезагрузка страницы)
      performSearch(
        eventsStore,
        searchLokation,
        filterEventsByCity,
        ".eventList"
      ); // Выполняем поиск при нажатии клавиши Enter
      searchLokation.value = ""; // Очищаем поле ввода
    }
  });
  // Обработка поиска при изменении текста в другом поле ввода
  searchLokation.addEventListener("input", () => {
    performSearch(
      eventsStore,
      searchLokation,
      filterEventsByCity,
      ".eventList"
    ); // Выполняем поиск при каждом изменении текста в поле
  });

  searchEvent.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное действие (перезагрузка страницы)
      performSearch(
        eventsStore,
        searchEvent,
        filterEventsByTitel,
        ".eventList"
      ); // Выполняем поиск при нажатии клавиши Enter
      searchEvent.value = ""; // Очищаем поле ввода
    }
    // showAllEventCards(".eventList", ".eventCard");
  });
  searchEvent.addEventListener("input", () => {
    performSearch(eventsStore, searchEvent, filterEventsByTitel, ".eventList"); // Выполняем поиск по введенному в поле названия тексту
    // showAllEventCards(".eventList", ".eventCard");
  });
  searchEventMedia.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное действие (перезагрузка страницы)
      performSearch(
        eventsStore,
        searchEventMedia,
        filterEventsByTitel,
        ".eventList"
      ); // Выполняем поиск при нажатии клавиши Enter
      searchEventMedia.value = ""; // Очищаем поле ввода
    }
    // showAllEventCards(".eventList", ".eventCard");
  });
  searchEventMedia.addEventListener("input", () => {
    performSearch(
      eventsStore,
      searchEventMedia,
      filterEventsByTitel,
      ".eventList"
    ); // Выполняем поиск по введенному в поле названия тексту
    // showAllEventCards(".eventList", ".eventCard");
  });
  // Обработка поиска по нажатию кнопки поиска
  searchEventBtn.addEventListener(
    "click",
    handleSearchButtonClick(
      eventsStore,
      searchEvent,
      searchLokation,
      filterEventsByTitel,
      filterEventsByCity,
      displayEvents,
      ".eventList"
    )
  );
});
