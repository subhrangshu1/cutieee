var radius = 180; // Circle size
var autoRotate = true; // Enable auto-rotate
var rotateSpeed = 60000; // Slow rotation (60s per full spin)
var imgWidth = 120, imgHeight = 170; // Image size

// Music autoplay fix
var bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.5; // Lower volume

// Prevent audio from failing to autoplay
document.addEventListener("click", () => bgMusic.play(), { once: true });

// Initialization
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aEle = [...aImg];

// Adjust styles
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Initialize rotation
function init(delayTime) {
    aEle.forEach((el, i) => {
        el.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        el.style.transition = "transform 1s";
        el.style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    });
}

// Auto Rotate
if (autoRotate) {
    ospin.style.animation = `spin ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Mouse Drag Rotate
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10, isZooming = false;

document.onpointerdown = function (e) {
    if (isZooming) return;
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function (e) {
        if (isZooming) return;
        nX = e.clientX;
        nY = e.clientY;
        desX = (nX - sX) * 0.05; // Slower movement
        desY = (nY - sY) * 0.05;
        tX += desX;
        tY += desY;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
    };

    document.onpointerup = function () {
        odrag.timer = setInterval(() => {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.05;
            tY += desY * 0.05;
            applyTransform(odrag);
            if (Math.abs(desX) < 0.1 && Math.abs(desY) < 0.1) {
                clearInterval(odrag.timer);
            }
        }, 20);
        document.onpointermove = document.onpointerup = null;
    };
};

// Apply rotation transformation
function applyTransform(obj) {
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}
