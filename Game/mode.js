document.onreadystatechange = function() {
    var loadingOverlay = document.getElementById('loading');

    if (document.readyState === 'complete') {
        loadingOverlay.style.display = 'none';
    } else {
        loadingOverlay.style.display = 'flex';
    }
};
var character = document.getElementById("character");
var position = { x: 0, y: 0 };
var isMoving = false;
var isColliding = false;
var isGameOver = false;
var isLightBeamActive = false;
var score = 0;
var characterStepSize = 5;
var isWIN = false;
character.className = "character";

function moveCharacter() {
    var newX = position.x;
    var newY = position.y;
    if (isMoving) {
        var deltaX = mouseX - newX;
        var deltaY = mouseY - newY;

        var angle = Math.atan2(deltaY, deltaX);
        newX += Math.cos(angle) * characterStepSize;
        newY += Math.sin(angle) * characterStepSize;
    }

    var maxX = window.innerWidth - character.offsetWidth;
    var maxY = window.innerHeight - character.offsetHeight;

    position.x = Math.max(0, Math.min(newX, maxX));
    position.y = Math.max(0, Math.min(newY, maxY));

    character.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

    var bunnies = document.getElementsByClassName("bunny");
    var tokki = document.getElementsByClassName("tokki");

    for (var i = 0; i < bunnies.length; i++) {
        if (isCollidingWith(character, bunnies[i])) {
            handleCollision();
            return;
        }
    }

    for (var i = 0; i < tokki.length; i++) {
        if (isCollidingWith(character, tokki[i])) {
            handleCollision();
            return;
        }
    }

    if (isMoving) {
        requestAnimationFrame(moveCharacter, 1000 / 30);
    }

    if (isGameOver) {
        return;
    }
}

function playRandomMusic() {
    var musicList = [
        "song/Newjeans.mp3",
        "song/SuperShy.mp3",
        "song/ZeroJid.mp3",
        "song/Zero.mp3",
        "song/TellMe.mp3",
        "song/Omg.mp3",
        "song/HypeBoy.mp3",
        "song/Ditto.mp3",
        "song/Cookie.mp3",
        "song/Attention.mp3",
        "song/Gods.mp3",
        "song/BeautifulRestrictionATimeCalledYouOST.mp3",
        "song/GetUp.mp3",
        "song/CoolWithYou.mp3",
        "song/Asap.mp3"
    ];

    var gameMusic = document.getElementById("game-music");
    var randomIndex = Math.floor(Math.random() * musicList.length);
    gameMusic.src = musicList[randomIndex];
    gameMusic.play();
}

// Gọi hàm playRandomMusic khi trang web được tải hoặc reset lại
window.addEventListener("load", playRandomMusic);
window.onload = function() {
    window.addEventListener("load", playRandomMusic);
};
window.open = function() {
    window.addEventListener("load", playRandomMusic);
};

function isCollidingWith(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var horizontalCollision =
        rect1.left <= rect2.right && rect1.right >= rect2.left;
    var verticalCollision =
        rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;

    // Điều chỉnh kích thước khung va chạm
    var collisionMargin = 0.5; // Giá trị margin mong muốn (2px)

    rect1.left += collisionMargin;
    rect1.right -= collisionMargin;
    rect1.top += collisionMargin;
    rect1.bottom -= collisionMargin;

    horizontalCollision = rect1.left <= rect2.right && rect1.right >= rect2.left;
    verticalCollision = rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;

    return horizontalCollision && verticalCollision;
}

function handleCollision() {
    if (isWIN) return;
    var gameContainer = document.getElementById("game-container");

    var overlay = document.createElement("div");
    overlay.className = "overlay";
    gameContainer.appendChild(overlay);

    var gameOver = document.createElement("div");
    gameOver.className = "game-over";
    gameOver.textContent = "Game Over!";

    var diem = document.createElement("div");
    diem.className = "diem-so";
    s1 = score - 1;
    diem.textContent = "Score " + s1.toString();

    var gameOverSound = document.getElementById("Over-sound");
    gameOverSound.play();
    gameContainer.appendChild(gameOver);
    gameContainer.appendChild(diem);

    var buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    var replayButton = document.createElement("button");
    replayButton.textContent = "Replay";
    replayButton.addEventListener("click", function() {
        location.reload();
    });
    buttonContainer.appendChild(replayButton);

    var backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.addEventListener("click", function() {
        history.back();
    });
    buttonContainer.appendChild(backButton);

    gameContainer.appendChild(buttonContainer);

    isGameOver = true;

    // Thay đổi CSS để hiển thị khung va chạm màu đỏ cho character, bunnies và tokki
}

