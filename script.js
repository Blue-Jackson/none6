const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    bullets: [],
};

const enemies = [];
const enemySize = 40;
const enemySpeed = 2;

function drawSpaceship() {
    ctx.fillStyle = "white";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    spaceship.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
    });
}

function createEnemy() {
    const x = Math.random() * (canvas.width - enemySize);
    enemies.push({
        x: x,
        y: -enemySize,
        width: enemySize,
        height: enemySize,
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;
    });
}

function detectCollisions() {
    spaceship.bullets = spaceship.bullets.filter(bullet => {
        return !enemies.some((enemy, index) => {
            const collision =
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.height + bullet.y > enemy.y;

            if (collision) {
                enemies.splice(index, 1);
                return true;
            }
            return false;
        });
    });

    enemies.forEach(enemy => {
        if (
            spaceship.x < enemy.x + enemy.width &&
            spaceship.x + spaceship.width > enemy.x &&
            spaceship.y < enemy.y + enemy.height &&
            spaceship.height + spaceship.y > enemy.y
        ) {
            alert("Game Over!");
            document.location.reload();
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawBullets();
    drawEnemies();
    detectCollisions();

    if (spaceship.movingLeft && spaceship.x > 0) {
        spaceship.x -= spaceship.speed;
    }
    if (spaceship.movingRight && spaceship.x < canvas.width - spaceship.width) {
        spaceship.x += spaceship.speed;
    }

    spaceship.bullets = spaceship.bullets.filter(bullet => bullet.y > 0);

    requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        spaceship.movingLeft = true;
    }
    if (e.key === "ArrowRight") {
        spaceship.movingRight = true;
    }
    if (e.key === " ") {
        spaceship.bullets.push({
            x: spaceship.x + spaceship.width / 2 - 5,
            y: spaceship.y,
            width: 10,
            height: 20,
            speed: 7,
        });
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") {
        spaceship.movingLeft = false;
    }
    if (e.key === "ArrowRight") {
        spaceship.movingRight = false;
    }
});

setInterval(createEnemy, 1000);

update();
