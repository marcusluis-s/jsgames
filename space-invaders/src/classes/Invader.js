import { IMAGES } from "../utils/config.js";
import Projectiles from "./Projectiles.js";

class Invader {
    constructor(position, speed) {
        this.position = position;
        this.width = 50 * 0.8;
        this.height = 37 * 0.8;
        this.speed = speed;

        this.image = this.getImage(IMAGES.INVADER);
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

    moveDown() {
        this.position.y += this.height;
    }

    incrementInvaderSpeed(boost) {
        this.speed += boost;
    }

    drawInvader(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    shoot(projectiles) {
        const p = new Projectiles(
            {
                x: this.position.x + this.width / 2 -1,
                y: this.position.y + this.height,
            },
            10,
            "cyan",
        );

        projectiles.push(p);
    }

    hit(projectile) {
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height
        );
    }
}

export default Invader;
