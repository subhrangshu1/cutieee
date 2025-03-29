var radius = 240; // Default radius
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight = 170;

// Gesture Variables
var lastTouchDist = 0;
var isDragging = false;
var lastX = 0, lastY = 0;
var scaleFactor = 1;

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// Touch Controls
odrag.addEventListener("touchstart", function(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDist = getDistance(e.touches[0], e.touches[1]);
    }
});

odrag.addEventListener("touchmove", function(e) {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
        var deltaX = e.touches[0].clientX - lastX;
        var deltaY = e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        tX += deltaX * 0.1;
        tY += deltaY * 0.1;
        applyTransform(odrag);
    } else if (e.touches.length === 2) {
        var newDist = getDistance(e.touches[0], e.touches[1]);
        var zoomFactor = newDist / lastTouchDist;
        scaleFactor *= zoomFactor;
        scaleFactor = Math.max(0.5, Math.min(2, scaleFactor));
        ospin.style.transform = `scale(${scaleFactor})`;
        lastTouchDist = newDist;
    }
});

odrag.addEventListener("touchend", function(e) {
    isDragging = false;
});

function getDistance(touch1, touch2) {
    return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
}

function applyTransform(obj) {
    obj.style.transform = `rotateX(${tY}deg) rotateY(${tX}deg)`;
}
