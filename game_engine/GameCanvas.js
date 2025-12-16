export default class GameCanvas {
    constructor(canvas, gameState, onEvent) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = gameState;
        this.onEvent = onEvent;

        // Theme settings (6 themes, 5 levels each = 30 levels)
        this.themes = [
            { 
                name: '숲', emoji: '🌲', 
                bg1: '#1a472a', bg2: '#2d5a27', bg3: '#4a7c23',
                road: '#8B4513', roadEdge: '#654321',
                particles: ['🍃', '🌿', '🍂'], particleCount: 8
            },
            { 
                name: '방', emoji: '🏠',
                bg1: '#8B4513', bg2: '#A0522D', bg3: '#CD853F',
                road: '#DEB887', roadEdge: '#D2691E',
                particles: ['✨', '💫'], particleCount: 5
            },
            { 
                name: '도서관', emoji: '📚',
                bg1: '#2c1810', bg2: '#4a3728', bg3: '#6b5344',
                road: '#8B7355', roadEdge: '#654321',
                particles: ['📖', '✏️', '📝'], particleCount: 6
            },
            { 
                name: '정원', emoji: '🌷',
                bg1: '#228B22', bg2: '#32CD32', bg3: '#90EE90',
                road: '#C0C0C0', roadEdge: '#A9A9A9',
                particles: ['🌸', '🌺', '🦋', '🐝'], particleCount: 10
            },
            { 
                name: '도시', emoji: '🏙️',
                bg1: '#1a1a2e', bg2: '#16213e', bg3: '#0f3460',
                road: '#333333', roadEdge: '#FFD700',
                particles: ['🚗', '🚕', '💡'], particleCount: 6
            },
            { 
                name: '우주', emoji: '🚀',
                bg1: '#000011', bg2: '#0a0a2e', bg3: '#1a1a4e',
                road: '#2a2a5e', roadEdge: '#4a4a8e',
                particles: ['⭐', '✨', '🌟', '💫'], particleCount: 15
            }
        ];

        // Floating particles for theme atmosphere
        this.particles = [];
        this.currentThemeIdx = -1;
        this.themeTransition = 0; // For smooth transition effect
        this.showThemeBanner = false;
        this.themeBannerTime = 0;

        // Load images
        this.images = {
            forestItems: new Image(),
            themeItems: new Image(),
            bear: new Image()
        };
        
        // Processed images (with transparent background)
        this.processedImages = {};
        
        this.images.forestItems.src = 'assets/game_items.png';
        this.images.themeItems.src = 'assets/theme_enemies_items.png';
        this.images.bear.src = 'assets/bear_back.png';

        this.imagesLoaded = 0;
        this.totalImages = 3;
        this.assetsReady = false;

        Object.entries(this.images).forEach(([key, img]) => {
            img.onload = () => {
                // Remove white background
                this.processedImages[key] = this.removeWhiteBackground(img);
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
        this.baseSpeed = 280;
        this.speed = 280;
        this.bgScrollY = 0;

        // Difficulty settings
        this.enemyRate = 0.40;    // Base enemy spawn rate
        this.spawnRate = 0.018;   // Base spawn rate

        // Theme progress tracking - must complete 5 questions per theme
        this.questionsInCurrentTheme = 0;

        this.initInput();
    }

    setDifficulty(settings) {
        this.baseSpeed = settings.speed;
        this.speed = settings.speed;
        this.enemyRate = settings.enemyRate;
        this.spawnRate = settings.spawnRate;
    }

    // Called when a question is answered (from main.js)
    onQuestionAnswered() {
        this.questionsInCurrentTheme++;
        
        // Check if theme is complete (5 questions)
        if (this.questionsInCurrentTheme >= 5) {
            this.questionsInCurrentTheme = 0;
            // Theme will change automatically based on currentLevel in state
        }
    }

    getCurrentThemeProgress() {
        return this.questionsInCurrentTheme;
    }

    // Remove white/light background from images
    removeWhiteBackground(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // If pixel is white or near-white, make it transparent
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0; // Set alpha to 0
            }
            // Also handle light gray backgrounds
            else if (r > 230 && g > 230 && b > 230) {
                data[i + 3] = 0;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
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
        // Check for theme change
        const newThemeIdx = Math.floor(this.state.currentLevel / 5) % 6;
        if (newThemeIdx !== this.currentThemeIdx) {
            this.currentThemeIdx = newThemeIdx;
            this.initParticles();
            this.themeTransition = 1.0; // Start transition effect
            this.showThemeBanner = true;
            this.themeBannerTime = 2.5; // Show banner for 2.5 seconds
        }

        // Update theme transition
        if (this.themeTransition > 0) {
            this.themeTransition -= dt * 0.8;
        }

        // Update theme banner
        if (this.themeBannerTime > 0) {
            this.themeBannerTime -= dt;
            if (this.themeBannerTime <= 0) {
                this.showThemeBanner = false;
            }
        }

        // Update particles
        this.updateParticles(dt);

        if (this.state.phase === 'RUN') {
            this.bgScrollY += this.speed * dt;

            if (Math.random() < this.spawnRate) this.spawnObstacle();

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

    initParticles() {
        const theme = this.themes[this.currentThemeIdx];
        this.particles = [];
        
        for (let i = 0; i < (theme.particleCount || 5); i++) {
            this.particles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                emoji: theme.particles[Math.floor(Math.random() * theme.particles.length)],
                speed: 30 + Math.random() * 50,
                sway: Math.random() * Math.PI * 2,
                swaySpeed: 1 + Math.random() * 2,
                size: 15 + Math.random() * 15
            });
        }
    }

    updateParticles(dt) {
        const w = this.canvas.width || 800;
        const h = this.canvas.height || 600;

        this.particles.forEach(p => {
            p.y += p.speed * dt;
            p.sway += p.swaySpeed * dt;
            p.x += Math.sin(p.sway) * 0.5;

            // Reset particle when it goes off screen
            if (p.y > h + 50) {
                p.y = -50;
                p.x = Math.random() * w;
            }
            if (p.x < -50) p.x = w + 50;
            if (p.x > w + 50) p.x = -50;
        });
    }

    spawnObstacle() {
        const lastObs = this.obstacles[this.obstacles.length - 1];
        if (lastObs && lastObs.y < 180) return;

        const lane = Math.floor(Math.random() * 3);
        
        // Ensure items spawn regularly so player can collect them
        // If no item on screen, higher chance to spawn item
        const hasItemOnScreen = this.obstacles.some(o => o.type === 'item' && !o.hit);
        
        // Use difficulty-based enemy rate, but ensure items spawn if none on screen
        let type;
        if (!hasItemOnScreen) {
            type = 'item'; // Force item spawn if none on screen
        } else {
            type = Math.random() < this.enemyRate ? 'enemy' : 'item';
        }

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
        const roadWidth = this.canvas.width * 0.75;
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

        // 2. Floating particles (behind road)
        this.drawParticles(ctx, w, h, 0.3);

        // 3. Road
        this.drawRoad(ctx, w, h, theme);

        // 4. Obstacles
        this.drawObstacles(ctx, theme);

        // 5. Bear
        this.drawBear(ctx, w, h);

        // 6. Floating particles (in front)
        this.drawParticles(ctx, w, h, 0.7);

        // 7. Damage flash
        if (this.bear.invincible > 0.8) {
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, 0, w, h);
        }

        // 8. Theme transition flash
        if (this.themeTransition > 0) {
            ctx.fillStyle = `rgba(255,255,255,${this.themeTransition * 0.5})`;
            ctx.fillRect(0, 0, w, h);
        }

        // 9. Theme banner
        if (this.showThemeBanner && this.themeBannerTime > 0) {
            this.drawThemeBanner(ctx, w, h, theme);
        }

        // 10. Loading overlay
        if (!this.assetsReady) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('로딩 중...', w/2, h/2);
        }
    }

    drawParticles(ctx, w, h, alpha) {
        ctx.globalAlpha = alpha;
        this.particles.forEach(p => {
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, p.x, p.y);
        });
        ctx.globalAlpha = 1;
    }

    drawThemeBanner(ctx, w, h, theme) {
        const progress = Math.min(1, (2.5 - this.themeBannerTime) / 0.3); // Fade in
        const fadeOut = this.themeBannerTime < 0.5 ? this.themeBannerTime / 0.5 : 1; // Fade out
        const alpha = progress * fadeOut;

        // Banner background
        ctx.fillStyle = `rgba(0,0,0,${0.7 * alpha})`;
        ctx.fillRect(0, h * 0.35, w, h * 0.3);

        // Theme emoji and name
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.font = '60px serif';
        ctx.fillText(theme.emoji, w / 2, h * 0.43);
        
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`${theme.name} 스테이지`, w / 2, h * 0.55);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText(`Level ${this.state.currentLevel + 1} - ${this.state.currentLevel + 5}`, w / 2, h * 0.62);
        
        ctx.globalAlpha = 1;
    }

    drawBackground(ctx, w, h, theme) {
        // Multi-color gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, theme.bg1);
        gradient.addColorStop(0.4, theme.bg2);
        gradient.addColorStop(0.7, theme.bg3 || theme.bg2);
        gradient.addColorStop(1, theme.bg1);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Theme-specific decorations
        const themeIdx = theme.index;
        
        if (themeIdx === 5) {
            // Space: Stars
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 50; i++) {
                const x = (i * 137 + this.bgScrollY * 0.1) % w;
                const y = (i * 89 + this.bgScrollY * 0.05) % h;
                const size = (i % 3) + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (themeIdx === 4) {
            // City: Building silhouettes
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            for (let i = 0; i < 8; i++) {
                const x = (i * 120) % w - 20;
                const bh = 100 + (i % 3) * 80;
                ctx.fillRect(x, h - bh, 60, bh);
                // Windows
                ctx.fillStyle = 'rgba(255,200,50,0.5)';
                for (let wy = h - bh + 20; wy < h - 20; wy += 30) {
                    for (let wx = x + 10; wx < x + 50; wx += 20) {
                        if (Math.random() > 0.3) {
                            ctx.fillRect(wx, wy, 8, 12);
                        }
                    }
                }
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
            }
        } else if (themeIdx === 0) {
            // Forest: Trees in background
            ctx.fillStyle = 'rgba(0,50,0,0.3)';
            for (let i = 0; i < 6; i++) {
                const x = (i * 150 + 50) % w;
                // Tree trunk
                ctx.fillRect(x - 8, h - 150, 16, 100);
                // Tree top
                ctx.beginPath();
                ctx.moveTo(x, h - 200);
                ctx.lineTo(x - 40, h - 100);
                ctx.lineTo(x + 40, h - 100);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Scrolling ground lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        const lineSpacing = 50;
        const offset = this.bgScrollY % lineSpacing;
        for (let y = offset - lineSpacing; y < h + lineSpacing; y += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    drawRoad(ctx, w, h, theme) {
        const roadWidth = w * 0.75;
        const roadX = (w - roadWidth) / 2;
        
        // Road shadow/depth
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(roadX - 5, 0, roadWidth + 10, h);

        // Road surface with gradient
        const roadGradient = ctx.createLinearGradient(roadX, 0, roadX + roadWidth, 0);
        roadGradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        roadGradient.addColorStop(0.1, theme.road);
        roadGradient.addColorStop(0.9, theme.road);
        roadGradient.addColorStop(1, 'rgba(0,0,0,0.2)');
        ctx.fillStyle = roadGradient;
        ctx.fillRect(roadX, 0, roadWidth, h);

        // Lane dividers (animated dashes)
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 4;
        ctx.setLineDash([30, 20]);
        
        const laneWidth = roadWidth / 3;
        const dashOffset = this.bgScrollY % 50;
        ctx.lineDashOffset = -dashOffset;

        for (let i = 1; i < 3; i++) {
            const x = roadX + laneWidth * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Road edges with glow
        ctx.shadowColor = theme.roadEdge || '#fff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = theme.roadEdge || '#fff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(roadX, 0);
        ctx.lineTo(roadX, h);
        ctx.moveTo(roadX + roadWidth, 0);
        ctx.lineTo(roadX + roadWidth, h);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    drawBear(ctx, w, h) {
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = h * 0.78;

        // Blink when invincible
        if (this.bear.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        // Always use canvas-drawn bear (no image text issue)
        this.drawBearCanvas(ctx, bearX, bearY);
    }

    drawBearCanvas(ctx, bearX, bearY) {
        ctx.save();
        ctx.translate(bearX, bearY);

        const bounce = Math.sin(Date.now() / 100) * 2; // Subtle bounce
        const runOffset = this.bear.runFrame === 0 ? 3 : -3;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, 35, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left leg
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(-10, 25 + runOffset, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Right leg
        ctx.beginPath();
        ctx.ellipse(10, 25 - runOffset, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.ellipse(0, bounce, 28, 32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Belly
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(0, 5 + bounce, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left arm
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(-30, -5 + bounce + runOffset, 10, 18, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right arm
        ctx.beginPath();
        ctx.ellipse(30, -5 + bounce - runOffset, 10, 18, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(0, -35 + bounce, 25, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(-18, -52 + bounce, 10, 0, Math.PI * 2);
        ctx.arc(18, -52 + bounce, 10, 0, Math.PI * 2);
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(-18, -52 + bounce, 5, 0, Math.PI * 2);
        ctx.arc(18, -52 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(0, -28 + bounce, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(0, -32 + bounce, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-9, -42 + bounce, 4, 0, Math.PI * 2);
        ctx.arc(9, -42 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-10, -43 + bounce, 1.5, 0, Math.PI * 2);
        ctx.arc(8, -43 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Cute blush
        ctx.fillStyle = 'rgba(255,150,150,0.5)';
        ctx.beginPath();
        ctx.ellipse(-15, -35 + bounce, 5, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(15, -35 + bounce, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -28 + bounce, 6, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

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
                const img = this.processedImages.forestItems || this.images.forestItems;
                if (img && (img.width || img.naturalWidth)) {
                    const imgW = img.width || img.naturalWidth;
                    const imgH = img.height || img.naturalHeight;
                    const fw = imgW / 2;
                    const fh = imgH / 2;
                    const col = obs.type === 'enemy' ? 0 : 1;
                    ctx.drawImage(img, col * fw, 0, fw, fh, x - size/2, obs.y - size/2, size, size);
                    drawn = true;
                }
            } else {
                // Other themes: use theme_enemies_items.png (3 cols x 5 rows)
                // Col 0: text label, Col 1: enemy, Col 2: item
                const img = this.processedImages.themeItems || this.images.themeItems;
                if (img && (img.width || img.naturalWidth)) {
                    const imgW = img.width || img.naturalWidth;
                    const imgH = img.height || img.naturalHeight;
                    const fw = imgW / 3;
                    const fh = imgH / 5;
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
