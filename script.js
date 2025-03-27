<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aditi_Aunty</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>

<!-- Main Image Rotation Container -->
<div id="drag-container">
    <div id="spin-container">
        <img src="1.jpg" alt="">
        <img src="2.jpg" alt="">
        <img src="3.jpg" alt="">
        <img src="4.jpg" alt="">
        <img src="5.jpg" alt="">
        <img src="6.jpg" alt="">
        <img src="7.jpg" alt="">

        <!-- Text at center of ground -->
        <p>My Angry Bird<mark>(Click Me)</mark></p>
    </div>
    <div id="ground"></div>
</div>

<!-- Music Container -->
<div id="music-container">
    <audio id="bg-music" src="Kabhi kabhi.mp3" autoplay loop></audio>
</div>

<script>
    var radius = 240;
    var spinContainer = document.getElementById('spin-container');

    // Mouse Scroll Zoom
    document.addEventListener("wheel", function(event) {
        if (event.ctrlKey) { // Zoom only when Ctrl is pressed
            event.preventDefault();
            radius += event.deltaY > 0 ? 20 : -20;
            radius = Math.min(Math.max(radius, 100), 600); // Limit zoom range
            updateZoom();
        }
    });

    // Pinch Zoom for Touch Screens
    var lastTouchDist = 0;
    document.addEventListener("touchmove", function (e) {
        if (e.touches.length == 2) {
            e.preventDefault();
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];

            var currentDist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            if (lastTouchDist) {
                var zoomChange = (currentDist - lastTouchDist) * 0.2;
                radius += zoomChange;
                radius = Math.min(Math.max(radius, 100), 600);
                updateZoom();
            }
            lastTouchDist = currentDist;
        }
    }, { passive: false });

    document.addEventListener("touchend", function () {
        lastTouchDist = 0;
    });

    function updateZoom() {
        var images = spinContainer.getElementsByTagName('img');
        for (var i = 0; i < images.length; i++) {
            images[i].style.transform = `rotateY(${i * (360 / images.length)}deg) translateZ(${radius}px)`;
        }
    }
</script>

<script src="./script.js"></script>
</body>
</html>
