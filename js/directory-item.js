window.onload = () => {
  const transition = document.querySelector(".gym-page-transition");
  transition.classList.remove("is-active");
};

// Initialize Locomotive
// const scroller = new LocomotiveScroll({
//   el: document.querySelector("[data-scroll-container]"),
//   smooth: true,
// });

// HELPER FUNCTIONS
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// const intraNav = document.querySelector(".intra-page-nav");

// Add Vanilla JS parallax scrolling
window.addEventListener("scroll", () => {
  let offset = window.scrollY;

  // Let intra-page navigation circle turn green on section
  // for (const navCircle of intraNav.children) {
  //   const sectionId = new URL(navCircle.href).hash;
  //   const sectionEl = document.querySelector(sectionId);
  //   if (isInViewport(sectionEl)) {
  //     navCircle.style.backgroundColor = "var(--green)";
  //   } else {
  //     navCircle.style.backgroundColor = "var(--light)";
  //   }
  // }

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
  wallTitle.style.transform = `translateX(${offset * 1 - 3000}px)`;

  // CLIMBER SECTION
  const climberTitle = document.querySelector(".climber-content>h1");
  const climberDescription = document.querySelector(".climber-content>p");
  const floater = document.querySelector(".climber-img");
  const logo = document.querySelector(".gym-logo");
  floater.style.transform = `translateY(calc(-40rem + ${offset * 0.2}px))`;
  logo.style.transform = `rotate(-10deg) translateY(calc(-60rem + ${
    offset * 0.2
  }px))`;

  // SOCIAL INITIATIVES SECTION
  // const socialTitle = document.querySelector(".social-initiatives>article>h1");
  // const socialPosY = socialTitle.getBoundingClientRect().top + offset;
  // socialTitle.style.transform = `translateX(${
  //   socialPosY - offset * 1.25 + 800
  // }px)`;
});

// Fix section large image on scroll
const fixedImage = document.querySelector(".fixed-image");
// To-do: Generate url dynamically
fixedImage.style.background =
  "url(../images/la-maison-rose.jpg) fixed no-repeat center center";
fixedImage.style.backgroundSize = "cover";
fixedImage.style.height = "140vh";
