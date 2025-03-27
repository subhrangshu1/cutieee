var radius = 240; // Circle Radius
var autoRotate = true; // Enable Auto Rotate
var rotateSpeed = -36000; // Slowest Rotation (1 degree per 100 sec)
var imgWidth = 120, imgHeight = 170; // Image Size

// 🎵 AutoPlay Music Fix
var bgMusicURL = 'Kabhi kabhi.mp3';
var audio = new Audio(bgMusicURL);
audio.loop = true;

// Try autoplay silently
audio.play().catch(() => {
    document.addEventListener("click", () => audio.play(), { once: true });
});

// ===================== Initialize =======================
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // Merge images & videos

// Set Full-Screen for Mobile
odrag.style.width = "100vw";
odrag.style.height = "100vh";

// Set Image & Ground Size
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
document.getElementById('ground').style.width = radius * 3 + "px";
document.getElementById('ground').style.height = radius * 3 + "px";

// 🌀 Initialize Rotation
function init(delayTime) {
    aEle.forEach((el, i) => {
        el.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        el.style.transition = "transform 1s";
        el.style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    });
}

// 🌀 Apply Transform
function applyTransform(obj) {
    tY = Math.max(0, Math.min(180, tY)); // Restrict Vertical Rotation
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

// 🌀 Auto Rotate (Slowest)
if (autoRotate) {
    ospin.style.animation = `${rotateSpeed > 0 ? 'spin' : 'spinRevert'} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// 🖱️ Mouse Drag Rotate
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10, isZooming = false, isTwoFingerTouch = false, rotationTimeout;

document.onpointerdown = function (e) {
    if (isZooming || isTwoFingerTouch) return; // Disable Rotation During Zoom or 2-Finger Touch
    clearInterval(odrag.timer);
    clearTimeout(rotationTimeout); // 🛑 Stop Rotation Timer
    playSpin(false); // Stop Rotation
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function (e) {
        if (isZooming || isTwoFingerTouch) return;
        nX = e.clientX;
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
    };

    document.onpointerup = function () {
        odrag.timer = setInterval(() => {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odrag);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                // 🔥 4 sec delay before restarting rotation
                rotationTimeout = setTimeout(() => playSpin(true), 4000);
            }
        }, 17);
        document.onpointermove = document.onpointerup = null;
    };
};

// 🔍 Mouse Scroll Zoom (Ctrl + Scroll)
document.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
        radius += e.deltaY * -0.1;
        radius = Math.min(Math.max(radius, 100), 600);
        init(1);
    }
}, { passive: false });

// 📱 Touch Zoom (Pinch Gesture)
var lastTouchDist = 0;
document.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        isZooming = true; // Disable Rotation
        isTwoFingerTouch = true;
        playSpin(false); // Stop Rotation
        clearTimeout(rotationTimeout); // Stop Auto-Rotation Timer

        var touch1 = e.touches[0], touch2 = e.touches[1];
        var currentDist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDist) {
            radius += (currentDist - lastTouchDist) * 0.5;
            radius = Math.min(Math.max(radius, 100), 600);
            init(1);
        }
        lastTouchDist = currentDist;
    }
}, { passive: false });

// 🛑 Reset Zoom & Enable Rotation on Touch End (After 4 Sec)
document.addEventListener("touchend", function (e) {
    if (e.touches.length === 0) {  // 🛑 Only enable rotation if no fingers are touching
        lastTouchDist = 0;
        isZooming = false;
        isTwoFingerTouch = false;
        
        setTimeout(() => {  // 🔥 4 Sec Delay Before Restarting Rotation
            playSpin(true);
        }, 4000);
    }
});

// 🌀 Play/Pause Rotation
function playSpin(yes) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
}
