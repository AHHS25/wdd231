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

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modification: ${document.lastModified}`;

const queryParameters = new URLSearchParams(window.location.search);

function getSubmittedValue(name) {
  const value = queryParameters.get(name)?.trim();
  return value || "Not provided";
}

document.querySelector("#submitted-first").textContent = getSubmittedValue("first");
document.querySelector("#submitted-last").textContent = getSubmittedValue("last");
document.querySelector("#submitted-email").textContent = getSubmittedValue("email");
document.querySelector("#submitted-phone").textContent = getSubmittedValue("phone");
document.querySelector("#submitted-organization").textContent = getSubmittedValue("organization");

const submittedTimestamp = document.querySelector("#submitted-timestamp");
const timestampValue = queryParameters.get("timestamp");
const timestampDate = timestampValue ? new Date(timestampValue) : null;

if (timestampDate && !Number.isNaN(timestampDate.getTime())) {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short"
  });
  submittedTimestamp.textContent = dateFormatter.format(timestampDate);
}
