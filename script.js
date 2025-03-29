var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Remove background music container
document.getElementById('music-container').remove();

// Add new background music
var audio = new Audio('Kabhi_Kabhi.mp3'); // Ensure the file exists and has the correct path
audio.volume = 0.1; // Start with low volume
audio.loop = true;

document.getElementById('click-me').addEventListener('click', function(event) {
  event.stopPropagation(); // Prevents triggering if other areas are clicked
  audio.play().then(() => {
    console.log("Audio started playing");
    let volumeIncrease = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(audio.volume + 0.1, 1);
      } else {
        clearInterval(volumeIncrease);
      }
    }, 500);
  }).catch(error => {
    console.log("Error playing audio:", error);
  });
}, { once: true }); // Ensures it triggers only once
