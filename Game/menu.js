var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
document.onreadystatechange = function() {
    var loadingOverlay = document.getElementById('loading');

    if (document.readyState === 'complete') {
        loadingOverlay.style.display = 'none';
    } else {
        loadingOverlay.style.display = 'flex';
    }
};
if (isMobile) {
    // Nếu là thiết bị di động hoặc iPad, chuyển hướng hoặc hiển thị thông báo
    // Ví dụ chuyển hướng đến một trang khác
    window.location.href = 'https://example.com/mobile-blocked.html';
}
document.addEventListener("DOMContentLoaded", function() {
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
    };
});
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