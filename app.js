(() => {
  "use strict";

  const STORAGE = {
    custom: "ewp_custom_words_v1",
    disabled: "ewp_disabled_words_v1",
    history: "ewp_score_history_v1",
    theme: "ewp_theme_v1",
    voice: "ewp_voice_v1"
  };

  const topics = {
    colors: "色", numbers: "数字", calendar: "カレンダー", family: "家族",
    stationery: "文房具", school: "学校", sports: "運動", jobs: "職業",
    animals: "動物", food: "食べ物", body: "からだ", nature: "自然",
    weather: "天気・気温", feelings: "気持ち・感情", other: "その他"
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
    ["glad","嬉しい","feelings"],["happy","幸せな","feelings"],["fun","楽しい","feelings"],["sad","悲しい","feelings"],["angry","怒った","feelings"],["scared","怖い","feelings"],["surprised","驚いた","feelings"],["excited","わくわくした","feelings"],["worried","心配な","feelings"],["tired","疲れた","feelings"]
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
  let quiz = null;
  let visibleWordIds = [];
  let lastSettings = null;
  let practiceFlashTimer = null;
  let voicePreviewInProgress = false;
  let wordSort = { key: "topic", direction: "asc" };

  function allWords() { return [...presetWords, ...customWords]; }
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
    $("#questionCount").value = "20";
    updatePracticeAvailability();
  }

  function initPracticeSettings() {
    $$('input[name="mode"],input[name="writingLevel"],input[name="source"]').forEach(x => x.addEventListener("change", updatePracticeAvailability));
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
      count: Number($("#questionCount").value)
    };
  }
  function eligibleWords(settings) {
    return allWords().filter(w => isEnabled(w) && settings.sources.includes(w.source) && settings.topics.includes(w.topic));
  }
  function updatePracticeAvailability() {
    $("#practiceAvailability").classList.remove("warning-text");
    const s=getSettings();
    const words=eligibleWords(s);
    const issues=[];
    if (!s.modes.length) issues.push("練習内容を選択してください。");
    if (s.modes.includes("writing") && !s.writingLevels.length) issues.push("書きの段階を選択してください。");
    if (!s.sources.length) issues.push("出題元を選択してください。");
    if (!s.topics.length) issues.push("カテゴリを選択してください。");
    if (words.length < 4) issues.push("条件に合う出題対象単語が4件以上必要です。");
    if (s.modes.includes("listening") && !("speechSynthesis" in window)) issues.push("このブラウザではリスニングを利用できません。");
    $("#practiceAvailability").textContent = issues.length ? issues[0] : `条件に合う単語：${words.length}件（繰り返し出題あり）`;
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
    if (pool.length < 4) {
      startButton.textContent = originalLabel;
      updatePracticeAvailability();
      focusPracticeSettings(
        "現在の設定では、条件に合う出題対象単語が4件未満です。出題元またはカテゴリを見直してください。"
      );
      return;
    }

    lastSettings = JSON.parse(JSON.stringify(settings));
    const questions = [];

    for (let i = 0; i < settings.count; i++) {
      const mode = settings.modes[Math.floor(Math.random() * settings.modes.length)];
      const word = pool[Math.floor(Math.random() * pool.length)];
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
    $("#quizModeBadge").textContent=labels[q.mode];
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
    $$(".answer-button").forEach(b=>{
      b.disabled=true;
      if(b.textContent.toLowerCase()===String(q.correct).toLowerCase()) b.classList.add("correct");
    });
    if(!correct) button.classList.add("wrong");
    $("#quizCorrect").textContent=quiz.correct;
    $("#feedback").textContent=correct ? "正解です！" : `正解：${q.correct}（${q.word.english}：${q.word.japanese}）`;
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
      correct:quiz.correct, percent, detail:quiz.detail
    };
    history.unshift(record); save(STORAGE.history,history);
    $("#quizArea").classList.add("hidden");
    $("#resultArea").classList.remove("hidden");
    $("#resultPercent").textContent=`${percent}%`;
    $("#resultCount").textContent=`${quiz.correct} / ${quiz.questions.length} 問正解`;
    const labels={reading:"読み",writing:"書き",listening:"リスニング"};
    $("#resultBreakdown").innerHTML=Object.entries(labels).map(([k,l])=>{
      const [c,t]=quiz.detail[k]; return `<div><strong>${l}</strong><br>${t?`${c} / ${t}`:"出題なし"}</div>`;
    }).join("");
    $("#resultReviewFilter").value = "all";
    renderResultAnswers();
    renderHome();
  }
  function showSetup() {
    hidePracticeFlash();
    if("speechSynthesis" in window) speechSynthesis.cancel();
    $("#quizArea").classList.add("hidden");
    $("#resultArea").classList.add("hidden");
    $("#practiceSetup").classList.remove("hidden");
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
    const topic=$("#wordTopicFilter").value, enabled=$("#wordEnabledFilter").value, source=$("#wordSourceFilter").value;
    const filtered = allWords().filter(w=>
      (!q || w.english.toLowerCase().includes(q) || w.japanese.toLowerCase().includes(q)) &&
      (topic==="all" || w.topic===topic) &&
      (source==="all" || w.source===source) &&
      (enabled==="all" || (enabled==="enabled" ? isEnabled(w) : !isEnabled(w)))
    );
    return sortWords(filtered);
  }
  function renderWords() {
    const words=filteredWords(); visibleWordIds=words.map(w=>w.id);
    updateSortHeaders();
    $("#wordTableBody").innerHTML=words.map(w=>`<tr>
      <td><input type="checkbox" class="word-enabled" data-id="${w.id}" ${isEnabled(w)?"checked":""} aria-label="${escapeHtml(w.english)}を出題"></td>
      <td><strong>${escapeHtml(w.english)}</strong></td><td>${escapeHtml(w.japanese)}</td><td>${topics[w.topic]||w.topic}</td>
      <td>${w.source==="preset"?"プリセット":"個別登録"}</td>
      <td><button class="icon-button speak-word" data-text="${escapeHtml(w.english)}">🔊</button></td>
      <td>${w.source==="custom"?`<button class="danger-outline delete-word" data-id="${w.id}">削除</button>`:"—"}</td>
    </tr>`).join("");
    $("#wordCountLabel").textContent=`${words.length}件表示／全${allWords().length}件`;
    $$(".word-enabled").forEach(x=>x.addEventListener("change",e=>{setEnabled(e.target.dataset.id,e.target.checked);renderHome();updatePracticeAvailability();}));
    $$(".speak-word").forEach(x=>x.addEventListener("click",e=>speak(e.currentTarget.dataset.text)));
    $$(".delete-word").forEach(x=>x.addEventListener("click",e=>{
      const id=e.currentTarget.dataset.id, w=customWords.find(x=>x.id===id);
      if(w && confirm(`「${w.english}」を削除しますか？`)){
        customWords=customWords.filter(x=>x.id!==id); disabledIds.delete(id);
        save(STORAGE.custom,customWords); save(STORAGE.disabled,[...disabledIds]); renderWords();renderHome();updatePracticeAvailability();
      }
    }));
  }
  function initWordList() {
    ["#wordSearch","#wordTopicFilter","#wordEnabledFilter","#wordSourceFilter"].forEach(s=>$(s).addEventListener("input",renderWords));
    $$(".sort-button").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (wordSort.key === key) wordSort.direction = wordSort.direction === "asc" ? "desc" : "asc";
      else wordSort = { key, direction: "asc" };
      renderWords();
    }));
    $("#enableVisible").addEventListener("click",()=>{visibleWordIds.forEach(id=>setEnabled(id,true));renderWords();renderHome();updatePracticeAvailability();});
    $("#disableVisible").addEventListener("click",()=>{visibleWordIds.forEach(id=>setEnabled(id,false));renderWords();renderHome();updatePracticeAvailability();});
    $("#exportWords").addEventListener("click",()=>downloadCsv("english_words",["english","japanese","category","source","enabled"],
      allWords().map(w=>[w.english,w.japanese,topics[w.topic]||w.topic,w.source==="preset"?"preset":"custom",isEnabled(w)?"1":"0"])));
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
    renderHistory();
    updatePracticeAvailability();
  }
  document.addEventListener("DOMContentLoaded",init);
})();
