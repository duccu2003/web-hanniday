var balloonImages = [
    "./photo/1.webp",
    "./photo/2.webp",
    "./photo/3.webp",
    "./photo/4.webp",
    "./photo/5.webp",
    "./photo/6.webp",
    "./photo/7.webp",
    "./photo/8.webp",
    "./photo/9.webp",
    "./photo/10.webp",
    "./photo/11.webp",
    "./photo/12.webp",
    "./photo/13.webp",
    "./photo/14.webp",
    "./photo/15.webp",
    "./photo/16.webp",
    "./photo/17.webp",
    "./photo/18.webp",
    "./photo/19.webp",
    "./photo/20.webp",
    "./photo/21.webp",
    "./photo/22.webp",
    "./photo/23.webp",
    "./photo/24.webp",
    "./photo/25.webp",
    "./photo/26.webp",
    "./photo/27.webp",
    "./photo/28.webp",
    "./photo/29.webp",
    "./photo/30.webp",
    "./photo/31.webp",
    "./photo/32.webp",
    "./photo/33.webp",
    "./photo/34.webp",
    "./photo/35.webp",
    "./photo/36.webp",
    "./photo/37.webp",
    "./photo/38.webp",
    "./photo/39.webp",
    "./photo/40.webp",
    "./photo/41.webp",
    "./photo/42.webp",
    "./photo/43.webp",
    "./photo/44.webp",
    "./photo/45.webp",
    "./photo/46.webp",
    "./photo/47.webp",
    "./photo/48.webp",
    "./photo/49.webp",
    "./photo/50.webp",
];
// Số lượng quả bóng
var balloonCount = 50;
// Thời gian đợi giữa các quả bóng (milliseconds)
var delayTime = 100;
// Thời gian quay lại (milliseconds)
var spinTime = 6000; // Giảm giá trị spinTime để tăng tốc độ quay lại

// Tạo các quả bóng ngẫu nhiên
for (var i = 0; i < balloonCount; i++) {
    createBalloonWithDelay(i * delayTime);
}

// Tạo một quả bóng với thời gian đợi
function createBalloonWithDelay(delay) {
    setTimeout(function() {
        // Tạo một phần tử <img> cho mỗi quả bóng
        var balloon = document.createElement("img");
        balloon.src =
            balloonImages[Math.floor(Math.random() * balloonImages.length)];
        balloon.className = "balloon";

        // Đặt vị trí ngẫu nhiên cho quả bóng
        balloon.style.left = Math.random() + "%";
        balloon.style.top = Math.random() * 90 + "%";

        // Thêm quả bóng vào container
        document.getElementById("balloon-container").appendChild(balloon);

        // Quay lại nhanh hơn

        balloon.style.animationDuration = spinTime + "ms";
    }, delay);
} // Thêm vào cuối phần script của bạn
function copyLink() {
    var urlgift = "https://hannigift.000webhostapp.com";
    // Create a temporary input element
    var tempInput = document.createElement("input");
    tempInput.value = urlgift;
    document.body.appendChild(tempInput);

    // Select the text in the input element
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); /* For mobile devices */

    // Copy the text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, provide some feedback to the user (e.g., alert)
    alert("Link copied to clipboard!");
}