function gameOver1() {
    isGameOver = true;
    clearInterval(intervalId);
    score = 0;
    time = 0;
    setTimeout(closeGame, 10000); // Gọi hàm closeGame() sau 10 giây
    return (score = 0), (time = 0);
}

function startGame() {
    isGameOver = false;
    score = 0;

    intervalId = setInterval(function() {
        if (!isGameOver) {
            for (var i = 0; i < 1; i++) {
                createBunny();
            }
        }
    }, 2000);
}
startGame();

function startCharacterMovement() {
    if (!isMoving) {
        isMoving = true;
        moveCharacter();
    }
}

function stopCharacterMovement() {
    isMoving = false;
}

document.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    startCharacterMovement();
});

document.addEventListener("mousedown", function(event) {
    if (event.button === 0) {
        shootBullet();
    } else if (event.button === 2) {
        activateLightBeam();
        return;
    }
});
document.addEventListener("mouseup", function(event) {
    if (event.button === 0) {} else if (event.button === 2) {
        activateLightBeam();
        return;
    }
});
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

document.addEventListener("keyup", function(event) {
    var key = event.key;
    if (key === "q" || key === "Q") {
        activateLightBeam();
    } else if (key === "w" || key === "W") {
        shootBullet();
    }
});

function createBunny() {
    var bunny = document.createElement("div");
    bunny.className = "bunny";
    bunny.style.width = "48px";
    bunny.style.height = "40px";
    bunny.style.backgroundImage = "url('icon/Bunnies.webp')";
    bunny.style.backgroundSize = "contain";
    bunny.style.position = "absolute";
    bunny.style.top =
        Math.random() * (window.innerHeight - bunny.offsetHeight) + "px";
    bunny.style.left = window.innerWidth + "px";
    bunny.style.transition = "transform 6s ease-in-out";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(bunny);

    moveBunny(bunny);
}

function moveBunny(bunny) {
    var bunnyStepSize = 10 + time / 10; // Tốc độ tăng dần sau mỗi 10 giây
    var bunnyAcceleration = 0.1;
    var newX = parseInt(bunny.style.left) - bunnyStepSize;
    if (newX + bunny.offsetWidth < 0) {
        bunny.style.top =
            Math.random() * (window.innerHeight - bunny.offsetHeight) + "px";
        bunny.style.left = window.innerWidth + "px";
        newX = window.innerWidth;

        if (bunnyStepSize < maxBunnyStepSize) {
            bunnyStepSize += bunnyAcceleration;
        }
    }

    bunny.style.left = newX + "px";
    requestAnimationFrame(function() {
        moveBunny(bunny);
    }, 1000 / 30);
}

var intervalId = setInterval(function() {
    for (var i = 0; i < 3; i++) {
        createBunny();
    }
}, 1500);


function createTokki() {
    var tokki = document.createElement("div");
    tokki.className = "tokki";
    tokki.style.width = "95px";
    tokki.style.height = "102px";
    tokki.style.backgroundImage = "url('icon/Tokki.webp')";
    tokki.style.backgroundSize = "contain";
    tokki.style.position = "absolute";
    tokki.style.top =
        Math.random() * (window.innerHeight - tokki.offsetHeight) + "px";
    tokki.style.left = window.innerWidth + "px";
    tokki.style.transition = "transform 6s ease-in-out";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(tokki);

    moveTokki(tokki);
}

function moveTokki(tokki) {
    var tokkiStepSize = 14 + time / 10; // Tốc độ tăng dần sau mỗi 10 giây
    var tokkiAcceleration = 0.1;
    var newX = parseInt(tokki.style.left) - tokkiStepSize;

    if (newX + tokki.offsetWidth < 0) {
        tokki.style.top =
            Math.random() * (window.innerHeight - tokki.offsetHeight) + "px";
        tokki.style.left = window.innerWidth + "px";
        newX = window.innerWidth;

        if (tokkiStepSize < maxTokkiStepSize) {
            tokkiStepSize += tokkiAcceleration;
        }
    }

    tokki.style.left = newX + "px";
    requestAnimationFrame(function() {
        moveTokki(tokki);
    }, 1000 / 30);
}
var intervalId = setInterval(function() {
    for (var i = 0; i < 3; i++) {
        createTokki();
    }
}, 3000);

