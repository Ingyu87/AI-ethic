export default class Sprite {
    constructor(image, frameWidth, frameHeight, animations, speed = 10) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.animations = animations; // { 'run': { row: 0, frames: 4 }, ... }
        this.currentAnim = 'idle';
        this.frameIndex = 0;
        this.animationSpeed = speed; // Frames per second
        this.tickCount = 0;
    }

    setAnimation(name) {
        if (this.currentAnim !== name && this.animations[name]) {
            this.currentAnim = name;
            this.frameIndex = 0;
            this.tickCount = 0;
        }
    }

    update(dt) {
        // dt is delta time in seconds
        this.tickCount += dt;
        if (this.tickCount > 1 / this.animationSpeed) {
            this.tickCount = 0;
            const anim = this.animations[this.currentAnim];
            if (anim) {
                this.frameIndex = (this.frameIndex + 1) % anim.frames;
            }
        }
    }

    draw(ctx, x, y, options = {}) {
        const anim = this.animations[this.currentAnim];
        if (!anim) return;

        // Safety check for image
        if (!this.image || !this.image.width || !this.image.height) return;

        const row = anim.row;
        // If col is specified in options (for non-animated selection), use it. otherwise animate
        const col = options.frameIndex !== undefined ? options.frameIndex : this.frameIndex;

        const scale = options.scale || 1;

        // Ensure we don't draw outside image bounds
        const sourceX = Math.min(col * this.frameWidth, this.image.width - this.frameWidth);
        const sourceY = Math.min(row * this.frameHeight, this.image.height - this.frameHeight);

        try {
            ctx.drawImage(
                this.image,
                sourceX, sourceY,
                this.frameWidth, this.frameHeight,
                x, y,
                this.frameWidth * scale, this.frameHeight * scale
            );
        } catch (e) {
            // Silently ignore draw errors (image not ready)
        }
    }
}
