import Sprite from './Sprite.js';

export default class GameCanvas {
    constructor(canvas, gameState, onEvent) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { willReadFrequently: true });
        this.state = gameState;
        this.onEvent = onEvent;

        // 1. Asset Loading
        this.assets = {
            bear: new Image(),
            bg: new Image(),
            items: new Image(), // Theme items (Room, Library, Garden, City, Space)
            items_base: new Image() // Forest items (Bee, Honey)
        };
        this.sprites = {};

        this.assets.bear.src = 'assets/bear_back.png'; // New Back View
        this.assets.bg.src = 'assets/bg_vertical.png'; // New Vertical BGs
        this.assets.items.src = 'assets/theme_enemies_items.png'; // Theme enemies/items
        this.assets.items_base.src = 'assets/game_items.png'; // Forest Bee/Honey

        this.totalAssets = 4;
        this.loadedAssets = 0;
        this.assetsReady = false;

        Object.values(this.assets).forEach(img => {
            img.onload = () => {
                this.loadedAssets++;
                this.processImageTransparency(img);
                if (this.loadedAssets >= this.totalAssets) {
                    this.assetsReady = true;
                }
            };
            img.onerror = () => {
                console.warn('Image load failed:', img.src);
                this.loadedAssets++;
                if (this.loadedAssets >= this.totalAssets) {
                    this.assetsReady = true;
                }
            };
        });

        // 2. Game Entities
        this.bear = {
            lane: 1, // 0 (Left), 1 (Center), 2 (Right)
            x: 0, // Calculated based on lane
            y: 0, // Fixed near bottom
            sprite: null,
            invincible: 0
        };

        this.obstacles = [];
        this.laneWidth = 0; // Calculated on resize
        this.speed = 300; // Pixels per second (Vertical speed)
        this.bgScrollY = 0; // Vertical Scroll
        this.spritesApplied = false; // Flag for one-time sprite application

        this.initInput();
    }

    processImageTransparency(img) {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, c.width, c.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 230 && data[i + 1] > 230 && data[i + 2] > 230) data[i + 3] = 0;
        }
        ctx.putImageData(imageData, 0, 0);

        if (img === this.assets.bear) this.sprites.bear = c;
        if (img === this.assets.items) this.sprites.items = c;
        if (img === this.assets.items_base) this.sprites.items_base = c;
        // Keep BG raw
    }

    initInput() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            if (this.state.phase !== 'RUN') return;
            if (e.key === 'ArrowLeft') this.moveBear(-1);
            if (e.key === 'ArrowRight') this.moveBear(1);
        });

        // Touch/Click input for mobile
        this.canvas.addEventListener('click', (e) => {
            if (this.state.phase !== 'RUN') return;
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const canvasWidth = this.canvas.width;

            // Click on left third = move left, right third = move right
            if (clickX < canvasWidth / 3) {
                this.moveBear(-1);
            } else if (clickX > canvasWidth * 2 / 3) {
                this.moveBear(1);
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.canvas.addEventListener('touchend', (e) => {
            if (this.state.phase !== 'RUN') return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;

            if (Math.abs(diff) > 30) { // Minimum swipe distance
                this.moveBear(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    moveBear(dir) {
        const newLane = this.bear.lane + dir;
        if (newLane >= 0 && newLane <= 2) {
            this.bear.lane = newLane;
        }
    }

    start() {
        this.lastTime = Date.now();
        this.bearSpriteInitialized = false;
        requestAnimationFrame(() => this.loop());
    }

    initBearSprite() {
        // Bear Sprite: 3 frames in 2x2 grid (2 on top row, 1 on bottom row)
        const bearImg = this.assets.bear;
        if (!bearImg || bearImg.width === 0) return false;

        const bearW = bearImg.width / 2;  // 2 columns
        const bearH = bearImg.height / 2; // 2 rows

        this.bear.sprite = new Sprite(bearImg, bearW, bearH, {
            'run': { row: 0, frames: 2 }, // Use 2 frames from top row for smooth animation
            'idle': { row: 0, frames: 1 }
        }, 6);

        return true;
    }

    loop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        if (!this.assetsReady) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`로딩 중... ${this.loadedAssets}/${this.totalAssets}`, 50, 50);
            requestAnimationFrame(() => this.loop());
            return;
        }

        // Initialize bear sprite once assets are ready
        if (!this.bearSpriteInitialized) {
            if (this.initBearSprite()) {
                this.bearSpriteInitialized = true;
            } else {
                // Assets not fully ready yet, wait
                requestAnimationFrame(() => this.loop());
                return;
            }
        }

        // Apply processed sprites once (only first time after assets ready)
        if (!this.spritesApplied) {
            if (this.sprites.bear && this.bear.sprite) {
                this.bear.sprite.image = this.sprites.bear;
            }
            this.spritesApplied = true;
        }

        this.update(dt);
        this.draw();

        if (this.state.phase !== 'END') {
            requestAnimationFrame(() => this.loop());
        }
    }

    update(dt) {
        if (!this.bear.sprite) return; // Safety check

        if (this.state.phase === 'RUN') {
            this.bgScrollY += this.speed * dt; // Scroll Down (Y increases)

            // Spawn
            if (Math.random() < 0.02) this.spawnObstacle();

            // Move Obstacles (Downwards)
            this.obstacles.forEach(obs => obs.y += this.speed * dt);
            this.obstacles = this.obstacles.filter(obs => obs.y < this.canvas.height + 100);

            this.checkCollisions();

            this.bear.sprite.setAnimation('run');
            this.bear.sprite.update(dt);
            if (this.bear.invincible > 0) this.bear.invincible -= dt;
        } else {
            this.bear.sprite.setAnimation('idle');
        }
    }

    spawnObstacle() {
        // Min distance check
        const lastObs = this.obstacles[this.obstacles.length - 1];
        if (lastObs && lastObs.y < 200) return; // If last one is still at top, wait

        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.4 ? 'enemy' : 'item';

        this.obstacles.push({
            type,
            lane,
            y: -100, // Start above screen
            width: 60, height: 60
        });
    }

    checkCollisions() {
        // Bear is at bottom
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = this.canvas.height * 0.8;

        this.obstacles.forEach((obs) => {
            if (obs.hit) return;

            const obsX = this.getLaneX(obs.lane);
            const dist = Math.sqrt((bearX - obsX) ** 2 + (bearY - obs.y) ** 2);

            // Distance check (Vertical is easier, X is locked to lane)
            // But let's keep radius check for smoothness
            if (dist < 60) {
                obs.hit = true;
                if (obs.type === 'item') {
                    this.state.phase = 'QUIZ_TRANSITION';
                    this.onEvent('quiz_trigger');
                } else if (obs.type === 'enemy') {
                    if (this.bear.invincible <= 0) {
                        this.onEvent('damage');
                        this.bear.invincible = 1.0;
                    }
                }
                obs.y = 9999; // Move away
            }
        });
    }

    getLaneX(lane) {
        // Divide screen into 3 cols
        const colWidth = this.canvas.width / 3;
        return (colWidth * lane) + (colWidth / 2);
    }

    getThemeAssets() {
        // 6 Themes
        const themeIdx = Math.floor(this.state.currentLevel / 5);
        // bg_vertical has 6 columns stacked horizontally
        const bgImg = this.assets.bg;
        const colW = bgImg && bgImg.width ? bgImg.width / 6 : 0;
        const sourceX = (themeIdx % 6) * colW;

        return { bgImg, sourceX, colW, themeIdx };
    }

    draw() {
        if (this.canvas.width !== this.canvas.clientWidth) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        // 1. BG (Vertical Scroll)
        const { bgImg, sourceX, colW, themeIdx } = this.getThemeAssets();

        // Safety check for background image
        if (!bgImg || !bgImg.width || !bgImg.height) {
            // Draw fallback gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#228B22');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        } else {
            const scrollY = this.bgScrollY % h;

            // Draw 1 (Top part moving down)
            ctx.drawImage(bgImg,
                sourceX, 0, colW, bgImg.height,
                0, scrollY - h, w, h
            );
            // Draw 2 (Bottom part coming in)
            ctx.drawImage(bgImg,
                sourceX, 0, colW, bgImg.height,
                0, scrollY, w, h
            );
        }

        // 2. Lanes (Guides)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 1; i < 3; i++) {
            const x = (w / 3) * i;
            ctx.moveTo(x, 0); ctx.lineTo(x, h);
        }
        ctx.stroke();

        // 3. Bear
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = h * 0.8;

        if (this.bear.sprite && (this.bear.invincible <= 0 || Math.floor(Date.now() / 100) % 2 === 0)) {
            this.bear.sprite.draw(ctx, bearX - 50, bearY - 50, { scale: 0.5 });
        }

        // 4. Obstacles
        this.obstacles.forEach(obs => {
            const x = this.getLaneX(obs.lane);
            const size = 80;
            const half = size / 2;

            let drawSrc, sCol, sRow, fw, fh;

            if (themeIdx === 0) {
                // Forest Theme: Use items_base (game_items.png) - Bee/Honey
                drawSrc = this.sprites.items_base || this.assets.items_base;
                // game_items.png structure: assume 3 cols, enemy in col 0-1, item in col 2
                fw = drawSrc.width / 3;
                fh = drawSrc.height;
                sRow = 0;
                sCol = obs.type === 'enemy' ? 0 : 2; // Bee=0, Honey=2
            } else {
                // Other Themes: Use theme_enemies_items.png
                // 5 rows (Room=0, Library=1, Garden=2, City=3, Space=4)
                // 3 cols (col 0=?, col 1=enemy, col 2=item)
                drawSrc = this.sprites.items || this.assets.items;
                fw = drawSrc.width / 3;
                fh = drawSrc.height / 5;
                sRow = Math.min(themeIdx - 1, 4); // Map theme 1-5 to rows 0-4
                sCol = obs.type === 'enemy' ? 1 : 2;
            }

            // Safety check and draw
            if (drawSrc && drawSrc.width > 0 && drawSrc.height > 0) {
                ctx.drawImage(
                    drawSrc,
                    sCol * fw, sRow * fh, fw, fh,
                    x - half, obs.y - half, size, size
                );
            }
        });

        // 5. Flash
        if (this.bear.invincible > 0.8) {
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, 0, w, h);
        }
    }
}
