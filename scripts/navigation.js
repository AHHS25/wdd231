const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("primary-navigation");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a") && window.innerWidth < 700) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 700) {
    closeMenu();
  }
});
