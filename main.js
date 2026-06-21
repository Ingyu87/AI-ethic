import GameState from './game_engine/GameState.js';
import GameCanvas from './game_engine/GameCanvas.js';
import { questions as questionsEasy } from './data/questions_easy.js';
import { questions as questionsNormal } from './data/questions_normal.js';
import { questions as questionsHard } from './data/questions_hard.js';
import { generateReportHTML } from './report.js';

const state = new GameState();
const canvasEl = document.getElementById('game-canvas');
let gameCanvas;
let selectedDifficulty = 'normal'; // easy, normal, hard

// 난이도별 문항
const questionsByDifficulty = {
    easy: questionsEasy,
    normal: questionsNormal,
    hard: questionsHard
};

// 현재 사용할 문항 (난이도 선택 후 설정됨)
let questions = questionsNormal;

// Difficulty settings
const difficultySettings = {
    easy: { speed: 180, enemyRate: 0.25, spawnRate: 0.015, label: '이지' },
    normal: { speed: 280, enemyRate: 0.40, spawnRate: 0.018, label: '노멀' },
    hard: { speed: 400, enemyRate: 0.55, spawnRate: 0.025, label: '하드' }
};

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
        lives: document.getElementById('active-items')
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

// Quiz keyboard navigation state
let selectedOptionIndex = 0;
let currentQuestionOptions = [];
let currentQuestion = null;

// Start logic
function init() {
    gameCanvas = new GameCanvas(canvasEl, state, handleGameEvent);

    ui.btns.start.addEventListener('click', startGame);
    ui.btns.next.addEventListener('click', resumeGame);
    ui.btns.download.addEventListener('click', downloadReport);
    ui.btns.restart.addEventListener('click', () => location.reload());

    // Footer & Modal Event Listeners
    const linkTerms = document.getElementById('link-terms');
    const linkPrivacy = document.getElementById('link-privacy');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    if (linkTerms) linkTerms.addEventListener('click', () => openModal('terms'));
    if (linkPrivacy) linkPrivacy.addEventListener('click', () => openModal('privacy'));
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Setup Lives UI with Hearts
    ui.displays.lives.innerHTML = '';

    // Global keyboard navigation
    document.addEventListener('keydown', handleGlobalKeyboard);

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedDifficulty = btn.dataset.difficulty;
            // 난이도에 맞는 문항 로드
            questions = questionsByDifficulty[selectedDifficulty];
        });
    });
}

function handleGlobalKeyboard(e) {
    // Modal open check - close with Esc/Space/Enter and block other inputs
    const overlay = document.getElementById('modal-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
        return;
    }

    // Quiz screen keyboard navigation
    if (state.phase === 'QUIZ' && !ui.screens.quiz.classList.contains('hidden')) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
            e.preventDefault();
            navigateOption(-1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault();
            navigateOption(1);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCurrentOption();
        } else if (e.key >= '1' && e.key <= '9') {
            const idx = parseInt(e.key) - 1;
            if (idx < currentQuestionOptions.length) {
                selectedOptionIndex = idx;
                updateOptionHighlight();
                selectCurrentOption();
            }
        }
    }
    
    // Feedback screen - Enter or Space to continue
    if (!ui.screens.feedback.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            resumeGame();
        }
    }
    
    // Start screen - Enter to start
    if (!ui.screens.start.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startGame();
        }
    }
    
    // Report screen
    if (!ui.screens.report.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            downloadReport();
        } else if (e.key === 'r' || e.key === 'R') {
            location.reload();
        }
    }
}

function navigateOption(direction) {
    selectedOptionIndex += direction;
    
    // Wrap around
    if (selectedOptionIndex < 0) {
        selectedOptionIndex = currentQuestionOptions.length - 1;
    } else if (selectedOptionIndex >= currentQuestionOptions.length) {
        selectedOptionIndex = 0;
    }
    
    updateOptionHighlight();
}

