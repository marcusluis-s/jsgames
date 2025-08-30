class Obstacle {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    drawObstacles(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    hitObstacles(projectile) {
        const projectilePositionY =
            projectile.valocity < 0
                ? projectile.position.y
                : projectile.position.y + projectile.height;

        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectilePositionY >= this.position.y &&
            projectilePositionY <= this.position.y + this.height
        );     
    }  
}

export default Obstacle;
