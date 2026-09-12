const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#primary-navigation");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const membersContainer = document.querySelector("#members");
const directoryStatus = document.querySelector("#directory-status");

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

function selectView(view) {
  const showGrid = view === "grid";
  membersContainer.classList.toggle("grid", showGrid);
  membersContainer.classList.toggle("list", !showGrid);
  gridButton.classList.toggle("active", showGrid);
  listButton.classList.toggle("active", !showGrid);
  gridButton.setAttribute("aria-pressed", String(showGrid));
  listButton.setAttribute("aria-pressed", String(!showGrid));
}

gridButton.addEventListener("click", () => selectView("grid"));
listButton.addEventListener("click", () => selectView("list"));

const membershipDetails = {
  1: { label: "Member", className: "member" },
  2: { label: "Silver Member", className: "silver" },
  3: { label: "Gold Member", className: "gold" }
};

function createDetail(label, content, detailClass) {
  const paragraph = document.createElement("p");
  paragraph.className = `member-detail ${detailClass}`;

  const detailLabel = document.createElement("span");
  detailLabel.className = "member-label";
  detailLabel.textContent = label;

  paragraph.append(detailLabel, content);
  return paragraph;
}

function createMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";

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

  const heading = document.createElement("h2");
  heading.className = "member-name";
  heading.textContent = member.name;

  const category = document.createElement("p");
  category.className = "member-category";
  category.textContent = member.category;

  const addressText = document.createElement("span");
  addressText.textContent = member.address;

  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${member.phone.replace(/[^+\d]/g, "")}`;
  phoneLink.textContent = member.phone;

  const websiteLink = document.createElement("a");
  websiteLink.href = member.website;
  websiteLink.target = "_blank";
  websiteLink.rel = "noopener noreferrer";
  websiteLink.textContent = new URL(member.website).hostname.replace("www.", "");
  websiteLink.setAttribute("aria-label", `Visit ${member.name} website`);

  const membership = membershipDetails[member.membership] ?? membershipDetails[1];
  const badge = document.createElement("span");
  badge.className = `membership-badge ${membership.className}`;
  badge.textContent = membership.label;

  content.append(
    heading,
    category,
    createDetail("Address", addressText, "member-address"),
    createDetail("Phone", phoneLink, "member-phone"),
    createDetail("Website", websiteLink, "member-website"),
    badge
  );
  card.append(image, content);

  return card;
}

function displayMembers(members) {
  const cards = document.createDocumentFragment();
  members.forEach((member) => cards.append(createMemberCard(member)));
  membersContainer.replaceChildren(cards);
}

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Unable to load members: ${response.status}`);
    }

    const data = await response.json();
    const members = Array.isArray(data) ? data : data.members;
    displayMembers(members);
    directoryStatus.textContent = `${members.length} chamber members loaded.`;
    directoryStatus.hidden = true;
  } catch (error) {
    console.error(error);
    directoryStatus.textContent = "The member directory could not be loaded. Please try again later.";
    directoryStatus.classList.add("error-message");
  }
}

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modification: ${document.lastModified}`;

getMembers();
