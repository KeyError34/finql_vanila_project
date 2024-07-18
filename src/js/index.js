import "../../src/styles/main.scss";

import { displayEvents } from "./function";
import { setupMenuToggle } from "./function";
console.log("Это главная страница");

const eventsStore = [
  {
    title: "Day Trading Idea and Strategy",
    date: new Date(2024, 8, 22, 19),
    image: "/src/assets/images/main_event_img/DayTradingIdeaandStrategy.png",
    type: "offline",
    attendees: 15,
    price: 0.0,
    category: "Business",
    distance: 5,
    latitude: 40.7488,
    longitude: -73.9857,
    city: "New York",
  },
  {
    title: "Let's Talk Networking: JPMorgan Chase in Palo Alto",
    date: new Date(2024, 8, 21, 17),
    image: "/src/assets/images/main_event_img/Let'sTalkNetworking.png",
    type: "offline",
    attendees: 41,
    price: 0.0,
    category: "Business",
    distance: 15,
    latitude: 40.7488,
    longitude: -73.9857,
    city: "New York",
  },
  {
    title:
      "Tech Talks & Quiz: Next-Gen Database Solutions for Emerging Use Cases",
    date: new Date(2024, 8, 13, 18),
    image: "/src/assets/images/main_event_img/TechTalks&Quiz.webp.png",
    type: "online",
    attendees: 40,
    price: 0.0,
    category: "Technology",
    distance: 0,
    latitude: 37.7749,
    longitude: -122.4194,
    city: "San Francisco",
  },
  {
    title: "INFORMS San Francisco Chapter In-Person Event",
    date: new Date(2024, 2, 23, 17),
    image: "/src/assets/images/main_event_img/INFORMSSanFranciscoChapter.png",
    type: "offline",
    attendees: 41,
    price: 0.0,
    category: "Health and Wellbeing",
    distance: 50,
    latitude: 37.7749,
    longitude: -122.4194,
    city: "San Francisco",
  },
  {
    title: "AI Wednesdays - Meet and Greet!",
    date: new Date(2024, 8, 13, 18),
    image: "/src/assets/images/main_event_img/AIWednesdays.png",
    type: "offline",
    attendees: 29,
    price: 0.0,
    category: "Technology",
    distance: 5,
    latitude: 40.7488,
    longitude: -73.9857,
    city: "New York",
  },
  {
    title: "ROS By-The-Bay March 2024",
    date: new Date(2024, 8, 21, 18),
    image: "/src/assets/images/main_event_img/ROSBy-The-Bay.png",
    type: "online",
    attendees: 51,
    price: 0.0,
    category: "Social Activities",
    distance: 0,
    latitude: 37.7749,
    longitude: -122.4194,
    city: "San Francisco",
  },
  {
    title: "Free Christian Singles' Dinner",
    date: new Date(2024, 8, 29, 18),
    image: "/src/assets/images/main_event_img/FreeChristian.png",
    type: "offline",
    attendees: 11,
    price: 0.0,
    category: "Hobbies and Passions",
    distance: 10,
    latitude: 40.7488,
    longitude: -73.9857,
    city: "New York",
  },
  {
    title: "In-person: Deep Dive into RAG Architectures (Food served)",
    date: new Date(2024, 2, 14, 11),
    image: "/src/assets/images/main_event_img/inpersone.png",
    type: "offline",
    attendees: 16,
    price: 0.0,
    category: "Hobbies and Passions",
    distance: 50,
    latitude: 37.7749,
    longitude: -122.4194,
    city: "San Francisco",
  },
];

function filterEventsByCity(city) {
  const filteredEvents = eventsStore.filter(
    (event) => event.city.toLowerCase() === city.toLowerCase()
  );
  displayEvents(filteredEvents, ".meetUpEventDescription");
}

// Фильтрация событий по типу
function filterEventsByType(events, type) {
  return events.filter(
    (event) => event.type.toLowerCase() === type.toLowerCase()
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Отображение фиксированого модального меню

  setupMenuToggle("#menuToggle", ".menuContent", ".selectIcon");

  // Отображаем все события в основном контейнере
  displayEvents(eventsStore, ".meetUpEventDescription");

  const cityInput = document.getElementById("city-input");
  const searchButton = document.querySelector(".searchTaunNearBtn");

  searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      filterEventsByCity(city);
    } else {
      displayEvents(eventsStore, ".meetUpEventDescription");
    }
  });

  // Отображаем только онлайн события в отдельном контейнере
  const onlineEvents = filterEventsByType(eventsStore, "online");
  displayEvents(onlineEvents, ".meetUpEventSoonAll");
});
