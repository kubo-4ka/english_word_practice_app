(() => {
  "use strict";

  const STORAGE = {
    custom: "ewp_custom_words_v1",
    disabled: "ewp_disabled_words_v1",
    history: "ewp_score_history_v1",
    theme: "ewp_theme_v1",
    voice: "ewp_voice_v1",
    wordProgress: "ewp_word_progress_v1",
    learningStats: "ewp_learning_stats_v1",
    achievements: "ewp_achievements_v1"
  };

  const topics = {
    colors: "色",
    numbers: "数字",
    calendar: "カレンダー",
    family: "家族",
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

  const BADGE_MESSAGES = [
    ["はじめの一歩！この調子で続けよう！","Great start! Keep going!"],
    ["いいペース！少しずつ力になっているよ！","Nice pace! Keep it up!"],
    ["継続できているね！","Great work! Stay with it!"],
    ["もう慣れてきたね！","You're getting good!"],
    ["かなり力がついてきた！","You're getting stronger!"],
    ["もうすぐ大台！","Almost there!"],
    ["100達成！すごい！","Amazing! You reached 100!"],
    ["すごい継続力！","Great dedication!"],
    ["かなりの達人だね！","You're becoming an expert!"],
    ["マスター目前！","Almost a master!"],
    ["もうマスターだね！","You're a word master!"]
  ];

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
    ["beach","砂浜","nature"],
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
    ["supermarket","スーパーマーケット","buildings"],
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
    ["convenience store","コンビニ","buildings"],
    ["city hall","市役所","buildings"],
    ["movie theater","映画館","buildings"],
    ["shopping mall","ショッピングモール","buildings"],
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
    ["television","テレビ","home"],
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
    ["go shopping","買い物に行く","dailyActions"],
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
    ["friend","友達","other"],
    ["people","人々","other"],
    ["person","人","other"],
    ["child","子ども","other"],
    ["boy","男の子","other"],
    ["girl","女の子","other"],
    ["man","男性","other"],
    ["woman","女性","other"],
    ["name","名前","other"],
    ["thing","物","other"],
    ["place","場所","other"],
    ["idea","考え","other"],
    ["problem","問題","other"],
    ["question","質問","other"],
    ["answer","答え","other"],
    ["story","物語","other"],
    ["picture","絵・写真","other"],
    ["game","ゲーム","other"],
    ["party","パーティー","other"],
    ["birthday","誕生日","other"],
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
    ["store clerk","店員","jobs"],
    ["author","著者・作家","jobs"],
    ["cave","洞くつ","buildings"],
    ["shrine","神社","buildings"],
    ["art museum","美術館","buildings"],
    ["theater","劇場","buildings"],
    ["amusement park","遊園地","buildings"],
    ["science museum","科学博物館","buildings"],
    ["cafeteria","食堂","buildings"],
    ["gym","体育館","buildings"],
    ["schoolyard","校庭","buildings"],
    ["restroom","お手洗い","buildings"],
    ["science lab","理科室","buildings"],
    ["coffee shop","喫茶店","buildings"],
    ["store","店","buildings"],
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
    ["square","正方形","other"],
    ["circle","円","other"],
    ["triangle","三角形","other"],
    ["rectangle","長方形","other"],
    ["oval","だ円形","other"],
    ["flowerpot","植木鉢","other"],
    ["fountain","噴水","other"],
    ["bottle","びん・ボトル","other"],
    ["toy","おもちゃ","other"],
    ["present","プレゼント","other"],
    ["birthday cake","誕生日ケーキ","other"],
    ["party hat","パーティー帽子","other"],
    ["phone","電話","other"],
    ["screen","画面","other"],
    ["video game","テレビゲーム","other"],
    ["trip","旅行","other"],
    ["sunscreen","日焼け止め","other"],
    ["roof","屋根","other"],
    ["smoke","煙","other"],
    ["sandcastle","砂の城","other"],
    ["roller coaster","ジェットコースター","other"],
    ["plan","予定・計画","other"],
    ["favorite","お気に入りの","other"]
  ].map((w, i) => ({ id:`p${i+1}`, english:w[0], japanese:w[1], topic:w[2], source:"preset" }));

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
  let quiz = null;
  let visibleWordIds = [];
  let lastSettings = null;
  let practiceFlashTimer = null;
  let voicePreviewInProgress = false;
  let wordSort = { key: "topic", direction: "asc" };

  function allWords() { return [...presetWords, ...customWords]; }

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
    const now = new Date().toISOString();
    const progress = getWordProgress(id);
    const wasReview = progress.review;

    progress.attempts += 1;
    if (!progress.firstAttemptedAt) progress.firstAttemptedAt = now;
    progress.lastAttemptedAt = now;

    let reviewAdded = false;
    let reviewCleared = false;

    if (isCorrect) {
      progress.correct += 1;
      if (progress.review) {
        progress.reviewCorrectStreak += 1;
        if (progress.reviewCorrectStreak >= 2) {
          progress.review = false;
          progress.reviewCorrectStreak = 0;
          reviewCleared = true;
        }
      } else {
        progress.reviewCorrectStreak = 0;
      }
    } else {
      progress.wrong += 1;
      progress.review = true;
      progress.reviewCorrectStreak = 0;
      reviewAdded = !wasReview;
    }

    saveWordProgress(id, progress);

    return {
      progress,
      reviewAdded,
      reviewCleared,
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
    learningStats.completedSessions += 1;
    if (percent === 100) learningStats.perfectSessions += 1;

    for (const mode of ["reading","writing","listening"]) {
      learningStats.correct[mode] += Number(quiz.detail[mode]?.[0] || 0);
    }

    save(STORAGE.learningStats, learningStats);
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

  function renderBadges() {
    const summary = $("#achievementSummary");
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
    validAchievementIds.add("secret_all_clear");

    const unlockedCount = Object.keys(achievements)
      .filter(id => validAchievementIds.has(id))
      .length;

    summary.innerHTML = [
      [learningStats.completedSessions, "練習完了回数"],
      [learningStats.perfectSessions, "100%正解回数"],
      [learningStats.correct.reading, "読み・累計正解"],
      [learningStats.correct.writing, "書き・累計正解"],
      [learningStats.correct.listening, "リスニング・累計正解"],
      [`${attempted}/${words.length}`, "挑戦済み単語"],
      [review, "復習対象単語"],
      [`${unlockedCount}/56`, "獲得バッジ"]
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
        const [messageJa, messageEn] = BADGE_MESSAGES[index];
        const progressText = unlockedAt
          ? `獲得：${formatDate(unlockedAt)}`
          : `${Math.min(current, threshold)} / ${threshold}`;

        return `
          <div class="badge-item ${unlockedAt ? "" : "locked"}">
            ${badgeVisual(tier, !unlockedAt)}
            <div class="badge-info">
              <strong>${escapeHtml(series.short)} ${threshold}</strong>
              <span class="badge-condition">${escapeHtml(series.condition(threshold))}</span>
              <span class="badge-message-ja">${escapeHtml(messageJa)}</span>
              <span class="badge-message-en">${escapeHtml(messageEn)}</span>
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

    const secret = secretAchievementProgress();
    const secretUnlocked = achievements.secret_all_clear;

    secretArea.innerHTML = `
      <div class="secret-badge-layout">
        ${badgeVisual(
          { material:"rainbow", size:"large", label:"シークレット" },
          !secretUnlocked
        )}
        <div>
          <h3>${secretUnlocked ? "オールクリア獲得！" : "？？？ オールクリア"}</h3>
          <p class="secret-condition">
            現在登録されている全単語に1回以上挑戦し、復習対象を0件にすると解禁します。
          </p>
          <strong>${secretUnlocked ? "全部に出会って、苦手もゼロ！すごい！" : "全単語との出会いと、苦手ゼロを目指そう！"}</strong>
          <span class="badge-message-en">
            ${secretUnlocked ? "You cleared every word!" : "Meet every word and clear your review list!"}
          </span>
          <div class="secret-progress-grid">
            <span>挑戦済み ${secret.attempted} / ${secret.total}</span>
            <span>復習対象 ${secret.review}件</span>
            ${secretUnlocked ? `<span>獲得：${escapeHtml(formatDate(secretUnlocked))}</span>` : ""}
          </div>
        </div>
      </div>
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
      $("#startPractice").disabled = true;
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
    $("#questionCount").value = "20";
    updatePracticeAvailability();
  }

  function initPracticeSettings() {
    $$('input[name="mode"],input[name="writingLevel"],input[name="source"],input[name="studyMode"]').forEach(x => x.addEventListener("change", updatePracticeAvailability));
    $("#questionCount").addEventListener("change", updatePracticeAvailability);
    $("#checkAllTopics").addEventListener("click", () => { $$('input[name="topic"]').forEach(x=>x.checked=true); updatePracticeAvailability(); });
    $("#uncheckAllTopics").addEventListener("click", () => { $$('input[name="topic"]').forEach(x=>x.checked=false); updatePracticeAvailability(); });
    $("#selectRecommended").addEventListener("click", applyRecommendedSettings);
    $("#startRecommendedHome").addEventListener("click", () => {
      applyRecommendedSettings();
      showScreen("practice");
      if (!$("#startPractice").disabled) startPractice(null, { trigger: "recommended" });
    });
    $("#startPractice").addEventListener("click", () => startPractice(null, { trigger: "settings" }));
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

  function buildWordSequence(targetPool, count, allowRepeat = true) {
    if (!targetPool.length || count <= 0) return [];

    if (!allowRepeat) {
      return shuffle(targetPool).slice(0, count);
    }

    const result = [];
    let previousId = "";

    while (result.length < count) {
      let deck = shuffle(targetPool);

      if (
        deck.length > 1
        && previousId
        && deck[0].id === previousId
      ) {
        const swapIndex = deck.findIndex(word => word.id !== previousId);
        if (swapIndex > 0) {
          [deck[0], deck[swapIndex]] = [deck[swapIndex], deck[0]];
        }
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
    if (basePool.length < 4) {
      issues.push("条件に合う出題対象単語が4件以上必要です。");
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
    if (settings.studyMode === "review") {
      status = `復習対象：${targets.length}件／選択条件の単語：${basePool.length}件`;
    } else if (settings.studyMode === "untried") {
      status = `未挑戦：${targets.length}件／選択条件の単語：${basePool.length}件`;
      if (targets.length > 0 && targets.length < settings.count) {
        status += `（今回は${targets.length}問）`;
      }
    } else {
      status = `条件に合う単語：${basePool.length}件（全単語を一巡するまで重複を抑制）`;
    }

    $("#practiceAvailability").textContent = issues.length ? issues[0] : status;
    $("#startPractice").disabled = issues.length > 0 || voicePreviewInProgress;
  }

  function buildQuestion(word, mode, settings, pool) {
    if (mode === "reading") {
      return { word, mode, prompt:word.english, correct:word.japanese,
        choices:shuffle([word.japanese,...sample(pool.filter(x=>x.id!==word.id),3).map(x=>x.japanese)]) };
    }
    if (mode === "listening") {
      return { word, mode, prompt:word.english, correct:word.english,
        choices:shuffle([word.english,...sample(pool.filter(x=>x.id!==word.id),3).map(x=>x.english)]) };
    }
    const level = settings.writingLevels[Math.floor(Math.random()*settings.writingLevels.length)];
    if (level === "word" || word.english.replace(/[^a-z]/gi,"").length < 3) {
      return { word, mode, level:"word", prompt:word.japanese, correct:word.english,
        choices:shuffle([word.english,...sample(pool.filter(x=>x.id!==word.id),3).map(x=>x.english)]) };
    }
    const letters = [...word.english];
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
    return { word, mode, level:len===1?"one":"two", prompt:word.japanese, display, correct:missing,
      choices:shuffle([missing,...distractors]) };
  }

  async function startPractice(forcedSettings=null, options={}) {
    hidePracticeFlash();

    // clickイベントなどが誤って渡されても、練習設定として扱わない。
    const originalSettings = forcedSettings && Array.isArray(forcedSettings.modes)
      ? forcedSettings
      : getSettings();
    const settings = JSON.parse(JSON.stringify(originalSettings));

    const startButton = $("#startPractice");
    const originalLabel = startButton.textContent;

    if (settings.modes.includes("listening")) {
      startButton.disabled = true;
      startButton.textContent = "音声を確認中...";
      $("#practiceAvailability").classList.remove("warning-text");
      $("#practiceAvailability").textContent =
        "選択した音声を短く再生して、リスニングを利用できるか確認しています。";

      const playback = await checkSelectedVoicePlayback();

      startButton.textContent = originalLabel;

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

    if (pool.length < 4) {
      startButton.textContent = originalLabel;
      updatePracticeAvailability();
      focusPracticeSettings(
        "現在の設定では、条件に合う出題対象単語が4件未満です。出題元またはカテゴリを見直してください。"
      );
      return;
    }

    if (!targets.length) {
      startButton.textContent = originalLabel;
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
      settings.studyMode !== "untried"
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

    startButton.textContent = originalLabel;
    startButton.disabled = false;
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
    const studyLabel=studyLabels[quiz.settings.studyMode]||"";
    studyBadge.textContent=studyLabel;
    studyBadge.classList.toggle("hidden",!studyLabel);
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
      wordEnglish: q.word.english,
      wordJapanese: q.word.japanese,
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

    let feedbackText = "";
    if (!correct) {
      feedbackText = `正解：${q.correct}（${q.word.english}：${q.word.japanese}）`;
      feedbackText += progressUpdate.reviewAdded
        ? "　復習対象に追加しました。"
        : "　復習対象のままです。";
    } else if (progressUpdate.reviewCleared) {
      feedbackText = "正解です！ 2回連続正解で復習完了。復習対象から外れました。";
    } else if (progressUpdate.reviewPending) {
      feedbackText = "正解です！ あと1回連続正解で復習対象から外れます。";
    } else {
      feedbackText = "正解です！";
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

  function initCustomWords() {
    $("#previewCustom").addEventListener("click", () => {
      const en=$("#customEnglish").value.trim();
      if(!en){ $("#customMessage").textContent="英単語を入力してください。"; return; }
      speak(en);
      const jp=$("#customJapanese").value.trim();
      $("#customMessage").textContent=jp ? `${en}：${jp}` : `${en}（日本語は未入力です）`;
    });
    $("#addCustom").addEventListener("click", () => {
      const english=$("#customEnglish").value.trim();
      const japanese=$("#customJapanese").value.trim();
      const topic=$("#customTopic").value;
      if(!/^[A-Za-z][A-Za-z -]*$/.test(english)){ $("#customMessage").textContent="英単語は半角英字・空白・ハイフンで入力してください。"; return; }
      if(!japanese){ $("#customMessage").textContent="日本語を入力してください。"; return; }
      if(allWords().some(w=>w.english.toLowerCase()===english.toLowerCase())){ $("#customMessage").textContent="同じ英単語がすでに登録されています。"; return; }
      customWords.push({id:`c${Date.now()}`,english,japanese,topic,source:"custom"});
      save(STORAGE.custom,customWords);
      $("#customEnglish").value=""; $("#customJapanese").value="";
      $("#customMessage").textContent="登録しました。";
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

    const filtered = allWords().filter(w=>{
      const progress=getWordProgress(w.id);
      const learningMatch =
        learning==="all"
        || (learning==="review" && progress.review)
        || (learning==="untried" && progress.attempts===0)
        || (learning==="attempted" && progress.attempts>0);

      return (
        (!q || w.english.toLowerCase().includes(q) || w.japanese.toLowerCase().includes(q)) &&
        (topic==="all" || w.topic===topic) &&
        (source==="all" || w.source===source) &&
        (enabled==="all" || (enabled==="enabled" ? isEnabled(w) : !isEnabled(w))) &&
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
      <td><strong>${escapeHtml(w.english)}</strong></td><td>${escapeHtml(w.japanese)}</td><td>${topics[w.topic]||w.topic}</td>
      <td>${w.source==="preset"?"プリセット":"個別登録"}</td>
      <td><button class="icon-button speak-word" data-text="${escapeHtml(w.english)}">🔊</button></td>
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
        save(STORAGE.custom,customWords);
        save(STORAGE.disabled,[...disabledIds]);
        save(STORAGE.wordProgress,wordProgress);
        renderWords();renderHome();updatePracticeAvailability();
      }
    }));
  }
  function initWordList() {
    ["#wordSearch","#wordTopicFilter","#wordEnabledFilter","#wordSourceFilter","#wordLearningFilter"].forEach(s=>$(s).addEventListener("input",renderWords));
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
      ["english","japanese","category","source","enabled","attempts","correct","wrong","review_target","review_correct_streak"],
      allWords().map(w=>{
        const p=getWordProgress(w.id);
        return [
          w.english,
          w.japanese,
          topics[w.topic]||w.topic,
          w.source==="preset"?"preset":"custom",
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
    initHistory();
    renderHome();
    renderWords();
    renderBadges();
    renderHistory();
    updatePracticeAvailability();
  }
  document.addEventListener("DOMContentLoaded",init);
})();