document.onkeydown = function(e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }
};

function createGun() {
    var gun = document.createElement("div");
    gun.className = "tokki";
    gun.style.width = "48px";
    gun.style.height = "20px";
    gun.style.backgroundImage = "url('icon/gun.webp')";
    gun.style.backgroundSize = "contain";
    gun.style.position = "absolute";
    gun.style.top =
        Math.random() * (window.innerHeight - gun.offsetHeight) + "px";
    gun.style.left = window.innerWidth + "px";
    gun.style.transition = "transform 6s ease-in-out";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(gun);

    moveGun(gun);
}

function moveGun(gun) {
    var gunStepSize = 16 + time / 4; // Tốc độ tăng dần sau mỗi 10 giây
    var gunAcceleration = 0.1;
    var newX = parseInt(gun.style.left) - gunStepSize;
    if (newX + gun.offsetWidth < 0) {
        gun.style.top =
            Math.random() * (window.innerHeight - gun.offsetHeight) + "px";
        gun.style.left = window.innerWidth + "px";
        newX = window.innerWidth;

        if (gunStepSize < maxGunStepSize) {
            gunStepSize += gunAcceleration;
        }
    }

    gun.style.left = newX + "px";
    requestAnimationFrame(function() {
        moveGun(gun);
    }, 1000 / 30);
}

function createBunny1() {
    var bunny = document.createElement("div");
    bunny.className = "bunny";
    bunny.style.width = "48px";
    bunny.style.height = "40px";
    bunny.style.backgroundImage = "url('icon/Bunnies.webp')";
    bunny.style.backgroundSize = "contain";
    bunny.style.position = "absolute";
    bunny.style.top = window.innerHeight + "px"; // Thay đổi vị trí top ban đầu
    bunny.style.left =
        Math.random() * (window.innerWidth - bunny.offsetWidth) + "px"; // Chỉnh sửa vị trí left ngẫu nhiên

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(bunny);

    moveBunny1(bunny);
}

function moveBunny1(bunny) {
    var bunnyStepSize = 4 + time / 10; // Tốc độ tăng dần sau mỗi 10 giây
    var bunnyAcceleration = 0.1;
    var newY = parseInt(bunny.style.top) - bunnyStepSize; // Thay đổi newY thành newY
    if (newY + bunny.offsetHeight < 0) {
        // Kiểm tra nếu bunny ra khỏi khung hình
        bunny.style.top = window.innerHeight + "px"; // Đặt lại vị trí top ban đầu
        bunny.style.left =
            Math.random() * (window.innerWidth - bunny.offsetWidth) + "px"; // Chỉnh sửa vị trí left ngẫu nhiên
        newY = window.innerHeight; // Đặt newY thành window.innerHeight

        if (bunnyStepSize < maxBunnyStepSize) {
            bunnyStepSize += bunnyAcceleration;
        }
    }

    bunny.style.top = newY + "px"; // Thay đổi top thành newY
    requestAnimationFrame(function() {
        moveBunny1(bunny);
    }, 1000 / 30);
}

function createG1() {
    var g1 = document.createElement("div");
    g1.className = "tokki";
    g1.style.width = "48px";
    g1.style.height = "40px";
    g1.style.backgroundImage = "url('icon/Bunnies.webp')";
    g1.style.backgroundSize = "contain";
    g1.style.position = "absolute";
    g1.style.bottom = "0"; // Đặt vị trí ban đầu ở góc đáy
    g1.style.right = "0"; // Đặt vị trí ban đầu ở góc phải
    g1.style.transformOrigin = "bottom right"; // Đặt điểm xoay là góc đáy bên phải
    g1.style.transition = "transform 6s ease-in-out";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(g1);

    moveG1(g1);
}

function moveG1(g1) {
    var g1StepSize = 5 + time / 10; // Tốc độ di chuyển của G1
    var newX = parseInt(g1.style.right) + g1StepSize;
    var newY = parseInt(g1.style.bottom) + 2;

    if (newX > window.innerWidth || newY > window.innerHeight) {
        // Đặt lại vị trí ngẫu nhiên cho G1 khi nó đi qua góc trái trên cùng
        g1.style.bottom = "0";
        g1.style.right = "0";
        newX = 0;
        newY = 0;
    }

    g1.style.right = newX + "px";
    g1.style.bottom = newY + "px";
    requestAnimationFrame(function() {
        moveG1(g1);
    }, 1000 / 30);
}

