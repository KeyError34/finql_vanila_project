// Отображаем все события в основном контейнере
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
        ${event.type === "offline" ? `<p>Distance: ${event.distance} km</p> `: ""}
        <p>Attendees: ${event.attendees}</p>
          </div>`;

    if (showAdditionalInfo && event.type === "offline") {
      eventCard.innerHTML += `<p style="display: none">Additional info: Distance: ${event.distance} km</p>`;
    }

    eventList.appendChild(eventCard);
  });
}
// Отображение фиксированого модального меню
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
