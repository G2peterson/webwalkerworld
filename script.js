"use strict";

/*
  WEBWALKER PAGE MAP

  0 = Get To A Human
  1 = Home
  2 = AI + Infrastructure
  3 = Digital Solutions
  4 = Think Tank
*/

const pageNames = [
  "human",
  "home",
  "ai",
  "digital",
  "think"
];

const track = document.getElementById("pageTrack");
const dots = [...document.querySelectorAll(".dot-nav button")];

const menuButton = document.getElementById("menuButton");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

let currentPage = 1;


/* =========================
   NAVIGATION
   ========================= */

function goToPage(target) {

  let index;

  if (typeof target === "number") {
    index = target;
  } else {
    index = pageNames.indexOf(target);
  }

  if (index < 0 || index >= pageNames.length) {
    return;
  }

  currentPage = index;

  /*
    Track is 500% wide.
    Each page occupies 20% of the track.
  */

  track.style.transform =
    `translateX(-${currentPage * 20}%)`;

  updateDots();

  /*
    Reset destination page vertical scroll.
  */

  const destination =
    document.querySelector(
      `[data-page-name="${pageNames[currentPage]}"]`
    );

  if (
    destination &&
    destination.classList.contains("detail-page")
  ) {
    destination.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }

  menuOverlay.classList.remove("open");
}


function updateDots() {

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentPage
    );
  });

}


/* =========================
   ALL PAGE BUTTONS
   ========================= */

document.querySelectorAll("[data-page]").forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.page;

    goToPage(target);

  });

});


/* =========================
   MENU
   ========================= */

menuButton.addEventListener("click", () => {
  menuOverlay.classList.add("open");
});

menuClose.addEventListener("click", () => {
  menuOverlay.classList.remove("open");
});


/* =========================
   SWIPE ENGINE
   ========================= */

let touchStartX = 0;
let touchStartY = 0;

let touchEndX = 0;
let touchEndY = 0;

let trackingTouch = false;

const SWIPE_DISTANCE = 55;
const DIRECTION_RATIO = 1.25;


track.addEventListener(
  "touchstart",
  event => {

    if (event.touches.length !== 1) {
      return;
    }

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    touchEndX = touchStartX;
    touchEndY = touchStartY;

    trackingTouch = true;

  },
  { passive: true }
);


track.addEventListener(
  "touchmove",
  event => {

    if (!trackingTouch) {
      return;
    }

    const touch = event.touches[0];

    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

  },
  { passive: true }
);


track.addEventListener(
  "touchend",
  () => {

    if (!trackingTouch) {
      return;
    }

    trackingTouch = false;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    /*
      Ignore vertical scrolling.

      Horizontal movement must be clearly stronger
      than vertical movement before it counts
      as page navigation.
    */

    if (
      horizontalDistance < SWIPE_DISTANCE ||
      horizontalDistance <
        verticalDistance * DIRECTION_RATIO
    ) {
      return;
    }

    /*
      Finger moving LEFT:
      go deeper into WebWalker.
    */

    if (deltaX < 0) {

      if (currentPage < pageNames.length - 1) {
        goToPage(currentPage + 1);
      }

    }

    /*
      Finger moving RIGHT:
      move back toward Human page.
    */

    else {

      if (currentPage > 0) {
        goToPage(currentPage - 1);
      }

    }

  },
  { passive: true }
);


/* =========================
   KEYBOARD NAVIGATION
   Useful on desktop.
   ========================= */

document.addEventListener("keydown", event => {

  if (event.key === "ArrowRight") {

    if (currentPage < pageNames.length - 1) {
      goToPage(currentPage + 1);
    }

  }

  if (event.key === "ArrowLeft") {

    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }

  }

  if (event.key === "Escape") {
    menuOverlay.classList.remove("open");
  }

});


/* =========================
   INITIALIZE
   ========================= */

goToPage("home");
