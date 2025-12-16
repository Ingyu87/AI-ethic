// 노멀 난이도: 중간 난이도, 현재 수준
export const questions = [
    // Theme 1: 생성형 AI 기초
    {
        id: 1, category: "생성형 AI란?",
        question: "생성형 AI가 과거의 인공지능과 다른 점은?",
        options: [
            { text: "데이터를 분류·분석하는 것을 넘어 새로운 결과물을 창조할 수 있어요.", isCorrect: true },
            { text: "계산만 더 빨리 할 수 있어요.", isCorrect: false }
        ],
        explanation: "과거의 인공지능이 데이터를 분류하거나 분석하는 데 초점을 맞췄다면, 생성형 AI는 누구나 쉽게 활용할 수 있도록 설계되었고 창조적인 영역까지 확장되었어요."
    },
    {
        id: 2, category: "생성형 AI란?",
        question: "챗GPT가 빠르게 확산된 이유는?",
        options: [
            { text: "사람들이 마치 친구와 대화하듯 쉽고 빠르게 AI를 활용할 수 있게 되었기 때문이에요.", isCorrect: true },
            { text: "게임을 잘하기 때문이에요.", isCorrect: false }
        ],
        explanation: "2022년 11월 OpenAI가 챗GPT를 공개하면서 사람들은 쉽고 빠르고 편리하게 AI를 활용할 수 있게 되었고, 인공지능에 대한 기대감이 폭발적으로 증가했어요."
    },
    {
        id: 3, category: "생성형 AI란?",
        question: "생성형 AI 시장이 급성장하는 이유는?",
        options: [
            { text: "개인의 학업과 업무 방식을 혁신적으로 변화시켰기 때문이에요.", isCorrect: true },
            { text: "게임을 잘 만들어서예요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 외국어 번역, 문서 요약, 회의록 작성, 소프트웨어 코딩, 작곡, 이미지 제작 등 전문적인 영역까지 누구나 도움을 받을 수 있게 되었어요."
    },
    {
        id: 4, category: "생성형 AI란?",
        question: "GPT-3.5와 GPT-4의 성능 차이는?",
        options: [
            { text: "GPT-4는 변호사 시험에서 상위 10%에 해당하는 점수를 기록했어요.", isCorrect: true },
            { text: "차이가 없어요.", isCorrect: false }
        ],
        explanation: "GPT-3.5는 미국 변호사 시험 성적이 하위 10% 수준이었으나, GPT-4는 상위 10%에 해당하는 점수를 기록했어요. 생성형 AI는 지속적으로 성능이 개선되고 있어요."
    },
    {
        id: 5, category: "생성형 AI란?",
        question: "생성형 AI의 부정적 문제는?",
        options: [
            { text: "저작권 분쟁, 개인정보 유출, 허위조작정보 생성, 편향성 등이 있어요.", isCorrect: true },
            { text: "문제가 없어요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 효율성, 생산성, 창조성이라는 긍정적 측면과 함께 저작권 분쟁, 개인정보 유출, 허위조작정보 생성, 편향성 등의 부정적 문제를 내포하고 있어요."
    },

    // Theme 2: 저작권
    {
        id: 6, category: "저작권",
        question: "AI 생성물에 저작권이 없는 이유는?",
        options: [
            { text: "저작권법상 저작물은 '인간의 사상 또는 감정을 표현한 창작물'로 정의되기 때문이에요.", isCorrect: true },
            { text: "AI가 게을러서예요.", isCorrect: false }
        ],
        explanation: "저작권법상 저작물은 '인간의 사상 또는 감정을 표현한 창작물'로 정의되며, AI는 법인격이 없으므로 저작자가 될 수 없어요."
    },
    {
        id: 7, category: "저작권",
        question: "AI 생성물을 수정하면 저작권이 생기나요?",
        options: [
            { text: "이용자가 창작적 표현을 추가하거나 수정했다면 그 부분에 대해서는 저작권이 인정될 수 있어요.", isCorrect: true },
            { text: "절대 인정되지 않아요.", isCorrect: false }
        ],
        explanation: "이용자가 AI가 생성한 결과물에 나름의 창작적 표현을 추가하거나 수정(리터칭 등)을 가했다면, 그 인간이 기여한 부분에 대해서는 저작권이 인정될 수 있어요."
    },
    {
        id: 8, category: "저작권",
        question: "AI 생성물이 기존 작가의 화풍과 유사하면?",
        options: [
            { text: "저작권 침해 소지가 있어요.", isCorrect: true },
            { text: "문제없어요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 기존 저작물을 학습하여 확률적으로 조합해내기 때문에, 결과물이 기성 작가의 화풍이나 특정 캐릭터와 매우 유사하게 나올 수 있어 저작권 침해 위험이 있어요."
    },
    {
        id: 9, category: "저작권",
        question: "AI 커버곡이 문제가 되는 이유는?",
        options: [
            { text: "원곡 작사/작곡가의 저작권뿐만 아니라 가수의 음성권을 침해할 소지가 크기 때문이에요.", isCorrect: true },
            { text: "재미없어서예요.", isCorrect: false }
        ],
        explanation: "유명 가수의 목소리를 AI로 학습시켜 만든 'AI 커버곡'은 원곡 작사/작곡가의 저작권뿐만 아니라, 해당 가수의 음성권을 침해할 소지가 커요."
    },
    {
        id: 10, category: "저작권",
        question: "내 저작물이 AI 학습에 무단 사용되었다면?",
        options: [
            { text: "저작권 침해를 주장하고 학습 데이터 제외를 요청할 수 있어요.", isCorrect: true },
            { text: "아무것도 할 수 없어요.", isCorrect: false }
        ],
        explanation: "원칙적으로 AI 개발사가 허락 없이 저작물을 학습에 이용하는 것은 복제권 침해 등을 주장할 수 있어요. 저작권자는 침해 금지 및 학습 데이터 제외를 요청할 수 있어요."
    },

    // Theme 3: 책임성
    {
        id: 11, category: "책임성",
        question: "공모전에 AI 작품을 제출할 때 주의할 점은?",
        options: [
            { text: "대회 요강에 AI 활용 가능 여부를 확인하고, 불분명할 경우 주최 측에 사전 문의해야 해요.", isCorrect: true },
            { text: "그냥 내도 괜찮아요.", isCorrect: false }
        ],
        explanation: "일반적으로 공모전은 참가자 본인의 순수 창작 능력을 평가하는 자리이므로, AI 사용 여부를 확인하고 밝혀야 해요."
    },
    {
        id: 12, category: "책임성",
        question: "AI가 제공한 통계나 수치를 그대로 사용하면?",
        options: [
            { text: "할루시네이션으로 인해 오류가 발생할 수 있고, 그 책임은 사용자에게 있어요.", isCorrect: true },
            { text: "문제없어요.", isCorrect: false }
        ],
        explanation: "AI는 사실이 아닌 내용을 그럴듯하게 지어내는 환각 현상을 보일 수 있어요. AI가 제공한 통계나 수치를 그대로 사용했다가 오류가 발생하면 그 책임은 보고서를 작성한 사람에게 있어요."
    },
    {
        id: 13, category: "책임성",
        question: "회사 기밀 정보를 AI에 입력하면?",
        options: [
            { text: "외부 서버로 전송되어 유출될 수 있고, 회사 보안 규정 위반 및 법적 처벌 대상이 될 수 있어요.", isCorrect: true },
            { text: "안전하게 보관돼요.", isCorrect: false }
        ],
        explanation: "회사 내부 회의록이나 비공개 데이터를 AI에 입력하면 외부 서버로 전송되어 유출될 수 있어요. 이는 회사 보안 규정 위반일 뿐만 아니라 법적 처벌 대상이 될 수 있어요."
    },
    {
        id: 14, category: "책임성",
        question: "변호사가 챗GPT가 찾아준 판례를 검증 없이 법원에 제출했다면?",
        options: [
            { text: "가짜 판례일 수 있어 벌금형을 받을 수 있어요.", isCorrect: true },
            { text: "문제없어요.", isCorrect: false }
        ],
        explanation: "미국에서 변호사가 챗GPT가 찾아준 판례를 검증 없이 법원에 제출했다가, 해당 판례들이 모두 AI가 지어낸 가짜임이 밝혀져 벌금형을 선고받은 사례가 있어요."
    },
    {
        id: 15, category: "책임성",
        question: "AI 활용 시 출처 표기를 어떻게 해야 하나요?",
        options: [
            { text: "'ChatGPT 3.5를 이용하여 생성함(일자, 프롬프트 내용 포함)'과 같이 구체적으로 명시해야 해요.", isCorrect: true },
            { text: "표기할 필요 없어요.", isCorrect: false }
        ],
        explanation: "법적 의무는 아직 명확하지 않으나, 윤리적 활용을 위해 생성형 AI를 활용했음을 밝히고, 가능하다면 어떤 프롬프트를 사용했는지, 어떤 모델을 썼는지 명시하는 것이 좋아요."
    },

    // Theme 4: 허위조작정보
    {
        id: 16, category: "허위조작정보",
        question: "딥페이크가 사회에 미치는 영향은?",
        options: [
            { text: "경제적, 사회적 타격을 줄 수 있어요.", isCorrect: true },
            { text: "영향이 없어요.", isCorrect: false }
        ],
        explanation: "기시다 일본 총리의 외설적 발언 조작 영상이나, 미 국방부 폭발 가짜 사진이 유포되어 주식 시장이 출렁인 사례처럼, 딥페이크는 단순한 장난을 넘어 경제적, 사회적 타격을 줄 수 있어요."
    },
    {
        id: 17, category: "허위조작정보",
        question: "딥페이크를 제작·유포하면 처벌받을 수 있나요?",
        options: [
            { text: "네, 허위 사실이 담긴 가짜 뉴스를 제작·유포하여 명예를 훼손하거나 혼란을 야기하면 형법이나 정보통신망법에 따라 처벌받을 수 있어요.", isCorrect: true },
            { text: "처벌받지 않아요.", isCorrect: false }
        ],
        explanation: "타인에게 피해를 줄 목적이 없었다 해도, 허위 사실이 담긴 가짜 뉴스를 제작·유포하여 명예를 훼손하거나 혼란을 야기하면 형법이나 정보통신망법에 따라 처벌받을 수 있어요."
    },
    {
        id: 18, category: "허위조작정보",
        question: "보이스피싱이 진화한 이유는?",
        options: [
            { text: "생성형 AI가 단 3초 분량의 목소리 샘플만 있어도 특정인의 목소리를 완벽하게 복제할 수 있기 때문이에요.", isCorrect: true },
            { text: "전화기가 좋아져서예요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 단 3초 분량의 목소리 샘플만 있어도 특정인의 목소리를 완벽하게 복제할 수 있어, 이를 악용해 가족의 목소리로 전화를 걸어 돈을 요구하는 신종 보이스피싱이 기승을 부리고 있어요."
    },
    {
        id: 19, category: "허위조작정보",
        question: "AI가 '한국의 현재 대통령은 문재인입니다'라고 답하면?",
        options: [
            { text: "할루시네이션 현상으로, 사실이 아닌 정보를 사실인 양 생성한 것이에요.", isCorrect: true },
            { text: "정확한 정보예요.", isCorrect: false }
        ],
        explanation: "생성형 AI는 거짓 정보를 사실인 양 생성하는 고질적인 문제가 있어요. AI가 생성한 정보가 의심스럽다면 반드시 신뢰할 수 있는 검색 엔진이나 공신력 있는 자료를 통해 진위 여부를 확인해야 해요."
    },
    {
        id: 20, category: "허위조작정보",
        question: "가짜뉴스를 발견했을 때 신고할 수 있는 기관은?",
        options: [
            { text: "한국언론진흥재단, 방송통신심의위원회, 한국인터넷자율정책기구(KISO) 등이 있어요.", isCorrect: true },
            { text: "신고할 곳이 없어요.", isCorrect: false }
        ],
        explanation: "온라인에서 AI로 만든 허위조작정보를 발견했다면 한국언론진흥재단 가짜뉴스 피해 신고·상담센터, 방송통신심의위원회, 한국인터넷자율정책기구(KISO) 가짜뉴스 신고센터에 도움을 요청할 수 있어요."
    },

    // Theme 5: 개인정보·인격권
    {
        id: 21, category: "개인정보",
        question: "챗GPT의 버그로 다른 사용자의 대화 기록이 노출된 사고는?",
        options: [
            { text: "내가 입력한 은밀한 대화나 정보가 타인의 AI 답변을 통해 출력될 가능성을 보여줘요.", isCorrect: true },
            { text: "문제없어요.", isCorrect: false }
        ],
        explanation: "실제로 챗GPT의 버그로 인해 다른 사용자의 대화 기록이나 결제 정보가 노출되는 사고가 발생한 바 있어요. 내가 입력한 은밀한 대화나 정보가 타인의 AI 답변을 통해 출력될 가능성을 배제할 수 없어요."
    },
    {
        id: 22, category: "개인정보",
        question: "삼성전자 등 주요 기업이 챗GPT 사용을 제한하는 이유는?",
        options: [
            { text: "사내 정보 유출을 막기 위해서예요.", isCorrect: true },
            { text: "AI를 싫어해서예요.", isCorrect: false }
        ],
        explanation: "삼성전자 등 국내외 주요 기업들은 사내 정보 유출을 막기 위해 챗GPT 사용을 제한하거나 금지하는 조치를 취하기도 했어요."
    },
    {
        id: 23, category: "개인정보",
        question: "AI가 성소수자 혐오나 인종차별적 발언을 할 때?",
        options: [
            { text: "이를 재미로 소비하거나 유포하지 말고, 해당 서비스에 피드백을 주어 개선되도록 해야 해요.", isCorrect: true },
            { text: "친구들에게 공유해요.", isCorrect: false }
        ],
        explanation: "AI는 인터넷상의 방대한 데이터를 학습하므로, 그 데이터에 포함된 사회적 편향이나 혐오 표현을 그대로 답습할 수 있어요. 이용자는 이를 악용하지 말고 피드백을 주어 개선되도록 해야 해요."
    },
    {
        id: 24, category: "개인정보",
        question: "AI 서비스에서 개인정보를 보호하는 방법은?",
        options: [
            { text: "주민등록번호, 신용카드 번호, 비밀번호 등 식별 가능한 개인정보는 절대 입력하지 않고, 데이터 제어 설정을 활용해요.", isCorrect: true },
            { text: "모든 정보를 입력해도 괜찮아요.", isCorrect: false }
        ],
        explanation: "안전한 사용을 위해 주민등록번호, 여권번호, 신용카드 번호, 비밀번호, 주소, 전화번호 등 식별 가능한 개인정보는 절대 입력하지 마세요. 또한 서비스에서 제공하는 '데이터 제어 설정'을 통해 내 대화가 학습에 쓰이지 않도록 설정할 수 있어요."
    },
    {
        id: 25, category: "개인정보",
        question: "내 얼굴 사진이 포함된 데이터를 AI 기업이 가져가려고 할 때?",
        options: [
            { text: "나에게는 '자기결정권'이 있어서 거부할 수 있어요.", isCorrect: true },
            { text: "기업 마음대로 할 수 있어요.", isCorrect: false }
        ],
        explanation: "동의 없는 생체 정보(얼굴 등) 수집 및 판매는 불법이에요. 우리는 자신의 개인정보가 어떻게 쓰일지 결정할 권리가 있어요."
    },

    // Theme 6: 오남용
    {
        id: 26, category: "오남용",
        question: "AI에만 의존하면 인간의 어떤 능력이 저하되나요?",
        options: [
            { text: "비판적 사고력과 창의적 문제 해결 능력이 약화될 수 있어요.", isCorrect: true },
            { text: "운동 능력이 저하돼요.", isCorrect: false }
        ],
        explanation: "궁금한 것을 스스로 고민하거나 찾아보지 않고 AI에게만 물어보면 비판적 사고력과 창의적 문제 해결 능력이 약화될 수 있어요."
    },
    {
        id: 27, category: "오남용",
        question: "AI 챗봇에 감정적으로 의존하는 것은?",
        options: [
            { text: "AI는 감정을 느끼지 못하며 비밀을 지켜줄 수 없는 기계 알고리즘이므로 위험해요.", isCorrect: true },
            { text: "좋은 일이에요.", isCorrect: false }
        ],
        explanation: "AI 챗봇이 사람처럼 대화한다고 해서 이를 인격체로 착각하거나 지나치게 감정적으로 의존해서는 안 돼요. AI는 감정을 느끼지 못하며 비밀을 지켜줄 수 없는 기계 알고리즘일 뿐이에요."
    },
    {
        id: 28, category: "오남용",
        question: "의료나 법률 상담을 AI에게 받으면?",
        options: [
            { text: "AI의 잘못된 조언을 믿고 투자를 하거나 자가 치료를 하다가 큰 피해를 볼 수 있어요.", isCorrect: true },
            { text: "문제없어요.", isCorrect: false }
        ],
        explanation: "의료, 법률, 금융 등 전문적인 지식이 필요한 영역에서 AI의 조언은 참고만 해야 해요. AI가 의사나 변호사처럼 답변할지라도, 그 내용이 최신 의학 지식이나 현행 법률과 다를 수 있어요."
    },
    {
        id: 29, category: "오남용",
        question: "AI를 올바르게 활용하는 방법은?",
        options: [
            { text: "AI는 도구로 활용하고, AI가 준 초안에 자신의 생각과 통찰을 더해 완성하는 방식이에요.", isCorrect: true },
            { text: "AI가 만든 결과를 그대로 사용해요.", isCorrect: false }
        ],
        explanation: "AI는 인간을 돕는 '도구'일 뿐이에요. 파스칼의 말처럼 '생각하는 갈대'로서 인간의 주체성을 잃지 말고, AI가 준 초안에 자신의 생각과 통찰을 더해 완성하는 방식으로 활용해야 해요."
    },
    {
        id: 30, category: "오남용",
        question: "생성형 AI 활용 체크리스트에 포함되어야 할 항목은?",
        options: [
            { text: "저작권, 권리침해, 명예훼손, 혐오표현, 정보유출, 허위조작정보, 정보편향, 환각현상, 오남용, 창의성 등이에요.", isCorrect: true },
            { text: "체크할 필요 없어요.", isCorrect: false }
        ],
        explanation: "생성형 AI를 사용할 때는 저작권, 권리침해, 명예훼손, 혐오표현, 정보유출, 허위조작정보, 정보편향, 환각현상, 오남용, 창의성 등을 체크하며 윤리적으로 사용해야 해요."
    }
];

