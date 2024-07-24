import "../../src/styles/events.scss";
import { displayEvents } from "./function";
import { setupMenuToggle } from "./function";
import {
  filterEventsByCity,
  filterEventsByTitel,
  filterEventsByType,
  showAllEventCards,
  performSearch,
  handleSearchButtonClick,
} from "./function";
import L from "leaflet";
// import 'leaflet/dist/leaflet.css';



const eventsStore = [
  {
    title: "Day Trading Idea and Strategy",
    date: new Date(2024, 8, 22, 19),
    image: "/assets/images/main_event_img/DayTradingIdeaandStrategy.png",
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
    image: "/assets/images/main_event_img/Let'sTalkNetworking.png",
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
    image: "/assets/images/main_event_img/TechTalks&Quiz.webp.png",
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
    image: "/assets/images/main_event_img/INFORMSSanFranciscoChapter.png",
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
    image: "/assets/images/main_event_img/AIWednesdays.png",
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
    image: "/assets/images/main_event_img/ROSBy-The-Bay.png",
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
    image: "/assets/images/main_event_img/FreeChristian.png",
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
    image: "/assets/images/main_event_img/inpersone.png",
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


let map;
let markers = [];

// Функция инициализации карты Leaflet
function initMap() {
  map = L.map("map").setView([37.7128, -122.4194], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  displayEvents(eventsStore,".eventList",true);
}

function updateMapMarkers(events) {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  events.forEach(event => {
    if (event.type === "offline") {
      const marker = L.marker([event.latitude, event.longitude]).addTo(map);
      marker.bindPopup(event.title);
      markers.push(marker);
    }
  });
}


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
const cityInput = document.querySelector("#city-input");

const searchLokation = document.querySelector(".searchLokation"); 
const searchEventBtn = document.querySelector(".searchEventBtn "); 


const eventList = document.querySelector(".eventList")


const searchEventMedia = document.querySelector(".searchEventMedia");

document.addEventListener("DOMContentLoaded", () => {
  setupMenuToggle("#menuToggle", ".menuContent", ".selectIcon");
  initMap();
  filterEvents(); 
  document
    .querySelector(".typeFilter")
    .addEventListener("change", filterEvents);
  document
    .querySelector(".distanceFilter")
    .addEventListener("change", filterEvents);
  document
    .querySelector(".categoryFilter")
    .addEventListener("change", filterEvents);

    cityInput.addEventListener("input", () => {
      eventList.innerHTML=""
      performSearch(
        eventsStore,
        cityInput,
        filterEventsByCity,
        ".eventList"
      ); 
      // showAllEventCards('.eventList','.eventCard');
    });
    cityInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); 
        performSearch(
          eventsStore,
          cityInput,
          filterEventsByCity,
          '.eventList'
        ); 
        cityInput.value = ""; 
      }
      // showAllEventCards('.eventList','.eventCard');
    });
    searchLokation.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); 
        performSearch(
          eventsStore,
          searchLokation,
          filterEventsByCity,
          '.eventList'
        ); 
        searchLokation.value = ""; 
      }
    });
    searchLokation.addEventListener("input", () => {
      performSearch(
        eventsStore,
        searchLokation,
        filterEventsByCity,
        '.eventList'
      );
    });
    searchEventMedia.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); 
        performSearch(
          eventsStore,
          searchEventMedia,
          filterEventsByTitel,
          '.eventList'
        ); 
        searchEventMedia.value = ""; 
      }
      // showAllEventCards('.eventList','.eventCard');
    });
    searchEventMedia.addEventListener("input", () => {
     
      performSearch(
        eventsStore,
        searchEventMedia,
        filterEventsByTitel,
        '.eventList'
      ); 
      // showAllEventCards('.eventList','.eventCard');
    });
});


