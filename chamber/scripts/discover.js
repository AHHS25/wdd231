import { places } from "../data/discover.mjs";

const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#primary-navigation");
const placesContainer = document.querySelector("#places");
const placesStatus = document.querySelector("#places-status");
const visitMessage = document.querySelector("#visit-message");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }
});

function createPlaceCard(place, index) {
  const cardNumber = index + 1;
  const card = document.createElement("article");
  card.className = `place-card place-${cardNumber}`;

  const heading = document.createElement("h2");
  heading.textContent = place.name;

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = `images/discover/${place.image}`;
  image.alt = place.alt;
  image.width = 300;
  image.height = 200;
  image.loading = index < 2 ? "eager" : "lazy";
  image.decoding = "async";
  figure.append(image);

  const address = document.createElement("address");
  address.textContent = place.address;

  const description = document.createElement("p");
  description.className = "place-description";
  description.textContent = place.description;

  const factId = `place-fact-${cardNumber}`;
  const fact = document.createElement("p");
  fact.id = factId;
  fact.className = "place-fact";
  fact.textContent = place.details;
  fact.hidden = true;

  const button = document.createElement("button");
  button.className = "learn-more-button";
  button.type = "button";
  button.title = `Learn more about ${place.name}`;
  button.textContent = "Learn More";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", factId);

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Learn More" : "Show Less";
    fact.hidden = isExpanded;
  });

  card.append(heading, figure, address, description, fact, button);
  return card;
}

function displayPlaces() {
  const cards = document.createDocumentFragment();
  places.forEach((place, index) => cards.append(createPlaceCard(place, index)));
  placesContainer.replaceChildren(cards);
  placesStatus.hidden = true;
}

function displayVisitMessage() {
  const storageKey = "mexicoCityChamberLastVisit";
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const currentVisit = Date.now();
  let message = "Welcome! Let us know if you have any questions.";

  try {
    const previousVisit = Number(localStorage.getItem(storageKey));

    if (previousVisit > 0) {
      const elapsedTime = Math.max(0, currentVisit - previousVisit);

      if (elapsedTime < millisecondsPerDay) {
        message = "Back so soon! Awesome!";
      } else {
        const days = Math.floor(elapsedTime / millisecondsPerDay);
        const dayLabel = days === 1 ? "day" : "days";
        message = `You last visited ${days} ${dayLabel} ago.`;
      }
    }

    localStorage.setItem(storageKey, String(currentVisit));
  } catch {
    message = "Welcome! Let us know if you have any questions.";
  }

  visitMessage.textContent = message;
}

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modification: ${document.lastModified}`;

displayVisitMessage();
displayPlaces();
