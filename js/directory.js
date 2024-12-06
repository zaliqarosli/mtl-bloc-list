const json = "json/directory.json";
fetch(json)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Select elements
    const list = document.querySelector(".directory-list-items");
    const map = document.querySelector(".map-logos");
    const pinsContainer = document.querySelector(".map-pins");

    // Create document fragment to append to document
    const pinsFragment = document.createDocumentFragment();
    const listFragment = document.createDocumentFragment();

    // Create data list items, logos, and map pins
    data.items.forEach((item) => {
      // Create list items
      const li = createListItem(item.name, item.href);
      const liText = li.firstChild;
      listFragment.appendChild(li);

      // Create map pins and logos
      const logo = createLogo(item.logo, item.name, item.href);
      const pins = createMapPins(item.mapPins, item.href);

      // Append pins to fragment and add event listeners
      pins.forEach((pin) => {
        pinsFragment.appendChild(pin);
        // Add hover over actions
        pin.addEventListener("mouseover", function () {
          map.appendChild(logo);
          // Set opacity 1 after timeout to allow transition to display
          setTimeout(() => (logo.firstChild.style.opacity = "1"), 1);
          // Highlist list item text
          liText.style.color = "var(--pink)";
        });
        pin.addEventListener("mouseout", () => {
          // Transition logo display out first
          logo.firstChild.style.opacity = "0";
          setTimeout(() => map.removeChild(logo), 400);
          liText.style.color = "";
        });
      });

      // Pop up respective logo, enlarge pins when hovering over list item
      liText.addEventListener("mouseover", () => {
        map.appendChild(logo);
        // Set opacity 1 after timeout to allow transition to display
        setTimeout(() => (logo.firstChild.style.opacity = "1"), 1);
        pins.forEach((pin) => {
          pin.classList.add("heartbeat");
        });
      });
      // Remove logo, shrink pins when mouse leaves list item
      liText.addEventListener("mouseout", () => {
        // Transition logo display out first
        logo.firstChild.style.opacity = "0";
        setTimeout(() => map.removeChild(logo), 400);
        pins.forEach((pin) => {
          pin.classList.remove("heartbeat");
        });
      });
    });

    // Append fragments to DOM
    list.appendChild(listFragment);
    pinsContainer.appendChild(pinsFragment);
  })
  .catch((error) => console.error(error.message));

// HELPER FUNCTIONS
const createListItem = (name, href) => {
  const a = document.createElement("a");
  const li = document.createElement("li");
  a.href = href;
  a.textContent = name;
  li.appendChild(a);
  return li;
};

const createMapPins = (pins, href) => {
  return pins.map((pin) => {
    const a = document.createElement("a");
    const img = document.createElement("img");
    a.href = href || "#";
    img.id = pin.id;
    img.classList.add("pin");
    img.src = "images/pin_alt.svg";
    img.alt = pin.alt || "";
    img.style = pin.coord;
    return a.appendChild(img);
  });
};

const createLogo = (logoObj, name, href) => {
  const img = document.createElement("img");
  img.classList.add("logo");
  img.src = logoObj.src || "";
  img.alt = `logo of ${name || "climbing gym"}`;
  img.style = logoObj.coord || "top: 20%; left: 48%";
  const a = document.createElement("a");
  a.href = href || "#";
  a.appendChild(img);
  return a;
};
