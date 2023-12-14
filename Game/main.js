document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        shootBullet();
    } else if (event.button === 2) {
        event.preventDefault();
        return;
    }
});

document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});
document.onkeydown = function(e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }
}