export function generateReportHTML(state) {
    const rank = state.getRank();
    const date = new Date().toLocaleDateString();

    let rows = "";
    if (state.history.length === 0) {
        rows = `<tr><td colspan="3" style="text-align:center;">기록된 모험 내용이 없습니다. (0문제 해결)</td></tr>`;
    } else {
        rows = state.history.map((h, i) => {
            const questionText = h.question ? h.question.question : "알 수 없는 문제";
            const status = h.isCorrect ? '<span class="correct">정답 ⭕</span>' : '<span class="wrong">오답 ❌</span>';

            return `
                <tr class="${h.isCorrect ? 'row-correct' : 'row-wrong'}">
                    <td>${i + 1}</td>
                    <td class="q-text">${questionText}</td>
                    <td>${status}</td>
                </tr>
                ${!h.isCorrect && h.question ? `
                <tr class="explanation-row">
                    <td colspan="3">
                        <strong>💡 해설:</strong> ${h.question.explanation}
                    </td>
                </tr>` : ''}
            `;
        }).join('');
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI 윤리 곰돌이 모험 결과보고서</title>
            <style>
                body { font-family: 'Noto Sans KR', sans-serif; padding: 40px; background: #f9f9f9; }
                .report-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                h1 { text-align: center; color: #333; }
                .summary-box { background: #f0f7ff; padding: 20px; border-radius: 10px; display: flex; justify-content: space-around; margin: 30px 0; }
                .stat-item { text-align: center; }
                .stat-value { display: block; font-size: 24px; font-weight: bold; color: #007bff; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
                th { background: #eee; }
                .correct { color: green; font-weight: bold; }
                .wrong { color: red; font-weight: bold; }
                .explanation-row td { background: #fff5f5; color: #666; font-size: 0.9em; padding-left: 40px; border-bottom: 2px solid #ffcccc; }
                .footer { text-align: center; margin-top: 40px; color: #888; font-size: 0.8em; }
            </style>
        </head>
        <body>
            <div class="report-container">
                <h1>📜 AI 윤리 모험 결과보고서</h1>
                <p style="text-align:center;">날짜: ${date}</p>
                
                <div class="summary-box">
                    <div class="stat-item">
                        <span class="stat-value">${rank.emoji} ${rank.text}</span>
                        <span>최종 등급</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${state.score} 🍯</span>
                        <span>획득 점수</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${state.correctCount} / 20</span>
                        <span>정답 수</span>
                    </div>
                </div>

                <h3>상세 결과</h3>
                <table>
                    <thead>
                        <tr>
                            <th width="10%">번호</th>
                            <th width="70%">문항</th>
                            <th width="20%">결과</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <div class="footer">
                    생성형 AI 윤리 가이드북 교육용 게임 결과입니다.
                </div>
            </div>
            <script>
                window.print();
            </script>
        </body>
        </html>
    `;
}
