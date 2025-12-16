export const questions = [
    // Theme 1: Digital Etiquette & Copyright (Forest)
    {
        id: 1, category: "Digital Etiquette",
        question: "좋아하는 가수의 목소리를 AI로 흉내 내서, 그 가수가 부른 적 없는 노래의 커버 영상을 만들었어요. 이걸 인터넷에 올려도 될까요?",
        options: [{ text: "네, 재미로 만든 거니까 상관없어요.", isCorrect: false }, { text: "아니요, 목소리 주인(가수)의 허락을 받지 않았다면 올리면 안 돼요.", isCorrect: true }],
        explanation: "AI로 만든 딥페이크 음성이라도, 당사자의 동의 없이 공개하면 '퍼블리시티권' 침해나 명예훼손이 될 수 있어요."
    },
    {
        id: 2, category: "Copyright",
        question: "AI 그림 사이트에서 '반 고흐 스타일'로 그림을 만들었어요. 이 그림을 내가 직접 그렸다고 미술 대회에 내도 될까요?",
        options: [{ text: "네, 내 명령어로 만들었으니 내 작품이에요.", isCorrect: false }, { text: "아니요, AI가 만든 것을 내가 직접 그렸다고 속이면 안 돼요.", isCorrect: true }],
        explanation: "AI 생성물을 자신의 창작물인 것처럼 제출하는 것은 부정행위예요. AI 사용 여부를 밝혀야 해요."
    },
    {
        id: 3, category: "Copyright",
        question: "인터넷에 있는 다른 사람의 그림을 AI에게 학습시켜서 비슷한 그림을 대량으로 만들었어요.",
        options: [{ text: "학습용으로만 썼으니 괜찮아요.", isCorrect: false }, { text: "원작자의 동의 없이 학습시키는 것은 저작권 침해 논란이 있어요.", isCorrect: true }],
        explanation: "타인의 저작물을 허락 없이 AI 학습 데이터로 사용하는 것은 저작권 침해 소지가 있습니다."
    },
    {
        id: 4, category: "Digital Footprint",
        question: "AI 챗봇과 대화한 내용은 영원히 사라질까요?",
        options: [{ text: "네, 창을 닫으면 사라져요.", isCorrect: false }, { text: "아니요, 서버에 기록이 남아 '디지털 발자국'이 될 수 있어요.", isCorrect: true }],
        explanation: "디지털 공간에서의 활동은 기록으로 남을 수 있으므로 신중해야 해요."
    },
    {
        id: 5, category: "Cyberbullying",
        question: "친구의 얼굴을 웃긴 캐릭터와 합성해서 단톡방에 올렸어요.",
        options: [{ text: "친구도 웃을 테니 괜찮아요.", isCorrect: false }, { text: "친구의 동의 없는 합성은 사이버 폭력이 될 수 있어요.", isCorrect: true }],
        explanation: "상대방이 불쾌감을 느낄 수 있는 합성은 디지털 폭력입니다."
    },

    // Theme 2: Privacy (Room)
    {
        id: 6, category: "Privacy",
        question: "AI 챗봇이 내 이름과 학교를 물어봐요. 알려줘도 될까요?",
        options: [{ text: "네, AI는 친구니까 알려줘요.", isCorrect: false }, { text: "아니요, 개인정보는 절대 알려주면 안 돼요.", isCorrect: true }],
        explanation: "AI 서비스에 입력된 개인정보는 유출되거나 학습에 사용될 위험이 있어요."
    },
    {
        id: 7, category: "Privacy",
        question: "내 일기장(비밀 이야기)을 AI에게 분석해달라고 입력했어요.",
        options: [{ text: "AI는 비밀을 지켜줄 거예요.", isCorrect: false }, { text: "사적인 내용은 입력하지 않는 게 좋아요.", isCorrect: true }],
        explanation: "무료 AI 서비스는 입력 데이터를 학습에 활용하는 경우가 많아 사생활이 노출될 수 있어요."
    },
    {
        id: 8, category: "Security",
        question: "AI 앱을 가입할 때 '전체 약관 동의'를 무조건 눌러야 할까요?",
        options: [{ text: "귀찮으니까 그냥 다 동의해요.", isCorrect: false }, { text: "개인정보 수집 항목을 꼼꼼히 확인하고 필수 항목만 동의해요.", isCorrect: true }],
        explanation: "불필요한 개인정보 제공을 막기 위해 약관을 확인하는 습관이 필요해요."
    },
    {
        id: 9, category: "Privacy",
        question: "부모님의 신용카드 번호를 AI 쇼핑 도우미에게 입력했어요.",
        options: [{ text: "편리하니까 괜찮아요.", isCorrect: false }, { text: "금융 정보는 매우 민감한 정보이므로 함부로 입력하면 위험해요.", isCorrect: true }],
        explanation: "금융 정보 유출은 금전적 피해로 이어질 수 있습니다."
    },
    {
        id: 10, category: "Data Protection",
        question: "내 얼굴 사진이 포함된 데이터를 AI 기업이 가져가려고 해요. 나에게 권리가 있을까요?",
        options: [{ text: "기업 마음대로 할 수 있어요.", isCorrect: false }, { text: "나에게는 '자기결정권'이 있어서 거부할 수 있어요.", isCorrect: true }],
        explanation: "우리는 자신의 개인정보가 어떻게 쓰일지 결정할 권리가 있습니다."
    },

    // Theme 3: Bias & Fairness (Library)
    {
        id: 11, category: "Bias",
        question: "AI에게 '의사'를 그려달라고 했더니 남자만 그려요. 왜 그럴까요?",
        options: [{ text: "원래 의사는 남자가 많아서요.", isCorrect: false }, { text: "학습한 데이터에 성별 고정관념(편향)이 들어있기 때문이에요.", isCorrect: true }],
        explanation: "AI는 과거의 데이터 편향까지 그대로 학습할 수 있어 주의가 필요해요."
    },
    {
        id: 12, category: "Fairness",
        question: "AI 면접관이 특정 지역 출신 지원자를 모두 탈락시켰어요. 이것은?",
        options: [{ text: "알고리즘 차별이에요.", isCorrect: true }, { text: "AI의 공정한 판단이에요.", isCorrect: false }],
        explanation: "알고리즘이 특정 집단을 불리하게 대우하는 것은 차별입니다."
    },
    {
        id: 13, category: "Bias",
        question: "AI가 한국 역사에 대해 엉뚱한 대답을 해요. 이유는?",
        options: [{ text: "영어 데이터로 주로 학습해서 한국 문화에 대한 이해가 부족할 수 있어요.", isCorrect: true }, { text: "AI가 한국을 싫어해서 그래요.", isCorrect: false }],
        explanation: "데이터 불균형으로 인해 특정 문화나 언어에 취약할 수 있습니다."
    },
    {
        id: 14, category: "Fairness",
        question: "장애인을 위한 AI 기술이 개발되고 있어요. 이것은 AI의 어떤 점일까요?",
        options: [{ text: "AI의 긍정적인 '포용성'이에요.", isCorrect: true }, { text: "돈 낭비예요.", isCorrect: false }],
        explanation: "AI는 누구나 소외되지 않고 기술의 혜택을 누리도록 돕는 방향으로 발전해야 해요."
    },
    {
        id: 15, category: "Critical Thinking",
        question: "AI의 대답이 항상 중립적이고 공정할까요?",
        options: [{ text: "기계니까 무조건 공정해요.", isCorrect: false }, { text: "만든 사람이나 데이터에 따라 편향될 수 있음을 의심해야 해요.", isCorrect: true }],
        explanation: "AI도 완벽하지 않으므로 비판적으로 받아들이는 태도가 중요해요."
    },

    // Theme 4: Misinformation (Garden)
    {
        id: 16, category: "Hallucination",
        question: "AI가 '세종대왕이 노트북을 던졌다'는 이야기를 사실처럼 말해요. 이 현상은?",
        options: [{ text: "할루시네이션(환각) 현상", isCorrect: true }, { text: "창의적 글쓰기", isCorrect: false }],
        explanation: "AI는 사실이 아닌 것을 사실인 것처럼 그럴듯하게 꾸며내는 '할루시네이션'을 일으킬 수 있어요."
    },
    {
        id: 17, category: "Fact Check",
        question: "유튜브에서 본 충격적인 뉴스를 친구들에게 바로 공유했어요.",
        options: [{ text: "빨리 알려주는 게 좋아요.", isCorrect: false }, { text: "사실인지 확인(팩트체크)하기 전에는 공유하지 않아요.", isCorrect: true }],
        explanation: "허위 정보 확산을 막기 위해 공유 전 확인은 필수입니다."
    },
    {
        id: 18, category: "Misinformation",
        question: "숙제할 때 AI가 찾아준 정보를 그대로 복사해서 제출했어요.",
        options: [{ text: "편하고 좋아요.", isCorrect: false }, { text: "정보가 틀릴 수 있으니 교과서 등으로 교차 검증해야 해요.", isCorrect: true }],
        explanation: "AI 정보의 정확성을 스스로 검증하는 습관을 가져야 해요."
    },
    {
        id: 19, category: "Deepfake News",
        question: "유명인이 하지 않은 말을 하는 영상이 돌고 있어요. 진짜 같아 보여요.",
        options: [{ text: "영상은 조작하기 어려우니 진짜일 거예요.", isCorrect: false }, { text: "딥페이크 기술로 영상도 조작될 수 있음을 알아야 해요.", isCorrect: true }],
        explanation: "눈에 보이는 영상도 AI로 조작되었을 가능성을 염두에 두어야 해요."
    },
    {
        id: 20, category: "Information Literacy",
        question: "AI가 모르는 것을 물어봤을 때 '모른다'고 하지 않고 거짓말을 지어내는 이유는?",
        options: [{ text: "다음 단어를 확률적으로 예측해서 문장을 만들기 때문이에요.", isCorrect: true }, { text: "사용자를 놀리기 위해서예요.", isCorrect: false }],
        explanation: "생성형 AI는 진실을 아는 게 아니라, 가장 그럴듯한 문장을 확률적으로 생성하는 원리입니다."
    },

    // Theme 5: Deepfake & Portrait Rights (City)
    {
        id: 21, category: "Deepfake",
        question: "친구 얼굴을 영화 주인공 몸에 합성하는 앱을 썼어요. 혼자 보고 지우면 될까요?",
        options: [{ text: "유포하지 않아도 타인의 얼굴을 함부로 합성하는 건 윤리적으로 옳지 않아요.", isCorrect: true }, { text: "아무도 안 봤으니 괜찮아요.", isCorrect: false }],
        explanation: "기술을 호기심으로 사용하더라도 타인의 인격을 존중해야 합니다."
    },
    {
        id: 22, category: "Voice Cloning",
        question: "엄마 목소리를 AI로 복제해서 장난전화를 걸었어요.",
        options: [{ text: "가족끼리니 재밌는 장난이에요.", isCorrect: false }, { text: "목소리 도용은 범죄 악용 우려가 있어 매우 위험한 행동이에요.", isCorrect: true }],
        explanation: "AI 보이스 기술은 보이스피싱 등에 악용될 수 있어 장난으로라도 사용해선 안 돼요."
    },
    {
        id: 23, category: "Digital Sex Crime",
        question: "인터넷에 떠도는 딥페이크 음란물을 발견했어요.",
        options: [{ text: "친구들에게 보여준다.", isCorrect: false }, { text: "보지 않고 즉시 신고한다.", isCorrect: true }],
        explanation: "딥페이크 성착취물은 중대한 범죄입니다. 절대 보거나 공유하지 말고 신고해야 해요."
    },
    {
        id: 24, category: "Watermark",
        question: "AI로 만든 이미지에 'AI 생성됨' 표시(워터마크)를 지우고 올렸어요.",
        options: [{ text: "사람들이 더 진짜처럼 봐주니 좋아요.", isCorrect: false }, { text: "AI 생성물임을 숨기는 것은 정보를 왜곡하는 행위예요.", isCorrect: true }],
        explanation: "AI 생성물임을 투명하게 밝히는 것(워터마크)은 디지털 신뢰를 위한 약속입니다."
    },
    {
        id: 25, category: "Portrait Rights",
        question: "길거리에서 찍은 모르는 사람들의 사진을 AI 학습 데이터로 팔았어요.",
        options: [{ text: "초상권 침해예요.", isCorrect: true }, { text: "공공장소니 괜찮아요.", isCorrect: false }],
        explanation: "동의 없는 생체 정보(얼굴 등) 수집 및 판매는 불법입니다."
    },

    // Theme 6: AI Safety & Future (Space)
    {
        id: 26, category: "Safety",
        question: "AI에게 '폭탄 만드는 법'을 알려달라고 계속 물어봤어요.",
        options: [{ text: "알려줄 때까지 시도해본다.", isCorrect: false }, { text: "AI 안전 가이드라인을 위반하는 위험한 질문은 하지 않아요.", isCorrect: true }],
        explanation: "AI를 안전하게 사용하기 위해 유해한 질문을 삼가는 '프롬프트 윤리'가 중요해요."
    },
    {
        id: 27, category: "Responsibility",
        question: "자율주행차가 사고를 냈을 때 책임은 누구에게 있을까요?",
        options: [{ text: "운전자가 없으니 아무도 책임 없어요.", isCorrect: false }, { text: "제조사, 운영자, 사용자 등 인간에게 책임이 있어요.", isCorrect: true }],
        explanation: "AI는 법적 인격체가 아니므로, 결국 인간이 책임을 져야 합니다."
    },
    {
        id: 28, category: "Environment",
        question: "거대 AI를 유지하는 데 엄청난 전기가 든다는 사실, 알고 있나요?",
        options: [{ text: "몰랐어요. 환경을 위해 꼭 필요할 때만 써야겠네요.", isCorrect: true }, { text: "전기는 계속 만들어지니 펑펑 써도 돼요.", isCorrect: false }],
        explanation: "디지털 탄소 발자국을 줄이기 위해 AI를 효율적으로 사용하는 지혜가 필요해요."
    },
    {
        id: 29, category: "Human-AI",
        question: "미래에 AI가 인간의 모든 일을 대신하게 될까요?",
        options: [{ text: "네, 인간은 아무것도 안 해도 돼요.", isCorrect: false }, { text: "AI와 협력하되, 인간 고유의 가치(창의성, 공감)를 키워야 해요.", isCorrect: true }],
        explanation: "AI는 도구일 뿐, 우리의 삶을 주체적으로 이끌어가는 건 우리 자신이에요."
    },
    {
        id: 30, category: "Conclusion",
        question: "마지막 질문! 당신은 어떤 '디지털 시민'이 되고 싶나요?",
        options: [{ text: "AI 힘을 빌려 남을 괴롭히는 악당.", isCorrect: false }, { text: "AI 윤리를 지키며 기술을 선하게 사용하는 히어로!", isCorrect: true }],
        explanation: "축하합니다! 여러분은 이제 진정한 AI 윤리 마스터입니다. 지혜로운 여행을 마친 것을 환영합니다!"
    }
];
