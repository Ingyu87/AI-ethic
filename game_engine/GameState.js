export default class GameState {
    constructor() {
        this.currentLevel = 0; // 0 to 29 (30 levels)
        this.maxLevels = 30;

        this.score = 0;
        this.correctCount = 0;
        this.lives = 5; // New Life System

        this.startTime = 0;
        this.endTime = 0;

        this.history = []; // { questionId, isCorrect, userAnswer }
        this.phase = 'START';
    }

    start() {
        this.currentLevel = 0;
        this.score = 0;
        this.correctCount = 0;
        this.lives = 5;
        this.history = [];
        this.startTime = Date.now();
        this.phase = 'RUN';
    }

    damage() {
        this.lives--;
        return this.lives <= 0;
    }

    checkThemeReset() {
        // Reset lives if multiple of 5 (Start of new theme)
        if (this.currentLevel > 0 && this.currentLevel % 5 === 0) {
            this.lives = 5;
            return true;
        }
        return false;
    }

    recordAnswer(question, isCorrect) {
        this.history.push({ 
            question: question,  // 전체 question 객체 저장
            isCorrect: isCorrect,
            level: this.currentLevel
        });
        if (isCorrect) {
            this.correctCount++;
            this.score += 100;
        }
        // Advance level
        this.currentLevel++;
    }

    endGame() {
        this.endTime = Date.now();
        this.phase = 'END';
    }

    getPlayTime() {
        const end = this.endTime || Date.now();
        const diff = end - this.startTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getRank() {
        const ratio = this.correctCount / Math.max(1, this.currentLevel); // Divide by played levels
        if (this.lives <= 0) return { text: "모험 중단", emoji: "🚑" }; // Game Over case

        // 10% 단위 칭호 시스템
        if (ratio === 1) return { text: "AI 윤리 마스터", emoji: "🏆" };
        if (ratio >= 0.9) return { text: "AI 수호자", emoji: "🛡️" };
        if (ratio >= 0.8) return { text: "AI 전문가", emoji: "⭐" };
        if (ratio >= 0.7) return { text: "AI 선구자", emoji: "🌟" };
        if (ratio >= 0.6) return { text: "AI 모험가", emoji: "🧭" };
        if (ratio >= 0.5) return { text: "AI 탐험가", emoji: "🌿" };
        if (ratio >= 0.4) return { text: "AI 학습자", emoji: "📖" };
        if (ratio >= 0.3) return { text: "AI 도전자", emoji: "💪" };
        if (ratio >= 0.2) return { text: "AI 입문자", emoji: "🌱" };
        return { text: "AI 새내기", emoji: "🐣" };
    }
}
