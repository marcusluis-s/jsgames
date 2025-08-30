import { AUDIOS } from "../utils/config.js";

class SoundEffects {
    constructor() {
        this.shootSounds = [
            new Audio(AUDIOS.SHOOT),
            new Audio(AUDIOS.SHOOT),
            new Audio(AUDIOS.SHOOT),
            new Audio(AUDIOS.SHOOT),
            new Audio(AUDIOS.SHOOT),
        ];

        this.hitSounds = [
            new Audio(AUDIOS.HIT),
            new Audio(AUDIOS.HIT),
            new Audio(AUDIOS.HIT),
            new Audio(AUDIOS.HIT),
            new Audio(AUDIOS.HIT),
        ];

        this.explosionSound = new Audio(AUDIOS.EXPLOSION);
        this.nextLeveSound = new Audio(AUDIOS.NEXT_LEVEL);

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    playShootSound() {
        this.shootSounds[this.currentShootSound].currentTime = 0;
        this.shootSounds[this.currentShootSound].play();
        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length;
    }

    playHitSound() {
        this.hitSounds[this.currentHitSound].currentTime = 0;
        this.hitSounds[this.currentHitSound].play();
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    playExplosionSound() {
        this.explosionSound.play();
    }

    playNextLevelSound() {
        this.nextLeveSound.play();
    }

    adjustVolumes() {
        this.shootSounds.forEach((sound) => {
            return sound.volume = 0.5; 
        });
        this.hitSounds.forEach((sound) => {
            return sound.volume = 0.2;
        });
        this.explosionSound.volume = 0.2;
        this.nextLeveSound.volume = 0.4;
    }
}

export default SoundEffects;
