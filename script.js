var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Music Autoplay Fix
var bgMusicURL = 'Kabhi kabhi.mp3';
var audio = new Audio(bgMusicURL);
audio.loop = true;

// Try to autoplay with a silent start
audio.play().then(() => {
    console.log("Music autoplayed successfully.");
}).catch(() => {
    console.log("Autoplay blocked, waiting for user interaction...");
});

// If autoplay is blocked, start when user clicks anywhere
document.addEventListener("click", function() {
    audio.play();
}, { once: true }); // Runs only once

// ===================== start =======================
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Make Full-Screen for Mobile
odrag.style.width = "100vw";
odrag.style.height = "100vh";

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0,
  desY = 0,
  tX = 0,
  tY = 10;

// Auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Setup events for drag rotation
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
    sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
      nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// 🔥 Zoom In & Zoom Out Functionality 🔥

// Mouse Scroll Zoom (Ctrl + Scroll for Desktop)
document.addEventListener("wheel", function (e) {
  if (e.ctrlKey) { // Zoom only when Ctrl key is pressed
    e.preventDefault();
    var zoomChange = e.deltaY * -0.1;
    radius += zoomChange;
    radius = Math.min(Math.max(radius, 100), 600); // Limit zoom range
    init(1);
  }
});

// Pinch Zoom for Touch Screens
var lastTouchDist = 0;
document.addEventListener("touchmove", function (e) {
  if (e.touches.length == 2) { // Detect two-finger touch
    e.preventDefault();

    var touch1 = e.touches[0];
    var touch2 = e.touches[1];

    var currentDist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    if (lastTouchDist) {
      var zoomChange = (currentDist - lastTouchDist) * 0.2;
      radius += zoomChange;
      radius = Math.min(Math.max(radius, 100), 600); // Limit zoom range
      init(1);
    }
    lastTouchDist = currentDist;
  }
}, { passive: false });

// Reset lastTouchDist when touch ends
document.addEventListener("touchend", function () {
  lastTouchDist = 0;
});
