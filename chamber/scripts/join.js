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
document.querySelector("#timestamp").value = new Date().toISOString();

const dialogLinks = document.querySelectorAll("[data-dialog]");
const closeButtons = document.querySelectorAll("[data-close-dialog]");
const membershipDialogs = document.querySelectorAll(".membership-modal");

dialogLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const dialog = document.querySelector(`#${link.dataset.dialog}`);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");

    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  });
});

membershipDialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const clickedOutside = event.clientX < bounds.left
      || event.clientX > bounds.right
      || event.clientY < bounds.top
      || event.clientY > bounds.bottom;

    if (clickedOutside) {
      dialog.close();
    }
  });
});
