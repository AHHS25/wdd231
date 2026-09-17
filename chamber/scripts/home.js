const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#primary-navigation");

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

document.querySelector("#currentyear").textContent =
  new Date().getFullYear();

document.querySelector("#lastModified").textContent =
  `Last Modification: ${document.lastModified}`;

const weatherApiKey = "8d0d0574bb3f60b021ee2900d916e931";
const latitude = 19.4326;
const longitude = -99.1332;

const weatherStatus = document.querySelector("#weather-status");
const currentWeather = document.querySelector("#current-weather");
const currentTemperature = document.querySelector("#current-temperature");
const weatherDescription = document.querySelector(
  "#weather-description"
);
const forecastTitle = document.querySelector("#forecast-title");
const forecastContainer = document.querySelector("#forecast");

function capitalizeWords(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMexicoCityDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getThreeDayForecast(forecastList) {
  const today = getMexicoCityDateKey(new Date());
  const dailyForecasts = new Map();

  forecastList.forEach((forecast) => {
    const forecastDate = new Date(forecast.dt * 1000);
    const dateKey = getMexicoCityDateKey(forecastDate);

    if (dateKey <= today) {
      return;
    }

    if (!dailyForecasts.has(dateKey)) {
      dailyForecasts.set(dateKey, {
        date: forecastDate,
        minimums: [],
        maximums: []
      });
    }

    const day = dailyForecasts.get(dateKey);
    day.minimums.push(forecast.main.temp_min);
    day.maximums.push(forecast.main.temp_max);
  });

  return [...dailyForecasts.values()]
    .slice(0, 3)
    .map((day) => ({
      date: day.date,
      minimum: Math.round(Math.min(...day.minimums)),
      maximum: Math.round(Math.max(...day.maximums))
    }));
}

function displayForecast(days) {
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const forecastCards = document.createDocumentFragment();

  days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-day";

    const label = document.createElement("strong");
    label.textContent = dayFormatter.format(day.date);

    const temperature = document.createElement("span");
    temperature.textContent =
      `${day.maximum}° / ${day.minimum}°`;

    card.append(label, temperature);
    forecastCards.append(card);
  });

  forecastContainer.replaceChildren(forecastCards);
  forecastTitle.hidden = false;
  forecastContainer.hidden = false;
}

async function getWeather() {
  try {
    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;

    const [currentResponse, forecastResponse] =
      await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error(
        "The weather service returned an unsuccessful response."
      );
    }

    const [currentData, forecastData] =
      await Promise.all([
        currentResponse.json(),
        forecastResponse.json()
      ]);

    currentTemperature.textContent =
      Math.round(currentData.main.temp);

    weatherDescription.textContent =
      capitalizeWords(currentData.weather[0].description);

    displayForecast(
      getThreeDayForecast(forecastData.list)
    );

    currentWeather.hidden = false;
    weatherStatus.hidden = true;
  } catch (error) {
    console.warn(error.message);

    weatherStatus.textContent =
      "Live weather is temporarily unavailable.";

    weatherStatus.classList.add("error-message");
  }
}

const membershipDetails = {
  2: {
    label: "Silver Member",
    className: "silver"
  },
  3: {
    label: "Gold Member",
    className: "gold"
  }
};

function shuffleMembers(members) {
  const shuffled = [...members];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] =
      [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function createSpotlightDetail(label, content) {
  const paragraph = document.createElement("p");
  paragraph.className = "member-detail";

  const detailLabel = document.createElement("span");
  detailLabel.className = "member-label";
  detailLabel.textContent = label;

  paragraph.append(detailLabel, content);

  return paragraph;
}

function createSpotlightCard(member) {
  const card = document.createElement("article");
  card.className = "member-card spotlight-card";

  const image = document.createElement("img");
  image.className = "member-image";
  image.src = `images/${member.image}`;
  image.alt = `${member.name} logo`;
  image.width = 720;
  image.height = 440;
  image.loading = "lazy";
  image.decoding = "async";

  const content = document.createElement("div");
  content.className = "member-card-content";

  const heading = document.createElement("h3");
  heading.className = "member-name";
  heading.textContent = member.name;

  const category = document.createElement("p");
  category.className = "member-category";
  category.textContent = member.category;

  const addressText = document.createElement("span");
  addressText.textContent = member.address;

  const phoneLink = document.createElement("a");
  phoneLink.href =
    `tel:${member.phone.replace(/[^+\d]/g, "")}`;
  phoneLink.textContent = member.phone;

  const websiteLink = document.createElement("a");
  websiteLink.href = member.website;
  websiteLink.target = "_blank";
  websiteLink.rel = "noopener noreferrer";
  websiteLink.textContent = "Visit website";

  websiteLink.setAttribute(
    "aria-label",
    `Visit ${member.name} website`
  );

  const membership =
    membershipDetails[member.membership];

  const badge = document.createElement("span");
  badge.className =
    `membership-badge ${membership.className}`;
  badge.textContent = membership.label;

  content.append(
    heading,
    category,
    createSpotlightDetail(
      "Address",
      addressText
    ),
    createSpotlightDetail(
      "Phone",
      phoneLink
    ),
    createSpotlightDetail(
      "Website",
      websiteLink
    ),
    badge
  );

  card.append(image, content);

  return card;
}

async function getSpotlights() {
  const spotlightStatus =
    document.querySelector("#spotlight-status");

  const spotlightContainer =
    document.querySelector("#spotlights");

  try {
    const response =
      await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(
        `Unable to load members: ${response.status}`
      );
    }

    const data = await response.json();

    const members =
      Array.isArray(data) ? data : data.members;

    const eligibleMembers = members.filter(
      (member) =>
        [2, 3].includes(member.membership)
    );

    const selectedMembers =
      shuffleMembers(eligibleMembers).slice(0, 3);

    const cards =
      document.createDocumentFragment();

    selectedMembers.forEach((member) => {
      cards.append(createSpotlightCard(member));
    });

    spotlightContainer.replaceChildren(cards);
    spotlightStatus.hidden = true;
  } catch (error) {
    console.warn(error.message);

    spotlightStatus.textContent =
      "Member spotlights could not be loaded.";

    spotlightStatus.classList.add(
      "error-message"
    );
  }
}

getWeather();
getSpotlights();