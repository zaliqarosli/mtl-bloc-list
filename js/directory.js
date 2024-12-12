// Select elements
const directoryPage = document.querySelector(".directory-page");
const list = document.querySelector(".directory-list-items");
const map = document.querySelector(".map-logos");
const pinsContainer = document.querySelector(".map-pins");

// Fetch data and generate dynamic content
const jsonURL = "json/directory.json";
let itemFilters = {};
fetch(jsonURL)
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
      const href = `${item.id}.html`;
      const li = createListItem(item.id, item.name, href);
      const liText = li.firstChild;
      listFragment.append(li);

      // Create map pins and logos
      const logo = createLogo(item.id, item.logo, item.name, href);
      const pins = createMapPins(item.id, item.mapPins, href);

      // Append pins to fragment and add event listeners
      pins.forEach((pin) => {
        pinsFragment.append(pin);
        // Add hover over actions
        pin.addEventListener("mouseover", function () {
          map.append(logo);
          // Remove hidden after timeout to allow transition to display
          setTimeout(() => logo.firstChild.classList.remove("hidden"), 1);
          // Highlist list item text
          liText.classList.add("highlight");
          pin.firstChild.src = "images/pin_red.svg";
        });
        pin.addEventListener("mouseout", () => {
          // Hide logo, unhighlight list item text
          logo.firstChild.classList.add("hidden");
          liText.classList.remove("highlight");
          pin.firstChild.src = "images/pin_alt.svg";
        });
      });

      // Pop up respective logo, enlarge pins when hovering over list item
      liText.addEventListener("mouseover", () => {
        map.append(logo);
        // Remove hidden after timeout to allow transition to display
        setTimeout(() => logo.firstChild.classList.remove("hidden"), 1);
        // Bob pin
        pins.forEach((pin) => {
          const img = pin.firstChild;
          img.src = "images/pin_red.svg";
          img.classList.add("heartbeat");
        });
      });
      // Remove logo, shrink pins when mouse leaves list item
      liText.addEventListener("mouseout", () => {
        // Hide logo, bob pin
        logo.firstChild.classList.add("hidden");
        pins.forEach((pin) => {
          const img = pin.firstChild;
          img.src = "images/pin_alt.svg";
          img.classList.remove("heartbeat");
        });
      });
    });

    // Append fragments to DOM
    list.append(listFragment);
    pinsContainer.append(pinsFragment);
  })
  .catch((error) => console.error(error.message));

// Set up filtering and filter chips
const enabledChip = [];
const filters = [
  { id: "beginner", name: "Beginner" },
  { id: "new-school", name: "New-school" },
  { id: "old-school", name: "Old-school" },
];

// Create filter chips
const fieldset = document.querySelector("fieldset.filter");
filters.forEach((filter) => {
  const filterId = filter.id;
  const filterName = filter.name;
  // Create filter chip button
  const button = document.createElement("button");
  button.id = filterId;
  button.classList.add("filter-chip", "roc-grotesk-footer");
  button.innerHTML = filterName;
  // Add event listener to button
  button.addEventListener("click", function () {
    toggleFiltering(this, filterName);
  });
  // Add chip to fieldset
  fieldset.append(button);
});

// Parse out URL if query parameters present for filtering
// when directory page is visible
const observer = new IntersectionObserver(
  () => {
    const params = new URLSearchParams(document.location.search);
    filters.forEach((filter) => {
      const filterId = filter.id;
      const filterName = filter.name;
      const chip = document.querySelector(`#${filterId}`);
      const param = params.get(filterId) ?? false;
      if (param) {
        chip.classList.add("is-enabled");
        chip.innerHTML = `${filterName} <span>X</span>`;
        enabledChip.push(filterId);
      } else {
        chip.classList.remove("is-enabled");
        chip.innerHTML = filterName;
        const chipIndex = enabledChip.indexOf(filterId);
        if (chipIndex > -1) {
          enabledChip.splice(chipIndex, 1);
        }
      }
    });
    // Filter list and icons according to array of filters enabled
    filterList(enabledChip);
  },
  { root: null }
);
observer.observe(directoryPage);

// HELPER FUNCTIONS

function toggleFiltering(chip, filterName) {
  // Toggle classname
  chip.classList.toggle("is-enabled");

  // Enable or disable filtering
  let url;
  if (chip.classList.contains("is-enabled")) {
    chip.innerHTML = `${filterName} <span>X</span>`;
    enabledChip.push(chip.id);
    // Append filter query parameter to url
    url = new URL(location);
    url.searchParams.set(chip.id, true);
  } else {
    chip.innerHTML = filterName;
    enabledChip.splice(enabledChip.indexOf(chip.id), 1);
    // Remove filter query parameter from url
    url = new URL(location);
    url.searchParams.delete(chip.id, true);
  }

  history.replaceState({}, "", url);
  filterList(enabledChip);
}

// Filter list and icons according to array of filters
function filterList(filters) {
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
}

const createListItem = (id, name, href) => {
  const a = document.createElement("a");
  const li = document.createElement("li");
  a.href = href;
  a.textContent = name;
  a.id = id;
  li.append(a);
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
    a.append(img);
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
  a.append(img);
  return a;
};
