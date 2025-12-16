import GameState from './game_engine/GameState.js';
import GameCanvas from './game_engine/GameCanvas.js';
import { questions } from './data/questions.js';
import { generateReportHTML } from './report.js';

const state = new GameState();
const canvasEl = document.getElementById('game-canvas');
let gameCanvas;

// UI Elements
const ui = {
    screens: {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        feedback: document.getElementById('feedback-screen'),
        report: document.getElementById('report-screen')
    },
    hud: document.getElementById('hud'),
    displays: {
        time: document.getElementById('time-display'),
        level: document.getElementById('level-display'),
        score: document.getElementById('score-display'),
        lives: document.getElementById('active-items') // Reuse item box for lives
    },
    quiz: {
        category: document.getElementById('quiz-category'),
        question: document.getElementById('quiz-question'),
        options: document.getElementById('quiz-options'),
        timerBar: document.getElementById('quiz-timer-bar')
    },
    feedback: {
        title: document.getElementById('feedback-title'),
        explanation: document.getElementById('feedback-explanation'),
        icon: document.getElementById('feedback-icon')
    },
    report: {
        rankEmoji: document.getElementById('final-rank-emoji'),
        rankText: document.getElementById('final-rank-text'),
        score: document.getElementById('final-score'),
        correct: document.getElementById('final-correct'),
        time: document.getElementById('final-time')
    },
    btns: {
        start: document.getElementById('start-btn'),
        next: document.getElementById('next-btn'),
        download: document.getElementById('download-btn'),
        restart: document.getElementById('restart-btn')
    }
};

// Start logic
function init() {
    gameCanvas = new GameCanvas(canvasEl, state, handleGameEvent);

    ui.btns.start.addEventListener('click', startGame);
    ui.btns.next.addEventListener('click', resumeGame);
    ui.btns.download.addEventListener('click', downloadReport);
    ui.btns.restart.addEventListener('click', () => location.reload()); // FORCE REFRESH TO RESTART

    // Setup Lives UI with Hearts
    ui.displays.lives.innerHTML = '';
}

function startGame() {
    state.start();
    showScreen(null);
    ui.hud.classList.remove('hidden');

    gameCanvas.start();

    // HUD Loop
    setInterval(updateHUD, 200);
}

function updateHUD() {
    if (state.phase === 'END') return;
    ui.displays.time.textContent = state.getPlayTime();
    ui.displays.level.textContent = `${state.currentLevel + 1}/30`;
    ui.displays.score.textContent = state.score;

    // Update Lives (Heart Icons)
    const hearts = '❤️'.repeat(state.lives) + '🖤'.repeat(5 - state.lives);
    ui.displays.lives.textContent = hearts;
}

function handleGameEvent(event) {
    if (event === 'quiz_trigger') {
        startQuiz();
    } else if (event === 'damage') {
        const isGameOver = state.damage();
        if (isGameOver) {
            endGame(true); // Game Over
        }
    }
}

function startQuiz() {
    state.phase = 'QUIZ';
    const currentQuestion = questions[state.currentLevel];

    if (!currentQuestion) { endGame(); return; } // No more questions?

    ui.quiz.category.textContent = currentQuestion.category;
    ui.quiz.question.textContent = currentQuestion.question;
    ui.quiz.options.innerHTML = '';

    currentQuestion.options.forEach((opt) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.textContent = opt.text;
        btn.onclick = () => handleAnswer(opt, currentQuestion);
        ui.quiz.options.appendChild(btn);
    });

    showScreen('quiz');
}

function handleAnswer(selectedOption, question) {
    const isCorrect = selectedOption.isCorrect;

    state.recordAnswer(question, isCorrect);

    ui.feedback.title.textContent = isCorrect ? "정답입니다! 꿀 획득! 🍯" : "오답입니다... 🐝";
    ui.feedback.icon.textContent = isCorrect ? "⭕" : "❌";
    ui.feedback.explanation.textContent = question.explanation;

    showScreen('feedback');
}

function resumeGame() {
    if (state.currentLevel >= 30) {
        endGame();
        return;
    }

    // Check Theme Reset (Heal)
    if (state.checkThemeReset()) {
        // Maybe show toast? "새로운 테마! 목숨 회복!"
    }

    state.phase = 'RUN';
    showScreen(null);
}

function endGame(isGameOver = false) {
    state.endGame();
    showScreen('report');

    const rank = state.getRank();
    const totalAnswered = state.history.length;
    
    ui.report.rankEmoji.textContent = isGameOver ? "💀" : rank.emoji;
    ui.report.rankText.textContent = isGameOver ? "게임 오버 (목숨 소진)" : rank.text;
    ui.report.score.textContent = state.score;
    ui.report.correct.textContent = `${state.correctCount} / ${totalAnswered}`;
    ui.report.time.textContent = state.getPlayTime();
}

function downloadReport() {
    const html = generateReportHTML(state);
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
}

function showScreen(name) {
    Object.values(ui.screens).forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('show');
    });
    if (name && ui.screens[name]) {
        ui.screens[name].classList.remove('hidden');
        ui.screens[name].classList.add('show');
    }
}

init();
