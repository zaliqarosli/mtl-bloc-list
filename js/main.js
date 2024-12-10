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

// Add event listener to 'Feeling lucky' button
const notSureBtn = document.querySelector(".lucky");
notSureBtn.addEventListener("click", () => {
  // Remove initial placeholder logo
  if (logoContainer.classList.contains("heart-placeholder")) {
    removePlaceholder(logoContainer);
  }
  randomizeLogo();
});

window.onload = () => {
  // Add directory page transition effect
  const nav = document.querySelector(".header-nav");
  const menuTarget = document.querySelector(".menu-target");
  const spanElement = document.querySelector(".menu-target>span");
  const menuIcon = document.querySelector(".menu-icon");

  menuTarget.addEventListener("click", (e) => {
    e.preventDefault();
    // Set target from menuTarget href because e.target targets img inside anchor element
    const target = menuTarget.href;

    // Remove menu-icon from display
    // Change opacity instead to let menu target keep its size
    // menuIcon.style.display = "none";
    menuIcon.style.opacity = 0;
    menuIcon.style.pointerEvents = "none";
    nav.querySelector("h1").style.pointerEvents = "none";

    // Amend menu target class list and z-index
    nav.style.position = "relative";
    nav.style.top = "0";
    nav.style.right = "0";
    nav.style.left = "0";
    nav.style.zIndex = "5";
    menuTarget.classList.add("blown");

    // Redirect to target after 400ms delay
    setTimeout(() => {
      nav.style.position = "fixed";
      // window.location.href = target;
    }, 400);
  });
};

// Landing Page Helper functions

const removePlaceholder = (logoContainer) => {
  // Remove placeholder class name, add grow-on-hover class
  logoContainer.classList.remove("heart-placeholder");
  logoContainer.classList.add("grow-on-hover");

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
  logoHref.href = item.href ? `/${item.href}` : "#";
  logoGraphic.src = item.logo.src || "";
  logoGraphic.alt = `logo of ${item.name || "climbing gym"}, montreal`;
  logoGraphic.style.transform = `rotate(${logoReset}deg)`;

  // Add gym page transition effect
  logoHref.addEventListener("click", (e) => {
    e.preventDefault();

    // Set target from logo href const because e.target targets img inside anchor element
    const target = logoHref.href;

    // Remove logo image and pink hold from display
    logoGraphic.style.display = "none";
    setTimeout(() => {
      document.querySelector(".pink-center-hold").style.display = "none";
    }, 100);

    // Blow up logoHref element
    logoHref.style.border = "none";
    logoHref.classList.add("blown");

    // Redirect to target after 400ms delay
    setTimeout(() => {
      window.location.href = target;
    }, 400);
  });
};

const randomizeLogo = () => {
  // Find random int from 0 to 100
  const randomInt = Math.floor(Math.random() * 100);
  // Generate a logo for the random score
  generateLogo(randomInt);
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
