// Get body's main and footer
const body = document.querySelector("body");
const main = body.querySelector("main");
const footer = body.querySelector("footer");

// Create directory page HTML
body.prepend(createDirectoryPage());

// Open directory page modal with transition
const nav = document.querySelector(".site-nav");
const openIcon = document.querySelector(".menu-target");
const closeIcon = document.querySelector(".close-icon");
const menuIcon = document.querySelector(".menu-icon");
const modal = document.querySelector(".directory-page");
const titleContainer = document.querySelector(".title-container");
const overlayImg = document.querySelector(".overlay-img");
const intraNav = document.querySelector(".intra-page-nav");

openIcon.addEventListener("click", openModal);
closeIcon.addEventListener("click", closeModal);

window.onload = () => {
  const transition = document.querySelector(".gym-page-transition");
  transition.classList.remove("is-active");
  // Open modal on load if url has any query parameter
  const params = new URLSearchParams(document.location.search);
  if (params.size > 0) {
    openModal();
  }
};

// Fix section large image on scroll
const fixedImage = document.querySelector(".fixed-image");
// To-do: Generate url dynamically
fixedImage.style.background =
  "url(images/la-maison-rose.jpg) fixed no-repeat center center";
fixedImage.style.backgroundSize = "cover";
fixedImage.style.height = "140vh";

// Observe sections and highlight intra-page nav circle
// green when section is in viewport
// Callback function
const trackSection = (entries) => {
  entries.forEach((entry) => {
    const element = entry.target;
    const elementId = element.id;
    const navTracker = document.querySelector(
      `a[href='#${elementId}'].nav-bar-circle`
    );
    if (entry.isIntersecting) {
      navTracker.classList.add("active");
    } else {
      navTracker.classList.remove("active");
    }
  });
};
// Create intersection observer with offset margin of half the
// viewport height
const margin = document.querySelector("html").clientHeight / 2;
const sectionObserver = new IntersectionObserver(trackSection, {
  root: null,
  rootMargin: `-${margin}px 0px`,
});
// Target section elements to be observed
sectionObserver.observe(document.querySelector("#the-story"));
sectionObserver.observe(document.querySelector("#neighbourhood"));
sectionObserver.observe(document.querySelector("#the-wall"));
sectionObserver.observe(document.querySelector("#social"));

// Add Vanilla JS parallax scrolling
window.addEventListener("scroll", () => {
  let offset = window.scrollY;

  // HEADER SECTION
  const headerImg = document.querySelector(".header-img");
  const overlayImg = document.querySelector(".overlay-img");
  const headerTitle = document.querySelector(".title-container");
  headerImg.style.transform = `translateY(-${offset * 0.25}px)`;
  overlayImg.style.bottom = `calc(-28rem + ${offset * 1}px)`;
  headerTitle.style.transform = `rotate(-5deg) translateX(${offset * 0.5}px)`;

  // NEIGHBOURHOOD SECTION
  const locationTitle = document.querySelector(".neighbourhood-content>h1");
  const positionY = locationTitle.getBoundingClientRect().top + offset;
  locationTitle.style.transform = `translateX(${
    positionY - offset * 1.25 - 150
  }px)`;

  // THE WALL SECTION
  const wallTitle = document.querySelector(".the-wall-container>h1");
  wallTitle.style.transform = `translateX(${offset * 1.25 - 4800}px)`;

  // CLIMBER SECTION
  const climberTitle = document.querySelector(".climber-content>h1");
  const climberDescription = document.querySelector(".climber-content>p");
  const floater = document.querySelector(".climber-img");
  const logo = document.querySelector(".gym-logo");
  floater.style.transform = `translateY(calc(-40rem + ${offset * 0.2}px))`;
  logo.style.transform = `rotate(-10deg) translateY(calc(-60rem + ${
    offset * 0.2
  }px))`;
});

// HELPER FUNCTIONS
function openModal() {
  // Bring nav to the highest z-index
  nav.classList.toggle("front");
  // Trigger modal transition
  openIcon.classList.toggle("blown");
  // Remove menu-icon, overlays from display
  menuIcon.classList.toggle("hidden");
  titleContainer.classList.toggle("hidden");
  overlayImg.classList.toggle("hidden");
  intraNav.classList.toggle("hidden");
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
    // Return menu-icon, overlays to display after modal transition completes
    menuIcon.classList.toggle("hidden");
    titleContainer.classList.toggle("hidden");
    overlayImg.classList.toggle("hidden");
    intraNav.classList.toggle("hidden");
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
      <p class="roc-grotesk-footer right-align">
         <a href="form.html" class="join"
          >Not on the list? <strong>Join.</strong></a
        >
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
