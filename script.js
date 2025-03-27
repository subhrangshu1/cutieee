var radius = 120; 
var autoRotate = true;
var rotateSpeed = -36000; 
var imgWidth = 100, imgHeight = 140; 

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aEle = [...aImg];

document.getElementById('ground').style.width = radius * 2 + "px";
document.getElementById('ground').style.height = radius * 2 + "px";

// Initialize Rotation
function init(delayTime) {
    aEle.forEach((el, i) => {
        el.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        el.style.transition = "transform 1s";
        el.style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    });
}

// Apply Transform
function applyTransform(obj) {
    tY = Math.max(0, Math.min(180, tY)); 
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

// Auto Rotate
if (autoRotate) {
    ospin.style.animation = `spin ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Mouse Drag Rotate
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10, isZooming = false;

document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function (e) {
        if (isZooming) return;
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
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        document.onpointermove = document.onpointerup = null;
    };
};

// Mouse Scroll Zoom (Ctrl + Scroll)
document.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
        radius += e.deltaY * -0.1;
        radius = Math.min(Math.max(radius, 100), 300);
        init(1);
    }
}, { passive: false });

// Touch Zoom (Pinch Gesture)
var lastTouchDist = 0;
document.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        isZooming = true;
        playSpin(false);
        var touch1 = e.touches[0], touch2 = e.touches[1];
        var currentDist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDist) {
            radius += (currentDist - lastTouchDist) * 0.5;
            radius = Math.min(Math.max(radius, 100), 300);
            init(1);
        }
        lastTouchDist = currentDist;
    }
}, { passive: false });

// Reset Zoom & Enable Rotation on Touch End
document.addEventListener("touchend", function () {
    lastTouchDist = 0;
    isZooming = false;
    playSpin(true);
});

// Play/Pause Rotation
function playSpin(yes) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
}
