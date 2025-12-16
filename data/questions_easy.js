// 이지 난이도: 기초 개념, 명확한 정답, 쉬운 용어
export const questions = [
    // Theme 1: 생성형 AI 기초
    {
        id: 1, category: "생성형 AI란?",
        question: "생성형 AI는 무엇을 만들어낼 수 있나요?",
        options: [
            { text: "텍스트, 이미지, 음악 등 새로운 결과물을 만들 수 있어요.", isCorrect: true },
            { text: "오직 숫자 계산만 할 수 있어요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 텍스트, 이미지, 비디오, 음악, 코딩 등 다양한 새로운 결과물을 만들어낼 수 있어요."
    },
    {
        id: 2, category: "생성형 AI란?",
        question: "챗GPT는 어떤 AI인가요?",
        options: [
            { text: "사람과 대화하듯 텍스트를 생성하는 AI예요.", isCorrect: true },
            { text: "게임만 하는 AI예요.", isCorrect: false }
        ],
        explanation: "챗GPT는 사람과 대화하듯 쉽고 빠르게 텍스트를 생성하는 생성형 AI 서비스예요."
    },
    {
        id: 3, category: "생성형 AI란?",
        question: "생성형 AI는 누구나 사용할 수 있나요?",
        options: [
            { text: "네, 누구나 쉽게 사용할 수 있어요.", isCorrect: true },
            { text: "아니요, 전문가만 사용할 수 있어요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 누구나 쉽게 활용할 수 있도록 설계되었어요."
    },
    {
        id: 4, category: "생성형 AI란?",
        question: "생성형 AI로 할 수 있는 일은?",
        options: [
            { text: "번역, 문서 요약, 이미지 제작 등 다양한 일을 할 수 있어요.", isCorrect: true },
            { text: "음식만 만들 수 있어요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 외국어 번역, 문서 요약, 회의록 작성, 이미지 제작 등 전문적인 영역까지 도움을 줄 수 있어요."
    },
    {
        id: 5, category: "생성형 AI란?",
        question: "생성형 AI를 사용할 때 무엇을 기억해야 하나요?",
        options: [
            { text: "윤리적으로 사용하고, 한계를 인식해야 해요.", isCorrect: true },
            { text: "아무렇게나 사용해도 괜찮아요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 효율성과 창조성을 제공하지만, 저작권, 개인정보, 허위정보 등의 문제를 인식하고 윤리적으로 사용해야 해요."
    },

    // Theme 2: 저작권
    {
        id: 6, category: "저작권",
        question: "AI가 만든 그림에 저작권이 있나요?",
        options: [
            { text: "대부분의 국가에서 AI 생성물은 저작권이 인정되지 않아요.", isCorrect: true },
            { text: "네, AI가 저작자예요.", isCorrect: false }
        ],
        explanation: "현재 한국을 포함한 대부분의 국가에서는 AI가 생성한 결과물을 저작권법상 보호되는 저작물로 인정하지 않아요."
    },
    {
        id: 7, category: "저작권",
        question: "AI로 만든 그림을 내가 그렸다고 말해도 될까요?",
        options: [
            { text: "아니요, AI가 만든 것을 내가 그렸다고 속이면 안 돼요.", isCorrect: true },
            { text: "네, 내 명령어로 만들었으니 내 작품이에요.", isCorrect: false }
        ],
        explanation: "AI 생성물을 자신의 창작물인 것처럼 제출하는 것은 부정행위예요. AI 사용 여부를 밝혀야 해요."
    },
    {
        id: 8, category: "저작권",
        question: "다른 사람의 그림을 AI에게 학습시켜도 될까요?",
        options: [
            { text: "원작자의 동의 없이 학습시키는 것은 저작권 침해 논란이 있어요.", isCorrect: true },
            { text: "학습용으로만 썼으니 괜찮아요.", isCorrect: false }
        ],
        explanation: "타인의 저작물을 허락 없이 AI 학습 데이터로 사용하는 것은 저작권 침해 소지가 있어요."
    },
    {
        id: 9, category: "저작권",
        question: "유명 가수의 목소리를 AI로 복제해서 노래를 만들어도 될까요?",
        options: [
            { text: "아니요, 가수의 허락 없이는 음성권 침해가 될 수 있어요.", isCorrect: true },
            { text: "네, 재미로 만든 거니까 괜찮아요.", isCorrect: false }
        ],
        explanation: "유명 가수의 목소리를 AI로 학습시켜 만든 'AI 커버곡'은 해당 가수의 음성권을 침해할 소지가 커요."
    },
    {
        id: 10, category: "저작권",
        question: "AI로 만든 작품을 공모전에 내도 될까요?",
        options: [
            { text: "대회 요강을 확인하고, AI 사용 여부를 밝혀야 해요.", isCorrect: true },
            { text: "그냥 내도 괜찮아요.", isCorrect: false }
        ],
        explanation: "공모전은 참가자 본인의 순수 창작 능력을 평가하는 자리이므로, AI 사용 여부를 확인하고 밝혀야 해요."
    },

    // Theme 3: 책임성
    {
        id: 11, category: "책임성",
        question: "학교 과제를 AI가 대신 작성하게 해도 될까요?",
        options: [
            { text: "아니요, AI는 보조 도구로만 활용하고 본인이 직접 작성해야 해요.", isCorrect: true },
            { text: "네, 편하니까 AI가 다 해주면 좋아요.", isCorrect: false }
        ],
        explanation: "과제를 스스로 수행하지 않고 AI 결과물을 그대로 제출하면 사고력과 작문 능력이 저하될 수 있어요."
    },
    {
        id: 12, category: "책임성",
        question: "AI가 알려준 정보를 그대로 사용해도 될까요?",
        options: [
            { text: "아니요, 정보가 틀릴 수 있으니 교차 검증이 필요해요.", isCorrect: true },
            { text: "네, AI가 알려주니까 맞을 거예요.", isCorrect: false }
        ],
        explanation: "AI는 사실이 아닌 내용을 그럴듯하게 지어낼 수 있어요. 반드시 팩트 체크를 거쳐야 해요."
    },
    {
        id: 13, category: "책임성",
        question: "회사 비밀 정보를 AI에게 입력해도 될까요?",
        options: [
            { text: "아니요, 기밀 정보는 외부 서버로 유출될 수 있어요.", isCorrect: true },
            { text: "네, AI는 비밀을 지켜줄 거예요.", isCorrect: false }
        ],
        explanation: "회사 내부 회의록이나 비공개 데이터를 AI에 입력하면 외부 서버로 전송되어 유출될 수 있어요."
    },
    {
        id: 14, category: "책임성",
        question: "AI가 만든 보고서의 책임은 누구에게 있나요?",
        options: [
            { text: "AI를 사용한 사람에게 책임이 있어요.", isCorrect: true },
            { text: "AI에게 책임이 있어요.", isCorrect: false }
        ],
        explanation: "AI는 법적 인격체가 아니므로, AI를 사용한 사람이 최종 책임을 져야 해요."
    },
    {
        id: 15, category: "책임성",
        question: "AI 활용 여부를 밝혀야 하나요?",
        options: [
            { text: "네, 윤리적으로 출처를 표기하는 것이 좋아요.", isCorrect: true },
            { text: "아니요, 숨겨도 괜찮아요.", isCorrect: false }
        ],
        explanation: "생성형 AI를 활용했음을 밝히고, 가능하다면 어떤 모델을 썼는지 명시하는 것이 정보의 투명성을 높여요."
    },

    // Theme 4: 허위조작정보
    {
        id: 16, category: "허위조작정보",
        question: "딥페이크(Deepfake)란 무엇인가요?",
        options: [
            { text: "AI로 특정 인물의 얼굴이나 목소리를 실제처럼 조작하는 기술이에요.", isCorrect: true },
            { text: "진짜 영상을 만드는 기술이에요.", isCorrect: false }
        ],
        explanation: "딥페이크는 AI 기술을 이용해 특정 인물의 얼굴이나 목소리를 실제처럼 조작하는 기술이에요."
    },
    {
        id: 17, category: "허위조작정보",
        question: "AI가 만든 가짜 뉴스를 발견했을 때 어떻게 해야 하나요?",
        options: [
            { text: "신고하고 공유하지 않아요.", isCorrect: true },
            { text: "친구들에게 바로 공유해요.", isCorrect: false }
        ],
        explanation: "허위조작정보를 발견하면 한국언론진흥재단, 방송통신심의위원회 등에 신고하고 공유하지 않아야 해요."
    },
    {
        id: 18, category: "허위조작정보",
        question: "AI가 알려준 정보를 믿어도 될까요?",
        options: [
            { text: "아니요, 거짓 정보일 수 있으니 확인이 필요해요.", isCorrect: true },
            { text: "네, AI가 알려주니까 맞을 거예요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 거짓 정보를 사실인 양 생성하는 문제가 있어요. 반드시 신뢰할 수 있는 자료로 확인해야 해요."
    },
    {
        id: 19, category: "허위조작정보",
        question: "할루시네이션(Hallucination)이란?",
        options: [
            { text: "AI가 사실이 아닌 것을 사실인 것처럼 꾸며내는 현상이에요.", isCorrect: true },
            { text: "AI가 잠을 자는 현상이에요.", isCorrect: false }
        ],
        explanation: "할루시네이션은 AI가 사실이 아닌 것을 사실인 것처럼 그럴듯하게 꾸며내는 고질적인 문제예요."
    },
    {
        id: 20, category: "허위조작정보",
        question: "보이스피싱이란?",
        options: [
            { text: "AI로 복제한 목소리로 전화를 걸어 돈을 요구하는 범죄예요.", isCorrect: true },
            { text: "목소리로 노래를 부르는 거예요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 단 3초 분량의 목소리 샘플만 있어도 특정인의 목소리를 복제할 수 있어, 이를 악용한 보이스피싱 범죄가 늘고 있어요."
    },

    // Theme 5: 개인정보·인격권
    {
        id: 21, category: "개인정보",
        question: "AI 챗봇과 나눈 대화는 어디에 저장되나요?",
        options: [
            { text: "서비스 제공 기업의 서버에 저장되고 학습에 사용될 수 있어요.", isCorrect: true },
            { text: "내 컴퓨터에만 저장돼요.", isCorrect: false }
        ],
        explanation: "사용자가 생성형 AI와 나눈 대화는 기본적으로 서비스 제공 기업의 서버에 저장되며, 학습 데이터로 활용될 수 있어요."
    },
    {
        id: 22, category: "개인정보",
        question: "AI에게 개인정보를 알려줘도 될까요?",
        options: [
            { text: "아니요, 개인정보는 절대 입력하지 않아야 해요.", isCorrect: true },
            { text: "네, AI는 친구니까 알려줘도 돼요.", isCorrect: false }
        ],
        explanation: "주민등록번호, 신용카드 번호, 비밀번호 등 식별 가능한 개인정보는 절대 입력하지 마세요."
    },
    {
        id: 23, category: "개인정보",
        question: "AI가 차별적 발언을 할 때 어떻게 해야 하나요?",
        options: [
            { text: "재미로 소비하지 말고 서비스에 피드백을 줘야 해요.", isCorrect: true },
            { text: "친구들에게 공유해요.", isCorrect: false }
        ],
        explanation: "AI가 차별적이거나 명예를 훼손하는 발언을 할 경우, 이를 악용하지 말고 해당 서비스에 피드백을 주어 개선되도록 해야 해요."
    },
    {
        id: 24, category: "개인정보",
        question: "내 대화가 AI 학습에 쓰이지 않게 하려면?",
        options: [
            { text: "서비스 설정에서 '데이터 제어 설정'을 비활성화해요.", isCorrect: true },
            { text: "아무것도 할 수 없어요.", isCorrect: false }
        ],
        explanation: "서비스에서 제공하는 'Chat History & Training 비활성화' 설정을 통해 내 대화가 학습에 쓰이지 않도록 할 수 있어요."
    },
    {
        id: 25, category: "개인정보",
        question: "AI에게 건강 상태나 사생활을 말해도 될까요?",
        options: [
            { text: "아니요, 민감한 정보는 입력하지 않는 게 좋아요.", isCorrect: true },
            { text: "네, AI는 비밀을 지켜줄 거예요.", isCorrect: false }
        ],
        explanation: "건강 상태, 정치적 성향, 종교, 사생활 관련 내용도 입력하지 않는 것이 좋아요."
    },

    // Theme 6: 오남용
    {
        id: 26, category: "오남용",
        question: "모든 것을 AI에게 맡기면 어떻게 될까요?",
        options: [
            { text: "사고력과 창의적 문제 해결 능력이 약화될 수 있어요.", isCorrect: true },
            { text: "더 똑똑해져요.", isCorrect: false }
        ],
        explanation: "AI에만 의존하면 비판적 사고력과 창의적 문제 해결 능력이 퇴화할 수 있어요."
    },
    {
        id: 27, category: "오남용",
        question: "AI 챗봇을 친구처럼 대해야 하나요?",
        options: [
            { text: "아니요, AI는 감정을 느끼지 못하는 기계 알고리즘이에요.", isCorrect: true },
            { text: "네, 사람처럼 대화하니까 친구예요.", isCorrect: false }
        ],
        explanation: "AI는 감정을 느끼지 못하며 비밀을 지켜줄 수 없는 기계 알고리즘일 뿐이에요. 현실 세계의 대인관계를 대체할 수 없어요."
    },
    {
        id: 28, category: "오남용",
        question: "의료나 법률 상담을 AI에게 받아도 될까요?",
        options: [
            { text: "아니요, 전문가와 상의해야 해요.", isCorrect: true },
            { text: "네, AI가 정확하게 알려줄 거예요.", isCorrect: false }
        ],
        explanation: "의료, 법률, 금융 등 전문적인 지식이 필요한 영역에서 AI의 조언은 참고만 해야 해요. 중요 결정은 인간 전문가와 상의해야 해요."
    },
    {
        id: 29, category: "오남용",
        question: "AI를 어떻게 활용하는 것이 좋을까요?",
        options: [
            { text: "도구로 활용하고, 자신의 생각과 통찰을 더해 완성해요.", isCorrect: true },
            { text: "AI가 만든 결과를 그대로 사용해요.", isCorrect: false }
        ],
        explanation: "AI는 인간을 돕는 '도구'일 뿐이에요. AI가 준 초안에 자신의 생각과 통찰을 더해 완성하는 방식으로 활용해야 해요."
    },
    {
        id: 30, category: "오남용",
        question: "생성형 AI를 사용할 때 체크해야 할 것은?",
        options: [
            { text: "저작권, 개인정보, 허위정보, 편향성 등을 확인해야 해요.", isCorrect: true },
            { text: "아무것도 확인할 필요 없어요.", isCorrect: false }
        ],
        explanation: "저작권, 권리침해, 개인정보 유출, 허위조작정보, 편향성, 할루시네이션 등을 체크하며 윤리적으로 사용해야 해요."
    }
];

