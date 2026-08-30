(() => {
  "use strict";

  const APP_VERSION = "023";
  const DATA_SCHEMA_VERSION = 2;

  const STORAGE = {
    custom: "ewp_custom_words_v1",
    disabled: "ewp_disabled_words_v1",
    history: "ewp_score_history_v1",
    theme: "ewp_theme_v1",
    voice: "ewp_voice_v1",
    wordProgress: "ewp_word_progress_v1",
    learningStats: "ewp_learning_stats_v1",
    achievements: "ewp_achievements_v1",
    sync: "ewp_sync_state_v1"
  };

  const topics = {
    colors: "色",
    numbers: "数字",
    calendar: "カレンダー",
    family: "家族",
    peopleRelations: "人・人間関係",
    stationery: "文房具",
    school: "学校",
    sports: "運動",
    jobs: "職業",
    animals: "動物",
    food: "食べ物",
    body: "からだ",
    nature: "自然",
    weather: "天気・気温",
    feelings: "気持ち・感情",
    directions: "道案内・方向",
    countries: "国名",
    questionWords: "疑問詞・質問表現",
    shapes: "図形",
    shoppingMoney: "買い物・お金",
    mediaEntertainment: "娯楽・メディア",
    leisureEvents: "行事・レジャー",
    generalWords: "基本・汎用語",
    buildings: "建物・場所",
    clothing: "衣服",
    transportation: "交通",
    home: "家・生活",
    dailyActions: "日常動作",
    qualities: "性質・特徴",
    timeFrequency: "時間・頻度",
    positionOrder: "位置・順序",
    other: "その他"
  };

  const BADGE_THRESHOLDS = [5,10,20,40,60,80,100,200,300,400,500];

  const BADGE_TIERS = [
    { material:"bronze", size:"small", label:"ブロンズ・小" },
    { material:"bronze", size:"medium", label:"ブロンズ・中" },
    { material:"bronze", size:"large", label:"ブロンズ・大" },
    { material:"silver", size:"small", label:"シルバー・小" },
    { material:"silver", size:"medium", label:"シルバー・中" },
    { material:"silver", size:"large", label:"シルバー・大" },
    { material:"gold", size:"small", label:"ゴールド・小" },
    { material:"gold", size:"medium", label:"ゴールド・中" },
    { material:"gold", size:"large", label:"ゴールド・大" },
    { material:"platinum", size:"large", label:"プラチナ" },
    { material:"rainbow", size:"large", label:"レインボー" }
  ];

  const BADGE_MESSAGES = {
    sessions: [
      ["5回完走！練習のリズムができ始めたね！","Five sessions done! Your practice rhythm is starting!"],
      ["10回完走！続けることが、もう力になっているよ！","Ten sessions complete! Practice is becoming a habit!"],
      ["20回完走！コツコツ続ける力が育ってきたね！","Twenty sessions! Your steady effort is growing!"],
      ["40回完走！たくさんの練習を積み重ねたね！","Forty sessions! You have built up lots of practice!"],
      ["60回完走！英単語練習がしっかり習慣になってきた！","Sixty sessions! Word practice is becoming a strong habit!"],
      ["80回完走！ここまで続けた集中力がすごい！","Eighty sessions! Great focus and persistence!"],
      ["100回完走！大きな節目を最後まで走り切ったね！","One hundred sessions! You reached a huge milestone!"],
      ["200回完走！積み重ねた時間が大きな自信になるね！","Two hundred sessions! All that practice builds real confidence!"],
      ["300回完走！続ける力はもう立派な特技だね！","Three hundred sessions! Consistency is now your special skill!"],
      ["400回完走！ゴールまでやり切る力が本当に強い！","Four hundred sessions! Your power to finish is amazing!"],
      ["500回完走！ものすごい継続記録を作ったね！","Five hundred sessions! What an incredible practice record!" ]
    ],
    perfect: [
      ["満点5回！ていねいに答える力が光っているよ！","Five perfect scores! Your careful answers are shining!"],
      ["満点10回！正確さがしっかり身についてきたね！","Ten perfect scores! Your accuracy is getting strong!"],
      ["満点20回！知っている単語を確実に答えられているね！","Twenty perfect scores! You can answer known words with confidence!"],
      ["満点40回！最後の1問まで集中できている証拠だね！","Forty perfect scores! You stay focused to the very last question!"],
      ["満点60回！高い正答率を何度も再現できてすごい！","Sixty perfect scores! You can repeat excellent results again and again!"],
      ["満点80回！安定した正確さが大きな強みになっているよ！","Eighty perfect scores! Steady accuracy is now a real strength!"],
      ["満点100回！100回のパーフェクトは圧巻だね！","One hundred perfect scores! That is an amazing achievement!"],
      ["満点200回！ミスなく解き切る力がとても頼もしい！","Two hundred perfect scores! Your mistake-free skill is impressive!"],
      ["満点300回！正確さと集中力、どちらも達人級だね！","Three hundred perfect scores! Your accuracy and focus are expert level!"],
      ["満点400回！パーフェクトを積み上げる力が別格だね！","Four hundred perfect scores! Your perfect-score streak is outstanding!"],
      ["満点500回！まさにパーフェクトマスター！","Five hundred perfect scores! You are a true perfect-score master!" ]
    ],
    reading: [
      ["読み5問正解！英単語を見て意味をつかめたね！","Five reading answers right! You can connect words with meanings!"],
      ["読み10問正解！見た瞬間に分かる単語が増えてきた！","Ten reading answers right! More words are becoming familiar at a glance!"],
      ["読み20問正解！英単語と日本語の結びつきが強くなっているよ！","Twenty reading answers right! Word-meaning connections are getting stronger!"],
      ["読み40問正解！読む力がぐんぐん広がっているね！","Forty reading answers right! Your reading power is growing fast!"],
      ["読み60問正解！たくさんの単語を見分けられるようになった！","Sixty reading answers right! You can recognize many more words now!"],
      ["読み80問正解！意味を思い出す速さも上がってきたね！","Eighty reading answers right! You are recalling meanings faster too!"],
      ["読み100問正解！英単語を読む大きな節目を突破！","One hundred reading answers right! A big reading milestone cleared!"],
      ["読み200問正解！語彙を見て理解する力がかなり育ったね！","Two hundred reading answers right! Your word recognition is very strong!"],
      ["読み300問正解！初見の英語にも向き合える土台ができてきた！","Three hundred reading answers right! You have built a strong reading foundation!"],
      ["読み400問正解！読む力はもうかなりの達人級！","Four hundred reading answers right! Your reading skill is expert level!"],
      ["読み500問正解！たくさんの英単語を読み解いた読解マスター！","Five hundred reading answers right! You are a word-reading master!" ]
    ],
    writing: [
      ["書き5問正解！英単語のつづりを自分で組み立てられたね！","Five writing answers right! You can build English spellings yourself!"],
      ["書き10問正解！文字の並びが少しずつ身についてきた！","Ten writing answers right! Letter patterns are starting to stick!"],
      ["書き20問正解！つづりを思い出す力が育っているよ！","Twenty writing answers right! Your spelling memory is growing!"],
      ["書き40問正解！一文字ずつ確かめる力が強くなってきたね！","Forty writing answers right! Your careful spelling skill is getting stronger!"],
      ["書き60問正解！英単語の形をしっかり覚えられている！","Sixty writing answers right! You are remembering word shapes well!"],
      ["書き80問正解！難しいつづりにも落ち着いて挑戦できているね！","Eighty writing answers right! You can tackle tricky spellings calmly!"],
      ["書き100問正解！100問分のつづり練習を力に変えたね！","One hundred writing answers right! A hundred spellings are now part of your skill!"],
      ["書き200問正解！書いて確かめる力が大きな武器になっているよ！","Two hundred writing answers right! Spelling has become a powerful skill!"],
      ["書き300問正解！文字の並びを見抜く力はもう上級者！","Three hundred writing answers right! Your spelling sense is advanced now!"],
      ["書き400問正解！つづりへの自信がしっかり積み上がったね！","Four hundred writing answers right! Your spelling confidence is very strong!"],
      ["書き500問正解！英単語を形にできるスペリングマスター！","Five hundred writing answers right! You are a true spelling master!" ]
    ],
    listening: [
      ["リスニング5問正解！英語の音から単語を見つけられたね！","Five listening answers right! You can find words from their sounds!"],
      ["リスニング10問正解！耳で聞いた英語が少しずつ分かってきた！","Ten listening answers right! Spoken English is becoming clearer!"],
      ["リスニング20問正解！音とつづりのつながりが育っているよ！","Twenty listening answers right! Sound and spelling are connecting in your mind!"],
      ["リスニング40問正解！英語の音を聞き分ける力が上がってきたね！","Forty listening answers right! Your ear for English is getting sharper!"],
      ["リスニング60問正解！聞こえた単語を落ち着いて選べている！","Sixty listening answers right! You can choose heard words with confidence!"],
      ["リスニング80問正解！耳から覚えた英単語がどんどん増えているね！","Eighty listening answers right! Your sound-based vocabulary keeps growing!"],
      ["リスニング100問正解！100回の聞き取り成功、大きな一歩！","One hundred listening answers right! A hundred successful listens is a big step!"],
      ["リスニング200問正解！英語を聞く経験がしっかり積み上がったね！","Two hundred listening answers right! You have built lots of listening experience!"],
      ["リスニング300問正解！音から単語をつかむ力はもう上級者！","Three hundred listening answers right! Your listening skill is advanced now!"],
      ["リスニング400問正解！聞き取る力がとても頼もしくなった！","Four hundred listening answers right! Your English ear is impressively strong!"],
      ["リスニング500問正解！たくさんの英語を聞き取ったリスニングマスター！","Five hundred listening answers right! You are a true listening master!" ]
    ]
  };

  const presetWords = [
    ["red","赤","colors"],["blue","青","colors"],["yellow","黄色","colors"],["green","緑","colors"],["white","白","colors"],["black","黒","colors"],["pink","桃色","colors"],["orange","オレンジ色","colors"],
    ["one","1、一つ","numbers"],["two","2、二つ","numbers"],["three","3、三つ","numbers"],["four","4、四つ","numbers"],["five","5、五つ","numbers"],["six","6、六つ","numbers"],["seven","7、七つ","numbers"],["eight","8、八つ","numbers"],["nine","9、九つ","numbers"],["ten","10、十","numbers"],
    ["Monday","月曜日","calendar"],["Tuesday","火曜日","calendar"],["Wednesday","水曜日","calendar"],["Thursday","木曜日","calendar"],["Friday","金曜日","calendar"],["Saturday","土曜日","calendar"],["Sunday","日曜日","calendar"],["January","1月","calendar"],["summer","夏","calendar"],["winter","冬","calendar"],
    ["mother","母","family"],["father","父","family"],["sister","姉・妹","family"],["brother","兄・弟","family"],["grandmother","祖母","family"],["grandfather","祖父","family"],["family","家族","family"],
    ["pencil","鉛筆","stationery"],["pen","ペン","stationery"],["eraser","消しゴム","stationery"],["ruler","定規","stationery"],["notebook","ノート","stationery"],["scissors","はさみ","stationery"],["glue","のり","stationery"],["crayon","クレヨン","stationery"],
    ["school","学校","school"],["teacher","先生","school"],["student","生徒","school"],["classroom","教室","school"],["library","図書館","school"],["desk","机","school"],["chair","いす","school"],["book","本","school"],
    ["soccer","サッカー","sports"],["baseball","野球","sports"],["tennis","テニス","sports"],["swimming","水泳","sports"],["running","走ること","sports"],["basketball","バスケットボール","sports"],["volleyball","バレーボール","sports"],
    ["doctor","医師","jobs"],["nurse","看護師","jobs"],["cook","料理人","jobs"],["farmer","農家","jobs"],["pilot","パイロット","jobs"],["firefighter","消防士","jobs"],["police officer","警察官","jobs"],["artist","芸術家","jobs"],
    ["dog","犬","animals"],["cat","猫","animals"],["bird","鳥","animals"],["fish","魚","animals"],["rabbit","うさぎ","animals"],["elephant","象","animals"],["lion","ライオン","animals"],["monkey","猿","animals"],
    ["apple","りんご","food"],["banana","バナナ","food"],["bread","パン","food"],["rice","ご飯","food"],["milk","牛乳","food"],["water","水","food"],["egg","卵","food"],["cake","ケーキ","food"],
    ["head","頭","body"],["hand","手","body"],["foot","足","body"],["eye","目","body"],["ear","耳","body"],["mouth","口","body"],["nose","鼻","body"],
    ["sun","太陽","nature"],["moon","月","nature"],["star","星","nature"],["sky","空","nature"],["rain","雨","nature"],["snow","雪","nature"],["tree","木","nature"],["flower","花","nature"],
    ["February","2月","calendar"],["March","3月","calendar"],["April","4月","calendar"],["May","5月","calendar"],["June","6月","calendar"],["July","7月","calendar"],["August","8月","calendar"],["September","9月","calendar"],["October","10月","calendar"],["November","11月","calendar"],["December","12月","calendar"],
    ["sunny","晴れた","weather"],["cloudy","曇った","weather"],["rainy","雨の","weather"],["snowy","雪の","weather"],["windy","風の強い","weather"],["hot","暑い","weather"],["warm","暖かい","weather"],["cool","涼しい","weather"],["cold","寒い","weather"],["weather","天気","weather"],
    ["glad","嬉しい","feelings"],["happy","幸せな","feelings"],["fun","楽しい","feelings"],["sad","悲しい","feelings"],["angry","怒った","feelings"],["scared","怖い","feelings"],["surprised","驚いた","feelings"],["excited","わくわくした","feelings"],["worried","心配な","feelings"],["tired","疲れた","feelings"],
    ["purple","紫","colors"],
    ["brown","茶色","colors"],
    ["gray","灰色","colors"],
    ["gold","金色","colors"],
    ["silver","銀色","colors"],
    ["beige","ベージュ","colors"],
    ["navy","紺色","colors"],
    ["violet","すみれ色","colors"],
    ["light blue","水色","colors"],
    ["dark blue","濃い青","colors"],
    ["light green","黄緑","colors"],
    ["dark green","濃い緑","colors"],
    ["zero","0、ゼロ","numbers"],
    ["eleven","11、十一","numbers"],
    ["twelve","12、十二","numbers"],
    ["thirteen","13、十三","numbers"],
    ["fourteen","14、十四","numbers"],
    ["fifteen","15、十五","numbers"],
    ["sixteen","16、十六","numbers"],
    ["seventeen","17、十七","numbers"],
    ["eighteen","18、十八","numbers"],
    ["nineteen","19、十九","numbers"],
    ["twenty","20、二十","numbers"],
    ["spring","春","calendar"],
    ["autumn","秋","calendar"],
    ["parent","親","family"],
    ["parents","両親","family"],
    ["son","息子","family"],
    ["daughter","娘","family"],
    ["baby","赤ちゃん","family"],
    ["aunt","おば","family"],
    ["uncle","おじ","family"],
    ["cousin","いとこ","family"],
    ["husband","夫","family"],
    ["wife","妻","family"],
    ["grandson","孫（男の子）","family"],
    ["granddaughter","孫（女の子）","family"],
    ["nephew","おい","family"],
    ["niece","めい","family"],
    ["marker","マーカー","stationery"],
    ["highlighter","蛍光ペン","stationery"],
    ["stapler","ホチキス","stationery"],
    ["tape","テープ","stationery"],
    ["paper","紙","stationery"],
    ["folder","フォルダー","stationery"],
    ["pencil case","筆箱","stationery"],
    ["sharpener","鉛筆削り","stationery"],
    ["calculator","計算機","stationery"],
    ["compass","コンパス","stationery"],
    ["protractor","分度器","stationery"],
    ["sticky note","付箋","stationery"],
    ["principal","校長先生","school"],
    ["lesson","授業","school"],
    ["homework","宿題","school"],
    ["subject","教科","school"],
    ["English","英語","school"],
    ["math","算数","school"],
    ["science","理科","school"],
    ["music","音楽","school"],
    ["art","図工","school"],
    ["P.E.","体育","school"],
    ["test","テスト","school"],
    ["playground","校庭","school"],
    ["golf","ゴルフ","sports"],
    ["badminton","バドミントン","sports"],
    ["rugby","ラグビー","sports"],
    ["gymnastics","体操","sports"],
    ["skiing","スキー","sports"],
    ["skating","スケート","sports"],
    ["cycling","自転車競技","sports"],
    ["surfing","サーフィン","sports"],
    ["karate","空手","sports"],
    ["judo","柔道","sports"],
    ["boxing","ボクシング","sports"],
    ["hockey","ホッケー","sports"],
    ["dodgeball","ドッジボール","sports"],
    ["dentist","歯科医","jobs"],
    ["vet","獣医","jobs"],
    ["scientist","科学者","jobs"],
    ["engineer","技術者","jobs"],
    ["driver","運転手","jobs"],
    ["baker","パン職人","jobs"],
    ["singer","歌手","jobs"],
    ["actor","俳優","jobs"],
    ["writer","作家","jobs"],
    ["photographer","写真家","jobs"],
    ["mechanic","整備士","jobs"],
    ["carpenter","大工","jobs"],
    ["horse","馬","animals"],
    ["cow","牛","animals"],
    ["pig","豚","animals"],
    ["sheep","羊","animals"],
    ["goat","やぎ","animals"],
    ["chicken","にわとり","animals"],
    ["duck","あひる","animals"],
    ["bear","熊","animals"],
    ["tiger","虎","animals"],
    ["giraffe","キリン","animals"],
    ["zebra","シマウマ","animals"],
    ["penguin","ペンギン","animals"],
    ["strawberry","いちご","food"],
    ["grape","ぶどう","food"],
    ["peach","もも","food"],
    ["lemon","レモン","food"],
    ["carrot","にんじん","food"],
    ["tomato","トマト","food"],
    ["potato","じゃがいも","food"],
    ["cheese","チーズ","food"],
    ["soup","スープ","food"],
    ["salad","サラダ","food"],
    ["sandwich","サンドイッチ","food"],
    ["pizza","ピザ","food"],
    ["arm","腕","body"],
    ["leg","脚","body"],
    ["finger","指","body"],
    ["toe","足の指","body"],
    ["hair","髪","body"],
    ["face","顔","body"],
    ["tooth","歯","body"],
    ["neck","首","body"],
    ["shoulder","肩","body"],
    ["knee","ひざ","body"],
    ["elbow","ひじ","body"],
    ["stomach","おなか","body"],
    ["heart","心臓","body"],
    ["mountain","山","nature"],
    ["river","川","nature"],
    ["sea","海","nature"],
    ["ocean","海洋","nature"],
    ["lake","湖","nature"],
    ["forest","森","nature"],
    ["grass","草","nature"],
    ["leaf","葉","nature"],
    ["rock","岩","nature"],
    ["island","島","nature"],
    ["beach","砂浜","leisureEvents"],
    ["field","野原","nature"],
    ["stormy","嵐の","weather"],
    ["foggy","霧の深い","weather"],
    ["humid","蒸し暑い","weather"],
    ["dry","乾燥した","weather"],
    ["wet","ぬれた","weather"],
    ["thunder","雷鳴","weather"],
    ["lightning","稲妻","weather"],
    ["storm","嵐","weather"],
    ["temperature","気温","weather"],
    ["degree","度","weather"],
    ["nervous","緊張した","feelings"],
    ["bored","退屈した","feelings"],
    ["sleepy","眠い","feelings"],
    ["hungry","おなかがすいた","feelings"],
    ["thirsty","のどが渇いた","feelings"],
    ["proud","誇らしい","feelings"],
    ["shy","恥ずかしがりの","feelings"],
    ["lonely","寂しい","feelings"],
    ["relaxed","くつろいだ","feelings"],
    ["confused","困惑した","feelings"],
    ["left","左","directions"],
    ["right","右","directions"],
    ["straight","まっすぐ","directions"],
    ["turn","曲がる","directions"],
    ["north","北","directions"],
    ["south","南","directions"],
    ["east","東","directions"],
    ["west","西","directions"],
    ["near","近く","directions"],
    ["far","遠く","directions"],
    ["corner","角","directions"],
    ["intersection","交差点","directions"],
    ["traffic light","信号","directions"],
    ["crosswalk","横断歩道","directions"],
    ["block","一区画","directions"],
    ["next to","～の隣に","directions"],
    ["between","～の間に","directions"],
    ["in front of","～の前に","directions"],
    ["behind","～の後ろに","directions"],
    ["across from","～の向かいに","directions"],
    ["Japan","日本","countries"],
    ["China","中国","countries"],
    ["South Korea","韓国","countries"],
    ["India","インド","countries"],
    ["Canada","カナダ","countries"],
    ["the United States","アメリカ合衆国","countries"],
    ["Mexico","メキシコ","countries"],
    ["Brazil","ブラジル","countries"],
    ["the United Kingdom","イギリス","countries"],
    ["France","フランス","countries"],
    ["Germany","ドイツ","countries"],
    ["Italy","イタリア","countries"],
    ["Spain","スペイン","countries"],
    ["Egypt","エジプト","countries"],
    ["Kenya","ケニア","countries"],
    ["South Africa","南アフリカ","countries"],
    ["Australia","オーストラリア","countries"],
    ["New Zealand","ニュージーランド","countries"],
    ["Singapore","シンガポール","countries"],
    ["Thailand","タイ","countries"],
    ["what","何","questionWords"],
    ["who","だれ","questionWords"],
    ["where","どこ","questionWords"],
    ["when","いつ","questionWords"],
    ["why","なぜ","questionWords"],
    ["how","どのように","questionWords"],
    ["which","どちら・どれ","questionWords"],
    ["whose","だれの","questionWords"],
    ["how many","いくつ・何個","questionWords"],
    ["how much","いくら・どのくらい","questionWords"],
    ["how old","何歳","questionWords"],
    ["what time","何時","questionWords"],
    ["how often","どのくらいの頻度で","questionWords"],
    ["how long","どのくらい長く","questionWords"],
    ["how far","どのくらい遠く","questionWords"],
    ["how tall","どのくらいの高さ","questionWords"],
    ["what color","何色","questionWords"],
    ["what kind","どんな種類","questionWords"],
    ["what day","何曜日","questionWords"],
    ["what date","何日・何月何日","questionWords"],
    ["hospital","病院","buildings"],
    ["supermarket","スーパーマーケット","shoppingMoney"],
    ["bank","銀行","buildings"],
    ["post office","郵便局","buildings"],
    ["police station","警察署","buildings"],
    ["fire station","消防署","buildings"],
    ["restaurant","レストラン","buildings"],
    ["hotel","ホテル","buildings"],
    ["museum","博物館","buildings"],
    ["airport","空港","buildings"],
    ["bakery","パン屋","buildings"],
    ["pharmacy","薬局","buildings"],
    ["convenience store","コンビニ","shoppingMoney"],
    ["city hall","市役所","buildings"],
    ["movie theater","映画館","mediaEntertainment"],
    ["shopping mall","ショッピングモール","shoppingMoney"],
    ["church","教会","buildings"],
    ["temple","寺","buildings"],
    ["castle","城","buildings"],
    ["stadium","競技場","buildings"],
    ["shirt","シャツ","clothing"],
    ["T-shirt","Tシャツ","clothing"],
    ["pants","ズボン","clothing"],
    ["shorts","半ズボン","clothing"],
    ["skirt","スカート","clothing"],
    ["dress","ワンピース","clothing"],
    ["jacket","ジャケット","clothing"],
    ["coat","コート","clothing"],
    ["sweater","セーター","clothing"],
    ["socks","靴下","clothing"],
    ["shoes","靴","clothing"],
    ["sneakers","スニーカー","clothing"],
    ["boots","ブーツ","clothing"],
    ["hat","帽子","clothing"],
    ["cap","キャップ","clothing"],
    ["gloves","手袋","clothing"],
    ["scarf","マフラー","clothing"],
    ["belt","ベルト","clothing"],
    ["pajamas","パジャマ","clothing"],
    ["uniform","制服","clothing"],
    ["car","車","transportation"],
    ["bus","バス","transportation"],
    ["train","電車","transportation"],
    ["bicycle","自転車","transportation"],
    ["airplane","飛行機","transportation"],
    ["taxi","タクシー","transportation"],
    ["subway","地下鉄","transportation"],
    ["ship","船","transportation"],
    ["boat","ボート","transportation"],
    ["motorcycle","オートバイ","transportation"],
    ["truck","トラック","transportation"],
    ["ambulance","救急車","transportation"],
    ["helicopter","ヘリコプター","transportation"],
    ["ferry","フェリー","transportation"],
    ["van","バン","transportation"],
    ["scooter","スクーター","transportation"],
    ["ticket","切符","transportation"],
    ["road","道路","transportation"],
    ["bridge","橋","transportation"],
    ["bus stop","バス停","transportation"],
    ["room","部屋","home"],
    ["kitchen","台所","home"],
    ["bedroom","寝室","home"],
    ["bathroom","浴室","home"],
    ["living room","居間","home"],
    ["door","ドア","home"],
    ["window","窓","home"],
    ["bed","ベッド","home"],
    ["table","テーブル","home"],
    ["sofa","ソファ","home"],
    ["lamp","ランプ","home"],
    ["clock","時計","home"],
    ["television","テレビ","mediaEntertainment"],
    ["refrigerator","冷蔵庫","home"],
    ["microwave","電子レンジ","home"],
    ["sink","流し台","home"],
    ["shower","シャワー","home"],
    ["towel","タオル","home"],
    ["key","鍵","home"],
    ["garden","庭","home"],
    ["wake up","目を覚ます","dailyActions"],
    ["get up","起きる","dailyActions"],
    ["eat breakfast","朝食を食べる","dailyActions"],
    ["eat lunch","昼食を食べる","dailyActions"],
    ["eat dinner","夕食を食べる","dailyActions"],
    ["take a bath","風呂に入る","dailyActions"],
    ["go home","家に帰る","dailyActions"],
    ["go shopping","買い物に行く","shoppingMoney"],
    ["study","勉強する","dailyActions"],
    ["read","読む","dailyActions"],
    ["write","書く","dailyActions"],
    ["speak","話す","dailyActions"],
    ["listen","聞く","dailyActions"],
    ["sleep","眠る","dailyActions"],
    ["clean","掃除する","dailyActions"],
    ["help","手伝う","dailyActions"],
    ["play","遊ぶ","dailyActions"],
    ["watch","見る","dailyActions"],
    ["open","開ける","dailyActions"],
    ["close","閉める","dailyActions"],
    ["friend","友達","peopleRelations"],
    ["people","人々","peopleRelations"],
    ["person","人","peopleRelations"],
    ["child","子ども","peopleRelations"],
    ["boy","男の子","peopleRelations"],
    ["girl","女の子","peopleRelations"],
    ["man","男性","peopleRelations"],
    ["woman","女性","peopleRelations"],
    ["name","名前","generalWords"],
    ["thing","物","generalWords"],
    ["place","場所","generalWords"],
    ["idea","考え","generalWords"],
    ["problem","問題","generalWords"],
    ["question","質問","questionWords"],
    ["answer","答え","questionWords"],
    ["story","物語","mediaEntertainment"],
    ["picture","絵・写真","mediaEntertainment"],
    ["game","ゲーム","mediaEntertainment"],
    ["party","パーティー","leisureEvents"],
    ["birthday","誕生日","leisureEvents"],
    ["sour","すっぱい","qualities"],
    ["sweet","甘い","qualities"],
    ["salty","塩からい","qualities"],
    ["bitter","苦い","qualities"],
    ["delicious","おいしい","qualities"],
    ["boring","つまらない","qualities"],
    ["interesting","おもしろい","qualities"],
    ["exciting","わくわくする","qualities"],
    ["friendly","親しみやすい","qualities"],
    ["historic","歴史上重要な","qualities"],
    ["mean","いじわるな","qualities"],
    ["kind","親切な","qualities"],
    ["heavy","重い","qualities"],
    ["deep","深い","qualities"],
    ["light","軽い","qualities"],
    ["shallow","浅い","qualities"],
    ["hard","かたい・難しい","qualities"],
    ["fast","速い","qualities"],
    ["slow","遅い","qualities"],
    ["cheerful","陽気な","qualities"],
    ["hardworking","勤勉な","qualities"],
    ["thin","薄い・細い","qualities"],
    ["brave","勇敢な","qualities"],
    ["polite","礼儀正しい","qualities"],
    ["lazy","なまけた","qualities"],
    ["thick","厚い・太い","qualities"],
    ["narrow","せまい","qualities"],
    ["wide","広い","qualities"],
    ["crowded","混雑した","qualities"],
    ["honest","正直な","qualities"],
    ["convenient","便利な","qualities"],
    ["peaceful","静かで穏やかな","qualities"],
    ["difficult","難しい","qualities"],
    ["easy","簡単な","qualities"],
    ["terrible","ひどい","qualities"],
    ["broken","こわれた","qualities"],
    ["popular","人気のある","qualities"],
    ["sharp","とがった","qualities"],
    ["empty","空の","qualities"],
    ["full","いっぱいの","qualities"],
    ["same","同じ","qualities"],
    ["different","違う","qualities"],
    ["striped","しま模様の","qualities"],
    ["checkered","チェック柄の","qualities"],
    ["curly","巻き毛の","qualities"],
    ["long","長い","qualities"],
    ["short","短い","qualities"],
    ["round","丸い","qualities"],
    ["hour","時間","timeFrequency"],
    ["minute","分","timeFrequency"],
    ["morning","朝","timeFrequency"],
    ["afternoon","午後","timeFrequency"],
    ["evening","夕方・晩","timeFrequency"],
    ["noon","正午","timeFrequency"],
    ["today","今日","timeFrequency"],
    ["yesterday","昨日","timeFrequency"],
    ["tomorrow","明日","timeFrequency"],
    ["early","早く・早い","timeFrequency"],
    ["late","遅く・遅い","timeFrequency"],
    ["before","前に","timeFrequency"],
    ["after","後に","timeFrequency"],
    ["ago","～前","timeFrequency"],
    ["week","週","timeFrequency"],
    ["weekend","週末","timeFrequency"],
    ["every","すべての・毎～","timeFrequency"],
    ["always","いつも","timeFrequency"],
    ["usually","たいてい","timeFrequency"],
    ["often","しばしば","timeFrequency"],
    ["sometimes","ときどき","timeFrequency"],
    ["rarely","めったに～ない","timeFrequency"],
    ["never","決して～ない","timeFrequency"],
    ["once","1回","timeFrequency"],
    ["twice","2回","timeFrequency"],
    ["above","～の上に","positionOrder"],
    ["under","～の下に","positionOrder"],
    ["beside","～のそばに","positionOrder"],
    ["around","～のまわりに","positionOrder"],
    ["middle","真ん中","positionOrder"],
    ["top","上部","positionOrder"],
    ["bottom","下部","positionOrder"],
    ["first","最初の・1番目の","positionOrder"],
    ["second","2番目の","positionOrder"],
    ["third","3番目の","positionOrder"],
    ["along","～に沿って","positionOrder"],
    ["across","～を横切って","positionOrder"],
    ["inside","内側に","positionOrder"],
    ["outside","外側に","positionOrder"],
    ["up","上へ","positionOrder"],
    ["down","下へ","positionOrder"],
    ["forward","前へ","positionOrder"],
    ["backwards","後ろへ","positionOrder"],
    ["over","～の上方に","positionOrder"],
    ["below","～の下方に","positionOrder"],
    ["hundred","100、百","numbers"],
    ["thousand","1,000、千","numbers"],
    ["grandparents","祖父母","family"],
    ["relative","親せき","family"],
    ["astronaut","宇宙飛行士","jobs"],
    ["inventor","発明家","jobs"],
    ["politician","政治家","jobs"],
    ["composer","作曲家","jobs"],
    ["painter","画家","jobs"],
    ["clown","ピエロ","jobs"],
    ["detective","探偵","jobs"],
    ["volunteer","ボランティア","jobs"],
    ["store clerk","店員","shoppingMoney"],
    ["author","著者・作家","jobs"],
    ["cave","洞くつ","buildings"],
    ["shrine","神社","buildings"],
    ["art museum","美術館","buildings"],
    ["theater","劇場","buildings"],
    ["amusement park","遊園地","leisureEvents"],
    ["science museum","科学博物館","buildings"],
    ["cafeteria","食堂","buildings"],
    ["gym","体育館","buildings"],
    ["schoolyard","校庭","buildings"],
    ["restroom","お手洗い","buildings"],
    ["science lab","理科室","buildings"],
    ["coffee shop","喫茶店","buildings"],
    ["store","店","shoppingMoney"],
    ["animal shelter","動物保護施設","buildings"],
    ["sandals","サンダル","clothing"],
    ["glasses","めがね","clothing"],
    ["doughnut","ドーナツ","food"],
    ["cookie","クッキー","food"],
    ["coconut","ココナッツ","food"],
    ["apple pie","アップルパイ","food"],
    ["sugar","砂糖","food"],
    ["chest","胸","body"],
    ["back","背中","body"],
    ["pond","池","nature"],
    ["woods","林・森","nature"],
    ["waterfall","滝","nature"],
    ["thorn","とげ","nature"],
    ["alligator","ワニ","animals"],
    ["dinosaur","恐竜","animals"],
    ["insect","昆虫","animals"],
    ["backpack","リュックサック","school"],
    ["letter","手紙","school"],
    ["novel","小説","school"],
    ["concert","コンサート","school"],
    ["speech","スピーチ","school"],
    ["class","授業・クラス","school"],
    ["recess","休み時間","school"],
    ["application form","申込書","school"],
    ["postcard","絵はがき","school"],
    ["collection","コレクション","school"],
    ["couch","ソファ","home"],
    ["shelf","棚","home"],
    ["cup","カップ","home"],
    ["fork","フォーク","home"],
    ["spoon","スプーン","home"],
    ["bowl","ボウル・鉢","home"],
    ["plate","皿","home"],
    ["chopsticks","はし","home"],
    ["drawer","引き出し","home"],
    ["oven","オーブン","home"],
    ["stroller","ベビーカー","transportation"],
    ["flight","飛行","transportation"],
    ["drink","飲む","dailyActions"],
    ["hear","聞こえる","dailyActions"],
    ["sing","歌う","dailyActions"],
    ["eat","食べる","dailyActions"],
    ["cut","切る","dailyActions"],
    ["fold","折る","dailyActions"],
    ["clap","手をたたく","dailyActions"],
    ["throw","投げる","dailyActions"],
    ["hop","ぴょんと跳ぶ","dailyActions"],
    ["scratch","かく","dailyActions"],
    ["send","送る","dailyActions"],
    ["brush","ブラシをかける・みがく","dailyActions"],
    ["feed","えさをやる","dailyActions"],
    ["walk","歩く","dailyActions"],
    ["ride","乗る","dailyActions"],
    ["hold","持つ","dailyActions"],
    ["carry","運ぶ","dailyActions"],
    ["sit","座る","dailyActions"],
    ["stand","立つ","dailyActions"],
    ["talk","話す","dailyActions"],
    ["wait","待つ","dailyActions"],
    ["share","分け合う","dailyActions"],
    ["draw","描く","dailyActions"],
    ["build","建てる・作る","dailyActions"],
    ["break","こわす","dailyActions"],
    ["wash","洗う","dailyActions"],
    ["arrive","着く","dailyActions"],
    ["finish","終える","dailyActions"],
    ["borrow","借りる","dailyActions"],
    ["push","押す","dailyActions"],
    ["make","作る","dailyActions"],
    ["square","正方形","shapes"],
    ["circle","円","shapes"],
    ["triangle","三角形","shapes"],
    ["rectangle","長方形","shapes"],
    ["oval","だ円形","shapes"],
    ["flowerpot","植木鉢","home"],
    ["fountain","噴水","buildings"],
    ["bottle","びん・ボトル","home"],
    ["toy","おもちゃ","leisureEvents"],
    ["present","プレゼント","leisureEvents"],
    ["birthday cake","誕生日ケーキ","leisureEvents"],
    ["party hat","パーティー帽子","leisureEvents"],
    ["phone","電話","mediaEntertainment"],
    ["screen","画面","mediaEntertainment"],
    ["video game","テレビゲーム","mediaEntertainment"],
    ["trip","旅行","leisureEvents"],
    ["sunscreen","日焼け止め","home"],
    ["roof","屋根","home"],
    ["smoke","煙","nature"],
    ["sandcastle","砂の城","leisureEvents"],
    ["roller coaster","ジェットコースター","leisureEvents"],
    ["plan","予定・計画","timeFrequency"],
    ["favorite","お気に入りの","qualities"],
    ["dirty","汚れた","qualities"],
    ["movie","映画","mediaEntertainment"],
    ["turn right","右に曲がる","directions"],
    ["first corner","最初の角","directions"],
    ["on your left","向かって左に","directions"],
    ["something","何か・あるもの","generalWords"],
    ["bright","明るい・輝いている","qualities"],
    ["Earth","地球","nature"],
    ["go around","～の周りを回る","dailyActions"],
    ["player","選手","sports"],
    ["bookstore","本屋","shoppingMoney"],
    ["map","地図","directions"],
    ["schedule","予定表・時間割","school"],
    ["change","変わる・変える","dailyActions"],
    ["arts and crafts","図工・工作","school"],
    ["polka-dot","水玉模様の","qualities"],
    ["dollar","ドル","shoppingMoney"],
    ["neighbor","近所の人","peopleRelations"],
    ["twins","双子","family"],
    ["tall","背が高い","qualities"],
    ["sore throat","のどの痛み","body"],
    ["headache","頭痛","body"],
    ["sign","標識・看板","directions"],
    ["carefully","注意深く","qualities"],
    ["hurt","傷つける・痛む","dailyActions"],
    ["already","もう・すでに","timeFrequency"],
    ["hurry up","急ぐ","dailyActions"],
    ["school bus","スクールバス","transportation"],
    ["enough time","十分な時間","timeFrequency"],
    ["percent off","～パーセント引き","numbers"],
    ["half price","半額","shoppingMoney"],
    ["special sale","特売","shoppingMoney"],
    ["item","商品・品物","shoppingMoney"],
    ["Italian food","イタリア料理","food"],
    ["famous","有名な","qualities"],
    ["town","町","buildings"],
    ["sunset","夕日・日没","nature"],
    ["dinner time","夕食の時間","timeFrequency"],
    ["musician","音楽家","jobs"],
    ["guitar","ギター","school"],
    ["meal","食事","food"],
    ["chef","シェフ","jobs"],
    ["spaghetti","スパゲッティ","food"],
    ["dessert","デザート","food"],
    ["homemade","手作りの","qualities"],
    ["magazine","雑誌","mediaEntertainment"],
    ["decide","決める","dailyActions"],
    ["especially","特に","qualities"],
    ["choose","選ぶ","dailyActions"],
    ["frame","自転車のフレーム","transportation"],
    ["tires","タイヤ","transportation"],
    ["handlebars","自転車のハンドル","transportation"],
    ["baseball team","野球チーム","sports"],
    ["model","型・モデル","generalWords"],
    ["happen","起こる","dailyActions"],
    ["TV program","テレビ番組","mediaEntertainment"],
    ["come in","中に入る","dailyActions"],
    ["station","駅","buildings"],
    ["go straight down","この道をまっすぐ進む","directions"],
    ["pass","手渡す","dailyActions"],
    ["mom","母","family"],
    ["mum","母","family"],
    ["dad","父","family"],
    ["grandma","祖母","family"],
    ["grandpa","祖父","family"],
    ["bunny","うさぎ","animals"],
    ["grey","灰色","colors"],
    ["fall","秋","calendar"],
    ["pencil box","筆箱","stationery"],
    ["maths","算数","school"],
    ["physician","医師","jobs"],
    ["veterinarian","獣医","jobs"],
    ["cinema","映画館","mediaEntertainment"],
    ["trainers","スニーカー","clothing"],
    ["automobile","車","transportation"],
    ["bike","自転車","transportation"],
    ["plane","飛行機","transportation"],
    ["cab","タクシー","transportation"],
    ["TV","テレビ","mediaEntertainment"],
    ["fridge","冷蔵庫","home"],
    ["have breakfast","朝食を食べる","dailyActions"],
    ["have lunch","昼食を食べる","dailyActions"],
    ["have dinner","夕食を食べる","dailyActions"],
    ["tasty","おいしい","qualities"],
    ["courteous","礼儀正しい","qualities"],
    ["well-liked","人気のある","qualities"],
    ["shop assistant","店員","shoppingMoney"],
    ["washroom","お手洗い","buildings"],
    ["cafe","喫茶店","buildings"],
    ["shop","店","shoppingMoney"],
    ["eyeglasses","めがね","clothing"],
    ["donut","ドーナツ","food"],
    ["rucksack","リュックサック","school"],
    ["dish","皿","home"],
    ["telephone","電話","mediaEntertainment"],
    ["unclean","汚れた","qualities"],
    ["film","映画","mediaEntertainment"],
    ["bookshop","本屋","shoppingMoney"],
    ["neighbour","近所の人","peopleRelations"],
    ["well-known","有名な","qualities"],
    ["tyres","タイヤ","transportation"],
    ["television program","テレビ番組","mediaEntertainment"],
    ["mouse","ネズミ","animals"],
    ["snake","ヘビ","animals"],
    ["frog","カエル","animals"],
    ["turtle","カメ","animals"],
    ["panda","パンダ","animals"],
    ["deer","シカ","animals"],
    ["fox","キツネ","animals"],
    ["wolf","オオカミ","animals"],
    ["watermelon","スイカ","food"],
    ["onion","玉ねぎ","food"],
    ["cucumber","きゅうり","food"],
    ["cabbage","キャベツ","food"],
    ["corn","とうもろこし","food"],
    ["beef","牛肉","food"],
    ["pork","豚肉","food"],
    ["wrist","手首","body"],
    ["ankle","足首","body"],
    ["tongue","舌","body"],
    ["lips","唇","body"],
    ["cloud","雲","nature"],
    ["wind","風","nature"],
    ["rainbow","虹","nature"],
    ["jeans","ジーンズ","clothing"],
    ["tie","ネクタイ","clothing"],
    ["blouse","ブラウス","clothing"],
    ["raincoat","レインコート","clothing"],
    ["swimsuit","水着","clothing"],
    ["knife","ナイフ","home"],
    ["washing machine","洗濯機","home"],
    ["dishwasher","食器洗い機","home"],
    ["mirror","鏡","home"],
    ["pillow","枕","home"],
    ["blanket","毛布","home"],
    ["lend","貸す","dailyActions"],
    ["leave","出発する","dailyActions"],
    ["pull","引く","dailyActions"],
    ["learn","学ぶ","dailyActions"],
    ["buy","買う","dailyActions"],
    ["sell","売る","dailyActions"],
    ["soft","柔らかい","qualities"],
    ["dark","暗い","qualities"],
    ["noisy","うるさい","qualities"],
    ["quiet","静かな","qualities"],
    ["cheap","安い","qualities"],
    ["expensive","高価な","qualities"],
    ["money","お金","shoppingMoney"],
    ["price","値段","shoppingMoney"],
    ["cashier","レジ係","shoppingMoney"],
    ["receipt","レシート","shoppingMoney"],
    ["picnic","ピクニック","leisureEvents"],
    ["camping","キャンプ","leisureEvents"],
    ["festival","お祭り","leisureEvents"],
    ["classmate","クラスメート","peopleRelations"],
    ["teammate","チームメート","peopleRelations"],
    ["radio","ラジオ","mediaEntertainment"],
    ["newspaper","新聞","mediaEntertainment"],
    ["comic book","漫画","mediaEntertainment"],
    ["wheel","車輪","transportation"],
    ["pedal","ペダル","transportation"],
    ["brake","ブレーキ","transportation"]
  ].map((w, i) => ({ id:`p${i+1}`, english:w[0], japanese:w[1], topic:w[2], source:"preset" }));

  // v019: 英語表現はすべて独立した単語IDを持つ。
  // 同義語・短縮形・地域差などは「ID同士の関係」として管理し、進捗は各IDで独立させる。
  // forms の先頭は、v018以前に代表語として扱っていた表現。legacyAttached は移行処理にだけ使用する。
  const PRESET_SYNONYM_GROUP_DEFS = [
    { kind:"日常表現", forms:["mother","mom","mum"], legacyAttached:true },
    { kind:"日常表現", forms:["father","dad"], legacyAttached:true },
    { kind:"日常表現", forms:["grandmother","grandma"], legacyAttached:true },
    { kind:"日常表現", forms:["grandfather","grandpa"], legacyAttached:true },
    { kind:"日常表現", forms:["rabbit","bunny"], legacyAttached:true },
    { kind:"つづり違い", forms:["gray","grey"], legacyAttached:true },
    { kind:"地域差", forms:["autumn","fall"], legacyAttached:true },
    { kind:"言い換え", forms:["pencil case","pencil box"], legacyAttached:true },
    { kind:"地域差", forms:["math","maths"], legacyAttached:true },
    { kind:"言い換え", forms:["doctor","physician"], legacyAttached:true },
    { kind:"短縮形", forms:["vet","veterinarian"], legacyAttached:true },
    { kind:"地域差・言い換え", forms:["movie theater","cinema"], legacyAttached:true },
    { kind:"地域差", forms:["sneakers","trainers"], legacyAttached:true },
    { kind:"言い換え", forms:["car","automobile"], legacyAttached:true },
    { kind:"短縮形", forms:["bicycle","bike"], legacyAttached:true },
    { kind:"短縮形", forms:["airplane","plane"], legacyAttached:true },
    { kind:"言い換え", forms:["taxi","cab"], legacyAttached:true },
    { kind:"略語", forms:["television","TV"], legacyAttached:true },
    { kind:"短縮形", forms:["refrigerator","fridge"], legacyAttached:true },
    { kind:"言い換え", forms:["eat breakfast","have breakfast"], legacyAttached:true },
    { kind:"言い換え", forms:["eat lunch","have lunch"], legacyAttached:true },
    { kind:"言い換え", forms:["eat dinner","have dinner"], legacyAttached:true },
    { kind:"同義語", forms:["delicious","tasty"], legacyAttached:true },
    { kind:"同義語", forms:["polite","courteous"], legacyAttached:true },
    { kind:"言い換え", forms:["popular","well-liked"], legacyAttached:true },
    { kind:"地域差・言い換え", forms:["store clerk","shop assistant"], legacyAttached:true },
    { kind:"地域差", forms:["restroom","washroom"], legacyAttached:true },
    { kind:"言い換え", forms:["coffee shop","cafe"], legacyAttached:true },
    { kind:"地域差", forms:["store","shop"], legacyAttached:true },
    { kind:"言い換え", forms:["glasses","eyeglasses"], legacyAttached:true },
    { kind:"つづり違い", forms:["doughnut","donut"], legacyAttached:true },
    { kind:"地域差", forms:["backpack","rucksack"], legacyAttached:true },
    { kind:"近い表現", forms:["plate","dish"], legacyAttached:true },
    { kind:"短縮形", forms:["phone","telephone"], legacyAttached:true },
    { kind:"同義語", forms:["dirty","unclean"], legacyAttached:true },
    { kind:"地域差・言い換え", forms:["movie","film"], legacyAttached:true },
    { kind:"地域差", forms:["bookstore","bookshop"], legacyAttached:true },
    { kind:"つづり違い", forms:["neighbor","neighbour"], legacyAttached:true },
    { kind:"同義語", forms:["famous","well-known"], legacyAttached:true },
    { kind:"つづり違い", forms:["tires","tyres"], legacyAttached:true },
    { kind:"略語・言い換え", forms:["TV program","television program"], legacyAttached:true },
    { kind:"同義語", forms:["sofa","couch"] },
    { kind:"近い表現", forms:["speak","talk"] },
    { kind:"近い表現", forms:["playground","schoolyard"] },
    { kind:"同義語", forms:["next to","beside"] }
  ];

  // 完全な同義語ではないが、四択で同時に出すと意味が近すぎる組み合わせ。
  // これは「同義語あり」表示や同義語マスターには含めず、誤答候補の衝突回避だけに使う。
  const PRESET_CHOICE_CONFLICT_GROUP_DEFS = [
    ["cook","chef"],
    ["writer","author"],
    ["forest","woods"],
    ["hard","difficult"]
  ];

  // v023: 対義語・対になる表現も、同義語とは独立した「単語ID同士の関係」として管理する。
  // strictな対義語に加え、方向・売買・貸借など学習上「対」で覚えやすい語も relation kind を分けて扱う。
  const PRESET_ANTONYM_GROUP_DEFS = [
    { kind:"対になる色", forms:["white","black"] },
    { kind:"対になる季節", forms:["summer","winter"] },
    { kind:"対になる季節", forms:["spring","autumn"] },
    { kind:"対義語", forms:["hot","cold"] },
    { kind:"対義語", forms:["warm","cool"] },
    { kind:"対義語", forms:["happy","sad"] },
    { kind:"方向の対", forms:["left","right"] },
    { kind:"方向の対", forms:["north","south"] },
    { kind:"方向の対", forms:["east","west"] },
    { kind:"対義語", forms:["near","far"] },
    { kind:"対義語", forms:["wet","dry"] },
    { kind:"位置の対", forms:["inside","outside"] },
    { kind:"方向の対", forms:["up","down"] },
    { kind:"方向の対", forms:["forward","backwards"] },
    { kind:"位置の対", forms:["above","below"] },
    { kind:"位置の対", forms:["top","bottom"] },
    { kind:"時間の対", forms:["before","after"] },
    { kind:"時間の対", forms:["early","late"] },
    { kind:"頻度の対", forms:["always","never"] },
    { kind:"対義語", forms:["empty","full"] },
    { kind:"対義語", forms:["same","different"] },
    { kind:"対義語", forms:["long","short"] },
    { kind:"対義語", forms:["heavy","light"] },
    { kind:"対義語", forms:["deep","shallow"] },
    { kind:"対義語", forms:["fast","slow"] },
    { kind:"対義語", forms:["thin","thick"] },
    { kind:"対義語", forms:["narrow","wide"] },
    { kind:"対義語", forms:["difficult","easy"] },
    { kind:"対義語", forms:["hard","soft"] },
    { kind:"対義語", forms:["bright","dark"] },
    { kind:"対義語", forms:["noisy","quiet"] },
    { kind:"対義語", forms:["cheap","expensive"] },
    { kind:"対になる動作", forms:["open","close"] },
    { kind:"対になる動作", forms:["sit","stand"] },
    { kind:"対になる動作", forms:["arrive","leave"] },
    { kind:"対になる動作", forms:["borrow","lend"] },
    { kind:"対になる動作", forms:["push","pull"] },
    { kind:"対になる動作", forms:["buy","sell"] }
  ];

  const presetWordByEnglish = new Map(presetWords.map(word => [word.english.toLowerCase(), word]));
  const presetSynonymGroupById = new Map();
  const synonymGroupMeta = new Map();
  const presetAntonymRelationsById = new Map();
  const choiceGroupById = new Map();

  PRESET_SYNONYM_GROUP_DEFS.forEach((definition, index) => {
    const key = `preset-syn-${index + 1}`;
    const members = definition.forms
      .map(form => presetWordByEnglish.get(form.toLowerCase()))
      .filter(Boolean);
    if (members.length < 2) return;
    synonymGroupMeta.set(key, { kind:definition.kind || "同義語・言い換え" });
    for (const word of members) {
      presetSynonymGroupById.set(word.id, key);
      choiceGroupById.set(word.id, key);
    }
  });

  PRESET_ANTONYM_GROUP_DEFS.forEach((definition, index) => {
    const key = `preset-ant-${index + 1}`;
    const members = definition.forms
      .map(form => presetWordByEnglish.get(form.toLowerCase()))
      .filter(Boolean);
    if (members.length < 2) return;
    for (const word of members) {
      if (!presetAntonymRelationsById.has(word.id)) presetAntonymRelationsById.set(word.id, []);
      presetAntonymRelationsById.get(word.id).push({ key, kind:definition.kind || "対義語" });
    }
  });

  PRESET_CHOICE_CONFLICT_GROUP_DEFS.forEach((forms, index) => {
    const key = `choice-conflict-${index + 1}`;
    for (const form of forms) {
      const word = presetWordByEnglish.get(form.toLowerCase());
      if (word && !choiceGroupById.has(word.id)) choiceGroupById.set(word.id, key);
    }
  });

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  let customWords = load(STORAGE.custom, []);
  let disabledIds = new Set(load(STORAGE.disabled, []));
  let history = load(STORAGE.history, []);
  let wordProgress = load(STORAGE.wordProgress, {});
  let learningStats = load(STORAGE.learningStats, null);
  let achievements = load(STORAGE.achievements, {});
  let syncState = load(STORAGE.sync, null);
  let quiz = null;
  let visibleWordIds = [];
  let lastSettings = null;
  let practiceFlashTimer = null;
  let voicePreviewInProgress = false;
  let wordSort = { key: "topic", direction: "asc" };
  let syncSequence = 0;

  function normalizeSynonyms(value) {
    const source = Array.isArray(value) ? value : [];
    const seen = new Set();
    const result = [];
    for (const raw of source) {
      const text = String(raw || "").trim();
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      result.push(text);
    }
    return result;
  }

  function normalizedWord(word) {
    if (!word || typeof word !== "object") return word;
    if (word.synonymGroup != null) word.synonymGroup = String(word.synonymGroup || "").trim();
    return word;
  }

  function allWords() {
    return [...presetWords, ...customWords].map(normalizedWord);
  }

  function wordForms(word) {
    return word?.english ? [String(word.english).trim()] : [];
  }

  function wordSynonymGroupKey(word) {
    if (!word) return "";
    return presetSynonymGroupById.get(word.id) || String(word.synonymGroup || "").trim();
  }

  function synonymRelationKind(word) {
    const group = wordSynonymGroupKey(word);
    if (!group) return "";
    return synonymGroupMeta.get(group)?.kind || String(word.synonymKind || "同義語・言い換え");
  }

  function linkedSynonymWords(word) {
    const group = wordSynonymGroupKey(word);
    if (!group) return [];
    return allWords().filter(other => other.id !== word.id && wordSynonymGroupKey(other) === group);
  }

  function synonymFormsForDisplay(word) {
    return linkedSynonymWords(word).map(other => other.english);
  }

  function hasSynonyms(word) {
    return linkedSynonymWords(word).length > 0;
  }

  function antonymRelations(word) {
    if (!word) return [];
    return presetAntonymRelationsById.get(word.id) || [];
  }

  function linkedAntonymWords(word) {
    const relations = antonymRelations(word);
    if (!relations.length) return [];
    const keys = new Set(relations.map(relation => relation.key));
    const seen = new Set();
    const result = [];
    for (const other of allWords()) {
      if (other.id === word.id) continue;
      const otherRelations = antonymRelations(other);
      if (!otherRelations.some(relation => keys.has(relation.key))) continue;
      if (seen.has(other.id)) continue;
      seen.add(other.id);
      result.push(other);
    }
    return result;
  }

  function antonymFormsForDisplay(word) {
    return linkedAntonymWords(word).map(other => other.english);
  }

  function antonymRelationKinds(word) {
    return [...new Set(antonymRelations(word).map(relation => relation.kind).filter(Boolean))];
  }

  function hasAntonyms(word) {
    return linkedAntonymWords(word).length > 0;
  }

  function normalizedJapanese(word) {
    return String(word.japanese || "").trim().toLowerCase();
  }

  function wordConceptKey(word) {
    const synonymGroup = wordSynonymGroupKey(word);
    if (synonymGroup) return `syn:${synonymGroup}`;
    const explicit = choiceGroupById.get(word.id);
    return explicit || `ja:${normalizedJapanese(word)}`;
  }

  function wordsConflict(a, b) {
    if (!a || !b) return false;
    if (a.id === b.id) return true;
    if (wordConceptKey(a) === wordConceptKey(b)) return true;
    return String(a.english || "").trim().toLowerCase() === String(b.english || "").trim().toLowerCase();
  }

  function randomWordForm(word) {
    return word.english;
  }

  function uniqueConceptCount(words) {
    return new Set(words.map(wordConceptKey)).size;
  }

  function safeDistractorWords(target, pool, count = 3) {
    const candidates = shuffle(pool.filter(word => !wordsConflict(target, word)));
    const result = [];
    const concepts = new Set([wordConceptKey(target)]);
    for (const word of candidates) {
      const key = wordConceptKey(word);
      if (concepts.has(key)) continue;
      concepts.add(key);
      result.push(word);
      if (result.length >= count) break;
    }
    return result;
  }

  function englishChoicesFor(target, targetForm, pool) {
    const choices = [targetForm];
    const seen = new Set([String(targetForm).toLowerCase()]);
    for (const word of safeDistractorWords(target, pool, 3)) {
      let forms = shuffle(wordForms(word));
      const form = forms.find(value => !seen.has(value.toLowerCase()));
      if (!form) continue;
      choices.push(form);
      seen.add(form.toLowerCase());
    }
    return shuffle(choices);
  }

  function japaneseChoicesFor(target, pool) {
    const choices = [target.japanese];
    const seen = new Set([normalizedJapanese(target)]);
    for (const word of safeDistractorWords(target, pool, 3)) {
      const key = normalizedJapanese(word);
      if (!key || seen.has(key)) continue;
      choices.push(word.japanese);
      seen.add(key);
    }
    return shuffle(choices);
  }

  function defaultWordProgress() {
    return {
      attempts: 0,
      correct: 0,
      wrong: 0,
      review: false,
      reviewCorrectStreak: 0,
      firstAttemptedAt: "",
      lastAttemptedAt: ""
    };
  }

  function getWordProgress(id) {
    const saved = wordProgress[id];
    return saved ? { ...defaultWordProgress(), ...saved } : defaultWordProgress();
  }

  function saveWordProgress(id, progress) {
    wordProgress[id] = progress;
    save(STORAGE.wordProgress, wordProgress);
  }

  function updateWordProgress(id, isCorrect) {
    const before = getWordProgress(id);
    const now = new Date().toISOString();
    const source = currentSyncSource();
    const entry = normalizeSyncWordEntry(source.words[id]);

    entry.attempts += 1;
    if (isCorrect) entry.correct += 1;
    else entry.wrong += 1;
    if (!entry.firstAttemptedAt) entry.firstAttemptedAt = now;
    entry.lastAttemptedAt = now;
    entry.forms = {};

    entry.recentAnswers.push({
      id: uniqueSyncId("a"),
      at: now,
      correct: Boolean(isCorrect)
    });
    entry.recentAnswers = dedupeRecentAnswers(entry.recentAnswers).slice(-3);
    source.words[id] = entry;
    save(STORAGE.sync, syncState);

    const progress = buildMergedWordProgress(id);
    saveWordProgress(id, progress);

    return {
      progress,
      reviewAdded: !before.review && progress.review,
      reviewCleared: before.review && !progress.review,
      reviewPending: progress.review && isCorrect
    };
  }

  function isReviewTarget(word) {
    return getWordProgress(word.id).review;
  }

  function isUntriedWord(word) {
    return getWordProgress(word.id).attempts === 0;
  }

  function wordLearningStatus(word) {
    const progress = getWordProgress(word.id);

    if (progress.review) {
      return {
        type: "review",
        label: progress.reviewCorrectStreak
          ? `復習 ${progress.reviewCorrectStreak}/2`
          : "復習対象"
      };
    }

    if (progress.attempts === 0) {
      return { type: "untried", label: "未挑戦" };
    }

    return { type: "attempted", label: `挑戦済 ${progress.attempts}回` };
  }

  function defaultLearningStats() {
    return {
      completedSessions: 0,
      perfectSessions: 0,
      correct: {
        reading: 0,
        writing: 0,
        listening: 0
      },
      migratedFromHistory: false
    };
  }

  function safeCount(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  function generateDeviceId() {
    const random = Math.random().toString(36).slice(2, 10);
    return `d${Date.now()}_${random}`;
  }

  function uniqueSyncId(prefix) {
    const device = syncState?.deviceId || "device";
    syncSequence += 1;
    return `${prefix}${Date.now()}_${String(syncSequence).padStart(6, "0")}_${device}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function defaultSyncSource(createdAt = new Date().toISOString()) {
    return {
      createdAt,
      sessions: {
        completedSessions: 0,
        perfectSessions: 0,
        correct: { reading: 0, writing: 0, listening: 0 }
      },
      words: {}
    };
  }

  function normalizeSyncSessions(value) {
    const v = value || {};
    return {
      completedSessions: safeCount(v.completedSessions),
      perfectSessions: safeCount(v.perfectSessions),
      correct: {
        reading: safeCount(v.correct?.reading),
        writing: safeCount(v.correct?.writing),
        listening: safeCount(v.correct?.listening)
      }
    };
  }

  function normalizeFormKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeSyncFormEntry(value) {
    const v = value || {};
    return {
      attempts: safeCount(v.attempts),
      correct: safeCount(v.correct),
      wrong: safeCount(v.wrong),
      firstAttemptedAt: typeof v.firstAttemptedAt === "string" ? v.firstAttemptedAt : "",
      lastAttemptedAt: typeof v.lastAttemptedAt === "string" ? v.lastAttemptedAt : ""
    };
  }

  function normalizeSyncWordEntry(value) {
    const v = value || {};
    const forms = {};
    if (v.forms && typeof v.forms === "object" && !Array.isArray(v.forms)) {
      for (const [form, raw] of Object.entries(v.forms)) {
        const key = normalizeFormKey(form);
        if (key) forms[key] = normalizeSyncFormEntry(raw);
      }
    }
    return {
      attempts: safeCount(v.attempts),
      correct: safeCount(v.correct),
      wrong: safeCount(v.wrong),
      firstAttemptedAt: typeof v.firstAttemptedAt === "string" ? v.firstAttemptedAt : "",
      lastAttemptedAt: typeof v.lastAttemptedAt === "string" ? v.lastAttemptedAt : "",
      forms,
      baseline: v.baseline && typeof v.baseline === "object" ? {
        at: typeof v.baseline.at === "string" ? v.baseline.at : "",
        review: Boolean(v.baseline.review),
        reviewCorrectStreak: Math.min(1, safeCount(v.baseline.reviewCorrectStreak))
      } : null,
      recentAnswers: Array.isArray(v.recentAnswers) ? v.recentAnswers
        .filter(x => x && typeof x.id === "string" && typeof x.at === "string")
        .map(x => ({ id:x.id, at:x.at, correct:Boolean(x.correct) })) : []
    };
  }

  function normalizeSyncSource(value) {
    const v = value || {};
    const words = {};
    if (v.words && typeof v.words === "object" && !Array.isArray(v.words)) {
      for (const [id, entry] of Object.entries(v.words)) words[id] = normalizeSyncWordEntry(entry);
    }
    return {
      createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString(),
      sessions: normalizeSyncSessions(v.sessions),
      words
    };
  }

  function generateCustomWordId(prefix = "c") {
    return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function legacyPresetSplitMappings() {
    const mappings = [];
    for (const definition of PRESET_SYNONYM_GROUP_DEFS) {
      if (!definition.legacyAttached || definition.forms.length < 2) continue;
      const parent = presetWordByEnglish.get(definition.forms[0].toLowerCase());
      if (!parent) continue;
      for (const form of definition.forms.slice(1)) {
        const child = presetWordByEnglish.get(form.toLowerCase());
        if (child) mappings.push({ parentId:parent.id, parentEnglish:parent.english, childId:child.id, form:child.english });
      }
    }
    return mappings;
  }

  function migrateLegacyCustomSynonyms() {
    const mappings = [];
    const registered = new Map();
    for (const word of [...presetWords, ...customWords]) {
      if (word?.english) registered.set(String(word.english).trim().toLowerCase(), word);
    }
    const additions = [];

    for (const word of customWords) {
      const legacyForms = normalizeSynonyms(word?.synonyms);
      if (!legacyForms.length) {
        delete word.synonyms;
        continue;
      }
      const group = String(word.synonymGroup || `custom-syn-${word.id}`).trim();
      word.synonymGroup = group;
      word.synonymKind = word.synonymKind || "同義語・言い換え";

      legacyForms.forEach((form, index) => {
        const key = form.toLowerCase();
        let child = registered.get(key);
        if (!child) {
          let id = `${word.id}_syn${index + 1}`;
          if (customWords.some(item => item.id === id) || additions.some(item => item.id === id)) id = generateCustomWordId("cs");
          child = {
            id,
            english:form,
            japanese:word.japanese,
            topic:word.topic,
            source:"custom",
            synonymGroup:group,
            synonymKind:word.synonymKind
          };
          additions.push(child);
          registered.set(key, child);
        } else if (child.source === "custom" && !child.synonymGroup) {
          child.synonymGroup = group;
          child.synonymKind = word.synonymKind;
        }
        mappings.push({ parentId:word.id, parentEnglish:word.english, childId:child.id, form });
        if (disabledIds.has(word.id)) disabledIds.add(child.id);
      });
      delete word.synonyms;
    }

    if (additions.length) customWords.push(...additions);
    return mappings;
  }

  function initializeSyncDataFromCurrentState() {
    if (syncState && typeof syncState === "object" && !Array.isArray(syncState)
        && syncState.sources && typeof syncState.sources === "object"
        && typeof syncState.deviceId === "string") {
      const normalized = {};
      for (const [id, source] of Object.entries(syncState.sources)) normalized[id] = normalizeSyncSource(source);
      syncState = {
        schemaVersion: Number(syncState.schemaVersion) || 1,
        deviceId: syncState.deviceId,
        sources: normalized
      };
      if (!syncState.sources[syncState.deviceId]) syncState.sources[syncState.deviceId] = defaultSyncSource();
      save(STORAGE.sync, syncState);
      return;
    }

    const deviceId = generateDeviceId();
    const capturedAt = new Date().toISOString();
    const source = defaultSyncSource(capturedAt);
    source.sessions = normalizeSyncSessions(learningStats);

    for (const [id, raw] of Object.entries(wordProgress || {})) {
      const progress = { ...defaultWordProgress(), ...(raw || {}) };
      if (safeCount(progress.attempts) === 0) continue;
      source.words[id] = {
        attempts: safeCount(progress.attempts),
        correct: safeCount(progress.correct),
        wrong: safeCount(progress.wrong),
        firstAttemptedAt: progress.firstAttemptedAt || "",
        lastAttemptedAt: progress.lastAttemptedAt || "",
        forms: {},
        baseline: {
          at: progress.lastAttemptedAt || progress.firstAttemptedAt || capturedAt,
          review: Boolean(progress.review),
          reviewCorrectStreak: Math.min(1, safeCount(progress.reviewCorrectStreak))
        },
        recentAnswers: []
      };
    }

    syncState = { schemaVersion: DATA_SCHEMA_VERSION, deviceId, sources: { [deviceId]: source } };
    save(STORAGE.sync, syncState);
  }

  function currentSyncSource() {
    if (!syncState || typeof syncState !== "object" || !syncState.deviceId) {
      initializeSyncDataFromCurrentState();
    }
    if (!syncState.sources[syncState.deviceId]) syncState.sources[syncState.deviceId] = defaultSyncSource();
    return syncState.sources[syncState.deviceId];
  }

  function splitLegacyEntriesInSource(source, mappings) {
    const byParent = new Map();
    for (const mapping of mappings) {
      if (!byParent.has(mapping.parentId)) byParent.set(mapping.parentId, []);
      byParent.get(mapping.parentId).push(mapping);
    }

    for (const [parentId, children] of byParent.entries()) {
      if (!source.words?.[parentId]) continue;
      const original = normalizeSyncWordEntry(source.words[parentId]);
      const parentEnglish = children[0]?.parentEnglish || "";
      const canonical = normalizeSyncFormEntry(original.forms[normalizeFormKey(parentEnglish)]);
      const tracked = Object.values(original.forms).map(normalizeSyncFormEntry);
      const trackedAttempts = tracked.reduce((sum, item) => sum + item.attempts, 0);
      const trackedCorrect = tracked.reduce((sum, item) => sum + item.correct, 0);
      const trackedWrong = tracked.reduce((sum, item) => sum + item.wrong, 0);
      const legacyAttempts = Math.max(0, original.attempts - trackedAttempts);
      const legacyCorrect = Math.max(0, original.correct - trackedCorrect);
      const legacyWrong = Math.max(0, original.wrong - trackedWrong);

      source.words[parentId] = {
        ...original,
        attempts: legacyAttempts + canonical.attempts,
        correct: legacyCorrect + canonical.correct,
        wrong: legacyWrong + canonical.wrong,
        forms: {}
      };

      for (const child of children) {
        const formEntry = normalizeSyncFormEntry(original.forms[normalizeFormKey(child.form)]);
        if (!formEntry.attempts) continue;
        const childEntry = {
          attempts: formEntry.attempts,
          correct: formEntry.correct,
          wrong: formEntry.wrong,
          firstAttemptedAt: formEntry.firstAttemptedAt,
          lastAttemptedAt: formEntry.lastAttemptedAt,
          forms: {},
          baseline: null,
          recentAnswers: []
        };
        source.words[child.childId] = source.words[child.childId]
          ? mergeSameSourceWord(source.words[child.childId], childEntry)
          : childEntry;
      }
    }
    return source;
  }

  function migrateLegacySyncToIndependentWords(mappings) {
    if (!syncState || (Number(syncState.schemaVersion) || 1) >= DATA_SCHEMA_VERSION) return;
    for (const source of Object.values(syncState.sources || {})) splitLegacyEntriesInSource(source, mappings);
    for (const mapping of mappings) {
      if (disabledIds.has(mapping.parentId)) disabledIds.add(mapping.childId);
    }
    syncState.schemaVersion = DATA_SCHEMA_VERSION;
    save(STORAGE.sync, syncState);
    save(STORAGE.disabled, [...disabledIds]);
  }

  function dedupeRecentAnswers(items) {
    const map = new Map();
    for (const item of items || []) {
      if (!item || typeof item.id !== "string" || typeof item.at !== "string") continue;
      if (!map.has(item.id)) map.set(item.id, { id:item.id, at:item.at, correct:Boolean(item.correct) });
    }
    return [...map.values()].sort((a,b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
  }

  function applyReviewAnswer(state, isCorrect) {
    if (isCorrect) {
      if (state.review) {
        state.reviewCorrectStreak += 1;
        if (state.reviewCorrectStreak >= 2) {
          state.review = false;
          state.reviewCorrectStreak = 0;
        }
      } else {
        state.reviewCorrectStreak = 0;
      }
    } else {
      state.review = true;
      state.reviewCorrectStreak = 0;
    }
  }

  function buildMergedWordProgress(id) {
    const result = defaultWordProgress();
    let latestBaseline = null;
    let recent = [];

    for (const source of Object.values(syncState?.sources || {})) {
      const entry = source?.words?.[id];
      if (!entry) continue;
      const normalized = normalizeSyncWordEntry(entry);
      result.attempts += normalized.attempts;
      result.correct += normalized.correct;
      result.wrong += normalized.wrong;
      if (normalized.firstAttemptedAt && (!result.firstAttemptedAt || normalized.firstAttemptedAt < result.firstAttemptedAt)) {
        result.firstAttemptedAt = normalized.firstAttemptedAt;
      }
      if (normalized.lastAttemptedAt && (!result.lastAttemptedAt || normalized.lastAttemptedAt > result.lastAttemptedAt)) {
        result.lastAttemptedAt = normalized.lastAttemptedAt;
      }
      if (normalized.baseline?.at && (!latestBaseline || normalized.baseline.at > latestBaseline.at)) {
        latestBaseline = normalized.baseline;
      }
      recent.push(...normalized.recentAnswers);
    }

    const state = {
      review: Boolean(latestBaseline?.review),
      reviewCorrectStreak: Math.min(1, safeCount(latestBaseline?.reviewCorrectStreak))
    };
    const baselineAt = latestBaseline?.at || "";
    recent = dedupeRecentAnswers(recent);
    for (const event of recent) {
      if (baselineAt && event.at <= baselineAt) continue;
      applyReviewAnswer(state, event.correct);
    }
    result.review = state.review;
    result.reviewCorrectStreak = state.reviewCorrectStreak;
    return result;
  }

  function rebuildWordProgressFromSync() {
    const ids = new Set();
    for (const source of Object.values(syncState?.sources || {})) {
      Object.keys(source?.words || {}).forEach(id => ids.add(id));
    }
    wordProgress = {};
    ids.forEach(id => {
      const progress = buildMergedWordProgress(id);
      if (progress.attempts > 0) wordProgress[id] = progress;
    });
    save(STORAGE.wordProgress, wordProgress);
  }

  function rebuildLearningStatsFromSync() {
    const next = defaultLearningStats();
    next.migratedFromHistory = true;
    for (const source of Object.values(syncState?.sources || {})) {
      const sessions = normalizeSyncSessions(source?.sessions);
      next.completedSessions += sessions.completedSessions;
      next.perfectSessions += sessions.perfectSessions;
      for (const mode of ["reading","writing","listening"]) next.correct[mode] += sessions.correct[mode];
    }
    learningStats = next;
    save(STORAGE.learningStats, learningStats);
  }

  function rebuildLearningCachesFromSync() {
    rebuildWordProgressFromSync();
    rebuildLearningStatsFromSync();
  }

  function initializeLearningData() {
    if (!wordProgress || typeof wordProgress !== "object" || Array.isArray(wordProgress)) {
      wordProgress = {};
      save(STORAGE.wordProgress, wordProgress);
    }

    if (!achievements || typeof achievements !== "object" || Array.isArray(achievements)) {
      achievements = {};
      save(STORAGE.achievements, achievements);
    }

    const defaults = defaultLearningStats();
    learningStats = {
      ...defaults,
      ...(learningStats || {}),
      correct: {
        ...defaults.correct,
        ...((learningStats && learningStats.correct) || {})
      }
    };

    if (!learningStats.migratedFromHistory) {
      learningStats.completedSessions = history.length;
      learningStats.perfectSessions = history.filter(item => Number(item.percent) === 100).length;

      for (const item of history) {
        const detail = item.detail || {};
        for (const mode of ["reading","writing","listening"]) {
          learningStats.correct[mode] += Number(detail[mode]?.[0] || 0);
        }
      }

      learningStats.migratedFromHistory = true;
      save(STORAGE.learningStats, learningStats);
    }

    const legacyCustomMappings = migrateLegacyCustomSynonyms();
    if (legacyCustomMappings.length) save(STORAGE.custom, customWords);

    initializeSyncDataFromCurrentState();
    migrateLegacySyncToIndependentWords([
      ...legacyPresetSplitMappings(),
      ...legacyCustomMappings
    ]);
    rebuildLearningCachesFromSync();
    evaluateAchievements(false);
  }

  function achievementSeriesDefinitions() {
    return [
      {
        key: "sessions",
        title: "チャレンジ回数",
        short: "チャレンジ",
        value: () => Number(learningStats.completedSessions || 0),
        condition: threshold => `練習を${threshold}回、最後まで完了する`
      },
      {
        key: "perfect",
        title: "100%正解回数",
        short: "パーフェクト",
        value: () => Number(learningStats.perfectSessions || 0),
        condition: threshold => `100%正解を${threshold}回達成する`
      },
      {
        key: "reading",
        title: "読み・累計正解",
        short: "読み名人",
        value: () => Number(learningStats.correct.reading || 0),
        condition: threshold => `読み問題で累計${threshold}問正解する`
      },
      {
        key: "writing",
        title: "書き・累計正解",
        short: "書き名人",
        value: () => Number(learningStats.correct.writing || 0),
        condition: threshold => `書き問題で累計${threshold}問正解する`
      },
      {
        key: "listening",
        title: "リスニング・累計正解",
        short: "リスニング名人",
        value: () => Number(learningStats.correct.listening || 0),
        condition: threshold => `リスニング問題で累計${threshold}問正解する`
      }
    ];
  }

  function synonymAchievementProgress() {
    const words = allWords().filter(hasSynonyms);
    const attemptedWords = words.filter(word => !isUntriedWord(word)).length;
    const reviewWords = words.filter(isReviewTarget).length;
    const groups = new Set(words.map(wordSynonymGroupKey).filter(Boolean));

    return {
      totalWords: words.length,
      attemptedWords,
      reviewWords,
      totalGroups: groups.size,
      complete: words.length > 0
        && attemptedWords === words.length
        && reviewWords === 0
    };
  }

  function antonymAchievementProgress() {
    const words = allWords().filter(hasAntonyms);
    const attemptedWords = words.filter(word => !isUntriedWord(word)).length;
    const reviewWords = words.filter(isReviewTarget).length;
    const groups = new Set();
    words.forEach(word => antonymRelations(word).forEach(relation => groups.add(relation.key)));

    return {
      totalWords: words.length,
      attemptedWords,
      reviewWords,
      totalGroups: groups.size,
      complete: words.length > 0
        && attemptedWords === words.length
        && reviewWords === 0
    };
  }

  function secretAchievementProgress() {
    const words = allWords();
    const attempted = words.filter(word => !isUntriedWord(word)).length;
    const review = words.filter(isReviewTarget).length;

    return {
      total: words.length,
      attempted,
      review,
      complete: words.length > 0 && attempted === words.length && review === 0
    };
  }

  function evaluateAchievements(announce = true) {
    const newlyUnlocked = [];
    const now = new Date().toISOString();

    for (const series of achievementSeriesDefinitions()) {
      const value = series.value();

      BADGE_THRESHOLDS.forEach((threshold, index) => {
        const id = `${series.key}_${threshold}`;

        if (value >= threshold && !achievements[id]) {
          achievements[id] = now;
          newlyUnlocked.push({
            id,
            title: `${series.short} ${threshold}`,
            tier: BADGE_TIERS[index],
            secret: false
          });
        }
      });
    }

    const synonymSecret = synonymAchievementProgress();
    if (synonymSecret.complete && !achievements.secret_synonym_master) {
      achievements.secret_synonym_master = now;
      newlyUnlocked.push({
        id: "secret_synonym_master",
        title: "同義語マスター",
        tier: { material:"blue", size:"large", label:"シークレット" },
        secret: true
      });
    }

    const antonymSecret = antonymAchievementProgress();
    if (antonymSecret.complete && !achievements.secret_antonym_master) {
      achievements.secret_antonym_master = now;
      newlyUnlocked.push({
        id: "secret_antonym_master",
        title: "対義語マスター",
        tier: { material:"coral", size:"large", label:"シークレット" },
        secret: true
      });
    }

    const secret = secretAchievementProgress();
    if (secret.complete && !achievements.secret_all_clear) {
      achievements.secret_all_clear = now;
      newlyUnlocked.push({
        id: "secret_all_clear",
        title: "オールクリア",
        tier: { material:"rainbow", size:"large", label:"シークレット" },
        secret: true
      });
    }

    if (newlyUnlocked.length) {
      save(STORAGE.achievements, achievements);
    }

    return announce ? newlyUnlocked : [];
  }

  function updateLearningStatsFromQuiz(percent) {
    const source = currentSyncSource();
    source.sessions = normalizeSyncSessions(source.sessions);
    source.sessions.completedSessions += 1;
    if (percent === 100) source.sessions.perfectSessions += 1;
    for (const mode of ["reading","writing","listening"]) {
      source.sessions.correct[mode] += Number(quiz.detail[mode]?.[0] || 0);
    }
    save(STORAGE.sync, syncState);
    rebuildLearningStatsFromSync();
  }

  function badgeVisual(tier, locked = false) {
    const classes = [
      "badge-medal",
      `badge-${tier.material}`,
      `badge-size-${tier.size}`,
      locked ? "locked" : ""
    ].filter(Boolean).join(" ");

    return `<span class="${classes}" aria-hidden="true"></span>`;
  }

  function synonymSecretBadgeVisual(locked = false) {
    return `
      <span class="secret-double-badge" aria-hidden="true">
        ${badgeVisual({ material:"blue", size:"large", label:"シークレット" }, locked)}
        ${badgeVisual({ material:"blue-deep", size:"large", label:"シークレット" }, locked)}
      </span>
    `;
  }

  function antonymSecretBadgeVisual(locked = false) {
    return `
      <span class="secret-double-badge secret-opposite-badge" aria-hidden="true">
        ${badgeVisual({ material:"coral", size:"large", label:"シークレット" }, locked)}
        ${badgeVisual({ material:"teal", size:"large", label:"シークレット" }, locked)}
      </span>
    `;
  }

  function renderBadges() {
    const summary = $("#achievementSummary");
    const headerProgress = $("#achievementHeaderProgress");
    const seriesArea = $("#achievementSeries");
    const secretArea = $("#secretAchievement");
    if (!summary || !seriesArea || !secretArea) return;

    const words = allWords();
    const attempted = words.filter(word => !isUntriedWord(word)).length;
    const review = words.filter(isReviewTarget).length;
    const validAchievementIds = new Set();

    for (const series of achievementSeriesDefinitions()) {
      BADGE_THRESHOLDS.forEach(threshold => {
        validAchievementIds.add(`${series.key}_${threshold}`);
      });
    }
    validAchievementIds.add("secret_synonym_master");
    validAchievementIds.add("secret_antonym_master");
    validAchievementIds.add("secret_all_clear");

    const unlockedCount = Object.keys(achievements)
      .filter(id => validAchievementIds.has(id))
      .length;
    const totalBadgeCount = validAchievementIds.size;

    if (headerProgress) {
      headerProgress.innerHTML = `<span>獲得バッジ</span><strong>${unlockedCount}/${totalBadgeCount}</strong>`;
      headerProgress.setAttribute("aria-label", `獲得バッジ ${unlockedCount}/${totalBadgeCount}`);
    }

    summary.innerHTML = [
      [learningStats.completedSessions, "練習完了回数"],
      [learningStats.perfectSessions, "100%正解回数"],
      [learningStats.correct.reading, "読み・累計正解"],
      [learningStats.correct.writing, "書き・累計正解"],
      [learningStats.correct.listening, "リスニング・累計正解"],
      [`${attempted}/${words.length}`, "挑戦済み単語"],
      [review, "復習対象単語"]
    ].map(([value, label]) => `
      <div class="achievement-summary-item">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    `).join("");

    seriesArea.innerHTML = achievementSeriesDefinitions().map((series, seriesIndex) => {
      const current = series.value();
      const unlockedInSeries = BADGE_THRESHOLDS.filter(threshold =>
        Boolean(achievements[`${series.key}_${threshold}`])
      ).length;
      const nextThreshold = BADGE_THRESHOLDS.find(threshold => current < threshold);

      const badges = BADGE_THRESHOLDS.map((threshold, index) => {
        const id = `${series.key}_${threshold}`;
        const unlockedAt = achievements[id];
        const tier = BADGE_TIERS[index];
        const [messageJa, messageEn] = BADGE_MESSAGES[series.key][index];
        const progressText = unlockedAt
          ? `獲得：${formatDate(unlockedAt)}`
          : `${Math.min(current, threshold)} / ${threshold}`;

        return `
          <div class="badge-item ${unlockedAt ? "" : "locked"}">
            ${badgeVisual(tier, !unlockedAt)}
            <div class="badge-info">
              <strong>${escapeHtml(series.short)} ${threshold}</strong>
              <span class="badge-condition">${escapeHtml(series.condition(threshold))}</span>
              ${unlockedAt ? `
                <span class="badge-message-ja">${escapeHtml(messageJa)}</span>
                <span class="badge-message-en">${escapeHtml(messageEn)}</span>
              ` : ""}
              <span class="badge-progress">${escapeHtml(tier.label)}・${escapeHtml(progressText)}</span>
            </div>
          </div>
        `;
      }).join("");

      return `
        <details class="achievement-series-card" ${seriesIndex === 0 ? "open" : ""}>
          <summary>
            <div class="achievement-series-title">
              <strong>${escapeHtml(series.title)}</strong>
              <span>現在 ${current} ／ 11段階中 ${unlockedInSeries}個獲得</span>
            </div>
          </summary>
          <div class="achievement-series-body">
            <p class="achievement-progress-line">
              ${nextThreshold
                ? `次の目標：${nextThreshold}（あと${nextThreshold - current}）`
                : "11段階すべて達成！"}
            </p>
            <div class="badge-grid">${badges}</div>
          </div>
        </details>
      `;
    }).join("");

    const synonymSecret = synonymAchievementProgress();
    const synonymSecretUnlocked = achievements.secret_synonym_master;
    const antonymSecret = antonymAchievementProgress();
    const antonymSecretUnlocked = achievements.secret_antonym_master;
    const secret = secretAchievementProgress();
    const secretUnlocked = achievements.secret_all_clear;

    const secretUnlockedCount = [synonymSecretUnlocked, antonymSecretUnlocked, secretUnlocked].filter(Boolean).length;
    secretArea.innerHTML = `
      <details class="achievement-series-card secret-achievement-card">
        <summary>
          <div class="achievement-series-title">
            <strong>シークレット実績</strong>
            <span>獲得 ${secretUnlockedCount} / 3</span>
          </div>
        </summary>
        <div class="achievement-series-body secret-achievement-stack">
          <div class="secret-achievement-entry">
            <div class="secret-badge-layout">
              ${synonymSecretBadgeVisual(!synonymSecretUnlocked)}
              <div>
                <h3>${synonymSecretUnlocked ? "同義語マスター獲得！" : "？？？"}</h3>
                <p class="secret-condition">
                  同義語・言い換えの関係を持つ単語をすべて1回以上挑戦し、その対象の復習をすべて完了すると解禁します。
                </p>
                ${synonymSecretUnlocked ? `
                  <strong>いろいろな言い方を知って、使い分けへの一歩を進めたね！</strong>
                  <span class="badge-message-en">You mastered the synonym set!</span>
                ` : ""}
                <div class="secret-progress-grid">
                  <span>対象単語 ${synonymSecret.attemptedWords} / ${synonymSecret.totalWords}</span>
                  <span>同義語グループ ${synonymSecret.totalGroups}組</span>
                  <span>復習対象 ${synonymSecret.reviewWords}件</span>
                  ${synonymSecretUnlocked ? `<span>獲得：${escapeHtml(formatDate(synonymSecretUnlocked))}</span>` : ""}
                </div>
              </div>
            </div>
          </div>

          <div class="secret-achievement-entry">
            <div class="secret-badge-layout">
              ${antonymSecretBadgeVisual(!antonymSecretUnlocked)}
              <div>
                <h3>${antonymSecretUnlocked ? "対義語マスター獲得！" : "？？？"}</h3>
                <p class="secret-condition">
                  対義語・対になる表現を持つ単語をすべて1回以上挑戦し、その対象の復習をすべて完了すると解禁します。
                </p>
                ${antonymSecretUnlocked ? `
                  <strong>反対の意味や対になる動きを、つながりで覚えられたね！</strong>
                  <span class="badge-message-en">You mastered the opposite-word set!</span>
                ` : ""}
                <div class="secret-progress-grid">
                  <span>対象単語 ${antonymSecret.attemptedWords} / ${antonymSecret.totalWords}</span>
                  <span>対義語・対の組 ${antonymSecret.totalGroups}組</span>
                  <span>復習対象 ${antonymSecret.reviewWords}件</span>
                  ${antonymSecretUnlocked ? `<span>獲得：${escapeHtml(formatDate(antonymSecretUnlocked))}</span>` : ""}
                </div>
              </div>
            </div>
          </div>

          <div class="secret-achievement-entry">
            <div class="secret-badge-layout">
              ${badgeVisual(
                { material:"rainbow", size:"large", label:"シークレット" },
                !secretUnlocked
              )}
              <div>
                <h3>${secretUnlocked ? "オールクリア獲得！" : "？？？"}</h3>
                <p class="secret-condition">
                  現在登録されている全単語に1回以上挑戦し、復習対象を0件にすると解禁します。
                </p>
                ${secretUnlocked ? `
                  <strong>全部に出会って、苦手もゼロ！すごい！</strong>
                  <span class="badge-message-en">You cleared every word!</span>
                ` : ""}
                <div class="secret-progress-grid">
                  <span>挑戦済み ${secret.attempted} / ${secret.total}</span>
                  <span>復習対象 ${secret.review}件</span>
                  ${secretUnlocked ? `<span>獲得：${escapeHtml(formatDate(secretUnlocked))}</span>` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    `;
  }

  function isEnabled(word) { return !disabledIds.has(word.id); }
  function setEnabled(id, enabled) {
    enabled ? disabledIds.delete(id) : disabledIds.add(id);
    save(STORAGE.disabled, [...disabledIds]);
  }
  function escapeHtml(v) {
    return String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }
  function shuffle(arr) {
    const a = [...arr];
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0,n); }
  function formatDate(iso) { return new Date(iso).toLocaleString("ja-JP"); }

  let availableVoices = [];
  let selectedVoiceKey = localStorage.getItem(STORAGE.voice) || "";

  // Web Speech APIには声の性別属性がないため、初期値のみ女性声として
  // よく使われる声名を優先します。利用者はプルダウンから自由に変更できます。
  const preferredFemaleVoiceNames = [
    "Samantha", "Ava", "Allison", "Susan", "Victoria",
    "Karen", "Moira", "Tessa", "Fiona", "Serena", "Veena",
    "Nicky", "Zira", "Aria", "Jenny", "Hazel", "Sonia",
    "Libby", "Michelle", "Natasha", "Heera", "Linda"
  ];

  const knownMaleVoiceNames = [
    "Alex", "Daniel", "Fred", "Oliver", "Aaron", "Tom",
    "Ralph", "Bruce", "Albert", "Junior", "Reed", "Evan",
    "Nathan", "Guy"
  ];

  function voiceKey(voice) {
    return [voice.voiceURI || "", voice.name || "", voice.lang || ""].join("|||");
  }

  function isEnglishVoice(voice) {
    return /^en(?:-|_)/i.test(voice.lang || "");
  }

  function englishLocaleLabel(lang) {
    const normalized = String(lang || "").replace("_", "-");
    const labels = {
      "en-US": "英語（アメリカ）",
      "en-GB": "英語（イギリス）",
      "en-AU": "英語（オーストラリア）",
      "en-CA": "英語（カナダ）",
      "en-IN": "英語（インド）",
      "en-IE": "英語（アイルランド）",
      "en-NZ": "英語（ニュージーランド）",
      "en-ZA": "英語（南アフリカ）"
    };
    return labels[normalized] || `英語（${normalized || "地域未指定"}）`;
  }

  function getEnglishVoices() {
    return availableVoices
      .filter(isEnglishVoice)
      .sort((a, b) =>
        String(a.lang).localeCompare(String(b.lang), "en") ||
        String(a.name).localeCompare(String(b.name), "en")
      );
  }

  function selectPreferredEnglishVoice(voices = getEnglishVoices()) {
    if (!voices.length) return null;

    const scored = voices.map(voice => {
      const name = voice.name.toLowerCase();
      let score = 0;

      const preferredIndex = preferredFemaleVoiceNames.findIndex(
        candidate => name.includes(candidate.toLowerCase())
      );
      if (preferredIndex >= 0) score += 1000 - preferredIndex;
      if (name.includes("female") || name.includes("woman")) score += 900;

      if (knownMaleVoiceNames.some(candidate => name.includes(candidate.toLowerCase()))) {
        score -= 600;
      }

      if (/^en-US$/i.test(voice.lang)) score += 80;
      else if (/^en-GB$/i.test(voice.lang)) score += 55;
      else score += 35;

      if (voice.localService) score += 10;
      if (voice.default) score += 5;

      return { voice, score };
    });

    scored.sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name));
    return scored[0].voice;
  }

  function findStoredVoice(voices, storedKey) {
    if (!storedKey) return null;

    const exact = voices.find(voice => voiceKey(voice) === storedKey);
    if (exact) return exact;

    const [, storedName = "", storedLang = ""] = storedKey.split("|||");
    return voices.find(voice =>
      voice.name === storedName &&
      String(voice.lang).replace("_", "-") === String(storedLang).replace("_", "-")
    ) || null;
  }

  function updateVoiceStatus(voice = null) {
    const status = $("#voiceStatus");
    if (!status) return;

    if (!("speechSynthesis" in window)) {
      status.textContent = "このブラウザでは音声合成を利用できません。";
      return;
    }

    if (!voice) {
      status.textContent = "英語音声を読み込んでいます。表示されない場合は端末の音声設定をご確認ください。";
      return;
    }

    const serviceLabel = voice.localService ? "端末内音声" : "オンライン音声";
    status.textContent = `${serviceLabel}・${englishLocaleLabel(voice.lang)}の「${voice.name}」を使用します。`;
  }

  function populateVoiceSelect() {
    const select = $("#voiceSelect");
    const preview = $("#previewVoice");
    if (!select || !preview) return;

    const voices = getEnglishVoices();
    const previousKey = selectedVoiceKey || select.value;
    select.innerHTML = "";

    if (!("speechSynthesis" in window)) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "音声合成を利用できません";
      select.appendChild(option);
      select.disabled = true;
      preview.disabled = true;
      updateVoiceStatus(null);
      return;
    }

    if (!voices.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "英語音声を読み込み中...";
      select.appendChild(option);
      select.disabled = true;
      preview.disabled = true;
      updateVoiceStatus(null);
      return;
    }

    const groups = new Map();
    voices.forEach(voice => {
      const serviceLabel = voice.localService ? "端末内" : "オンライン";
      const localeLabel = englishLocaleLabel(voice.lang);
      const label = `${serviceLabel}｜${localeLabel}`;
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(voice);
    });

    const orderedGroups = [...groups.entries()].sort(([labelA], [labelB]) => {
      const serviceOrderA = labelA.startsWith("端末内") ? 0 : 1;
      const serviceOrderB = labelB.startsWith("端末内") ? 0 : 1;
      return serviceOrderA - serviceOrderB || labelA.localeCompare(labelB, "ja");
    });

    orderedGroups.forEach(([label, groupVoices]) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = label;

      groupVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voiceKey(voice);
        option.textContent = voice.name;
        optgroup.appendChild(option);
      });

      select.appendChild(optgroup);
    });

    let selectedVoice = findStoredVoice(voices, previousKey);
    if (!selectedVoice) selectedVoice = selectPreferredEnglishVoice(voices);

    if (selectedVoice) {
      selectedVoiceKey = voiceKey(selectedVoice);
      select.value = selectedVoiceKey;
      localStorage.setItem(STORAGE.voice, selectedVoiceKey);
    }

    select.disabled = false;
    preview.disabled = voicePreviewInProgress;
    updateVoiceStatus(selectedVoice);
  }

  function refreshVoices() {
    if (!("speechSynthesis" in window)) {
      populateVoiceSelect();
      return;
    }
    availableVoices = speechSynthesis.getVoices();
    populateVoiceSelect();
  }

  function getSelectedVoice() {
    if (!availableVoices.length && "speechSynthesis" in window) {
      availableVoices = speechSynthesis.getVoices();
    }

    const voices = getEnglishVoices();
    return findStoredVoice(voices, selectedVoiceKey) ||
      selectPreferredEnglishVoice(voices);
  }

  function practiceStartButtons() {
    return $$(".practice-start-button");
  }

  function setPracticeStartDisabled(disabled) {
    practiceStartButtons().forEach(button => { button.disabled = disabled; });
  }

  function setPracticeStartLabel(label) {
    practiceStartButtons().forEach(button => { button.textContent = label; });
  }

  function practiceStartDisabled() {
    const buttons = practiceStartButtons();
    return buttons.length > 0 && buttons.every(button => button.disabled);
  }

  function initVoiceSettings() {
    const select = $("#voiceSelect");
    const preview = $("#previewVoice");
    if (!select || !preview) return;

    select.addEventListener("change", event => {
      selectedVoiceKey = event.target.value;
      localStorage.setItem(STORAGE.voice, selectedVoiceKey);
      const status = $("#voiceStatus");
      status.classList.remove("warning-text", "success-text");
      updateVoiceStatus(getSelectedVoice());
    });

    preview.addEventListener("click", async () => {
      if (voicePreviewInProgress) return;

      const originalLabel = preview.textContent;
      const status = $("#voiceStatus");

      voicePreviewInProgress = true;
      preview.disabled = true;
      preview.textContent = "確認中...";
      setPracticeStartDisabled(true);
      status.classList.remove("warning-text", "success-text");
      status.textContent = "選択した音声を短く再生して確認しています。";

      const playback = await checkSelectedVoicePlayback();

      voicePreviewInProgress = false;
      preview.textContent = originalLabel;
      preview.disabled = getEnglishVoices().length === 0;
      updatePracticeAvailability();

      if (playback.ok) {
        const voice = playback.voice || getSelectedVoice();
        const serviceLabel = voice && voice.localService ? "端末内音声" : "オンライン音声";
        status.textContent = voice
          ? `音声を確認できました。${serviceLabel}・${englishLocaleLabel(voice.lang)}の「${voice.name}」を使用します。`
          : "音声を確認できました。";
        status.classList.add("success-text");
      } else {
        status.textContent = `音声を確認できませんでした。${playback.reason}`;
        status.classList.add("warning-text");
      }
    });

    refreshVoices();

    if ("speechSynthesis" in window) {
      if (typeof speechSynthesis.addEventListener === "function") {
        speechSynthesis.addEventListener("voiceschanged", refreshVoices);
      } else {
        speechSynthesis.onvoiceschanged = refreshVoices;
      }

      // Safari等では初回の音声一覧取得が遅れる場合があるため再取得します。
      window.setTimeout(refreshVoices, 250);
      window.setTimeout(refreshVoices, 1000);
    }
  }

  function checkSelectedVoicePlayback(timeoutMs = 5000) {
    return new Promise(resolve => {
      if (!("speechSynthesis" in window)) {
        resolve({ ok: false, reason: "このブラウザは音声合成に対応していません。" });
        return;
      }

      const selectedVoice = getSelectedVoice();
      if (!selectedVoice) {
        resolve({ ok: false, reason: "利用可能な英語音声を取得できませんでした。" });
        return;
      }

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance("Ready");
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
      utterance.rate = 0.82;
      utterance.pitch = 1;
      utterance.volume = 0.72;

      let settled = false;
      let started = false;

      const finish = result => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve(result);
      };

      utterance.onstart = () => {
        started = true;
      };

      utterance.onend = () => {
        finish({ ok: true, voice: selectedVoice });
      };

      utterance.onerror = event => {
        const errorName = event.error || "unknown";
        finish({
          ok: false,
          reason: `選択した音声を再生できませんでした（${errorName}）。`
        });
      };

      const timer = window.setTimeout(() => {
        speechSynthesis.cancel();
        finish({
          ok: false,
          reason: started
            ? "音声再生が完了しませんでした。"
            : "音声再生を開始できませんでした。通信状態や音声サービスをご確認ください。"
        });
      }, timeoutMs);

      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        finish({
          ok: false,
          reason: `音声再生処理でエラーが発生しました（${error.message || "unknown"}）。`
        });
      }
    });
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("このブラウザでは音声合成を利用できません。");
      return false;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getSelectedVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 0.82;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
    return true;
  }

  function hidePracticeFlash() {
    const flash = $("#practiceFlash");
    if (!flash) return;

    if (practiceFlashTimer) {
      window.clearTimeout(practiceFlashTimer);
      practiceFlashTimer = null;
    }

    flash.textContent = "";
    flash.className = "flash-message hidden";
  }

  function showPracticeFlash(message, type = "warning", autoHide = true) {
    const flash = $("#practiceFlash");
    if (!flash) return;

    if (practiceFlashTimer) {
      window.clearTimeout(practiceFlashTimer);
      practiceFlashTimer = null;
    }

    flash.textContent = message;
    flash.className = `flash-message ${type}`;

    if (autoHide) {
      practiceFlashTimer = window.setTimeout(() => {
        hidePracticeFlash();
      }, 9000);
    }
  }

  function focusPracticeSettings(message) {
    $("#quizArea").classList.add("hidden");
    $("#resultArea").classList.add("hidden");
    $("#practiceSetup").classList.remove("hidden");
    showScreen("practice");
    showPracticeFlash(message, "warning", false);

    window.requestAnimationFrame(() => {
      const setup = $("#practiceSetup");
      if (!setup) return;

      setup.setAttribute("tabindex", "-1");
      setup.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        setup.focus({ preventScroll: true });
      } catch {
        setup.focus();
      }
    });
  }

  function initNavigation() {
    $$(".tab").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.screen)));
    $$("[data-go]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.go)));
  }
  function showScreen(name) {
    $$(".screen").forEach(s => s.classList.toggle("active", s.id === `screen-${name}`));
    $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.screen === name));
    const scroller = $("#contentScroll");
    if (scroller) scroller.scrollTo({top:0, behavior:"smooth"});
    else window.scrollTo({top:0, behavior:"smooth"});
    if (name === "words") renderWords();
    if (name === "badges") renderBadges();
    if (name === "history") renderHistory();
    if (name === "home") renderHome();
    if (name === "practice") updatePracticeAvailability();
  }

  function initTheme() {
    const value = localStorage.getItem(STORAGE.theme) || "1";
    document.documentElement.dataset.theme = value;
    $("#themeSelect").value = value;
    $("#themeSelect").addEventListener("change", e => {
      document.documentElement.dataset.theme = e.target.value;
      localStorage.setItem(STORAGE.theme, e.target.value);
    });
  }

  function populateTopics() {
    const choices = $("#topicChoices");
    const custom = $("#customTopic");
    const filter = $("#wordTopicFilter");
    Object.entries(topics).forEach(([key,label]) => {
      choices.insertAdjacentHTML("beforeend", `<label><input type="checkbox" name="topic" value="${key}" checked> ${label}</label>`);
      custom.insertAdjacentHTML("beforeend", `<option value="${key}">${label}</option>`);
      filter.insertAdjacentHTML("beforeend", `<option value="${key}">${label}</option>`);
    });
    $$('input[name="topic"]').forEach(x => x.addEventListener("change", updatePracticeAvailability));
  }

  function renderHome() {
    const enabled = allWords().filter(isEnabled).length;
    $("#homeActiveWords").textContent = enabled;
    $("#homeHistoryCount").textContent = history.length;
    const best = history.length ? Math.max(...history.map(h => h.percent)) : null;
    $("#homeBestScore").textContent = best == null ? "--" : `${best}%`;
  }

  function applyRecommendedSettings() {
    const listeningAvailable = "speechSynthesis" in window;

    $$('input[name="mode"]').forEach(input => {
      input.checked = input.value !== "listening" || listeningAvailable;
    });
    $$('input[name="writingLevel"]').forEach(input => input.checked = true);
    $$('input[name="source"]').forEach(input => input.checked = true);
    $$('input[name="topic"]').forEach(input => input.checked = true);
    const normalMode = $('input[name="studyMode"][value="normal"]');
    if (normalMode) normalMode.checked = true;
    if ($("#synonymPriority")) $("#synonymPriority").checked = false;
    if ($("#antonymPriority")) $("#antonymPriority").checked = false;
    $("#questionCount").value = "20";
    updatePracticeAvailability();
  }

  function initPracticeSettings() {
    $$('input[name="mode"],input[name="writingLevel"],input[name="source"],input[name="studyMode"],#synonymPriority,#antonymPriority').forEach(x => x.addEventListener("change", updatePracticeAvailability));
    $("#questionCount").addEventListener("change", updatePracticeAvailability);
    $("#checkAllTopics").addEventListener("click", () => { $$('input[name="topic"]').forEach(x=>x.checked=true); updatePracticeAvailability(); });
    $("#uncheckAllTopics").addEventListener("click", () => { $$('input[name="topic"]').forEach(x=>x.checked=false); updatePracticeAvailability(); });
    $("#selectRecommended").addEventListener("click", applyRecommendedSettings);
    $("#startRecommendedHome").addEventListener("click", () => {
      applyRecommendedSettings();
      showScreen("practice");
      if (!practiceStartDisabled()) startPractice(null, { trigger: "recommended" });
    });
    practiceStartButtons().forEach(button => {
      button.addEventListener("click", () => startPractice(null, { trigger: "settings" }));
    });
    $("#nextQuestion").addEventListener("click", nextQuestion);
    $("#quitQuiz").addEventListener("click", () => {
      if (confirm("練習を中断しますか？現在の結果は保存されません。")) showSetup();
    });
    $("#retryPractice").addEventListener("click", () => startPractice(lastSettings, { trigger: "retry" }));
    $("#backToSetup").addEventListener("click", showSetup);
    $("#resultReviewFilter").addEventListener("change", renderResultAnswers);
  }

  function getSettings() {
    return {
      modes: $$('input[name="mode"]:checked').map(x=>x.value),
      writingLevels: $$('input[name="writingLevel"]:checked').map(x=>x.value),
      sources: $$('input[name="source"]:checked').map(x=>x.value),
      topics: $$('input[name="topic"]:checked').map(x=>x.value),
      studyMode: $('input[name="studyMode"]:checked')?.value || "normal",
      synonymPriority: Boolean($("#synonymPriority")?.checked),
      antonymPriority: Boolean($("#antonymPriority")?.checked),
      count: Number($("#questionCount").value)
    };
  }

  function eligibleWords(settings) {
    return allWords().filter(word =>
      isEnabled(word)
      && settings.sources.includes(word.source)
      && settings.topics.includes(word.topic)
    );
  }

  function targetWords(settings, basePool = eligibleWords(settings)) {
    if (settings.studyMode === "review") {
      return basePool.filter(isReviewTarget);
    }

    if (settings.studyMode === "untried") {
      return basePool.filter(isUntriedWord);
    }

    return basePool;
  }

  function buildWordSequence(targetPool, count, allowRepeat = true, priorities = {}) {
    if (!targetPool.length || count <= 0) return [];

    const synonymPriority = Boolean(priorities.synonymPriority);
    const antonymPriority = Boolean(priorities.antonymPriority);

    const buildDeck = () => {
      if (!synonymPriority && !antonymPriority) return shuffle(targetPool);

      const priorityWords = shuffle(targetPool.filter(word =>
        (synonymPriority && hasSynonyms(word)) ||
        (antonymPriority && hasAntonyms(word))
      ));
      const otherWords = shuffle(targetPool.filter(word =>
        !((synonymPriority && hasSynonyms(word)) ||
          (antonymPriority && hasAntonyms(word)))
      ));
      return [...priorityWords, ...otherWords];
    };

    if (!allowRepeat) return buildDeck().slice(0, count);

    const result = [];
    let previousId = "";

    while (result.length < count) {
      const deck = buildDeck();

      if (deck.length > 1 && previousId && deck[0].id === previousId) {
        const swapIndex = deck.findIndex(word => word.id !== previousId);
        if (swapIndex > 0) [deck[0], deck[swapIndex]] = [deck[swapIndex], deck[0]];
      }

      for (const word of deck) {
        if (result.length >= count) break;
        result.push(word);
        previousId = word.id;
      }
    }

    return result;
  }

  function updatePracticeAvailability() {
    $("#practiceAvailability").classList.remove("warning-text");
    const settings = getSettings();
    const basePool = eligibleWords(settings);
    const reviewPool = basePool.filter(isReviewTarget);
    const untriedPool = basePool.filter(isUntriedWord);
    const targets = targetWords(settings, basePool);
    const issues = [];

    const reviewCount = $("#reviewModeCount");
    const untriedCount = $("#untriedModeCount");
    if (reviewCount) reviewCount.textContent = reviewPool.length;
    if (untriedCount) untriedCount.textContent = untriedPool.length;

    if (!settings.modes.length) issues.push("練習内容を選択してください。");
    if (settings.modes.includes("writing") && !settings.writingLevels.length) {
      issues.push("書きの段階を選択してください。");
    }
    if (!settings.sources.length) issues.push("出題元を選択してください。");
    if (!settings.topics.length) issues.push("カテゴリを選択してください。");
    if (uniqueConceptCount(basePool) < 4) {
      issues.push("条件に合う意味の異なる出題対象単語が4件以上必要です。");
    }
    if (settings.studyMode === "review" && !targets.length) {
      issues.push("現在の条件に復習対象の単語はありません。");
    }
    if (settings.studyMode === "untried" && !targets.length) {
      issues.push("現在の条件に未挑戦の単語はありません。");
    }
    if (settings.modes.includes("listening") && !("speechSynthesis" in window)) {
      issues.push("このブラウザではリスニングを利用できません。");
    }

    let status = "";
    const synonymTargetCount = targets.filter(hasSynonyms).length;
    const antonymTargetCount = targets.filter(hasAntonyms).length;
    if (settings.studyMode === "review") {
      status = `復習対象：${targets.length}件／選択条件の単語：${basePool.length}件`;
    } else if (settings.studyMode === "untried") {
      status = `未挑戦：${targets.length}件／選択条件の単語：${basePool.length}件`;
      if (targets.length > 0 && targets.length < settings.count) status += `（今回は${targets.length}問）`;
    } else {
      status = `条件に合う単語：${basePool.length}件（全単語を一巡するまで重複を抑制）`;
    }
    if (settings.synonymPriority && targets.length) {
      status += `／同義語・言い換え優先：${synonymTargetCount}件`;
    }
    if (settings.antonymPriority && targets.length) {
      status += `／対義語・対になる語優先：${antonymTargetCount}件`;
    }
    if ((settings.synonymPriority || settings.antonymPriority) && targets.length) {
      status += "（不足分はその他の対象単語から出題）";
    }

    $("#practiceAvailability").textContent = issues.length ? issues[0] : status;
    setPracticeStartDisabled(issues.length > 0 || voicePreviewInProgress);
  }

  function buildQuestion(word, mode, settings, pool) {
    const targetEnglish = randomWordForm(word);
    if (mode === "reading") {
      return {
        word, mode, targetEnglish, prompt:targetEnglish, correct:word.japanese,
        choices:japaneseChoicesFor(word, pool)
      };
    }
    if (mode === "listening") {
      return {
        word, mode, targetEnglish, prompt:targetEnglish, correct:targetEnglish,
        choices:englishChoicesFor(word, targetEnglish, pool)
      };
    }
    const level = settings.writingLevels[Math.floor(Math.random()*settings.writingLevels.length)];
    if (level === "word" || targetEnglish.replace(/[^a-z]/gi,"").length < 3) {
      return {
        word, mode, level:"word", targetEnglish, prompt:word.japanese, correct:targetEnglish,
        choices:englishChoicesFor(word, targetEnglish, pool)
      };
    }
    const letters = [...targetEnglish];
    const validStarts = letters.map((c,i)=>/[a-z]/i.test(c) ? i : -1).filter(i=>i>=0);
    let start = validStarts[Math.floor(Math.random()*validStarts.length)];
    let len = level === "two" ? 2 : 1;
    if (len===2 && (!letters[start+1] || !/[a-z]/i.test(letters[start+1]))) {
      const pairs=validStarts.filter(i=>letters[i+1] && /[a-z]/i.test(letters[i+1]));
      if (!pairs.length) len=1; else start=pairs[Math.floor(Math.random()*pairs.length)];
    }
    const missing=letters.slice(start,start+len).join("");
    const alphabet="abcdefghijklmnopqrstuvwxyz";
    const distractors=new Set();
    while(distractors.size<3) {
      let d="";
      for(let i=0;i<len;i++) d+=alphabet[Math.floor(Math.random()*alphabet.length)];
      if(d.toLowerCase()!==missing.toLowerCase()) distractors.add(d);
    }
    const display=letters.map((c,i)=>(i>=start&&i<start+len)?"_":c).join("");
    return {
      word, mode, level:len===1?"one":"two", targetEnglish, prompt:word.japanese, display, correct:missing,
      choices:shuffle([missing,...distractors])
    };
  }

  async function startPractice(forcedSettings=null, options={}) {
    hidePracticeFlash();

    // clickイベントなどが誤って渡されても、練習設定として扱わない。
    const originalSettings = forcedSettings && Array.isArray(forcedSettings.modes)
      ? forcedSettings
      : getSettings();
    const settings = JSON.parse(JSON.stringify(originalSettings));

    const originalLabel = "練習開始";

    if (settings.modes.includes("listening")) {
      setPracticeStartDisabled(true);
      setPracticeStartLabel("音声を確認中...");
      $("#practiceAvailability").classList.remove("warning-text");
      $("#practiceAvailability").textContent =
        "選択した音声を短く再生して、リスニングを利用できるか確認しています。";

      const playback = await checkSelectedVoicePlayback();

      setPracticeStartLabel(originalLabel);

      if (!playback.ok) {
        const listeningCheckbox = $('input[name="mode"][value="listening"]');
        if (listeningCheckbox) listeningCheckbox.checked = false;
        settings.modes = settings.modes.filter(mode => mode !== "listening");

        updatePracticeAvailability();

        if (!settings.modes.length) {
          focusPracticeSettings(
            `リスニングを利用できません。${playback.reason} ` +
            "リスニングのみが選択されていたため練習を開始できません。読みまたは書きを選択して、もう一度「練習開始」を押してください。"
          );
          return;
        }

        const modeLabels = { reading: "読み", writing: "書き" };
        const remainingModes = settings.modes
          .map(mode => modeLabels[mode] || mode)
          .join("・");
        const continuationMessage = options.trigger === "recommended"
          ? "リスニングを外し、読み・書きの問題で練習を開始します。"
          : `リスニングを除去し、残った練習内容（${remainingModes}）で開始します。`;

        showPracticeFlash(
          `リスニングを利用できません。${playback.reason} ${continuationMessage}`,
          "warning",
          true
        );
      } else {
        $("#practiceAvailability").classList.remove("warning-text");
      }
    }

    const pool = eligibleWords(settings);
    const targets = targetWords(settings, pool);

    if (uniqueConceptCount(pool) < 4) {
      setPracticeStartLabel(originalLabel);
      updatePracticeAvailability();
      focusPracticeSettings(
        "現在の設定では、意味の異なる出題対象単語が4件未満です。出題元またはカテゴリを見直してください。"
      );
      return;
    }

    if (!targets.length) {
      setPracticeStartLabel(originalLabel);
      updatePracticeAvailability();
      focusPracticeSettings(
        settings.studyMode === "review"
          ? "現在の条件に復習対象の単語はありません。通常または未挑戦モードを選択してください。"
          : "現在の条件に未挑戦の単語はありません。通常または復習モードを選択してください。"
      );
      return;
    }

    const actualCount = settings.studyMode === "untried"
      ? Math.min(settings.count, targets.length)
      : settings.count;

    lastSettings = JSON.parse(JSON.stringify(settings));
    const questions = [];
    const wordSequence = buildWordSequence(
      targets,
      actualCount,
      settings.studyMode !== "untried",
      { synonymPriority: settings.synonymPriority, antonymPriority: settings.antonymPriority }
    );

    for (let i = 0; i < wordSequence.length; i++) {
      const mode = settings.modes[Math.floor(Math.random() * settings.modes.length)];
      const word = wordSequence[i];
      questions.push(buildQuestion(word, mode, settings, pool));
    }

    quiz = {
      settings,
      questions,
      index: 0,
      correct: 0,
      answered: false,
      detail: { reading: [0,0], writing: [0,0], listening: [0,0] },
      answers: []
    };

    setPracticeStartLabel(originalLabel);
    setPracticeStartDisabled(false);
    $("#practiceSetup").classList.add("hidden");
    $("#resultArea").classList.add("hidden");
    $("#quizArea").classList.remove("hidden");
    renderQuestion();
  }

  function renderQuestion() {
    const q=quiz.questions[quiz.index];
    quiz.answered=false;
    const labels={reading:"読み",writing:"書き",listening:"リスニング"};
    const studyLabels={normal:"",review:"復習モード",untried:"未挑戦モード"};
    $("#quizModeBadge").textContent=labels[q.mode];
    const studyBadge=$("#quizStudyModeBadge");
    const studyParts=[];
    const studyLabel=studyLabels[quiz.settings.studyMode]||"";
    if (studyLabel) studyParts.push(studyLabel);
    if (quiz.settings.synonymPriority) studyParts.push("同義語優先");
    if (quiz.settings.antonymPriority) studyParts.push("対義語優先");
    studyBadge.textContent=studyParts.join("・");
    studyBadge.classList.toggle("hidden",studyParts.length===0);
    $("#quizProgress").textContent=`${quiz.index+1} / ${quiz.questions.length}`;
    $("#quizCorrect").textContent=quiz.correct;
    $("#progressBar").style.width=`${(quiz.index/quiz.questions.length)*100}%`;
    $("#feedback").textContent="";
    $("#feedback").className="feedback";
    $("#nextQuestion").classList.add("hidden");
    if(q.mode==="reading") {
      $("#questionArea").innerHTML=`<p>この英単語の意味は？</p><div class="word">${escapeHtml(q.prompt)}</div>`;
    } else if(q.mode==="listening") {
      $("#questionArea").innerHTML=`<p>音声と同じ英単語は？</p><button class="speak-large" id="playQuestionAudio" aria-label="音声を再生">🔊</button>`;
      $("#playQuestionAudio").addEventListener("click",()=>speak(q.prompt));
      setTimeout(()=>speak(q.prompt),180);
    } else if(q.level==="word") {
      $("#questionArea").innerHTML=`<p>日本語に合う英単語は？</p><div class="jp">${escapeHtml(q.prompt)}</div>`;
    } else {
      const rendered=q.display.replace(/_+/g,m=>`<span class="missing">${m}</span>`);
      $("#questionArea").innerHTML=`<p>空欄に入る文字は？　<span class="jp">${escapeHtml(q.prompt)}</span></p><div class="word">${rendered}</div>`;
    }
    $("#answerChoices").innerHTML="";
    q.choices.forEach(choice=>{
      const b=document.createElement("button");
      b.className="answer-button";
      b.textContent=choice;
      b.addEventListener("click",()=>answerQuestion(choice,b));
      $("#answerChoices").appendChild(b);
    });
  }

  function answerQuestion(choice, button) {
    if(quiz.answered) return;
    quiz.answered=true;
    const q=quiz.questions[quiz.index];
    const correct=String(choice).toLowerCase()===String(q.correct).toLowerCase();

    quiz.answers.push({
      number: quiz.index + 1,
      mode: q.mode,
      level: q.level || "",
      prompt: q.prompt,
      display: q.display || "",
      wordId: q.word.id,
      wordEnglish: q.targetEnglish || q.word.english,
      baseWordEnglish: q.word.english,
      wordJapanese: q.word.japanese,
      answeredAt: new Date().toISOString(),
      selectedAnswer: String(choice),
      correctAnswer: String(q.correct),
      isCorrect: correct
    });

    quiz.detail[q.mode][1]++;
    if(correct){ quiz.correct++; quiz.detail[q.mode][0]++; }

    const progressUpdate = updateWordProgress(q.word.id, correct);

    $$(".answer-button").forEach(b=>{
      b.disabled=true;
      if(b.textContent.toLowerCase()===String(q.correct).toLowerCase()) b.classList.add("correct");
    });
    if(!correct) button.classList.add("wrong");
    $("#quizCorrect").textContent=quiz.correct;

    const synonymForms = synonymFormsForDisplay(q.word);
    const synonymNote = synonymForms.length
      ? `　${synonymRelationKind(q.word) || "同義語・言い換え"}：${[q.word.english, ...synonymForms].join(" / ")}`
      : "";
    const antonymForms = antonymFormsForDisplay(q.word);
    const antonymNote = antonymForms.length
      ? `　対になる語：${antonymForms.join(" / ")}`
      : "";
    const relationNote = synonymNote + antonymNote;
    const listeningMeaning = correct && q.mode === "listening"
      ? `　${q.targetEnglish || q.word.english}：${q.word.japanese}`
      : "";
    let feedbackText = "";
    if (!correct) {
      const completedWord = q.targetEnglish || q.word.english;
      feedbackText = `正解：${q.correct}（${completedWord}：${q.word.japanese}）`;
      feedbackText += progressUpdate.reviewAdded
        ? "　復習対象に追加しました。"
        : "　復習対象のままです。";
      feedbackText += relationNote;
    } else if (progressUpdate.reviewCleared) {
      feedbackText = "正解です！" + listeningMeaning + "　2回連続正解で復習完了。復習対象から外れました。" + relationNote;
    } else if (progressUpdate.reviewPending) {
      feedbackText = "正解です！" + listeningMeaning + "　あと1回連続正解で復習対象から外れます。" + relationNote;
    } else {
      feedbackText = "正解です！" + listeningMeaning + relationNote;
    }

    $("#feedback").textContent=feedbackText;
    $("#feedback").className=`feedback ${correct?"good":"bad"}`;
    $("#nextQuestion").textContent=quiz.index===quiz.questions.length-1 ? "結果を見る" : "次の問題";
    $("#nextQuestion").classList.remove("hidden");
  }

  function nextQuestion() {
    if(quiz.index<quiz.questions.length-1){ quiz.index++; renderQuestion(); } else finishQuiz();
  }
  function resultQuestionDescription(answer) {
    if (answer.mode === "reading") {
      return {
        title: answer.prompt,
        detail: `英単語の意味を選ぶ問題・${answer.wordEnglish}：${answer.wordJapanese}`
      };
    }

    if (answer.mode === "listening") {
      return {
        title: `音声で聞いた単語：${answer.wordEnglish}`,
        detail: `${answer.wordEnglish}：${answer.wordJapanese}`
      };
    }

    if (answer.level === "word") {
      return {
        title: answer.prompt,
        detail: `日本語に合う英単語を選ぶ問題・${answer.wordEnglish}：${answer.wordJapanese}`
      };
    }

    return {
      title: `${answer.display}（${answer.prompt}）`,
      detail: `空欄に入る文字を選ぶ問題・完成形：${answer.wordEnglish}`
    };
  }

  function renderResultAnswers() {
    const list = $("#resultAnswerList");
    const empty = $("#resultAnswerEmpty");
    const filter = $("#resultReviewFilter").value;
    if (!list || !empty || !quiz) return;

    const modeLabels = { reading: "読み", writing: "書き", listening: "リスニング" };
    const answers = (quiz.answers || []).filter(answer => {
      if (filter === "wrong") return !answer.isCorrect;
      if (filter === "correct") return answer.isCorrect;
      return true;
    });

    list.innerHTML = answers.map(answer => {
      const question = resultQuestionDescription(answer);
      const stateClass = answer.isCorrect ? "correct" : "wrong";
      const stateLabel = answer.isCorrect ? "正解" : "不正解";

      return `<article class="result-answer-item ${stateClass}">
        <div class="result-answer-number">
          Q${answer.number}
          <span class="result-status-mark ${stateClass}">${stateLabel}</span>
        </div>
        <div class="result-answer-question">
          <strong>${escapeHtml(modeLabels[answer.mode] || answer.mode)}：${escapeHtml(question.title)}</strong>
          <span>${escapeHtml(question.detail)}</span>
        </div>
        <div class="result-answer-value ${answer.isCorrect ? "" : "user-wrong"}">
          <span class="label">あなたの解答</span>
          <strong>${escapeHtml(answer.selectedAnswer)}</strong>
        </div>
        <div class="result-answer-value correct-answer">
          <span class="label">正しい答え</span>
          <strong>${escapeHtml(answer.correctAnswer)}</strong>
        </div>
      </article>`;
    }).join("");

    empty.classList.toggle("hidden", answers.length > 0);
  }

  function finishQuiz() {
    const percent=Math.round(quiz.correct/quiz.questions.length*100);
    const record={
      id:`h${Date.now()}`, date:new Date().toISOString(), total:quiz.questions.length,
      correct:quiz.correct, percent, detail:quiz.detail, studyMode:quiz.settings.studyMode
    };
    history.unshift(record);
    save(STORAGE.history,history);

    updateLearningStatsFromQuiz(percent);
    const newlyUnlocked = evaluateAchievements(true);
    $("#quizArea").classList.add("hidden");
    $("#resultArea").classList.remove("hidden");
    $("#resultPercent").textContent=`${percent}%`;
    $("#resultCount").textContent=`${quiz.correct} / ${quiz.questions.length} 問正解`;
    const labels={reading:"読み",writing:"書き",listening:"リスニング"};
    $("#resultBreakdown").innerHTML=Object.entries(labels).map(([k,l])=>{
      const [c,t]=quiz.detail[k]; return `<div><strong>${l}</strong><br>${t?`${c} / ${t}`:"出題なし"}</div>`;
    }).join("");
    const unlockNotice = $("#achievementUnlockNotice");
    if (newlyUnlocked.length) {
      unlockNotice.innerHTML =
        `🎉 バッジ獲得！<br>${newlyUnlocked.map(item => escapeHtml(item.title)).join("・")}`;
      unlockNotice.classList.remove("hidden");
    } else {
      unlockNotice.textContent = "";
      unlockNotice.classList.add("hidden");
    }

    $("#resultReviewFilter").value = "all";
    renderResultAnswers();
    renderHome();
    renderBadges();
  }
  function showSetup() {
    hidePracticeFlash();
    if("speechSynthesis" in window) speechSynthesis.cancel();
    $("#quizArea").classList.add("hidden");
    $("#resultArea").classList.add("hidden");
    $("#practiceSetup").classList.remove("hidden");
    const unlockNotice = $("#achievementUnlockNotice");
    if (unlockNotice) {
      unlockNotice.textContent = "";
      unlockNotice.classList.add("hidden");
    }
    updatePracticeAvailability();
  }

  function parseSynonymInput(value) {
    return normalizeSynonyms(String(value || "").split(/[,、\n]+/));
  }

  function allRegisteredEnglishForms() {
    const map = new Map();
    for (const word of allWords()) {
      for (const form of wordForms(word)) map.set(form.toLowerCase(), word);
    }
    return map;
  }

  function initCustomWords() {
    $("#previewCustom").addEventListener("click", () => {
      const en=$("#customEnglish").value.trim();
      if(!en){ $("#customMessage").textContent="英単語を入力してください。"; return; }
      speak(en);
      const jp=$("#customJapanese").value.trim();
      const synonyms=parseSynonymInput($("#customSynonyms").value);
      const synonymText=synonyms.length ? `／関連語：${synonyms.join("、")}` : "";
      $("#customMessage").textContent=jp ? `${en}：${jp}${synonymText}` : `${en}（日本語は未入力です）${synonymText}`;
    });
    $("#addCustom").addEventListener("click", () => {
      const english=$("#customEnglish").value.trim();
      const japanese=$("#customJapanese").value.trim();
      const synonyms=parseSynonymInput($("#customSynonyms").value);
      const topic=$("#customTopic").value;
      if(!/^[A-Za-z][A-Za-z .'-]*$/.test(english)){ $("#customMessage").textContent="英単語は半角英字を中心に、空白・ハイフンなどで入力してください。"; return; }
      if(!japanese){ $("#customMessage").textContent="日本語を入力してください。"; return; }
      if(synonyms.some(form => !/^[A-Za-z][A-Za-z .'-]*$/.test(form))){ $("#customMessage").textContent="同義語も半角英字を中心に入力し、複数ある場合はカンマで区切ってください。"; return; }
      if(synonyms.some(form => form.toLowerCase() === english.toLowerCase())){ $("#customMessage").textContent="同じ英語表現を重複して登録しないでください。"; return; }
      const registered=allRegisteredEnglishForms();
      const collision=[english,...synonyms].find(form=>registered.has(form.toLowerCase()));
      if(collision){ $("#customMessage").textContent=`「${collision}」はすでに単語として登録されています。`; return; }

      const forms=[english,...synonyms];
      const group=forms.length>1 ? `custom-syn-${generateCustomWordId("g")}` : "";
      const created=forms.map((form,index)=>({
        id:generateCustomWordId(index===0 ? "c" : "cs"),
        english:form,
        japanese,
        topic,
        source:"custom",
        ...(group ? { synonymGroup:group, synonymKind:"同義語・言い換え" } : {})
      }));
      customWords.push(...created);
      save(STORAGE.custom,customWords);
      $("#customEnglish").value=""; $("#customJapanese").value=""; $("#customSynonyms").value="";
      $("#customMessage").textContent=created.length>1
        ? `${created.length}語をそれぞれ独立した単語として登録し、同義語グループで関連づけました。`
        : "登録しました。";
      renderWords(); renderHome(); updatePracticeAvailability();
    });
  }

  function compareText(a, b, language = "ja") {
    return String(a).localeCompare(String(b), language, { sensitivity: "base", numeric: true });
  }
  function sortWords(words) {
    const categoryOrder = Object.keys(topics);
    const direction = wordSort.direction === "asc" ? 1 : -1;
    return [...words].sort((a, b) => {
      let result = 0;
      if (wordSort.key === "enabled") {
        result = Number(isEnabled(a)) - Number(isEnabled(b));
      } else if (wordSort.key === "english") {
        result = compareText(a.english, b.english, "en");
      } else if (wordSort.key === "japanese") {
        result = compareText(a.japanese, b.japanese, "ja");
      } else if (wordSort.key === "topic") {
        const ai = categoryOrder.indexOf(a.topic);
        const bi = categoryOrder.indexOf(b.topic);
        result = (ai < 0 ? categoryOrder.length : ai) - (bi < 0 ? categoryOrder.length : bi);
      } else if (wordSort.key === "source") {
        result = compareText(a.source, b.source, "en");
      }
      if (result === 0) result = compareText(a.english, b.english, "en");
      return result * direction;
    });
  }
  function updateSortHeaders() {
    $$(".sort-button").forEach(button => {
      const active = button.dataset.sort === wordSort.key;
      const th = button.closest("th");
      const indicator = button.querySelector(".sort-indicator");
      th.setAttribute("aria-sort", active ? (wordSort.direction === "asc" ? "ascending" : "descending") : "none");
      indicator.textContent = active ? (wordSort.direction === "asc" ? "▲" : "▼") : "";
    });
  }
  function filteredWords() {
    const q=$("#wordSearch").value.trim().toLowerCase();
    const topic=$("#wordTopicFilter").value;
    const enabled=$("#wordEnabledFilter").value;
    const source=$("#wordSourceFilter").value;
    const learning=$("#wordLearningFilter").value;
    const synonym=$("#wordSynonymFilter").value;
    const antonym=$("#wordAntonymFilter").value;

    const filtered = allWords().filter(w=>{
      const progress=getWordProgress(w.id);
      const learningMatch =
        learning==="all"
        || (learning==="review" && progress.review)
        || (learning==="untried" && progress.attempts===0)
        || (learning==="attempted" && progress.attempts>0);

      return (
        (!q || w.english.toLowerCase().includes(q) || w.japanese.toLowerCase().includes(q) || synonymFormsForDisplay(w).some(form=>form.toLowerCase().includes(q)) || antonymFormsForDisplay(w).some(form=>form.toLowerCase().includes(q))) &&
        (topic==="all" || w.topic===topic) &&
        (source==="all" || w.source===source) &&
        (enabled==="all" || (enabled==="enabled" ? isEnabled(w) : !isEnabled(w))) &&
        (synonym==="all" || (synonym==="yes" ? hasSynonyms(w) : !hasSynonyms(w))) &&
        (antonym==="all" || (antonym==="yes" ? hasAntonyms(w) : !hasAntonyms(w))) &&
        learningMatch
      );
    });
    return sortWords(filtered);
  }
  function renderWords() {
    const words=filteredWords(); visibleWordIds=words.map(w=>w.id);
    updateSortHeaders();
    $("#wordTableBody").innerHTML=words.map(w=>{
      const learningStatus=wordLearningStatus(w);
      return `<tr>
      <td><input type="checkbox" class="word-enabled" data-id="${w.id}" ${isEnabled(w)?"checked":""} aria-label="${escapeHtml(w.english)}を出題"></td>
      <td><span class="learning-status ${learningStatus.type}">${escapeHtml(learningStatus.label)}</span></td>
      <td>
        <div class="word-with-synonyms"><strong>${escapeHtml(w.english)}</strong>
          ${hasSynonyms(w) ? `<span class="synonym-kind">${escapeHtml(synonymRelationKind(w))}</span><span class="synonym-inline">同義語・言い換え：${synonymFormsForDisplay(w).map(escapeHtml).join(" / ")}</span>` : ""}
          ${hasAntonyms(w) ? `<span class="antonym-kind">${escapeHtml(antonymRelationKinds(w).join("・"))}</span><span class="antonym-inline">対になる語：${antonymFormsForDisplay(w).map(escapeHtml).join(" / ")}</span>` : ""}
        </div>
      </td><td>${escapeHtml(w.japanese)}</td><td>${topics[w.topic]||w.topic}</td>
      <td>${w.source==="preset"?"プリセット":"個別登録"}</td>
      <td><div class="word-audio-buttons"><button class="icon-button speak-word" data-text="${escapeHtml(w.english)}" title="${escapeHtml(w.english)} を読み上げ" aria-label="${escapeHtml(w.english)}を読み上げ">🔊<span>${escapeHtml(w.english)}</span></button></div></td>
      <td>${w.source==="custom"?`<button class="danger-outline delete-word" data-id="${w.id}">削除</button>`:"—"}</td>
    </tr>`;
    }).join("");
    $("#wordCountLabel").textContent=`${words.length}件表示／全${allWords().length}件`;
    $$(".word-enabled").forEach(x=>x.addEventListener("change",e=>{setEnabled(e.target.dataset.id,e.target.checked);renderHome();updatePracticeAvailability();}));
    $$(".speak-word").forEach(x=>x.addEventListener("click",e=>speak(e.currentTarget.dataset.text)));
    $$(".delete-word").forEach(x=>x.addEventListener("click",e=>{
      const id=e.currentTarget.dataset.id, w=customWords.find(x=>x.id===id);
      if(w && confirm(`「${w.english}」を削除しますか？`)){
        customWords=customWords.filter(x=>x.id!==id);
        disabledIds.delete(id);
        delete wordProgress[id];
        for (const source of Object.values(syncState?.sources || {})) delete source.words?.[id];
        save(STORAGE.sync,syncState);
        save(STORAGE.custom,customWords);
        save(STORAGE.disabled,[...disabledIds]);
        save(STORAGE.wordProgress,wordProgress);
        renderWords();renderHome();updatePracticeAvailability();
      }
    }));
  }
  function speechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function recognitionLanguage() {
    const voice = getSelectedVoice();
    const lang = String(voice?.lang || "").replace("_", "-");
    return /^en(?:-|$)/i.test(lang) ? lang : "en-US";
  }

  function voiceSearchErrorMessage(error) {
    const messages = {
      "not-allowed": "マイクの利用が許可されていません。ブラウザのサイト設定でマイクを許可してください。",
      "service-not-allowed": "この環境では音声認識サービスの利用が許可されていません。",
      "audio-capture": "利用できるマイクを確認できませんでした。端末のマイク設定をご確認ください。",
      "no-speech": "音声を認識できませんでした。マイクに近づいて、もう一度お試しください。",
      "network": "音声認識の通信に失敗しました。インターネット接続が必要な環境では通信状態をご確認ください。",
      "language-not-supported": "選択中の英語の言語設定では音声認識を利用できませんでした。",
      "aborted": "音声検索を中止しました。"
    };
    return messages[error] || `音声認識でエラーが発生しました（${error || "unknown"}）。`;
  }

  function initVoiceSearch() {
    const button = $("#voiceSearch");
    const status = $("#voiceSearchStatus");
    const input = $("#wordSearch");
    if (!button || !status || !input) return;

    const Recognition = speechRecognitionConstructor();
    if (!Recognition) {
      button.disabled = true;
      status.textContent = "このブラウザでは音声検索（β）を利用できません。キーボード検索は通常どおり利用できます。";
      status.classList.add("warning-text");
      return;
    }

    let recognition = null;
    let listening = false;

    const finish = () => {
      listening = false;
      button.disabled = false;
      button.classList.remove("listening");
      button.innerHTML = '音声検索 <span class="beta-mark">β</span>';
      recognition = null;
    };

    button.addEventListener("click", () => {
      if (listening) return;

      recognition = new Recognition();
      recognition.lang = recognitionLanguage();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        listening = true;
        button.disabled = true;
        button.classList.add("listening");
        button.textContent = "聞き取り中…";
        status.classList.remove("warning-text", "success-text");
        status.textContent = "英単語または短い英語表現を話してください。ブラウザの認識結果を検索欄へ入力します。";
      };

      recognition.onresult = event => {
        const transcript = String(event.results?.[0]?.[0]?.transcript || "").trim();
        if (!transcript) {
          status.textContent = "音声から検索文字を取得できませんでした。もう一度お試しください。";
          status.classList.add("warning-text");
          return;
        }

        input.value = transcript;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        status.textContent = `ブラウザは「${transcript}」と認識しました。検索欄へ入力して検索しました。`;
        status.classList.remove("warning-text");
        status.classList.add("success-text");
      };

      recognition.onerror = event => {
        status.textContent = voiceSearchErrorMessage(event.error);
        status.classList.remove("success-text");
        status.classList.add("warning-text");
      };

      recognition.onend = finish;

      try {
        recognition.start();
      } catch (error) {
        finish();
        status.textContent = `音声検索を開始できませんでした（${error.message || "unknown"}）。`;
        status.classList.remove("success-text");
        status.classList.add("warning-text");
      }
    });
  }

  function initWordList() {
    ["#wordSearch","#wordTopicFilter","#wordEnabledFilter","#wordSourceFilter","#wordLearningFilter","#wordSynonymFilter","#wordAntonymFilter"].forEach(s=>$(s).addEventListener("input",renderWords));
    $$(".sort-button").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (wordSort.key === key) wordSort.direction = wordSort.direction === "asc" ? "desc" : "asc";
      else wordSort = { key, direction: "asc" };
      renderWords();
    }));
    $("#enableVisible").addEventListener("click",()=>{visibleWordIds.forEach(id=>setEnabled(id,true));renderWords();renderHome();updatePracticeAvailability();});
    $("#disableVisible").addEventListener("click",()=>{visibleWordIds.forEach(id=>setEnabled(id,false));renderWords();renderHome();updatePracticeAvailability();});
    $("#exportWords").addEventListener("click",()=>downloadCsv(
      "english_words",
      ["id","english","japanese","category","source","synonym_group","synonym_relation_type","synonym_words","antonym_relation_type","antonym_words","enabled","attempts","correct","wrong","review_target","review_correct_streak"],
      allWords().map(w=>{
        const p=getWordProgress(w.id);
        return [
          w.id,
          w.english,
          w.japanese,
          topics[w.topic]||w.topic,
          w.source==="preset"?"preset":"custom",
          wordSynonymGroupKey(w),
          synonymRelationKind(w),
          synonymFormsForDisplay(w).join(" / "),
          antonymRelationKinds(w).join(" / "),
          antonymFormsForDisplay(w).join(" / "),
          isEnabled(w)?"1":"0",
          p.attempts,
          p.correct,
          p.wrong,
          p.review?"1":"0",
          p.reviewCorrectStreak
        ];
      })
    ));
  }

  function downloadJson(prefix, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type:"application/json;charset=utf-8" });
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
    a.href = URL.createObjectURL(blob);
    a.download = `${prefix}_${stamp}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportLearningData() {
    const payload = {
      format: "english-word-practice-learning-data",
      schemaVersion: DATA_SCHEMA_VERSION,
      appVersion: APP_VERSION,
      exportedAt: new Date().toISOString(),
      exportedBy: syncState.deviceId,
      data: {
        customWords,
        disabledIds: [...disabledIds],
        history,
        achievements,
        sync: {
          schemaVersion: DATA_SCHEMA_VERSION,
          sources: syncState.sources
        }
      }
    };
    downloadJson("english_word_practice_learning_data", payload);
  }

  function mergeSameSourceWord(localRaw, incomingRaw) {
    const local = normalizeSyncWordEntry(localRaw);
    const incoming = normalizeSyncWordEntry(incomingRaw);
    const firsts = [local.firstAttemptedAt, incoming.firstAttemptedAt].filter(Boolean).sort();
    const lasts = [local.lastAttemptedAt, incoming.lastAttemptedAt].filter(Boolean).sort();
    const baselines = [local.baseline, incoming.baseline].filter(x => x?.at).sort((a,b) => a.at.localeCompare(b.at));
    const forms = {};
    for (const key of new Set([...Object.keys(local.forms), ...Object.keys(incoming.forms)])) {
      const a = normalizeSyncFormEntry(local.forms[key]);
      const b = normalizeSyncFormEntry(incoming.forms[key]);
      const formFirsts = [a.firstAttemptedAt, b.firstAttemptedAt].filter(Boolean).sort();
      const formLasts = [a.lastAttemptedAt, b.lastAttemptedAt].filter(Boolean).sort();
      forms[key] = {
        attempts: Math.max(a.attempts, b.attempts),
        correct: Math.max(a.correct, b.correct),
        wrong: Math.max(a.wrong, b.wrong),
        firstAttemptedAt: formFirsts[0] || "",
        lastAttemptedAt: formLasts.at(-1) || ""
      };
    }
    return {
      attempts: Math.max(local.attempts, incoming.attempts),
      correct: Math.max(local.correct, incoming.correct),
      wrong: Math.max(local.wrong, incoming.wrong),
      firstAttemptedAt: firsts[0] || "",
      lastAttemptedAt: lasts.at(-1) || "",
      forms,
      baseline: baselines.at(-1) || null,
      recentAnswers: dedupeRecentAnswers([...local.recentAnswers, ...incoming.recentAnswers]).slice(-3)
    };
  }

  function prepareImportedCustomWords(importedWords, schemaVersion) {
    const prepared = [];
    const legacyMappings = [];
    for (const raw of Array.isArray(importedWords) ? importedWords : []) {
      if (!raw || typeof raw.id !== "string" || typeof raw.english !== "string") continue;
      const english = raw.english.trim();
      const japanese = String(raw.japanese || "").trim();
      if (!english || !japanese) continue;
      const topic = topics[raw.topic] ? raw.topic : "other";
      const legacyForms = normalizeSynonyms(raw.synonyms);
      const shouldExpandLegacy = Number(schemaVersion) < 2 && legacyForms.length > 0;
      const group = String(raw.synonymGroup || (shouldExpandLegacy ? `legacy-syn-${raw.id}` : "")).trim();
      const kind = String(raw.synonymKind || "同義語・言い換え");

      prepared.push({
        id:raw.id,
        english,
        japanese,
        topic,
        source:"custom",
        ...(group ? { synonymGroup:group, synonymKind:kind } : {})
      });

      if (shouldExpandLegacy) {
        legacyForms.forEach((form, index) => {
          const childId = `${raw.id}_syn${index + 1}`;
          prepared.push({
            id:childId,
            english:form,
            japanese,
            topic,
            source:"custom",
            synonymGroup:group,
            synonymKind:kind
          });
          legacyMappings.push({ parentId:raw.id, parentEnglish:english, childId, form });
        });
      }
    }
    return { prepared, legacyMappings };
  }

  function mergeCustomWordsForImport(importedWords, schemaVersion) {
    const { prepared, legacyMappings } = prepareImportedCustomWords(importedWords, schemaVersion);
    const idMap = new Map();
    let added = 0;
    const allByEnglish = new Map(allWords().map(word => [String(word.english).trim().toLowerCase(), word]));
    const allById = new Map(allWords().map(word => [word.id, word]));
    const groupRemap = new Map();

    for (const raw of prepared) {
      const incomingGroup = String(raw.synonymGroup || "").trim();
      if (!incomingGroup || groupRemap.has(incomingGroup)) continue;
      const existing = allByEnglish.get(raw.english.toLowerCase());
      const existingGroup = existing ? wordSynonymGroupKey(existing) : "";
      if (existingGroup) groupRemap.set(incomingGroup, existingGroup);
    }

    for (const raw of prepared) {
      const englishKey = raw.english.toLowerCase();
      const incomingGroup = String(raw.synonymGroup || "").trim();
      const localGroup = incomingGroup ? (groupRemap.get(incomingGroup) || incomingGroup) : "";
      const byId = allById.get(raw.id);
      const byEnglish = allByEnglish.get(englishKey);
      const existing = byId && String(byId.english).trim().toLowerCase() === englishKey ? byId : byEnglish;

      if (existing) {
        if (localGroup && !wordSynonymGroupKey(existing)) {
          existing.synonymGroup = localGroup;
          existing.synonymKind = raw.synonymKind || "同義語・言い換え";
        }
        idMap.set(raw.id, existing.id);
        continue;
      }

      let id = raw.id;
      if (allById.has(id)) id = generateCustomWordId("c");
      const word = {
        id,
        english:raw.english,
        japanese:raw.japanese,
        topic:raw.topic,
        source:"custom",
        ...(localGroup ? { synonymGroup:localGroup, synonymKind:raw.synonymKind || "同義語・言い換え" } : {})
      };
      customWords.push(word);
      allById.set(id, word);
      allByEnglish.set(englishKey, word);
      idMap.set(raw.id, id);
      added += 1;
    }

    // 同じ取り込みグループに属する既存語も、決定したローカルグループへそろえる。
    for (const raw of prepared) {
      const incomingGroup = String(raw.synonymGroup || "").trim();
      if (!incomingGroup) continue;
      const localGroup = groupRemap.get(incomingGroup) || incomingGroup;
      const localId = idMap.get(raw.id);
      const word = allWords().find(item => item.id === localId);
      if (word && !presetSynonymGroupById.has(word.id)) {
        word.synonymGroup = localGroup;
        word.synonymKind = raw.synonymKind || word.synonymKind || "同義語・言い換え";
      }
    }

    return { idMap, added, legacyMappings };
  }

  function remapImportedWordId(id, idMap) {
    return idMap.get(id) || id;
  }

  function mergeImportedSync(importedSync, idMap, schemaVersion, legacyMappings = []) {
    let addedSources = 0;
    const sources = importedSync?.sources;
    if (!sources || typeof sources !== "object" || Array.isArray(sources)) return addedSources;

    for (const [sourceId, rawSource] of Object.entries(sources)) {
      if (!sourceId) continue;
      const incoming = normalizeSyncSource(rawSource);
      if (Number(schemaVersion) < 2) {
        splitLegacyEntriesInSource(incoming, legacyMappings);
      }
      const remappedWords = {};
      for (const [wordId, entry] of Object.entries(incoming.words)) {
        const targetId = remapImportedWordId(wordId, idMap);
        remappedWords[targetId] = remappedWords[targetId]
          ? mergeSameSourceWord(remappedWords[targetId], entry)
          : normalizeSyncWordEntry(entry);
      }
      incoming.words = remappedWords;

      if (!syncState.sources[sourceId]) {
        syncState.sources[sourceId] = incoming;
        addedSources += 1;
        continue;
      }

      const local = normalizeSyncSource(syncState.sources[sourceId]);
      local.createdAt = [local.createdAt, incoming.createdAt].filter(Boolean).sort()[0] || local.createdAt;
      local.sessions.completedSessions = Math.max(local.sessions.completedSessions, incoming.sessions.completedSessions);
      local.sessions.perfectSessions = Math.max(local.sessions.perfectSessions, incoming.sessions.perfectSessions);
      for (const mode of ["reading","writing","listening"]) {
        local.sessions.correct[mode] = Math.max(local.sessions.correct[mode], incoming.sessions.correct[mode]);
      }
      for (const [wordId, entry] of Object.entries(incoming.words)) {
        local.words[wordId] = local.words[wordId]
          ? mergeSameSourceWord(local.words[wordId], entry)
          : normalizeSyncWordEntry(entry);
      }
      syncState.sources[sourceId] = local;
    }
    return addedSources;
  }

  function mergeAchievements(importedAchievements) {
    if (!importedAchievements || typeof importedAchievements !== "object" || Array.isArray(importedAchievements)) return;
    for (const [id, at] of Object.entries(importedAchievements)) {
      if (typeof at !== "string") continue;
      if (!achievements[id] || at < achievements[id]) achievements[id] = at;
    }
  }

  async function importLearningData(file) {
    const text = await file.text();
    const payload = JSON.parse(text);
    if (!payload || payload.format !== "english-word-practice-learning-data" || ![1,2].includes(Number(payload.schemaVersion)) || !payload.data) {
      throw new Error("このアプリの学習データJSONではありません。");
    }

    const importSchemaVersion = Number(payload.schemaVersion) || 1;
    const { idMap, added: addedWords, legacyMappings: customLegacyMappings } = mergeCustomWordsForImport(payload.data.customWords, importSchemaVersion);
    const importLegacyMappings = importSchemaVersion < 2
      ? [...legacyPresetSplitMappings(), ...customLegacyMappings]
      : [];
    const existingHistoryIds = new Set(history.map(item => item.id));
    let addedHistory = 0;
    for (const item of Array.isArray(payload.data.history) ? payload.data.history : []) {
      if (!item || typeof item.id !== "string" || existingHistoryIds.has(item.id)) continue;
      history.push(item);
      existingHistoryIds.add(item.id);
      addedHistory += 1;
    }
    history.sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));

    const importedDisabled = new Set(Array.isArray(payload.data.disabledIds) ? payload.data.disabledIds : []);
    for (const id of importedDisabled) disabledIds.add(remapImportedWordId(id, idMap));
    if (importSchemaVersion < 2) {
      for (const mapping of importLegacyMappings) {
        if (importedDisabled.has(mapping.parentId)) disabledIds.add(remapImportedWordId(mapping.childId, idMap));
      }
    }

    const addedSources = mergeImportedSync(payload.data.sync, idMap, importSchemaVersion, importLegacyMappings);
    mergeAchievements(payload.data.achievements);

    save(STORAGE.custom, customWords);
    save(STORAGE.disabled, [...disabledIds]);
    save(STORAGE.history, history);
    save(STORAGE.achievements, achievements);
    save(STORAGE.sync, syncState);
    rebuildLearningCachesFromSync();
    const unlockedByMerge = evaluateAchievements(false);
    if (unlockedByMerge.length) save(STORAGE.achievements, achievements);

    renderHome();
    renderWords();
    renderHistory();
    renderBadges();
    updatePracticeAvailability();
    return { addedWords, addedHistory, addedSources };
  }

  function resetLearningProgress() {
    if (!confirm("バッジ実績と単語ごとの挑戦・復習状況をリセットします。スコア履歴と登録単語は残ります。続けますか？")) return;
    if (!confirm("この操作では、バッジの累計値・獲得状況・未挑戦/復習対象などの学習進捗を0からやり直します。本当にリセットしますか？")) return;
    const typed = prompt("最終確認です。リセットする場合は「リセット」と入力してください。");
    if (typed !== "リセット") {
      alert("入力が一致しなかったため、リセットしませんでした。");
      return;
    }

    const deviceId = syncState?.deviceId || generateDeviceId();
    syncState = { schemaVersion:DATA_SCHEMA_VERSION, deviceId, sources:{ [deviceId]:defaultSyncSource() } };
    wordProgress = {};
    learningStats = defaultLearningStats();
    learningStats.migratedFromHistory = true;
    achievements = {};
    save(STORAGE.sync, syncState);
    save(STORAGE.wordProgress, wordProgress);
    save(STORAGE.learningStats, learningStats);
    save(STORAGE.achievements, achievements);
    renderHome();
    renderWords();
    renderBadges();
    updatePracticeAvailability();
    alert("バッジ実績と挑戦・復習状況をリセットしました。スコア履歴と登録単語は残しています。");
  }

  function renderHistory() {
    $("#historyTableBody").innerHTML=history.map(h=>{
      const d=h.detail||{reading:[0,0],writing:[0,0],listening:[0,0]};
      const f=k=>`${d[k]?.[0]||0}/${d[k]?.[1]||0}`;
      return `<tr><td>${formatDate(h.date)}</td><td>${h.total}</td><td>${h.correct}</td><td><strong>${h.percent}%</strong></td>
      <td>${f("reading")}</td><td>${f("writing")}</td><td>${f("listening")}</td>
      <td><button class="danger-outline delete-history" data-id="${h.id}">削除</button></td></tr>`;
    }).join("");
    $("#historyEmpty").classList.toggle("hidden",history.length>0);
    $$(".delete-history").forEach(x=>x.addEventListener("click",e=>{
      if(confirm("この履歴を削除しますか？")){history=history.filter(h=>h.id!==e.currentTarget.dataset.id);save(STORAGE.history,history);renderHistory();renderHome();}
    }));
  }
  function initHistory() {
    $("#deleteAllHistory").addEventListener("click",()=>{if(history.length&&confirm("スコア履歴をすべて削除しますか？")){history=[];save(STORAGE.history,history);renderHistory();renderHome();}});
    $("#exportHistory").addEventListener("click",()=>downloadCsv("english_score_history",
      ["date","total","correct","percent","reading_correct","reading_total","writing_correct","writing_total","listening_correct","listening_total"],
      history.map(h=>[formatDate(h.date),h.total,h.correct,h.percent,...(h.detail?.reading||[0,0]),...(h.detail?.writing||[0,0]),...(h.detail?.listening||[0,0])])));

    $("#exportLearningData").addEventListener("click", exportLearningData);
    $("#importLearningData").addEventListener("click", () => $("#importLearningDataFile").click());
    $("#importLearningDataFile").addEventListener("change", async e => {
      const file = e.target.files?.[0];
      const message = $("#learningDataMessage");
      if (!file) return;
      try {
        const result = await importLearningData(file);
        message.textContent = `マージしました。追加履歴 ${result.addedHistory}件・追加登録単語 ${result.addedWords}件・新しい端末データ ${result.addedSources}件。重複データは二重加算していません。`;
        message.className = "note data-message good";
      } catch (error) {
        console.error(error);
        message.textContent = `読み込みできませんでした：${error.message || "JSONを確認してください。"}`;
        message.className = "note data-message bad";
      } finally {
        e.target.value = "";
      }
    });
  }
  function downloadCsv(prefix,headers,rows) {
    const esc=v=>`"${String(v??"").replace(/"/g,'""')}"`;
    const csv="\uFEFF"+[headers,...rows].map(r=>r.map(esc).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const a=document.createElement("a");
    const stamp=new Date().toISOString().replace(/[-:T]/g,"").slice(0,14);
    a.href=URL.createObjectURL(blob); a.download=`${prefix}_${stamp}.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function init() {
    initializeLearningData();
    initNavigation();
    initTheme();
    populateTopics();
    initVoiceSettings();
    initPracticeSettings();
    initCustomWords();
    initWordList();
    initVoiceSearch();
    initHistory();
    $("#resetLearningProgress").addEventListener("click", resetLearningProgress);
    renderHome();
    renderWords();
    renderBadges();
    renderHistory();
    updatePracticeAvailability();
  }
  document.addEventListener("DOMContentLoaded",init);
})();
