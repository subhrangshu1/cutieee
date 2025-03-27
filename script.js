var radius = 150;
var autoRotate = true;
var rotateSpeed = -60; // 🔥 Slower rotation
var imgWidth = 100, imgHeight = 140;

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

// Initialize Rotation
setTimeout(init, 1000);
function init() {
    aEle.forEach((el, i) => {
        el.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
    });
}

// Apply Transform
function applyTransform(obj) {
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

// Auto Rotate
if (autoRotate) {
    ospin.style.animation = `spin ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Mouse Drag Rotate (🔥 Slower & Smoother)
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;
var friction = 0.95; // 🔥 Makes touch movement slow down smoothly

document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function (e) {
        nX = e.clientX;
        nY = e.clientY;
        desX = (nX - sX) * 0.05; // 🔥 Reduced speed of movement
        desY = (nY - sY) * 0.05; 
        tX += desX;
        tY += desY;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
    };

    document.onpointerup = function () {
        odrag.timer = setInterval(() => {
            desX *= friction;
            desY *= friction;
            tX += desX;
            tY += desY;
            applyTransform(odrag);
            if (Math.abs(desX) < 0.1 && Math.abs(desY) < 0.1) {
                clearInterval(odrag.timer);
            }
        }, 17);
        document.onpointermove = document.onpointerup = null;
    };
};

// Music AutoPlay Fix
var bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.5; // 🔥 Set volume low
bgMusic.play().catch(() => {
    document.addEventListener("click", () => bgMusic.play(), { once: true });
});
