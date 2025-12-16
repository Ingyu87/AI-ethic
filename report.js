export function generateReportHTML(state) {
    const rank = state.getRank();
    const date = new Date().toLocaleDateString('ko-KR');
    const totalAnswered = state.history.length;

    // 테마 정보 (6테마 x 5문항)
    const themes = [
        { name: "디지털 예절 & 저작권", emoji: "🌲", levels: [0, 1, 2, 3, 4] },
        { name: "개인정보 보호", emoji: "🏠", levels: [5, 6, 7, 8, 9] },
        { name: "편향성 & 공정성", emoji: "📚", levels: [10, 11, 12, 13, 14] },
        { name: "허위정보 & 팩트체크", emoji: "🌷", levels: [15, 16, 17, 18, 19] },
        { name: "딥페이크 & 초상권", emoji: "🏙️", levels: [20, 21, 22, 23, 24] },
        { name: "AI 안전 & 미래", emoji: "🚀", levels: [25, 26, 27, 28, 29] }
    ];

    // 테마별 분석
    const themeAnalysis = themes.map((theme, idx) => {
        const themeQuestions = state.history.filter(h => theme.levels.includes(h.level));
        const correct = themeQuestions.filter(h => h.isCorrect).length;
        const total = themeQuestions.length;
        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return {
            ...theme,
            correct,
            total,
            percent,
            status: percent >= 80 ? '우수' : percent >= 60 ? '보통' : percent > 0 ? '보완 필요' : '미응시'
        };
    });

    // 테마별 요약 HTML
    const themeSummaryHTML = themeAnalysis.map(t => `
        <div class="theme-card ${t.percent >= 80 ? 'excellent' : t.percent >= 60 ? 'good' : t.total > 0 ? 'needs-work' : 'not-taken'}">
            <div class="theme-emoji">${t.emoji}</div>
            <div class="theme-name">${t.name}</div>
            <div class="theme-score">${t.correct}/${t.total}</div>
            <div class="theme-bar">
                <div class="theme-bar-fill" style="width: ${t.percent}%"></div>
            </div>
            <div class="theme-status">${t.status}</div>
        </div>
    `).join('');

    // 테마별 상세 결과 HTML
    const themeDetailHTML = themeAnalysis.map((theme, themeIdx) => {
        const themeQuestions = state.history.filter(h => theme.levels.includes(h.level));
        
        if (themeQuestions.length === 0) {
            return `
                <div class="theme-section">
                    <h3>${theme.emoji} ${theme.name}</h3>
                    <p class="no-data">이 테마는 플레이하지 않았습니다.</p>
                </div>
            `;
        }

        const questionsHTML = themeQuestions.map((h, i) => `
            <div class="question-item ${h.isCorrect ? 'correct' : 'wrong'}">
                <div class="question-header">
                    <span class="question-num">Q${h.level + 1}</span>
                    <span class="question-result">${h.isCorrect ? '✅ 정답' : '❌ 오답'}</span>
                </div>
                <div class="question-text">${h.question?.question || '문제 정보 없음'}</div>
                <div class="question-explanation">
                    <strong>💡 해설:</strong> ${h.question?.explanation || '해설 정보 없음'}
                </div>
            </div>
        `).join('');

        // 테마별 피드백
        let feedback = '';
        if (theme.percent >= 80) {
            feedback = `<div class="theme-feedback excellent">🎉 훌륭해요! "${theme.name}" 영역을 잘 이해하고 있습니다.</div>`;
        } else if (theme.percent >= 60) {
            feedback = `<div class="theme-feedback good">👍 좋아요! 조금만 더 학습하면 완벽해질 거예요.</div>`;
        } else if (theme.total > 0) {
            feedback = `<div class="theme-feedback needs-work">📖 이 영역은 추가 학습이 필요해요. 해설을 꼼꼼히 읽어보세요!</div>`;
        }

        return `
            <div class="theme-section">
                <h3>${theme.emoji} ${theme.name} <span class="theme-result">(${theme.correct}/${theme.total} 정답)</span></h3>
                ${feedback}
                <div class="questions-list">
                    ${questionsHTML}
                </div>
            </div>
        `;
    }).join('');

    // 전체 피드백 생성
    const weakThemes = themeAnalysis.filter(t => t.total > 0 && t.percent < 60);
    const strongThemes = themeAnalysis.filter(t => t.percent >= 80);
    
    let overallFeedback = '';
    if (weakThemes.length > 0) {
        overallFeedback = `
            <div class="overall-feedback">
                <h3>📌 추천 학습 영역</h3>
                <p>다음 영역에 대해 추가 학습을 권장합니다:</p>
                <ul>
                    ${weakThemes.map(t => `<li><strong>${t.emoji} ${t.name}</strong> - 정답률 ${t.percent}%</li>`).join('')}
                </ul>
            </div>
        `;
    }
    if (strongThemes.length > 0) {
        overallFeedback += `
            <div class="overall-feedback strong">
                <h3>🌟 잘한 영역</h3>
                <ul>
                    ${strongThemes.map(t => `<li><strong>${t.emoji} ${t.name}</strong> - 정답률 ${t.percent}%</li>`).join('')}
                </ul>
            </div>
        `;
    }

    return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI 윤리 학습 결과 리포트</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { 
                    font-family: 'Noto Sans KR', sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .report-container { 
                    max-width: 900px; 
                    margin: 0 auto; 
                    background: #fff; 
                    border-radius: 20px; 
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    overflow: hidden;
                }
                .report-header {
                    background: linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                }
                .report-header h1 { font-size: 2rem; margin-bottom: 10px; }
                .report-header .date { opacity: 0.9; }
                
                .summary-section {
                    display: flex;
                    justify-content: space-around;
                    padding: 30px;
                    background: #f8f9fa;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .summary-item {
                    text-align: center;
                    padding: 20px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    min-width: 120px;
                }
                .summary-value { 
                    font-size: 2rem; 
                    font-weight: bold; 
                    color: #667eea;
                    display: block;
                }
                .summary-label { color: #666; font-size: 0.9rem; }
                
                .themes-overview {
                    padding: 30px;
                }
                .themes-overview h2 { margin-bottom: 20px; color: #333; }
                .themes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 15px;
                }
                .theme-card {
                    background: #fff;
                    border: 2px solid #eee;
                    border-radius: 15px;
                    padding: 15px;
                    text-align: center;
                    transition: transform 0.2s;
                }
                .theme-card:hover { transform: translateY(-3px); }
                .theme-card.excellent { border-color: #4CAF50; background: #E8F5E9; }
                .theme-card.good { border-color: #2196F3; background: #E3F2FD; }
                .theme-card.needs-work { border-color: #FF9800; background: #FFF3E0; }
                .theme-card.not-taken { border-color: #ccc; background: #f5f5f5; opacity: 0.7; }
                .theme-emoji { font-size: 2rem; margin-bottom: 5px; }
                .theme-name { font-weight: bold; font-size: 0.85rem; color: #333; margin-bottom: 5px; }
                .theme-score { font-size: 1.2rem; font-weight: bold; color: #667eea; }
                .theme-bar { 
                    height: 6px; 
                    background: #eee; 
                    border-radius: 3px; 
                    margin: 8px 0;
                    overflow: hidden;
                }
                .theme-bar-fill { 
                    height: 100%; 
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 3px;
                    transition: width 0.5s;
                }
                .theme-status { font-size: 0.75rem; color: #666; }
                
                .overall-feedback {
                    margin: 20px 30px;
                    padding: 20px;
                    background: #FFF3E0;
                    border-radius: 10px;
                    border-left: 4px solid #FF9800;
                }
                .overall-feedback.strong {
                    background: #E8F5E9;
                    border-left-color: #4CAF50;
                }
                .overall-feedback h3 { margin-bottom: 10px; }
                .overall-feedback ul { margin-left: 20px; }
                .overall-feedback li { margin: 5px 0; }
                
                .detail-section {
                    padding: 30px;
                }
                .detail-section h2 { margin-bottom: 20px; color: #333; }
                
                .theme-section {
                    margin-bottom: 30px;
                    border: 1px solid #eee;
                    border-radius: 15px;
                    overflow: hidden;
                }
                .theme-section h3 {
                    background: #f8f9fa;
                    padding: 15px 20px;
                    margin: 0;
                    border-bottom: 1px solid #eee;
                }
                .theme-result { font-weight: normal; color: #666; font-size: 0.9rem; }
                .theme-feedback {
                    padding: 15px 20px;
                    font-size: 0.95rem;
                }
                .theme-feedback.excellent { background: #E8F5E9; color: #2E7D32; }
                .theme-feedback.good { background: #E3F2FD; color: #1565C0; }
                .theme-feedback.needs-work { background: #FFF3E0; color: #E65100; }
                
                .questions-list { padding: 15px 20px; }
                .question-item {
                    padding: 15px;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    border-left: 4px solid;
                }
                .question-item.correct { background: #f1f8e9; border-color: #4CAF50; }
                .question-item.wrong { background: #ffebee; border-color: #f44336; }
                .question-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .question-num { font-weight: bold; color: #667eea; }
                .question-result { font-weight: bold; }
                .question-text { margin-bottom: 10px; color: #333; }
                .question-explanation { 
                    font-size: 0.9rem; 
                    color: #666; 
                    padding: 10px;
                    background: rgba(255,255,255,0.7);
                    border-radius: 5px;
                }
                .no-data { padding: 20px; color: #999; text-align: center; }
                
                .report-footer {
                    text-align: center;
                    padding: 30px;
                    background: #f8f9fa;
                    color: #666;
                    font-size: 0.85rem;
                }
                .print-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-bottom: 20px;
                }
                .print-btn:hover { opacity: 0.9; }
                
                @media print {
                    body { background: white; padding: 0; }
                    .report-container { box-shadow: none; }
                    .print-btn { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="report-header">
                    <h1>📜 AI 윤리 학습 결과 리포트</h1>
                    <p class="date">생성일: ${date}</p>
                </div>
                
                <div class="summary-section">
                    <div class="summary-item">
                        <span class="summary-value">${rank.emoji}</span>
                        <span class="summary-label">${rank.text}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-value">${state.score}</span>
                        <span class="summary-label">획득 점수 🍯</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-value">${state.correctCount}/${totalAnswered}</span>
                        <span class="summary-label">정답 수</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-value">${state.getPlayTime()}</span>
                        <span class="summary-label">플레이 시간</span>
                    </div>
                </div>
                
                <div class="themes-overview">
                    <h2>📊 테마별 성취도</h2>
                    <div class="themes-grid">
                        ${themeSummaryHTML}
                    </div>
                </div>
                
                ${overallFeedback}
                
                <div class="detail-section">
                    <h2>📝 테마별 상세 결과</h2>
                    ${themeDetailHTML}
                </div>
                
                <div class="report-footer">
                    <button class="print-btn" onclick="window.print()">🖨️ 리포트 인쇄/저장</button>
                    <p>생성형 AI 윤리 가이드북 교육용 게임 결과입니다.</p>
                    <p>🐻 AI 윤리 곰돌이 어드벤처 🍯</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
