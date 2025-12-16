export function generateReportHTML(state) {
    const rank = state.getRank();
    const date = new Date().toLocaleDateString('ko-KR');
    const totalAnswered = state.history.length;

    // 테마 정보 (6테마 x 5문항)
    const themes = [
        { name: "디지털 예절 & 저작권", emoji: "💻", levels: [0, 1, 2, 3, 4] },
        { name: "개인정보 보호", emoji: "🔒", levels: [5, 6, 7, 8, 9] },
        { name: "편향성 & 공정성", emoji: "⚖️", levels: [10, 11, 12, 13, 14] },
        { name: "허위정보 & 팩트체크", emoji: "🔍", levels: [15, 16, 17, 18, 19] },
        { name: "딥페이크 & 초상권", emoji: "🎭", levels: [20, 21, 22, 23, 24] },
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

        const questionsHTML = themeQuestions.map((h, i) => {
            const question = h.question;
            const userAnswer = h.userAnswer || '선택한 답안 정보 없음';
            const correctAnswer = question?.options?.find(opt => opt.isCorrect)?.text || '정답 정보 없음';
            
            let answerAnalysis = '';
            if (!h.isCorrect && question) {
                answerAnalysis = `
                    <div class="answer-analysis">
                        <div class="answer-item wrong-answer">
                            <strong>❌ 선택한 답안:</strong> ${userAnswer}
                        </div>
                        <div class="answer-item correct-answer">
                            <strong>✅ 정답:</strong> ${correctAnswer}
                        </div>
                    </div>
                `;
            } else if (h.isCorrect) {
                answerAnalysis = `
                    <div class="answer-analysis">
                        <div class="answer-item correct-answer">
                            <strong>✅ 선택한 답안:</strong> ${userAnswer}
                        </div>
                    </div>
                `;
            }
            
            return `
            <div class="question-item ${h.isCorrect ? 'correct' : 'wrong'}">
                <div class="question-header">
                    <span class="question-num">Q${h.level + 1}</span>
                    <span class="question-result">${h.isCorrect ? '✅ 정답' : '❌ 오답'}</span>
                </div>
                <div class="question-category">📌 ${question?.category || '카테고리 없음'}</div>
                <div class="question-text">${question?.question || '문제 정보 없음'}</div>
                ${answerAnalysis}
                <div class="question-explanation">
                    <strong>💡 상세 해설:</strong> ${question?.explanation || '해설 정보 없음'}
                </div>
            </div>
        `;
        }).join('');

        // 테마별 상세 분석 및 피드백
        const wrongQuestions = themeQuestions.filter(h => !h.isCorrect);
        const correctQuestions = themeQuestions.filter(h => h.isCorrect);
        
        let feedback = '';
        let detailedAnalysis = '';
        
        // 테마별 핵심 개념 요약
        const themeConcepts = {
            "디지털 예절 & 저작권": "생성형 AI의 기본 개념, 챗GPT 등 다양한 AI 도구의 활용, AI의 긍정적 측면과 부정적 문제의 균형",
            "개인정보 보호": "AI 서비스에 개인정보 입력 금지, 데이터 제어 설정 활용, 자기결정권의 중요성",
            "편향성 & 공정성": "AI의 데이터 편향 문제, 알고리즘 차별, 포용성의 중요성, 비판적 사고",
            "허위정보 & 팩트체크": "딥페이크의 위험성, 할루시네이션 현상, 팩트체크의 중요성, 보이스피싱 대응",
            "딥페이크 & 초상권": "초상권 침해, 음성권 보호, 딥페이크 성착취물 신고, 워터마크의 중요성",
            "AI 안전 & 미래": "AI 안전 가이드라인, 법적 책임, 환경 문제, 인간 고유 가치의 중요성"
        };
        
        if (theme.percent >= 80) {
            feedback = `<div class="theme-feedback excellent">
                <h4>🎉 훌륭한 성과입니다!</h4>
                <p><strong>${theme.name}</strong> 영역에서 <strong>${theme.percent}%</strong>의 정답률을 달성하셨어요. 이 영역의 핵심 개념을 잘 이해하고 계십니다.</p>
                <p><strong>✅ 강점:</strong> ${correctQuestions.length}개 문제를 모두 정확히 풀었어요. ${themeConcepts[theme.name] || '이 영역의 주요 개념을 잘 파악하고 있습니다.'}</p>
            </div>`;
            
            detailedAnalysis = `
                <div class="detailed-analysis">
                    <h4>📈 상세 분석</h4>
                    <ul>
                        <li><strong>정답률:</strong> ${theme.percent}% (${theme.correct}/${theme.total}문항)</li>
                        <li><strong>핵심 개념 이해도:</strong> 우수</li>
                        <li><strong>학습 상태:</strong> 이 영역은 충분히 숙지하셨습니다. 다른 영역으로 학습을 확장하시면 좋겠어요.</li>
                    </ul>
                </div>
            `;
        } else if (theme.percent >= 60) {
            const wrongCount = wrongQuestions.length;
            feedback = `<div class="theme-feedback good">
                <h4>👍 좋은 시작입니다!</h4>
                <p><strong>${theme.name}</strong> 영역에서 <strong>${theme.percent}%</strong>의 정답률을 달성하셨어요. ${wrongCount}개 문제를 틀렸지만, 기본 개념은 이해하고 계십니다.</p>
                <p><strong>💡 개선 포인트:</strong> 틀린 문제(${wrongCount}개)의 해설을 다시 한 번 읽어보시면 더 완벽해질 거예요.</p>
            </div>`;
            
            detailedAnalysis = `
                <div class="detailed-analysis">
                    <h4>📈 상세 분석</h4>
                    <ul>
                        <li><strong>정답률:</strong> ${theme.percent}% (${theme.correct}/${theme.total}문항)</li>
                        <li><strong>틀린 문제:</strong> ${wrongCount}개</li>
                        <li><strong>핵심 개념:</strong> ${themeConcepts[theme.name] || '이 영역의 주요 개념을 다시 한 번 정리해보세요.'}</li>
                        <li><strong>학습 권장사항:</strong> 아래 틀린 문제의 해설을 꼼꼼히 읽고, 관련 개념을 다시 학습하시면 정답률을 더 높일 수 있어요.</li>
                    </ul>
                </div>
            `;
        } else if (theme.total > 0) {
            const wrongCount = wrongQuestions.length;
            const wrongPercent = Math.round((wrongCount / theme.total) * 100);
            feedback = `<div class="theme-feedback needs-work">
                <h4>📖 추가 학습이 필요합니다</h4>
                <p><strong>${theme.name}</strong> 영역에서 <strong>${theme.percent}%</strong>의 정답률을 기록하셨어요. ${wrongCount}개 문제(${wrongPercent}%)를 틀렸습니다.</p>
                <p><strong>⚠️ 주의사항:</strong> 이 영역은 AI 윤리에서 매우 중요한 부분이에요. 아래 틀린 문제들을 중심으로 반복 학습하시길 권장합니다.</p>
                <p><strong>📚 핵심 개념:</strong> ${themeConcepts[theme.name] || '이 영역의 주요 개념을 다시 한 번 정리해보세요.'}</p>
            </div>`;
            
            // 틀린 문제 유형 분석
            const wrongCategories = {};
            wrongQuestions.forEach(h => {
                const category = h.question?.category || '기타';
                wrongCategories[category] = (wrongCategories[category] || 0) + 1;
            });
            
            const categoryAnalysis = Object.entries(wrongCategories).map(([cat, count]) => 
                `<li><strong>${cat}:</strong> ${count}개 문제 틀림</li>`
            ).join('');
            
            detailedAnalysis = `
                <div class="detailed-analysis">
                    <h4>📈 상세 분석</h4>
                    <ul>
                        <li><strong>정답률:</strong> ${theme.percent}% (${theme.correct}/${theme.total}문항)</li>
                        <li><strong>틀린 문제:</strong> ${wrongCount}개 (${wrongPercent}%)</li>
                        <li><strong>주요 약점 영역:</strong> 
                            <ul style="margin-top: 5px;">
                                ${categoryAnalysis || '<li>분류 불가</li>'}
                            </ul>
                        </li>
                        <li><strong>핵심 개념:</strong> ${themeConcepts[theme.name] || '이 영역의 주요 개념을 다시 한 번 정리해보세요.'}</li>
                        <li><strong>학습 권장사항:</strong> 
                            <ol style="margin-top: 5px; margin-left: 20px;">
                                <li>아래 틀린 문제의 해설을 반드시 읽어보세요.</li>
                                <li>관련 개념을 교과서나 학습 자료에서 다시 확인하세요.</li>
                                <li>비슷한 유형의 문제를 다시 풀어보며 이해도를 점검하세요.</li>
                            </ol>
                        </li>
                    </ul>
                </div>
            `;
        }

        return `
            <div class="theme-section">
                <h3>${theme.emoji} ${theme.name} <span class="theme-result">(${theme.correct}/${theme.total} 정답, ${theme.percent}%)</span></h3>
                ${feedback}
                ${detailedAnalysis}
                <div class="questions-list">
                    <h4 style="margin-bottom: 15px; color: #333;">📋 문항별 상세 결과</h4>
                    ${questionsHTML}
                </div>
            </div>
        `;
    }).join('');

    // 전체 피드백 생성
    const weakThemes = themeAnalysis.filter(t => t.total > 0 && t.percent < 60);
    const strongThemes = themeAnalysis.filter(t => t.percent >= 80);
    const averageThemes = themeAnalysis.filter(t => t.total > 0 && t.percent >= 60 && t.percent < 80);
    
    // 전체 정답률 계산
    const overallPercent = totalAnswered > 0 ? Math.round((state.correctCount / totalAnswered) * 100) : 0;
    
    let overallFeedback = '';
    
    // 전체 성과 분석
    overallFeedback = `
        <div class="overall-performance">
            <h3>📊 전체 학습 성과 분석</h3>
            <div class="performance-summary">
                <p><strong>전체 정답률:</strong> ${overallPercent}% (${state.correctCount}/${totalAnswered}문항)</p>
                <p><strong>플레이 시간:</strong> ${state.getPlayTime()}</p>
                <p><strong>획득 점수:</strong> ${state.score}점</p>
            </div>
    `;
    
    if (strongThemes.length > 0) {
        overallFeedback += `
            <div class="overall-feedback strong">
                <h4>🌟 우수한 영역 (${strongThemes.length}개)</h4>
                <p>다음 영역에서 뛰어난 성과를 보이셨어요:</p>
                <ul>
                    ${strongThemes.map(t => `
                        <li>
                            <strong>${t.emoji} ${t.name}</strong> - 정답률 ${t.percent}% (${t.correct}/${t.total}문항)
                            <p class="feedback-detail">이 영역의 핵심 개념을 잘 이해하고 계십니다. 다른 학습자들에게도 도움을 줄 수 있을 만큼 충분히 숙지하셨습니다.</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    if (averageThemes.length > 0) {
        overallFeedback += `
            <div class="overall-feedback average">
                <h4>👍 보통 수준의 영역 (${averageThemes.length}개)</h4>
                <p>다음 영역은 기본 개념은 이해하고 있지만, 조금 더 학습하면 완벽해질 수 있어요:</p>
                <ul>
                    ${averageThemes.map(t => `
                        <li>
                            <strong>${t.emoji} ${t.name}</strong> - 정답률 ${t.percent}% (${t.correct}/${t.total}문항)
                            <p class="feedback-detail">틀린 문제의 해설을 다시 읽어보시고, 관련 개념을 한 번 더 정리하시면 정답률을 더 높일 수 있어요.</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    if (weakThemes.length > 0) {
        overallFeedback += `
            <div class="overall-feedback">
                <h4>📌 추가 학습이 필요한 영역 (${weakThemes.length}개)</h4>
                <p>다음 영역에 대해 집중적인 학습을 권장합니다:</p>
                <ul>
                    ${weakThemes.map(t => {
                        const wrongCount = t.total - t.correct;
                        return `
                        <li>
                            <strong>${t.emoji} ${t.name}</strong> - 정답률 ${t.percent}% (${t.correct}/${t.total}문항, 틀린 문제 ${wrongCount}개)
                            <p class="feedback-detail">
                                <strong>학습 권장사항:</strong>
                                <ol style="margin-top: 5px; margin-left: 20px;">
                                    <li>이 영역의 모든 문제 해설을 꼼꼼히 읽어보세요.</li>
                                    <li>핵심 개념을 교과서나 학습 자료에서 다시 확인하세요.</li>
                                    <li>비슷한 유형의 문제를 다시 풀어보며 이해도를 점검하세요.</li>
                                    <li>필요하다면 선생님이나 동료와 함께 토론하며 개념을 정리하세요.</li>
                                </ol>
                            </p>
                        </li>
                    `;
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    // 학습 패턴 분석
    const consecutiveWrong = (() => {
        let maxConsecutive = 0;
        let current = 0;
        state.history.forEach(h => {
            if (!h.isCorrect) {
                current++;
                maxConsecutive = Math.max(maxConsecutive, current);
            } else {
                current = 0;
            }
        });
        return maxConsecutive;
    })();
    
    const themeStrengths = strongThemes.map(t => t.name).join(', ');
    const themeWeaknesses = weakThemes.map(t => t.name).join(', ');
    
    overallFeedback += `
            <div class="learning-pattern">
                <h4>🔍 학습 패턴 분석</h4>
                <ul>
                    <li><strong>최대 연속 오답:</strong> ${consecutiveWrong}개 ${consecutiveWrong > 3 ? '(주의: 연속으로 틀린 경우가 많아요. 문제를 풀기 전에 한 번 더 생각해보세요.)' : ''}</li>
                    <li><strong>강점 영역:</strong> ${themeStrengths || '없음'}</li>
                    <li><strong>보완 필요 영역:</strong> ${themeWeaknesses || '없음'}</li>
                </ul>
            </div>
        </div>
    `;

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
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                @media (max-width: 600px) {
                    .themes-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
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
                
                .overall-performance {
                    margin: 20px 30px;
                    padding: 25px;
                    background: #f8f9fa;
                    border-radius: 15px;
                    border: 2px solid #e0e0e0;
                }
                .overall-performance h3 {
                    margin-bottom: 15px;
                    color: #333;
                    font-size: 1.3rem;
                }
                .performance-summary {
                    background: white;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .performance-summary p {
                    margin: 8px 0;
                    font-size: 1rem;
                }
                .overall-feedback {
                    margin: 15px 0;
                    padding: 20px;
                    background: #FFF3E0;
                    border-radius: 10px;
                    border-left: 4px solid #FF9800;
                }
                .overall-feedback.strong {
                    background: #E8F5E9;
                    border-left-color: #4CAF50;
                }
                .overall-feedback.average {
                    background: #E3F2FD;
                    border-left-color: #2196F3;
                }
                .overall-feedback h4 { 
                    margin-bottom: 10px; 
                    font-size: 1.1rem;
                }
                .overall-feedback ul { 
                    margin-left: 20px; 
                    margin-top: 10px;
                }
                .overall-feedback li { 
                    margin: 10px 0; 
                    line-height: 1.6;
                }
                .feedback-detail {
                    margin-top: 5px;
                    font-size: 0.9rem;
                    color: #555;
                    padding-left: 10px;
                }
                .learning-pattern {
                    margin-top: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                }
                .learning-pattern h4 {
                    margin-bottom: 10px;
                    color: #333;
                }
                .learning-pattern ul {
                    margin-left: 20px;
                }
                .learning-pattern li {
                    margin: 8px 0;
                    line-height: 1.6;
                }
                .detailed-analysis {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    margin: 15px 20px;
                    border-left: 3px solid #667eea;
                }
                .detailed-analysis h4 {
                    margin-bottom: 10px;
                    color: #333;
                    font-size: 1rem;
                }
                .detailed-analysis ul {
                    margin-left: 20px;
                    line-height: 1.8;
                }
                .detailed-analysis li {
                    margin: 8px 0;
                }
                .detailed-analysis ol {
                    line-height: 1.8;
                }
                
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
                .question-category {
                    font-size: 0.85rem;
                    color: #667eea;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                .question-text { 
                    margin-bottom: 12px; 
                    color: #333; 
                    font-size: 1rem;
                    line-height: 1.6;
                }
                .answer-analysis {
                    margin: 12px 0;
                    padding: 12px;
                    background: rgba(255,255,255,0.9);
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }
                .answer-item {
                    margin: 8px 0;
                    padding: 8px;
                    border-radius: 5px;
                    line-height: 1.5;
                }
                .answer-item.wrong-answer {
                    background: #ffebee;
                    border-left: 3px solid #f44336;
                }
                .answer-item.correct-answer {
                    background: #e8f5e9;
                    border-left: 3px solid #4CAF50;
                }
                .question-explanation { 
                    font-size: 0.95rem; 
                    color: #555; 
                    padding: 12px;
                    background: rgba(255,255,255,0.9);
                    border-radius: 8px;
                    border-left: 3px solid #667eea;
                    line-height: 1.7;
                    margin-top: 10px;
                }
                .question-explanation strong {
                    color: #333;
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
