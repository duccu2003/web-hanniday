var isBoxOpen = false;
var w = (c.width = window.innerWidth),
    h = (c.height = window.innerHeight),
    ctx = c.getContext("2d"),
    hw = w / 2, // half-width
    hh = h / 2,
    opts = {
        strings: ["HAPPY HANNI DAY!!", "06/10/2004"],
        charSize: 20,
        charSpacing: 20,
        lineHeight: 80,

        cx: w / 2,
        cy: h / 2,

        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: 0.1,
        upFlow: -0.1,
        letterContemplatingWaitTime: 500,
        balloonSpawnTime: 30,
        balloonBaseInflateTime: 60,
        balloonAddedInflateTime: 80,
        balloonBaseSize: 20,
        balloonAddedSize: 40,
        balloonBaseVel: 0.4,
        balloonAddedVel: 0.4,
        balloonBaseRadian: -(Math.PI / 2 - 0.5),
        balloonAddedRadian: -1,
    },
    calc = {
        totalWidth: opts.charSpacing *
            Math.max(opts.strings[0].length, opts.strings[1].length),
    },
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    letters = [];

ctx.font = opts.charSize + "px F2";

function Letter(char, x, y) {
    this.char = char;
    this.x = x;
    this.y = y;

    this.dx = -ctx.measureText(char).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    var hue = (x / calc.totalWidth) * 360;

    this.color = "hsl(hue,80%,50%)".replace("hue", hue);
    this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
    this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
    this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);

    this.reset();
}
Letter.prototype.reset = function() {
    this.phase = "firework";
    this.tick = 0;
    this.spawned = false;
    this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
    this.reachTime =
        (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) |
        0;
    this.lineWidth =
        opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
    this.prevPoints = [
        [0, hh, 0]
    ];
};
Letter.prototype.step = function() {
    if (this.phase === "firework") {
        if (!this.spawned) {
            ++this.tick;
            if (this.tick >= this.spawningTime) {
                this.tick = 0;
                this.spawned = true;
            }
        } else {
            ++this.tick;

            var linearProportion = this.tick / this.reachTime,
                armonicProportion = Math.sin(linearProportion * TauQuarter),
                x = linearProportion * this.x,
                y = hh + armonicProportion * this.fireworkDy;

            if (this.prevPoints.length > opts.fireworkPrevPoints)
                this.prevPoints.shift();

            this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

            var lineWidthProportion = 1 / (this.prevPoints.length - 1);

            for (var i = 1; i < this.prevPoints.length; ++i) {
                var point = this.prevPoints[i],
                    point2 = this.prevPoints[i - 1];

                ctx.strokeStyle = this.alphaColor.replace(
                    "alp",
                    i / this.prevPoints.length
                );
                ctx.lineWidth = point[2] * lineWidthProportion * i;
                ctx.beginPath();
                ctx.moveTo(point[0], point[1]);
                ctx.lineTo(point2[0], point2[1]);
                ctx.stroke();
            }

            if (this.tick >= this.reachTime) {
                this.phase = "contemplate";

                this.circleFinalSize =
                    opts.fireworkCircleBaseSize +
                    opts.fireworkCircleAddedSize * Math.random();
                this.circleCompleteTime =
                    (opts.fireworkCircleBaseTime +
                        opts.fireworkCircleAddedTime * Math.random()) |
                    0;
                this.circleCreating = true;
                this.circleFading = false;

                this.circleFadeTime =
                    (opts.fireworkCircleFadeBaseTime +
                        opts.fireworkCircleFadeAddedTime * Math.random()) |
                    0;
                this.tick = 0;
                this.tick2 = 0;

                this.shards = [];

                var shardCount =
                    (opts.fireworkBaseShards +
                        opts.fireworkAddedShards * Math.random()) |
                    0,
                    angle = Tau / shardCount,
                    cos = Math.cos(angle),
                    sin = Math.sin(angle),
                    x = 1,
                    y = 0;

                for (var i = 0; i < shardCount; ++i) {
                    var x1 = x;
                    x = x * cos - y * sin;
                    y = y * cos + x1 * sin;

                    this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
                }
            }
        }
    } else if (this.phase === "contemplate") {
        ++this.tick;

        if (this.circleCreating) {
            ++this.tick2;
            var proportion = this.tick2 / this.circleCompleteTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor
                .replace("light", 50 + 50 * proportion)
                .replace("alp", proportion);
            ctx.beginPath();
            ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 > this.circleCompleteTime) {
                this.tick2 = 0;
                this.circleCreating = false;
                this.circleFading = true;
            }
        } else if (this.circleFading) {
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            ++this.tick2;
            var proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor
                .replace("light", 100)
                .replace("alp", 1 - armonic);
            ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
            ctx.fill();

            if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
        } else {
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
        }

        for (var i = 0; i < this.shards.length; ++i) {
            this.shards[i].step();

            if (!this.shards[i].alive) {
                this.shards.splice(i, 1);
                --i;
            }
        }

        if (this.tick > opts.letterContemplatingWaitTime) {
            this.phase = "balloon";

            this.tick = 0;
            this.spawning = true;
            this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
            this.inflating = false;
            this.inflateTime =
                (opts.balloonBaseInflateTime +
                    opts.balloonAddedInflateTime * Math.random()) |
                0;
            this.size =
                (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

            var rad =
                opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

            this.vx = Math.cos(rad) * vel;
            this.vy = Math.sin(rad) * vel;
        }
    } else if (this.phase === "balloon") {
        ctx.strokeStyle = this.lightColor.replace("light", 80);

        if (this.spawning) {
            ++this.tick;
            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= this.spawnTime) {
                this.tick = 0;
                this.spawning = false;
                this.inflating = true;
            }
        } else if (this.inflating) {
            ++this.tick;

            var proportion = this.tick / this.inflateTime,
                x = (this.cx = this.x),
                y = (this.cy = this.y - this.size * proportion);

            ctx.fillStyle = this.alphaColor.replace("alp", proportion);
            ctx.beginPath();
            generateBalloonPath(x, y, this.size * proportion);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, this.y);
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

            if (this.tick >= this.inflateTime) {
                this.tick = 0;
                this.inflating = false;
            }
        } else {
            this.cx += this.vx;
            this.cy += this.vy += opts.upFlow;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            generateBalloonPath(this.cx, this.cy, this.size);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(this.cx, this.cy);
            ctx.lineTo(this.cx, this.cy + this.size);
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace("light", 70);
            ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);

            if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
                this.phase = "done";
        }
    }
};

