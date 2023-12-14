var character = document.getElementById("character");
var position = { x: 0, y: 0 };
var isMoving = false;
var isColliding = false;
var isGameOver = false;
var isLightBeamActive = false;
var characterStepSize = 5;
var isWIN = false;
var soDan = 30;

character.className = "character";



function shootBullet() {
    if (isGameOver) return;
    if (soDan > 0) {
        soDan--;

        var bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.width = "20px";
        bullet.style.height = "20px";
        bullet.style.backgroundColor = "rgb(169, 80, 200)";
        bullet.style.position = "absolute";
        bullet.style.top = position.y + character.offsetHeight / 2 - 5 + "px";
        bullet.style.left = position.x + character.offsetWidth + "px";
        bullet.style.borderRadius = "10px";
        var gameContainer = document.getElementById("game-container");
        gameContainer.appendChild(bullet);
        var bulletSound = document.getElementById("bullet-sound");
        bulletSound.play();
        var bulletHalo = document.createElement("div");
        bulletHalo.className = "bullet-halo";
        bulletHalo.style.position = "absolute";
        bulletHalo.style.top = position.y + character.offsetHeight / 2 - 20 + "px";
        bulletHalo.style.left = position.x + character.offsetWidth + "px";
        gameContainer.appendChild(bulletHalo);
        setTimeout(function() {
            bulletHalo.remove();
        }, 1000);
        moveBullet(bullet);
        Pow();

    }
}

setInterval(function() {
    if (soDan < 30) {
        soDan++;
        Pow();
    }
}, 1000);

var lastLightBeamTime = 0;
var lightBeamCooldown = 15; // Thời gian cooldown cho light beam (30 giây)
var lightBeamTimerId = null;

function activateLightBeam() {
    if (isGameOver) return;

    var currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính bằng giây

    if (currentTime - lastLightBeamTime >= lightBeamCooldown) {
        lastLightBeamTime = currentTime;

        if (!isLightBeamActive) {
            isLightBeamActive = true;
            createLightBeam();
        }

        var lightBeamHalo = document.createElement("div");
        lightBeamHalo.className = "light-beam-halo";
        lightBeamHalo.style.position = "absolute";
        lightBeamHalo.style.top = position.y - 30 + "px";
        lightBeamHalo.style.left = position.x + character.offsetWidth + "px";

        gameContainer.appendChild(lightBeamHalo);

        setTimeout(function() {
            lightBeamHalo.remove();
        }, 2000);

        createLightBeam();

        startLightBeamCooldownTimer();
    }
}

function startLightBeamCooldownTimer() {
    var cooldownTime = lightBeamCooldown;

    updateLightBeamCooldown(cooldownTime);

    lightBeamTimerId = setInterval(function() {
        cooldownTime--;

        if (cooldownTime <= 0) {
            clearInterval(lightBeamTimerId);
            lightBeamTimerId = null;
            updateLightBeamCooldown(0);
        } else {
            updateLightBeamCooldown(cooldownTime);
        }
    }, 1000);
}

function updateLightBeamCooldown(time) {
    var cooldownDisplay = document.getElementById("l");

    if (cooldownDisplay) {
        cooldownDisplay.innerHTML = `<img src="hyein.webp" alt="Hồi chiêu" id="hinh-anh" style="vertical-align: middle;"> ${time}s`;
    }
}

function createLightBeam() {
    var lightBeam = document.createElement("div");
    lightBeam.className = "light-beam";
    lightBeam.style.width = character.offsetWidth + (50) + "px";
    lightBeam.style.height = character.offsetHeight + (50) + "px";
    lightBeam.style.backgroundImage =
        "url('hyein.webp')";
    lightBeam.style.position = "absolute";
    lightBeam.style.top = position.y + "px";
    lightBeam.style.left = position.x + character.offsetWidth + "px";
    var bulletSound = document.getElementById("Lover-sound");
    bulletSound.play();
    var gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(lightBeam);
    moveLightBeam(lightBeam);

}

function moveLightBeam(lightBeam) {
    var lightBeamStepSize = 7;
    var minX = 0;
    var maxX = window.innerWidth - lightBeam.offsetWidth;

    var lightBeamX = parseInt(lightBeam.style.left) + lightBeamStepSize;

    if (lightBeamX > maxX) {
        lightBeam.remove();
        isLightBeamActive = false;
        return;
    }

    lightBeam.style.left = lightBeamX + "px";

    var bunnies = document.getElementsByClassName("bunny");
    var tokki = document.getElementsByClassName("tokki");
    var character = document.getElementById("character");
    startLightBeamCooldownTimer();
    for (var i = 0; i < bunnies.length; i++) {
        if (isCollidingWith(lightBeam, bunnies[i])) {
            bunnies[i].remove();
            increaseScore();
        }
    }
    for (var j = 0; j < tokki.length; j++) {
        if (isCollidingWith(lightBeam, tokki[j])) {
            tokki[j].remove();
            increaseScore();
            increaseScore();
        }
    }

    requestAnimationFrame(function() {
        moveLightBeam(lightBeam);
    });
}

function moveBullet(bullet) {
    var bulletStepSize = 10;
    var maxX = window.innerWidth;

    var bulletX = parseInt(bullet.style.left) + bulletStepSize;

    if (bulletX > maxX) {
        bullet.remove();
        return;
    }

    bullet.style.left = bulletX + "px";

    var bunnies = document.getElementsByClassName("bunny");
    var tokki = document.getElementsByClassName("tokki");
    for (var i = 0; i < bunnies.length; i++) {
        if (isCollidingWith(bullet, bunnies[i])) {
            bunnies[i].remove();
            bullet.remove();
            increaseScore();
            return;
        }
    }
    for (var j = 0; j < tokki.length; j++) {
        if (isCollidingWith(bullet, tokki[j])) {
            tokki[j].remove();
            bullet.remove();
            increaseScore();
            increaseScore();
            return;
        }
    }

    requestAnimationFrame(function() {
        moveBullet(bullet);
    });
}