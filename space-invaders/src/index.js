import Player from "./classes/Player.js";
import Grid from "./classes/Grid.js";
import Particle from "./classes/Particle.js";
import { GameState } from "./utils/config.js";
import Obstacle from "./classes/Obstacle.js";
import SoundEffects from "./classes/SoundEffects.js";

const soundEffects = new SoundEffects();

const scoreUi = document.querySelector(".score-ui");
const scoreElement = document.querySelector(".score > span");
const levelElement = document.querySelector(".level > span");
const bestElement = document.querySelector(".best > span");
const startGameSection = document.querySelector(".start-game-section");
const gameOverSection = document.querySelector(".game-over-section");
const buttonPlay = document.querySelector(".play");
const buttonRestart = document.querySelector(".restart");

gameOverSection.remove();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false; // Melhora a qualidade da imagem

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    best: 0,
}

const showGameData = () => {
    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    bestElement.textContent = gameData.best;
}

const player = new Player(canvas.width, canvas.height);
const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];
const grid = new Grid(3, 6);

const initObstacles = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "#a06459";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
};

initObstacles();

const drawProjectiles = () => {
    const projectiles = [...playerProjectiles, ...invaderProjectiles];

    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.updateProjectil();
    });
};

const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
};

const drawObstacles = () => {
    obstacles.forEach((obstacle) => {
        return obstacle.drawObstacles(ctx);
    });
};

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    },
};

const incrementScore = (value) => {
    gameData.score += value;

    if (gameData.score > gameData.best) {
        gameData.best = gameData.score;
    }
}

const hasProjectileHitEnemy = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                soundEffects.playHitSound();

                particleExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2,
                    },
                    10,
                    2,
                    "#941cff",
                );
                
                // Incrementa o Score
                incrementScore(1);

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};

const hasProjectileHitSpaceship = () => {
    invaderProjectiles.some((projectile, index) => {
        if (player.hitSpaceship(projectile)) {
            soundEffects.playExplosionSound();

            invaderProjectiles.splice(index, 1);

            gameOver();
        } 
    });
};

const hasProjectileHitObstacles = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, index) => {
            if (obstacle.hitObstacles(projectile)) {
                playerProjectiles.splice(index, 1);
            } 
        });

        invaderProjectiles.some((projectile, index) => {
            if (obstacle.hitObstacles(projectile)) {
                invaderProjectiles.splice(index, 1);
            } 
        });
    });
};

const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        soundEffects.playNextLevelSound();

        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);

        grid.restartGrid()

        gameData.level += 1;
    }
};

const gameOver = () => {
    particleExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        6,
        "gray",
    );

    particleExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        6,
        "white",
    );

    particleExplosion(
        {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2,
        },
        5,
        6,
        "#F55E63",
    );

    currentState = GameState.GAME_OVER;
    player.alive = false;

    document.body.append(gameOverSection);
};

const particleExplosion = (position, quantity, particleSize, color) => {
    for (let index = 0; index < quantity; index++) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
                x: Math.random() - 0.5,
                y: Math.random() - 0.5,
            },
            particleSize,
            color,
        );

        particles.push(particle);
    }
};

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.drawParticle(ctx);
        particle.updateParticle();
    });
};

const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        } 
    });
};

const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState == GameState.PLAYING) {
        showGameData();
        spawnGrid();

        drawProjectiles();
        clearProjectiles();
        drawParticles();
        clearParticles();

        drawObstacles();

        hasProjectileHitEnemy();
        hasProjectileHitSpaceship();
        hasProjectileHitObstacles();
        
        grid.drawGrid(ctx); // Gird dos invasores
        grid.update(player.alive); // Faz os grid dos invasores se moverem p/ a direita

        ctx.save();

        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );

        if (keys.shoot.pressed && keys.shoot.released) {
            soundEffects.playShootSound();
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        if (keys.left && player.position.x >= 0) {
            player.moveLeft(); 
            ctx.rotate(-0.15);
        }

        if (keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        ctx.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        player.draw(ctx);

        ctx.restore();
    }

    if (currentState == GameState.GAME_OVER) {
        drawParticles();
        drawProjectiles();

        hasProjectileHitObstacles();
        drawObstacles();

        clearParticles();
        clearProjectiles();

        grid.drawGrid(ctx);
        grid.update(player.alive);
    }

    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") {
        keys.left = true;
    }

    if (key === "d") {
        keys.right = true;
    }

    if (key === "enter") {
        keys.shoot.pressed = true;
    }
});

window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") {
        keys.left = false;
    }

    if (key === "d") {
        keys.right = false;
    }

    if (key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

// Ao clicar no botao `Play`, inicia o jogo
buttonPlay.addEventListener("click", () => {
    startGameSection.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;

    // A cada 1 segundo, um invasor aleatorio dispara um tiro
    setInterval(() => {
        const invader = grid.getRandomInvader();

        if (invader) {
            invader.shoot(invaderProjectiles);
        }
    }, 1000);
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    player.alive = true;

    grid.invaders.length = 0;
    grid.invadersSpeed = 1;

    invaderProjectiles.length = 0;

    gameOverSection.remove();

    gameData.score = 0;
    gameData.level = 0;
});

loop();

