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

// Open modal on load if url has any query parameter
window.onload = () => {
  const params = new URLSearchParams(document.location.search);
  if (params.size > 0) {
    openModal();
  }
};

// Go back on click back in nav footer
const backBtn = document.querySelector(".go-back");
backBtn.addEventListener("click", () => history.back());

// FORM PAGE HELPER FUNCTIONS
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
