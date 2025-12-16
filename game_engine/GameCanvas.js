export default class GameCanvas {
    constructor(canvas, gameState, onEvent) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = gameState;
        this.onEvent = onEvent;

        // Theme settings (6 themes, 5 levels each = 30 levels)
        this.themes = [
            { name: 'Forest', bg1: '#228B22', bg2: '#90EE90', road: '#8B4513' },
            { name: 'Room', bg1: '#8B4513', bg2: '#DEB887', road: '#D2691E' },
            { name: 'Library', bg1: '#4A4A4A', bg2: '#8B7355', road: '#654321' },
            { name: 'Garden', bg1: '#32CD32', bg2: '#98FB98', road: '#C0C0C0' },
            { name: 'City', bg1: '#2F4F4F', bg2: '#708090', road: '#404040' },
            { name: 'Space', bg1: '#0a0a2e', bg2: '#1a1a4e', road: '#2a2a5e' }
        ];

        // Load images
        this.images = {
            forestItems: new Image(),    // game_items.png (bee, honey)
            themeItems: new Image(),     // theme_enemies_items.png
            bear: new Image()            // bear_back.png
        };
        
        this.images.forestItems.src = 'assets/game_items.png';
        this.images.themeItems.src = 'assets/theme_enemies_items.png';
        this.images.bear.src = 'assets/bear_back.png';

        this.imagesLoaded = 0;
        this.totalImages = 3;
        this.assetsReady = false;

        Object.values(this.images).forEach(img => {
            img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded >= this.totalImages) {
                    this.assetsReady = true;
                }
            };
            img.onerror = () => {
                console.warn('Image failed to load:', img.src);
                this.imagesLoaded++;
                if (this.imagesLoaded >= this.totalImages) {
                    this.assetsReady = true;
                }
            };
        });

        // Game Entities
        this.bear = {
            lane: 1,
            invincible: 0,
            runFrame: 0,
            frameTime: 0
        };

        this.obstacles = [];
        this.speed = 280;
        this.bgScrollY = 0;

        this.initInput();
    }

    initInput() {
        window.addEventListener('keydown', (e) => {
            if (this.state.phase !== 'RUN') return;
            if (e.key === 'ArrowLeft') this.moveBear(-1);
            if (e.key === 'ArrowRight') this.moveBear(1);
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.state.phase !== 'RUN') return;
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const canvasWidth = this.canvas.width;

            if (clickX < canvasWidth / 3) {
                this.moveBear(-1);
            } else if (clickX > canvasWidth * 2 / 3) {
                this.moveBear(1);
            }
        });

        let touchStartX = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.canvas.addEventListener('touchend', (e) => {
            if (this.state.phase !== 'RUN') return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 30) {
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
        requestAnimationFrame(() => this.loop());
    }

    loop() {
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.draw();

        if (this.state.phase !== 'END') {
            requestAnimationFrame(() => this.loop());
        }
    }

    update(dt) {
        if (this.state.phase === 'RUN') {
            this.bgScrollY += this.speed * dt;

            if (Math.random() < 0.018) this.spawnObstacle();

            this.obstacles.forEach(obs => obs.y += this.speed * dt);
            this.obstacles = this.obstacles.filter(obs => obs.y < this.canvas.height + 100);

            this.checkCollisions();

            // Bear animation
            this.bear.frameTime += dt;
            if (this.bear.frameTime > 0.12) {
                this.bear.frameTime = 0;
                this.bear.runFrame = (this.bear.runFrame + 1) % 2;
            }

            if (this.bear.invincible > 0) this.bear.invincible -= dt;
        }
    }

    spawnObstacle() {
        const lastObs = this.obstacles[this.obstacles.length - 1];
        if (lastObs && lastObs.y < 180) return;

        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.35 ? 'enemy' : 'item';

        this.obstacles.push({ type, lane, y: -70 });
    }

    checkCollisions() {
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = this.canvas.height * 0.78;

        this.obstacles.forEach((obs) => {
            if (obs.hit) return;

            const obsX = this.getLaneX(obs.lane);
            const dist = Math.sqrt((bearX - obsX) ** 2 + (bearY - obs.y) ** 2);

            if (dist < 45) {
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
            }
        });
    }

    getLaneX(lane) {
        const roadWidth = this.canvas.width * 0.8;
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;
        return roadX + (laneWidth * lane) + (laneWidth / 2);
    }

    getTheme() {
        const themeIdx = Math.floor(this.state.currentLevel / 5) % 6;
        return { ...this.themes[themeIdx], index: themeIdx };
    }

    draw() {
        if (this.canvas.width !== this.canvas.clientWidth) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;
        const theme = this.getTheme();

        // 1. Background
        this.drawBackground(ctx, w, h, theme);

        // 2. Road
        this.drawRoad(ctx, w, h, theme);

        // 3. Obstacles
        this.drawObstacles(ctx, theme);

        // 4. Bear
        this.drawBear(ctx, w, h);

        // 5. Damage flash
        if (this.bear.invincible > 0.8) {
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, 0, w, h);
        }

        // 6. Loading overlay
        if (!this.assetsReady) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('로딩 중...', w/2, h/2);
        }
    }

    drawBackground(ctx, w, h, theme) {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, theme.bg1);
        gradient.addColorStop(0.5, theme.bg2);
        gradient.addColorStop(1, theme.bg1);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Decorative scrolling lines
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        const lineSpacing = 60;
        const offset = this.bgScrollY % lineSpacing;
        for (let y = offset - lineSpacing; y < h + lineSpacing; y += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    drawRoad(ctx, w, h, theme) {
        const roadWidth = w * 0.8;
        const roadX = (w - roadWidth) / 2;
        
        // Road surface
        ctx.fillStyle = theme.road;
        ctx.fillRect(roadX, 0, roadWidth, h);

        // Lane dividers (animated dashes)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.setLineDash([25, 18]);
        
        const laneWidth = roadWidth / 3;
        const dashOffset = this.bgScrollY % 43;
        ctx.lineDashOffset = -dashOffset;

        for (let i = 1; i < 3; i++) {
            const x = roadX + laneWidth * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Road edges
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(roadX, 0);
        ctx.lineTo(roadX, h);
        ctx.moveTo(roadX + roadWidth, 0);
        ctx.lineTo(roadX + roadWidth, h);
        ctx.stroke();
    }

    drawBear(ctx, w, h) {
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = h * 0.78;

        // Blink when invincible
        if (this.bear.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        const img = this.images.bear;
        if (img && img.complete && img.naturalWidth > 0) {
            // Image: 2 cols x 2 rows, use top row for animation
            const frameW = img.width / 2;
            const frameH = img.height / 2;
            const frame = this.bear.runFrame % 2;
            
            const size = 90;
            ctx.drawImage(
                img,
                frame * frameW, 0, frameW, frameH,
                bearX - size/2, bearY - size/2, size, size
            );
        } else {
            // Fallback: draw bear with canvas
            this.drawBearFallback(ctx, bearX, bearY);
        }
    }

    drawBearFallback(ctx, bearX, bearY) {
        ctx.save();
        ctx.translate(bearX, bearY);

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(0, -35, 22, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(-15, -50, 8, 0, Math.PI * 2);
        ctx.arc(15, -50, 8, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(0, -30, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(0, -33, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.beginPath();
        ctx.arc(-8, -40, 3, 0, Math.PI * 2);
        ctx.arc(8, -40, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawObstacles(ctx, theme) {
        const themeIdx = theme.index;

        this.obstacles.forEach(obs => {
            if (obs.hit) return;
            
            const x = this.getLaneX(obs.lane);
            const size = 60;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.ellipse(x, obs.y + size/2 + 5, size/3, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            let drawn = false;

            if (themeIdx === 0) {
                // Forest theme: use game_items.png (2x2 grid)
                // Row 0: bee (enemy), honey (item)
                const img = this.images.forestItems;
                if (img && img.complete && img.naturalWidth > 0) {
                    const fw = img.width / 2;
                    const fh = img.height / 2;
                    const col = obs.type === 'enemy' ? 0 : 1;
                    ctx.drawImage(img, col * fw, 0, fw, fh, x - size/2, obs.y - size/2, size, size);
                    drawn = true;
                }
            } else {
                // Other themes: use theme_enemies_items.png (3 cols x 5 rows)
                // Col 0: text label, Col 1: enemy, Col 2: item
                const img = this.images.themeItems;
                if (img && img.complete && img.naturalWidth > 0) {
                    const fw = img.width / 3;
                    const fh = img.height / 5;
                    const row = themeIdx - 1; // themes 1-5 map to rows 0-4
                    const col = obs.type === 'enemy' ? 1 : 2;
                    
                    if (row >= 0 && row < 5) {
                        ctx.drawImage(img, col * fw, row * fh, fw, fh, x - size/2, obs.y - size/2, size, size);
                        drawn = true;
                    }
                }
            }

            // Fallback: emoji
            if (!drawn) {
                const emojis = {
                    0: { enemy: '🐝', item: '🍯' },
                    1: { enemy: '🐭', item: '🧀' },
                    2: { enemy: '📖', item: '📜' },
                    3: { enemy: '🐛', item: '🥕' },
                    4: { enemy: '🚁', item: '💾' },
                    5: { enemy: '☄️', item: '⭐' }
                };
                const emoji = emojis[themeIdx]?.[obs.type] || '❓';
                ctx.font = '45px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(emoji, x, obs.y);
            }
        });
    }
}