function Shard(x, y, vx, vy, color) {
    var vel =
        opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

    this.vx = vx * vel;
    this.vy = vy * vel;

    this.x = x;
    this.y = y;

    this.prevPoints = [
        [x, y]
    ];
    this.color = color;

    this.alive = true;

    this.size =
        opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function() {
    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if (this.prevPoints.length > opts.fireworkShardPrevPoints)
        this.prevPoints.shift();

    this.prevPoints.push([this.x, this.y]);

    var lineWidthProportion = this.size / this.prevPoints.length;

    for (var k = 0; k < this.prevPoints.length - 1; ++k) {
        var point = this.prevPoints[k],
            point2 = this.prevPoints[k + 1];

        ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
        ctx.lineWidth = k * lineWidthProportion;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
    }

    if (this.prevPoints[0][1] > hh) this.alive = false;
};

function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
        x - size / 2,
        y - size / 2,
        x - size / 4,
        y - size,
        x,
        y - size
    );
    ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
}

function anim() {
    window.requestAnimationFrame(anim);

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    ctx.translate(hw, hh);

    var done = true;
    for (var l = 0; l < letters.length; ++l) {
        letters[l].step();
        if (letters[l].phase !== "done") done = false;
    }

    ctx.translate(-hw, -hh);

    // Hiển thị chữ sau khi opts chạy xong
    if (done) {
        // Hiển thị chữ trên video
        ctx.fillStyle = "white";
        ctx.font = "18px F2";
        ctx.textAlign = "center";
        var textY = h / 2; // Vị trí dọc của chữ tiếng Anh
        ctx.fillText("HAPPY BIRTHDAY PAM HANNI 🥳", w / 2, textY);

        ctx.fillStyle = "white";
        ctx.font = "18px F2";
        ctx.textAlign = "center";
        var koreanTextY = textY + 50; // Vị trí dọc của chữ tiếng Hàn (dịch xuống dưới)
        ctx.fillText("행복한 생일이 되세요, 팜 한니 🥳", w / 2, koreanTextY);
        ctx.fillStyle = "white";
        ctx.font = "18px F2";
        ctx.textAlign = "center";
        var vietTextY = textY + 100; // Vị trí dọc của chữ tiếng Hàn (dịch xuống dưới)
        ctx.fillText("CHÚC MỪNG SINH NHẬT PAM HANNI 🥳", w / 2, vietTextY);
        // Vẽ nền cho video tiếng Hàn
        ctx.fillStyle = "#111";
        ctx.fillRect(videoX, videoY, video.width, video.height);
    }
}

for (var i = 0; i < opts.strings.length; ++i) {
    for (var j = 0; j < opts.strings[i].length; ++j) {
        letters.push(
            new Letter(
                opts.strings[i][j],
                j * opts.charSpacing +
                opts.charSpacing / 2 -
                (opts.strings[i].length * opts.charSize) / 2,
                i * opts.lineHeight +
                opts.lineHeight / 2 -
                (opts.strings.length * opts.lineHeight) / 2
            )
        );
    }
}

setTimeout(() => {
    anim();
    ctx.font = opts.charSize + "px F2";
}, 2000); // Mã liên quan đến hộp mở ở đây

window.requestAnimFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

// now we will setup our basic variables for the demo
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    // firework collection
    fireworks = [],
    // particle collection
    particles = [],
    // starting hue
    hue = 120,
    // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
    limiterTotal = 5,
    limiterTick = 0,
    // this will time the auto launches of fireworks, one launch per 80 loop ticks
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    // mouse x coordinate,
    mx,
    // mouse y coordinate
    my;

// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 3;
    // populate initial coordinate collection with the current coordinates
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    // circle target indicator radius
    this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function(index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);

    // cycle the circle target indicator radius
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    // speed up the firework
    this.speed *= this.acceleration;

    // get the current velocities based on angle and speed
    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance(
        this.sx,
        this.sy,
        this.x + vx,
        this.y + vy
    );

    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        // remove the firework, use the index passed into the update function to determine which to remove
        fireworks.splice(index, 1);
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
};
// draw firework
Firework.prototype.draw = function() {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
    ctx.stroke();

    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
};

// create particle
function Particle(x, y) {
    this.x = x;
    this.y = y;
    // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    // set a random angle in all possible directions, in radians
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    // friction will slow the particle down
    this.friction = 0.95;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-20 of the overall hue variable
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = random(0.015, 0.03);
}

// update particle
Particle.prototype.update = function(index) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift([this.x, this.y]);
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;

    // remove the particle once the alpha is low enough, based on the passed in index
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

// draw particle
Particle.prototype.draw = function() {
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle =
        "hsla(" +
        this.hue +
        ", 100%, " +
        this.brightness +
        "%, " +
        this.alpha +
        ")";
    ctx.stroke();
};

// create particle group/explosion
function createParticles(x, y) {
    // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
    var particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// main demo loop
function loop() {
    // this function will run endlessly with requestAnimationFrame
    requestAnimFrame(loop);

    hue += 0.5;

    ctx.globalCompositeOperation = "destination-out";

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = "lighter";
    // loop over each firework, draw it, update it
    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    // loop over each particle, draw it, update it
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    // launch fireworks automatically to random coordinates, when the mouse isn't down
    if (timerTick >= timerTotal) {
        if (!mousedown) {
            // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
            fireworks.push(
                new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2))
            );
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    // limit the rate at which fireworks get launched when mouse is down
    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

window.onload = function() {
    var merrywrap = document.getElementById("merrywrap");
    var box = merrywrap.getElementsByClassName("giftbox")[0];
    var step = 1;
    var stepMinutes = [500, 500, 200, 200];

    function init() {
        box.addEventListener("click", openBox, false);
    }

    function stepClass(step) {
        merrywrap.className = "merrywrap";
        merrywrap.className = "merrywrap step-" + step;
    }

    function openBox() {
        if (step === 1) {
            isBoxOpen = true;
            box.removeEventListener("click", openBox, false);
        }
        stepClass(step);
        if (step === 3) {}
        if (step === 4) {
            reveal();
            return;
        }

        setTimeout(openBox, stepMinutes[step - 1]);

        playMusic();
        step++;
    }

    init();
};

function reveal() {
    document.querySelector(".merrywrap").style.backgroundColor = "transparent";

    loop();

    var w, h;
    if (window.innerWidth >= 1000) {
        w = 295;
        h = 185;
    } else {
        w = 255;
        h = 155;
    }

    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "https://www.youtube.com/watch?v=KDxJlW6cxRk");

    ifrm.style.border = "none";
    document.querySelector("#video").appendChild(ifrm);
}

const balloonContainer = document.getElementById("balloon-container");

function random(num) {
    return Math.floor(Math.random() * num);
}

function getRandomStyles() {
    var r = random(255);
    var g = random(255);
    var b = random(255);
    var mt = random(200);
    var ml = random(50);
    var dur = random(5) + 5;
    return `
background-color: rgba(${r},${g},${b},0.7);
color: rgba(${r},${g},${b},0.7); 
box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
margin: ${mt}px 0 0 ${ml}px;
animation: float ${dur}s ease-in infinite
`;
}

function createBalloons(num) {
    for (var i = num; i > 0; i--) {
        var balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.cssText = getRandomStyles();
        balloonContainer.append(balloon);
    }
}
window.addEventListener("load", () => {
    createBalloons(30);
});

window.addEventListener("click", () => {
    removeBalloons();
});
// Hình ảnh của các quả bóng
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
}

// Ngăn chặn việc in mã nguồn trang web
document.addEventListener("keydown", function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
    } else if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 73)
    ) {
        e.preventDefault();
    }
});

// Ngăn chặn việc truy cập vào DevTools
function detectDevTools() {
    var devtools = /./;
    devtools.toString = function() {
        this.opened = true;
        // Thực hiện các hành động mong muốn khi DevTools được mở
    };

    setInterval(function() {
        console.log(devtools);
    }, 1000);
}

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

detectDevTools();
// Phát âm thanh chơi nhạc
function playMusic() {
    var audio = document.getElementById("birthday-music");
    audio.play();
}
// Thêm vào cuối phần script của bạn
document.addEventListener("click", function(event) {
    var popup = document.getElementById("popup");
    if (event.target == popup) {
        closePopup();
    }
});