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
  displayEvents
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
      displayEvents(filteredEvents, ".meetUpEventDescription");
    }

    searchEvent.value = "";
    searchLokation.value = "";
  };
}
export function showAllEventCards(containerSelector, cardSelector) {
  const container = document.querySelector(containerSelector);
  if (container) {
    const cards = container.querySelectorAll(cardSelector);
    cards.forEach((card) => {
      card.style.display = "block";
    });
  }
}
