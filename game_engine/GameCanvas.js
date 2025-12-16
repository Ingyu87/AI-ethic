export default class GameCanvas {
    constructor(canvas, gameState, onEvent) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = gameState;
        this.onEvent = onEvent;

        // Theme colors and settings
        this.themes = [
            { name: 'Forest', bg1: '#228B22', bg2: '#90EE90', road: '#8B4513', enemy: '🐝', item: '🍯' },
            { name: 'Room', bg1: '#8B4513', bg2: '#DEB887', road: '#D2691E', enemy: '🐭', item: '🧀' },
            { name: 'Library', bg1: '#4A4A4A', bg2: '#8B7355', road: '#654321', enemy: '📚', item: '📖' },
            { name: 'Garden', bg1: '#32CD32', bg2: '#98FB98', road: '#C0C0C0', enemy: '🐛', item: '🌸' },
            { name: 'City', bg1: '#2F4F4F', bg2: '#708090', road: '#404040', enemy: '🚗', item: '⭐' },
            { name: 'Space', bg1: '#0a0a2e', bg2: '#1a1a4e', road: '#2a2a5e', enemy: '☄️', item: '🚀' }
        ];

        // Game Entities
        this.bear = {
            lane: 1,
            invincible: 0,
            runFrame: 0,
            frameTime: 0
        };

        this.obstacles = [];
        this.speed = 300;
        this.bgScrollY = 0;
        this.assetsReady = true; // No external assets needed

        this.initInput();
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

            // Spawn obstacles
            if (Math.random() < 0.02) this.spawnObstacle();

            // Move Obstacles
            this.obstacles.forEach(obs => obs.y += this.speed * dt);
            this.obstacles = this.obstacles.filter(obs => obs.y < this.canvas.height + 100);

            this.checkCollisions();

            // Bear animation
            this.bear.frameTime += dt;
            if (this.bear.frameTime > 0.15) {
                this.bear.frameTime = 0;
                this.bear.runFrame = (this.bear.runFrame + 1) % 2;
            }

            if (this.bear.invincible > 0) this.bear.invincible -= dt;
        }
    }

    spawnObstacle() {
        const lastObs = this.obstacles[this.obstacles.length - 1];
        if (lastObs && lastObs.y < 200) return;

        const lane = Math.floor(Math.random() * 3);
        const type = Math.random() > 0.4 ? 'enemy' : 'item';

        this.obstacles.push({
            type,
            lane,
            y: -60
        });
    }

    checkCollisions() {
        const bearX = this.getLaneX(this.bear.lane);
        const bearY = this.canvas.height * 0.8;

        this.obstacles.forEach((obs) => {
            if (obs.hit) return;

            const obsX = this.getLaneX(obs.lane);
            const dist = Math.sqrt((bearX - obsX) ** 2 + (bearY - obs.y) ** 2);

            if (dist < 50) {
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
                obs.y = 9999;
            }
        });
    }

    getLaneX(lane) {
        const colWidth = this.canvas.width / 3;
        return (colWidth * lane) + (colWidth / 2);
    }

    getTheme() {
        const themeIdx = Math.floor(this.state.currentLevel / 5) % 6;
        return this.themes[themeIdx];
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

        // 1. Background with scrolling effect
        this.drawBackground(ctx, w, h, theme);

        // 2. Road/Lanes
        this.drawRoad(ctx, w, h, theme);

        // 3. Obstacles (enemies & items)
        this.drawObstacles(ctx, theme);

        // 4. Bear
        this.drawBear(ctx, w, h);

        // 5. Damage flash
        if (this.bear.invincible > 0.8) {
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, 0, w, h);
        }
    }

    drawBackground(ctx, w, h, theme) {
        // Scrolling gradient background
        const scrollOffset = (this.bgScrollY % 100) / 100;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, theme.bg1);
        gradient.addColorStop(0.5, theme.bg2);
        gradient.addColorStop(1, theme.bg1);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Scrolling decoration lines
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        const lineSpacing = 80;
        const offset = (this.bgScrollY % lineSpacing);
        for (let y = offset - lineSpacing; y < h + lineSpacing; y += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    drawRoad(ctx, w, h, theme) {
        // Center road
        const roadWidth = w * 0.8;
        const roadX = (w - roadWidth) / 2;
        
        ctx.fillStyle = theme.road;
        ctx.fillRect(roadX, 0, roadWidth, h);

        // Lane dividers (dashed lines)
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([30, 20]);
        
        const laneWidth = roadWidth / 3;
        for (let i = 1; i < 3; i++) {
            const x = roadX + laneWidth * i;
            const dashOffset = (this.bgScrollY % 50);
            ctx.lineDashOffset = -dashOffset;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Road edges
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
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
        const bearY = h * 0.8;

        // Blink when invincible
        if (this.bear.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        ctx.save();
        ctx.translate(bearX, bearY);

        // Body
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(0, -40, 25, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(-18, -55, 10, 0, Math.PI * 2);
        ctx.arc(18, -55, 10, 0, Math.PI * 2);
        ctx.fill();

        // Inner ears
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.arc(-18, -55, 5, 0, Math.PI * 2);
        ctx.arc(18, -55, 5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#DEB887';
        ctx.beginPath();
        ctx.ellipse(0, -35, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(0, -38, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-10, -45, 4, 0, Math.PI * 2);
        ctx.arc(10, -45, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-11, -46, 1.5, 0, Math.PI * 2);
        ctx.arc(9, -46, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Running legs animation
        const legOffset = this.bear.runFrame === 0 ? 5 : -5;
        ctx.fillStyle = '#8B4513';
        
        // Left leg
        ctx.beginPath();
        ctx.ellipse(-12, 30 + legOffset, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Right leg
        ctx.beginPath();
        ctx.ellipse(12, 30 - legOffset, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms
        ctx.beginPath();
        ctx.ellipse(-28, -5 + legOffset, 8, 18, -0.3, 0, Math.PI * 2);
        ctx.ellipse(28, -5 - legOffset, 8, 18, 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawObstacles(ctx, theme) {
        ctx.font = '50px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.obstacles.forEach(obs => {
            if (obs.hit) return;
            
            const x = this.getLaneX(obs.lane);
            const emoji = obs.type === 'enemy' ? theme.enemy : theme.item;
            
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(x, obs.y + 25, 20, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Emoji
            ctx.fillText(emoji, x, obs.y);
        });
    }
}
