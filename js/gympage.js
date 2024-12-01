window.onload = () => {
  const transition = document.querySelector(".gym-page-transition");
  transition.classList.remove("is-active");
};

// Initialize Locomotive
// const scroller = new LocomotiveScroll({
//   el: document.querySelector("[data-scroll-container]"),
//   smooth: true,
// });

// Add Vanilla JS parallax scrolling to header
const headerImg = document.querySelector(".header-img");
const overlayImg = document.querySelector(".overlay-img");
const title = document.querySelector(".title-container");

window.addEventListener("scroll", () => {
  let offset = window.scrollY;
  headerImg.style.transform = `translateY(-${offset * 0.25}px)`;
  overlayImg.style.bottom = `calc(-28rem + ${offset * 1}px)`;
  title.style.transform = `rotate(-5deg) translateX(${offset * 0.5}px)`;
});

// Fix section large image on scroll
const fixedImage = document.querySelector(".fixed-image");
// To-do: Generate url dynamically
fixedImage.style.background =
  "url(../images/la-maison-rose.jpg) fixed no-repeat center center";
fixedImage.style.backgroundSize = "cover";
fixedImage.style.height = "100vh";