function createG2() {
    var g2 = document.createElement("div");
    g2.className = "tokki";
    g2.style.width = "48px";
    g2.style.height = "40px";
    g2.style.backgroundImage = "url('icon/Bunnies.webp')";
    g2.style.backgroundSize = "contain";
    g2.style.position = "absolute";
    g2.style.bottom = window.innerHeight + "px"; // Đặt vị trí ban đầu ở góc đáy
    g2.style.right = "0"; // Đặt vị trí ban đầu ở góc phải
    g2.style.transformOrigin = "bottom right"; // Đặt điểm xoay là góc đáy bên phải
    g2.style.transition = "transform 6s ease-in-out";

    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(g2);

    moveG2(g2);
}

function moveG2(g2) {
    var g2StepSize = 5 + time / 10; // Tốc độ di chuyển của G2
    var newX = parseInt(g2.style.right) + g2StepSize;
    var newY = parseInt(g2.style.bottom) - 2; // Đổi dấu để di chuyển từ đáy lên trên cùng

    if (newX > window.innerWidth || newY < 0) {
        // Đặt lại vị trí ngẫu nhiên cho G2 khi nó đi qua góc trái dưới cùng
        g2.style.bottom = window.innerHeight + "px";
        g2.style.right = "0";
        newX = 0;
        newY = window.innerHeight;
    }

    g2.style.right = newX + "px";
    g2.style.bottom = newY + "px";
    requestAnimationFrame(function() {
        moveG2(g2);
    }, 1000 / 30);
}

var intervalId = setInterval(function() {
    if (score >= 75) {
        for (var i = 0; i < 4; i++) {
            createG2();
            createG1();
        }
    }
}, 6000);
var intervalId = setInterval(function() {
    if (score >= 50) {
        for (var i = 0; i < 3; i++) {
            createBunny1();
        }
    }
}, 3000);
var intervalId = setInterval(function() {
    if (score >= 25) {
        for (var i = 0; i < 3; i++) {
            createGun();
        }
    }
}, 2000);

var time = 0;
var scoreElement = document.getElementById("score");
var timeElement = document.getElementById("time");

// Tăng điểm khi Bunnies với Tokki bị trúng đạn
function increaseScore() {
    scoreElement.innerHTML = `<img src="point.webp" alt="score" id="score" style="vertical-align: middle;">  ${score}`;
    score++;

    if (score == 1000) {
        handleWin();
    }
}

// Cập nhật thời gian chạy
function updateTime() {
    timeElement.innerHTML =
        `<img src="time.webp" alt="time" id="time" style="vertical-align: middle;">   ${time}` +
        "s";
    time++;
}

// Gọi hàm increaseScore() khi Bunnies với Tokki bị trúng đạn
increaseScore();

// Gọi hàm updateTime() sau mỗi giây
setInterval(updateTime, 1000);

function handleWin() {
    isGameOver = true;
    clearInterval(intervalId);

    // Display win message or perform any other action
    var gameContainer = document.getElementById("game-container");

    var overlay = document.createElement("div");
    overlay.className = "overlay2";
    gameContainer.appendChild(overlay);

    var winMessage = document.createElement("div");
    winMessage.className = "win-message";
    gameContainer.appendChild(winMessage);
    isColliding = false;
    isMoving = false;
    isWIN = true;
    stopCharacterMovement();
}
document.onkeydown = function(e) {
    if (event.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 85) {
        return false;
    }
};
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Nếu là thiết bị di động hoặc iPad, chuyển hướng hoặc hiển thị thông báo
    // Ví dụ chuyển hướng đến một trang khác
    window.location.href = 'https://ducnguyenhoang.io.vn/404.html';
}
document.addEventListener("DOMContentLoaded", function() {


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
var myGif = document.getElementById("myGif");

// Bắt đầu tải gif
myGif.addEventListener("load", function() {
    // Đặt một timeout để tắt gif sau 3 giây
    setTimeout(function() {
        myGif.style.display = "none";
    }, 3000); // 3000 milliseconds = 3 giây
});

function Pow() {
    var soDanDisplay = document.getElementById("soDanDisplay");
    soDanDisplay.innerHTML =
        `<img src="pow.webp" id="soDanDisplay" style="vertical-align: middle;"> ${soDan}`;

}