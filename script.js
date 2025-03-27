var radius = 150;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120, imgHeight = 160;

var bgMusicURL = 'Kabhi kabhi.mp3';
var audio = new Audio(bgMusicURL);
audio.loop = true;

audio.play().catch(() => {
    document.addEventListener("click", () => audio.play(), { once: true });
});

setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

odrag.style.width = "100vw";
odrag.style.height = "100vh";
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
document.getElementById('ground').style.width = radius * 2 + "px";
document.getElementById('ground').style.height = radius * 2 + "px";

function init(delayTime) {
    aEle.forEach((el, i) => {
        el.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        el.style.transition = "transform 1s";
        el.style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    });
}

function applyTransform(obj) {
    tY = Math.max(0, Math.min(180, tY));
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

if (autoRotate) {
    ospin.style.animation = `${rotateSpeed > 0 ? 'spin' : 'spinRevert'} ${Math.abs(rotateSpeed)}s infinite linear`;
}

document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    document.onpointermove = function (e) {
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
            }
        }, 17);
        document.onpointermove = document.onpointerup = null;
    };
};

document.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
        radius += e.deltaY * -0.1;
        radius = Math.min(Math.max(radius, 100), 300);
        init(1);
    }
}, { passive: false });
