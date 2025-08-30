import { IMAGES, INITIAL_FRAMES } from "../utils/config.js";
import Projectiles from "./Projectiles.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;
        this.width = 48 * 2;
        this.height = 48 * 2;
        this.speed = 6;
        this.position = {
            x: (canvasWidth / 2) - (this.width / 2),
            y: canvasHeight - this.height - 30,
        };
        this.image = this.getImage(IMAGES.SPACESHIP);
        this.engineImage = this.getImage(IMAGES.ENGINE);
        this.engineSprites = this.getImage(IMAGES.ENGINE_SPRITES);

        this.sx = 0;
        this.framesCounter = INITIAL_FRAMES;
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() {
        this.position.x -= this.speed;
    }

    moveRight() {
        this.position.x += this.speed;
    }
    
    draw(ctx) {
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(
            this.engineSprites,
            this.sx,
            0,
            48,
            48,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height
        );
        ctx.drawImage(this.engineImage, this.position.x, this.position.y + 8, this.width, this.height);

        this.updateSpritesAnimation();
    }

    updateSpritesAnimation() {
        if (this.framesCounter === 0) {
            if (this.sx === 96) {
                this.sx = 0;
            } else {
                this.sx += 48;
            }

            this.framesCounter = INITIAL_FRAMES;
        }

        this.framesCounter--;
    }

    shoot(projectiles) {
        const projectil = new Projectiles({
            x: this.position.x + this.width / 2 - 1.5,
            y: this.position.y,
        }, -10);

        projectiles.push(projectil);
    }

    hitSpaceship(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + this.width - 20 &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );     
    }
}

export default Player;

