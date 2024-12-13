// Declare global variables
let items;
const json = "json/directory.json";
const logoContainer = document.querySelector(".logo-container");

// Get json data, set global data variable
fetch(json)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    items = data.items;
  })
  .catch((error) => console.error(error.message));

// Add event listener to slider
const slider = document.querySelector(".slider");
slider.addEventListener("input", () => {
  // Remove initial placeholder logo
  if (logoContainer.classList.contains("heart-placeholder")) {
    removePlaceholder(logoContainer);
  }

  // Generate logo with closest score matching slider value
  const value = parseInt(slider.value);
  generateLogo(value);
});

// Add event listener to 'Not sure' button
const notSure = document.querySelector(".not-sure");
notSure.addEventListener("click", () => {
  // Append beginner query parameter to url
  const url = new URL(location);
  url.searchParams.set("beginner", true);
  history.replaceState({}, "", url);
  // Open modal
  openModal();
  setTimeout(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, 400);
});

// Add event listener to 'Feeling lucky' button
const lucky = document.querySelector(".lucky");
lucky.addEventListener("click", () => {
  // Remove initial placeholder logo
  if (logoContainer.classList.contains("heart-placeholder")) {
    removePlaceholder(logoContainer);
  }
  const item = randomizeLogo();
  // Update slider position according to item's score
  slider.value = item.score;
});

// Get body's main and footer
const body = document.querySelector("body");
const main = body.querySelector("main");
const footer = body.querySelector("footer");

// Create directory page HTML
body.prepend(createDirectoryPage());

// Open directory page modal with transition
const nav = document.querySelector(".header-nav");
const openIcon = document.querySelector(".menu-target");
const closeIcon = document.querySelector(".close-icon");
const menuIcon = document.querySelector(".menu-icon");
const modal = document.querySelector(".directory-page");

openIcon.addEventListener("click", openModal);
closeIcon.addEventListener("click", closeModal);

// Open directory with call to action
const cta = document.querySelector("#call-to-action");
cta.addEventListener("click", () => {
  openModal();
  setTimeout(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, 400);
});

// Open modal on load if url has any query parameter
window.onload = () => {
  const params = new URLSearchParams(document.location.search);
  if (params.size > 0) {
    openModal();
  }
};

// LANDING PAGE HELPER FUNCTIONS
function openModal() {
  // Bring nav to the highest z-index
  nav.classList.toggle("front");
  // Trigger modal transition
  openIcon.classList.toggle("blown");
  // Remove menu-icon from display
  menuIcon.classList.toggle("hidden");
  // After modal transition completes, change the display
  setTimeout(() => {
    // Display modal
    modal.classList.toggle("is-active");
    // Hide main and footer, and fix nav so that the page length
    // doesn't extend beyond the modal
    nav.classList.toggle("fixed");
    main.classList.toggle("hidden");
    footer.classList.toggle("hidden");
  }, 400);
}

function closeModal() {
  // Reverse openModal
  // Unhide main and footer, and unfix nav
  nav.classList.toggle("fixed");
  main.classList.toggle("hidden");
  footer.classList.toggle("hidden");
  // Close modal display
  modal.classList.toggle("is-active");
  // Trigger modal transition
  openIcon.classList.toggle("blown");
  // Remove any query params from URL
  const url = new URL(location);
  history.replaceState({}, "", url.pathname);
  setTimeout(() => {
    // Return menu-icon to display after modal transition completes
    menuIcon.classList.toggle("hidden");
    // Remove nav z-index
    nav.classList.toggle("front");
  }, 200);
}

const removePlaceholder = (logoContainer) => {
  // Remove placeholder class name, add grow-on-hover class
  logoContainer.classList.remove("heart-placeholder");
  logoContainer.innerHTML = `
      <a href="" class="logo-href">
          <img
            src=""
            alt=""
            class="graphic logo-graphic"
          />
      </a>`;
};

const generateLogo = (score) => {
  // Get item with closest score matching input score
  const item = getClosestItemByScore(score);

  // Calculate rotations
  const rotateBy = 90 - 1.8 * item.score;
  const logoReset = rotateBy * -1;

  // Select elements
  const rotatingGroup = document.querySelector(".rotating-group");
  const logoHref = document.querySelector(".logo-href");
  const logoGraphic = document.querySelector(".logo-graphic");

  // Change logo data and rotation
  rotatingGroup.style.transform = `rotate(${rotateBy}deg)`;
  logoContainer.classList.add("heartbeat-out");
  logoHref.href = item.id ? `${item.id}.html` : "#";
  logoGraphic.src = item.logo.src || "";
  logoGraphic.alt = `logo of ${item.name || "climbing gym"}, montreal`;
  logoGraphic.style.transform = `rotate(${logoReset}deg)`;

  // Add gym page transition effect
  logoHref.addEventListener("click", function (e) {
    e.preventDefault();

    // Set target from logo href const because e.target targets img inside anchor element
    const target = this.href;

    // Remove logo image and pink hold from display
    logoGraphic.style.display = "none";
    setTimeout(() => {
      document.querySelector(".pink-center-hold").style.display = "none";
    }, 100);

    // Blow up logoHref element
    this.style.border = "none";
    this.classList.add("blown");

    // Redirect to target after 400ms delay
    setTimeout(() => {
      window.location.href = target;
    }, 400);
  });

  return item;
};

const randomizeLogo = () => {
  // Find random int from 0 to 100
  const randomInt = Math.floor(Math.random() * 100);
  // Generate a logo for the random score
  return generateLogo(randomInt);
};

// Return item with a score that's closest to the input score
const getClosestItemByScore = (score) => {
  // Find the item that's closest to input score
  const scores = items.map((item) => item.score);

  const closestScore = scores.reduce((prev, curr) =>
    Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev
  );

  // Return item with closest score
  return items.find((item) => item.score === closestScore);
};

function createDirectoryPage() {
  // Create document fragment to be appended to the DOM later
  const fragment = document.createDocumentFragment();

  // Container div
  const directoryPage = document.createElement("div");
  directoryPage.classList.add("directory-page");

  // Map section
  const mapSection = document.createElement("section");
  mapSection.classList.add("directory-map", "fade-in");
  mapSection.innerHTML = `
    <div class="map-pins">
    </div>
    <div class="map-logos">
    </div>
    <img
      class="map"
      src="images/map_dark_light_xs.jpg"
      alt="Grey, black, white Greater Montreal map"
    />
  `;

  // Directory content section
  const contentSection = document.createElement("section");
  contentSection.classList.add("directory-content", "slide-in-right");
  contentSection.innerHTML = `
    <nav>
      <p>Montreal's Bouldering Gym Directory</p>
      <h2 class="close-icon">X</h2>
    </nav>
    <div class="directory-list">
      <fieldset class="filter">
        <legend>Filter:</legend>
      </fieldset>
      <ul class="directory-list-items unbounded-h3"></ul>
      <p class="roc-grotesk-footer right-align cta-small">
        <a href="form.html" class="join">
          Are you a new gym? <strong>Join the list.</strong>
        </a>
      </p>
    </div>
  `;

  // Append sections to the directory page
  directoryPage.append(mapSection, contentSection);

  // Append directory page to the fragment
  fragment.appendChild(directoryPage);

  // Return the directory page fragment
  return fragment;
}
