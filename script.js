// 🔍 Mouse Scroll Zoom (Ctrl + Scroll)
document.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault();

        let newRadius = radius + e.deltaY * -0.1;
        radius = Math.min(Math.max(newRadius, 100), 300); // ✅ Zoom Limit Fix

        init(1); // ✅ Apply Zoom Without Changing Rotation
        applyTransform(odrag); // ✅ Keep Rotation Angle Same
    }
}, { passive: false });

// 📱 Touch Zoom (Pinch Gesture) (Fix: Prevent Rotation Change)
var lastTouchDist = 0;
document.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        isZooming = true;
        isTwoFingerTouch = true;
        playSpin(false);

        var touch1 = e.touches[0], touch2 = e.touches[1];
        var currentDist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDist) {
            let newRadius = radius + (currentDist - lastTouchDist) * 0.5;
            radius = Math.min(Math.max(newRadius, 100), 300); // ✅ Fix Zoom Range
            
            init(1); // ✅ Only Apply Zoom
            applyTransform(odrag); // ✅ Maintain Angle
        }
        lastTouchDist = currentDist;
    }
}, { passive: false });

// 🛑 Reset Zoom & Enable Rotation on Touch End (Fix: Keep Angle Same)
document.addEventListener("touchend", function (e) {
    if (e.touches.length === 0) {
        lastTouchDist = 0;
        isZooming = false;
        isTwoFingerTouch = false;
        playSpin(true); // ✅ Resume Rotation
        applyTransform(odrag); // ✅ Ensure No Angle Change
    }
});