function updateOptionHighlight() {
    const options = ui.quiz.options.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === selectedOptionIndex) {
            opt.classList.add('selected');
            opt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function selectCurrentOption() {
    if (currentQuestionOptions.length > 0 && currentQuestion) {
        const selectedOption = currentQuestionOptions[selectedOptionIndex];
        handleAnswer(selectedOption, currentQuestion);
    }
}

function startGame() {
    state.start(selectedDifficulty);
    showScreen(null);
    ui.hud.classList.remove('hidden');

    // Load questions for selected difficulty
    questions = questionsByDifficulty[selectedDifficulty];

    // Apply difficulty settings
    const settings = difficultySettings[selectedDifficulty];
    gameCanvas.setDifficulty(settings);
    gameCanvas.start();

    // HUD Loop
    setInterval(updateHUD, 200);
}

// Theme info for HUD
const themeInfo = [
    { name: '디지털', emoji: '💻' },
    { name: '개인정보', emoji: '🔒' },
    { name: '공정성', emoji: '⚖️' },
    { name: '팩트체크', emoji: '🔍' },
    { name: '딥페이크', emoji: '🎭' },
    { name: '미래', emoji: '🚀' }
];

function updateHUD() {
    if (state.phase === 'END') return;
    ui.displays.time.textContent = state.getPlayTime();
    
    // Theme-based level display - show questions answered in current theme
    const themeIdx = Math.floor(state.currentLevel / 5);
    const questionsAnsweredInTheme = state.currentLevel % 5;
    const theme = themeInfo[themeIdx] || themeInfo[0];
    
    // Show progress as "answered/5"
    ui.displays.level.textContent = `${theme.emoji} ${theme.name} ${questionsAnsweredInTheme}/5`;
    
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
    currentQuestion = questions[state.currentLevel];

    if (!currentQuestion) { endGame(); return; }

    // Reset keyboard navigation
    selectedOptionIndex = 0;
    
    // Shuffle options randomly so correct answer isn't always in same position
    currentQuestionOptions = shuffleArray([...currentQuestion.options]);

    ui.quiz.category.textContent = currentQuestion.category;
    ui.quiz.question.textContent = currentQuestion.question;
    ui.quiz.options.innerHTML = '';

    currentQuestionOptions.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option' + (index === 0 ? ' selected' : '');
        btn.innerHTML = `<span class="option-number">${index + 1}</span> ${opt.text}`;
        btn.onclick = () => handleAnswer(opt, currentQuestion);
        
        // Touch feedback for mobile
        btn.addEventListener('touchstart', () => {
            selectedOptionIndex = index;
            updateOptionHighlight();
        }, { passive: true });
        
        ui.quiz.options.appendChild(btn);
    });

    showScreen('quiz');
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleAnswer(selectedOption, question) {
    const isCorrect = selectedOption.isCorrect;

    state.recordAnswer(question, isCorrect, selectedOption.text);
    
    // Notify game canvas that question was answered
    gameCanvas.onQuestionAnswered();

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

async function openModal(docType) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const overlay = document.getElementById('modal-overlay');
    
    if (!titleEl || !bodyEl || !overlay) return;
    
    titleEl.textContent = docType === 'terms' ? '서비스 이용약관' : '개인정보처리방침';
    bodyEl.innerHTML = '<p style="text-align:center; padding: 20px;">로딩 중...</p>';
    overlay.classList.remove('hidden');
    
    const fileName = docType === 'terms' ? '이용약관.md' : '개인정보처리방침.md';
    try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error('파일을 불러오는데 실패했습니다.');
        const markdown = await response.text();
        bodyEl.innerHTML = parseMarkdownToHtml(markdown);
    } catch (e) {
        bodyEl.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">에러: ${e.message}</p>`;
    }
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function parseMarkdownToHtml(markdown) {
    // Escape HTML first
    let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        
    // Convert headers
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^---$/gim, '<hr style="border: 0; height: 1px; background: #ccc; margin: 15px 0;">');
    
    // Convert bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    
    // Convert numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Split into paragraphs by double newlines
    const lines = html.split('\n');
    let formatted = [];
    let inList = false;
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.startsWith('<li>')) {
            if (!inList) {
                formatted.push('<ul>');
                inList = true;
            }
            formatted.push(line);
        } else {
            if (inList) {
                formatted.push('</ul>');
                inList = false;
            }
            if (line.startsWith('<h1>') || line.startsWith('<h3>') || line.startsWith('<hr')) {
                formatted.push(line);
            } else {
                formatted.push(`<p>${line}</p>`);
            }
        }
    }
    if (inList) {
        formatted.push('</ul>');
    }
    
    return formatted.join('\n');
}

init();
