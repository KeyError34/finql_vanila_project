export function displayEvents(
  events,
  containerSelector,
  showAdditionalInfo = false
) {
  const eventList = document.querySelector(containerSelector);
  if (!eventList) {
    console.error(`Container with selector "${containerSelector}" not found.`);
    return;
  }

  eventList.innerHTML = "";
  events.forEach((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("eventCard");
    eventCard.innerHTML = `
          <div class="imgEvent">
          <img src="${event.image}" alt="${event.title}">
          </div>
          <div class="contentEventSearch">
              <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p>${event.date.toDateString()}</p>
        <p>Type: ${event.type}</p>
        <p>Category: ${event.category}</p>
        ${
          event.type === "offline"
            ? `<p>Distance: ${event.distance} km</p> `
            : ""
        }
        <p>Attendees: ${event.attendees}</p>
          </div>`;

    if (showAdditionalInfo && event.type === "offline") {
      eventCard.innerHTML += `<p style="display: none">Additional info: Distance: ${event.distance} km</p>`;
    }

    eventList.appendChild(eventCard);
  });
}

export function setupMenuToggle(
  menuToggleSelector,
  sideMenuSelector,
  selectIconSelector
) {
  const menuToggle = document.querySelector(menuToggleSelector);
  const sideMenu = document.querySelector(sideMenuSelector);
  const selectIcon = document.querySelector(selectIconSelector);

  if (!menuToggle || !sideMenu || !selectIcon) {
    console.error("One or more elements not found for menu toggle setup.");
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = sideMenu.classList.toggle("open");

    if (isOpen) {
      menuToggle.innerHTML = "&times;";
      menuToggle.style.left = "0px";
      menuToggle.style.top = "0px";
      selectIcon.style.display = "block";
    } else {
      menuToggle.innerHTML = "☰";
      menuToggle.style.left = "5px";
      menuToggle.style.top = "15px";
      selectIcon.style.display = "none";
    }
  });
}

export function filterEventsByCity(events, city) {
  return events.filter((event) =>
    event.city.toLowerCase().includes(city.toLowerCase())
  );
}

export function filterEventsByTitel(events, title) {
  return events.filter((event) =>
    event.title.toLowerCase().includes(title.toLowerCase())
  );
}

export function filterEventsByType(events, type) {
  return events.filter(
    (event) => event.type.toLowerCase() === type.toLowerCase()
  );
}

function searchEvents(eventsStore, query, filterFunction, containerSelector) {
  const filteredEvents = filterFunction(eventsStore, query);

  displayEvents(filteredEvents, containerSelector);
}

export function performSearch(
  eventsStore,
  inputElement,
  filterFunction,
  containerSelector
) {
  const query = inputElement.value.trim();
  searchEvents(eventsStore, query, filterFunction, containerSelector);
}

export function handleSearchButtonClick(
  eventsStore,
  searchEvent,
  searchLokation,
  filterEventsByTitel,
  filterEventsByCity,
  displayEvents,
  containerSelector
) {
  return () => {
    const searchEventQuery = searchEvent.value.trim();
    const searchLokationQuery = searchLokation.value.trim();

    let filteredEvents = eventsStore;

    if (searchEventQuery || searchLokationQuery) {
      filteredEvents = filterEventsByTitel(filteredEvents, searchEventQuery);
      filteredEvents = filterEventsByCity(filteredEvents, searchLokationQuery);
    } else {
      alert("Search error: try entering event name or city.");
      return;
    }

    if (filteredEvents.length === 0) {
      alert("No results for your search. Try another city or another event.");
    } else {
      displayEvents(filteredEvents, containerSelector);
    }

    searchEvent.value = "";
    searchLokation.value = "";
  };
}
export const eventsStore = [
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