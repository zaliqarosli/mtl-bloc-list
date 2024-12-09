// Parse out URL if query parameters present for filtering
const filters = [
  { id: "beginner", name: "Beginner" },
  { id: "new-school", name: "New-school" },
  { id: "old-school", name: "Old-school" },
];
const enabledChip = [];
const params = new URLSearchParams(document.location.search);
filters.forEach((filter) => {
  const chip = document.querySelector(`#${filter.id}`);
  const param = params.get(filter.id) ?? false;
  if (param) {
    chip.classList.add("is-enabled");
    chip.innerHTML += ` <span>X</span>`;
    enabledChip.push(filter.id);
  }
});
let itemFilters = {};

// Select elements
const list = document.querySelector(".directory-list-items");
const map = document.querySelector(".map-logos");
const pinsContainer = document.querySelector(".map-pins");

// Fetch data and generate dynamic content
const json = "json/directory.json";
fetch(json)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Create document fragment to append to document
    const pinsFragment = document.createDocumentFragment();
    const listFragment = document.createDocumentFragment();

    // Create data list items, logos, and map pins
    data.items.forEach((item) => {
      // Save filters to global variable
      itemFilters[item.id] = item.filter;

      // Create list items
      const li = createListItem(item.id, item.name, item.href);
      const liText = li.firstChild;
      listFragment.appendChild(li);

      // Create map pins and logos
      const logo = createLogo(item.id, item.logo, item.name, item.href);
      const pins = createMapPins(item.id, item.mapPins, item.href);

      // Append pins to fragment and add event listeners
      pins.forEach((pin) => {
        pinsFragment.appendChild(pin);
        // Add hover over actions
        pin.addEventListener("mouseover", function () {
          map.appendChild(logo);
          // Remove hidden after timeout to allow transition to display
          setTimeout(() => logo.firstChild.classList.remove("hidden"), 1);
          // Highlist list item text
          liText.classList.add("highlight");
        });
        pin.addEventListener("mouseout", () => {
          // Hide logo, unhighlight list item text
          logo.firstChild.classList.add("hidden");
          liText.classList.remove("highlight");
        });
      });

      // Pop up respective logo, enlarge pins when hovering over list item
      liText.addEventListener("mouseover", () => {
        map.appendChild(logo);
        // Remove hidden after timeout to allow transition to display
        setTimeout(() => logo.firstChild.classList.remove("hidden"), 1);
        // Bob pin
        pins.forEach((pin) => {
          pin.firstChild.classList.add("heartbeat");
        });
      });
      // Remove logo, shrink pins when mouse leaves list item
      liText.addEventListener("mouseout", () => {
        // Hide logo, bob pin
        logo.firstChild.classList.add("hidden");
        pins.forEach((pin) => {
          pin.firstChild.classList.remove("heartbeat");
        });
      });
    });

    // Append fragments to DOM
    list.appendChild(listFragment);
    pinsContainer.appendChild(pinsFragment);

    // Filter list and icons according to array of filters enabled
    filterList(enabledChip);
  })
  .catch((error) => console.error(error.message));

// Add event listeners to filter chip button
const chips = document.querySelectorAll(".filter-chip");
chips.forEach((chip) => {
  const filterId = chip.id;
  const filterName = filters.find((filter) => filter.id === filterId).name;
  chip.addEventListener("click", function () {
    this.classList.toggle("is-enabled");
    if (this.classList.contains("is-enabled")) {
      this.innerHTML = `${filterName} <span>X</span>`;
      enabledChip.push(filterId);
    } else {
      this.innerHTML = filterName;
      enabledChip.splice(enabledChip.indexOf(filterId), 1);
    }
    filterList(enabledChip);
  });
});

// HELPER FUNCTIONS

// Filter list and icons according to array of filters
const filterList = (filters) => {
  const li = list.querySelectorAll("li");
  li.forEach((item) => {
    const a = item.querySelector("a");
    const identifier = a.id;
    const pins = pinsContainer.querySelectorAll(`.${identifier}`);

    // If filters is an empty array, remove disabled class from all items
    if (enabledChip.length === 0) {
      a.classList.remove("disabled");
      pins.forEach((pin) => (pin.style.display = "revert"));
      return;
    }

    // Add disabled class if item filter value is false for all filter ids
    const filterIsTrue = (filter) => itemFilters[identifier][filter];
    const show = filters.some(filterIsTrue);
    if (!show) {
      a.classList.add("disabled");
      pins.forEach((pin) => (pin.style.display = "none"));
    } else {
      a.classList.remove("disabled");
      pins.forEach((pin) => (pin.style.display = "revert"));
    }
  });
};

const createListItem = (id, name, href) => {
  const a = document.createElement("a");
  const li = document.createElement("li");
  a.href = href;
  a.textContent = name;
  a.id = id;
  li.appendChild(a);
  return li;
};

const createMapPins = (id, pins, href) => {
  return pins.map((pin) => {
    const a = document.createElement("a");
    const img = document.createElement("img");
    a.href = href || "#";
    a.classList.add(id);
    img.id = pin.id;
    img.loading = "lazy";
    img.classList.add("pin");
    img.src = "images/pin_alt.svg";
    img.alt = pin.alt || "";
    img.style = pin.coord;
    a.appendChild(img);
    return a;
  });
};

const createLogo = (id, logoObj, name, href) => {
  const img = document.createElement("img");
  img.loading = "lazy";
  img.classList.add("logo", "hidden");
  img.src = logoObj.src || "";
  img.alt = `logo of ${name || "climbing gym"}`;
  img.style = logoObj.coord || "top: 20%; left: 48%";
  const a = document.createElement("a");
  a.id = `${id}-logo`;
  a.href = href || "#";
  a.appendChild(img);
  return a;
};
