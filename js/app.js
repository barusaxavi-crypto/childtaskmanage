/**
 * プリンセス・ルーティン・クエスト (Princess Routine Quest)
 * クライアント完結型・PWA対応 スタンドアロンWebアプリ
 */

// ==================== 1. 初期データ定義 ====================
const DEFAULT_ITEMS = [
  { id: 't1', name: 'ダイヤモンド・ティアラ', rarity: 'SSR', icon: '👑', desc: '七色に輝く伝説のティアラ', category: 'head' },
  { id: 't2', name: 'ルビーのまほうドレス', rarity: 'SSR', icon: '👗', desc: '情熱的な赤のプリンセスドレス', category: 'dress' },
  { id: 't3', name: 'きらめくガラスのくつ', rarity: 'SSR', icon: '👠', desc: '星屑で作られた魔法の靴', category: 'shoes' },
  { id: 't4', name: 'ほしぞらのステッキ', rarity: 'SR', icon: '🪄', desc: '星の光を集めて放つステッキ', category: 'weapon' },
  { id: 't5', name: 'ユニコーンのポポ', rarity: 'SSR', icon: '🦄', desc: 'お城の庭に住む優しいユニコーン', category: 'pet' },
  { id: 't6', name: 'サファイア・ネックレス', rarity: 'SR', icon: '📿', desc: '夜空のように深い青の首飾り', category: 'acc' },
  { id: 't7', name: 'エメラルドのリング', rarity: 'SR', icon: '💍', desc: '森の妖精がくれた幸運の指輪', category: 'acc' },
  { id: 't8', name: 'エンジェルウィング', rarity: 'SR', icon: '🪽', desc: '背中にふわっと広がる光の翼', category: 'back' },
  { id: 't9', name: 'ピンクパールのイヤリング', rarity: 'R', icon: '✨', desc: '耳元で可愛く揺れる真珠', category: 'acc' },
  { id: 't10', name: 'おしろのしろちょう', rarity: 'R', icon: '🦋', desc: '花畑から遊びにきた蝶々', category: 'pet' },
  { id: 't11', name: 'すずらんのブーケ', rarity: 'R', icon: '💐', desc: 'いつもいい香りがする花束', category: 'weapon' },
  { id: 't12', name: 'まほうのコンパクト', rarity: 'R', icon: '🪞', desc: '覗くと笑顔になれる鏡', category: 'acc' },
  { id: 't13', name: 'いちごのティアラ', rarity: 'N', icon: '🍓', desc: '甘い香りのする可愛い王冠', category: 'head' },
  { id: 't14', name: 'リボンのカチューシャ', rarity: 'N', icon: '🎀', desc: '毎日つけたいお気に入りリボン', category: 'head' },
  { id: 't15', name: 'こぐまのぬいぐるみ', rarity: 'N', icon: '🧸', desc: '一緒に寝るといい夢が見られる', category: 'pet' },
  { id: 't16', name: 'おほしさまのバッジ', rarity: 'N', icon: '⭐', desc: 'きらきら光る星型バッジ', category: 'acc' }
];

const DEFAULT_DATA = {
  version: 2,
  mode: 'morning', // 'morning' | 'evening'
  layout: 'split', // 'split' (2人並列) | 'single' (1人)
  activeKidIndex: 0, // singleモード用
  soundEnabled: true,
  realRewardEnabled: true,
  realRewardText: 'すきなおやつ券 🍪',
  kids: [
    {
      id: 'k1',
      name: 'おねえちゃん',
      avatar: '👸',
      equipped: { head: '👑', dress: '👗' },
      coins: 3,
      inventory: ['t14', 't16'],
      streak: 4,
      lastDate: '',
      title: 'きらめきプリンセス'
    },
    {
      id: 'k2',
      name: 'いもうと',
      avatar: '👧',
      equipped: { head: '🎀', dress: '👗' },
      coins: 2,
      inventory: ['t13', 't15'],
      streak: 3,
      lastDate: '',
      title: 'みならいプリンセス'
    }
  ],
  tasks: [
    // 朝のタスク
    { id: 'task_m1', timeOfDay: 'morning', text: 'おきる', icon: '☀️', time: '07:00', targetKidId: 'all', order: 1 },
    { id: 'task_m2', timeOfDay: 'morning', text: 'かおをあらう ＆ おくすり', icon: '💊', time: '07:10', targetKidId: 'k1', order: 2 },
    { id: 'task_m3', timeOfDay: 'morning', text: 'おきがえする', icon: '👗', time: '07:20', targetKidId: 'all', order: 3 },
    { id: 'task_m4', timeOfDay: 'morning', text: 'あさごはんをたべる', icon: '🥞', time: '07:35', targetKidId: 'all', order: 4 },
    { id: 'task_m5', timeOfDay: 'morning', text: 'はみがきする', icon: '🦷', time: '07:55', targetKidId: 'all', order: 5 },
    { id: 'task_m6', timeOfDay: 'morning', text: 'ほいくえんのタオルじゅんび', icon: '🎒', time: '08:05', targetKidId: 'k2', order: 6 },
    { id: 'task_m7', timeOfDay: 'morning', text: 'すいとうをもつ', icon: '💧', time: '08:15', targetKidId: 'all', order: 7 },

    // 夜のタスク
    { id: 'task_e1', timeOfDay: 'evening', text: 'てあらい・うがい', icon: '🧼', time: '17:30', targetKidId: 'all', order: 1 },
    { id: 'task_e2', timeOfDay: 'evening', text: 'じかんわり・しゅくだい', icon: '📚', time: '18:00', targetKidId: 'k1', order: 2 },
    { id: 'task_e3', timeOfDay: 'evening', text: 'よるごはんをたべる', icon: '🍛', time: '18:30', targetKidId: 'all', order: 3 },
    { id: 'task_e4', timeOfDay: 'evening', text: 'おふろにはいる', icon: '🛁', time: '19:30', targetKidId: 'all', order: 4 },
    { id: 'task_e5', timeOfDay: 'evening', text: 'はみがきする', icon: '🦷', time: '20:15', targetKidId: 'all', order: 5 },
    { id: 'task_e6', timeOfDay: 'evening', text: 'よるのおくすり', icon: '💊', time: '20:30', targetKidId: 'k1', order: 6 },
    { id: 'task_e7', timeOfDay: 'evening', text: 'おふとんにはいる', icon: '💤', time: '20:45', targetKidId: 'all', order: 7 }
  ],
  completions: {} // format: { 'YYYY-MM-DD': { kidId: { morning: [taskIds], evening: [taskIds] } } }
};

// ==================== 2. ストレージ管理 ====================
const STORAGE_KEY = 'princess_quest_state_v2';
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed };
  } catch (e) {
    console.error('Failed to load state', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 今日の完了リストを取得
function getCompletedTaskIds(kidId, timeOfDay) {
  const today = getTodayString();
  if (!state.completions[today]) state.completions[today] = {};
  if (!state.completions[today][kidId]) state.completions[today][kidId] = { morning: [], evening: [] };
  return state.completions[today][kidId][timeOfDay] || [];
}

// ==================== 3. Web Audio API サウンド合成 ====================
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSparkleSound() {
  if (!state.soundEnabled) return;
  initAudio();
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + idx * 0.06);
    osc.stop(audioCtx.currentTime + idx * 0.06 + 0.35);
  });
}

function playFanfareSound() {
  if (!state.soundEnabled) return;
  initAudio();
  const chords = [
    { freq: 523.25, time: 0, dur: 0.15 },
    { freq: 659.25, time: 0.15, dur: 0.15 },
    { freq: 783.99, time: 0.3, dur: 0.15 },
    { freq: 1046.50, time: 0.45, dur: 0.6 }
  ];
  chords.forEach((c) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(c.freq, audioCtx.currentTime + c.time);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime + c.time);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + c.time + c.dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + c.time);
    osc.stop(audioCtx.currentTime + c.time + c.dur + 0.05);
  });
}

function playAlarmBeep() {
  if (!state.soundEnabled) return;
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.13);
}

// ==================== 4. アプリケーション初期化 ＆ UI描画 ====================
document.addEventListener('DOMContentLoaded', () => {
  // 自動で朝/夜判定（14時以降は夜）
  const hour = new Date().getHours();
  state.mode = (hour >= 5 && hour < 14) ? 'morning' : 'evening';
  
  renderApp();
  startClock();
  setupEventListeners();

  // PWA Service Worker 登録
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
});

function startClock() {
  const timeEl = document.getElementById('currentTimeDisplay');
  const dateEl = document.getElementById('currentDateDisplay');
  
  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    if (timeEl) timeEl.textContent = `${hours}:${mins}:${secs}`;

    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    if (dateEl) dateEl.textContent = `${month}月${date}日 (${day})`;
  }
  update();
  setInterval(update, 1000);
}

// ==================== 5. メインレンダリング ====================
function renderApp() {
  const container = document.getElementById('appContainer');
  if (!container) return;

  const isMorning = state.mode === 'morning';
  document.body.style.background = isMorning 
    ? 'radial-gradient(circle at 50% 0%, #fdf2f8 0%, #fae8ff 40%, #f3e8ff 100%)'
    : 'radial-gradient(circle at 50% 0%, #2e1065 0%, #3b0764 40%, #1e1b4b 100%)';

  // ヘッダータイトルの更新
  const modeBadge = document.getElementById('modeBadge');
  if (modeBadge) {
    modeBadge.innerHTML = isMorning
      ? '<span class="text-amber-500">☀️</span> <span class="bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent font-black">あさのプリンセスクエスト</span>'
      : '<span class="text-indigo-400">🌙</span> <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-black">よるのプリンセスクエスト</span>';
  }

  // レーン生成
  const lanesContainer = document.getElementById('lanesContainer');
  if (!lanesContainer) return;

  lanesContainer.innerHTML = '';

  const kidsToRender = state.layout === 'split' 
    ? state.kids 
    : [state.kids[state.activeKidIndex] || state.kids[0]];

  lanesContainer.className = state.layout === 'split'
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 w-full max-w-7xl mx-auto'
    : 'flex justify-center flex-1 w-full max-w-3xl mx-auto';

  kidsToRender.forEach((kid) => {
    const laneHtml = createKidLaneHtml(kid);
    lanesContainer.insertAdjacentHTML('beforeend', laneHtml);
  });

  // アイコンリフレッシュ
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function createKidLaneHtml(kid) {
  const isMorning = state.mode === 'morning';
  const completedIds = getCompletedTaskIds(kid.id, state.mode);
  
  // 対象タスクのフィルタリング
  const availableTasks = state.tasks
    .filter(t => t.timeOfDay === state.mode && (t.targetKidId === 'all' || t.targetKidId === kid.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const total = availableTasks.length;
  const doneCount = completedIds.filter(id => availableTasks.some(t => t.id === id)).length;
  const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isAllClear = total > 0 && doneCount === total;

  // 最初の未完了タスクを見つけてアクティブにする
  let firstPendingFound = false;

  const tasksListHtml = availableTasks.map((t) => {
    const isDone = completedIds.includes(t.id);
    let activeClass = '';
    let isCurrent = false;

    if (!isDone && !firstPendingFound) {
      firstPendingFound = true;
      isCurrent = true;
      activeClass = 'task-active-pulse';
    }

    return `
      <div 
        onclick="toggleTask('${kid.id}', '${t.id}')"
        class="glass-card relative p-3.5 md:p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 ${isDone ? 'task-completed' : activeClass}"
        id="task_${kid.id}_${t.id}"
      >
        <div class="flex items-center space-x-3.5 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/90 shadow-sm border border-pink-100 flex-shrink-0">
            ${t.icon || '✨'}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full ${t.targetKidId !== 'all' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}">
                ${t.targetKidId !== 'all' ? '👑 せんよう' : '🌟 ふたり'}
              </span>
              <span class="text-xs font-semibold text-gray-400 font-num">${t.time || ''}</span>
            </div>
            <div class="text-base md:text-lg font-bold text-gray-800 truncate mt-0.5">
              ${t.text}
            </div>
          </div>
        </div>

        <div class="ml-3 flex-shrink-0">
          ${isDone 
            ? `<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xl shadow-md crown-stamp">👑</div>`
            : isCurrent
            ? `<div class="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-600 flex items-center justify-center font-bold text-sm animate-bounce">つぎ！</div>`
            : `<div class="w-10 h-10 rounded-full border-2 border-pink-200 bg-white/60 flex items-center justify-center"></div>`
          }
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="glass-panel p-4 md:p-6 rounded-3xl flex flex-col h-full shadow-xl border-2 border-white/80 relative overflow-hidden">
      <!-- レーンヘッダー -->
      <div class="flex items-center justify-between pb-4 border-b border-pink-100/80 mb-4">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-3xl shadow-md border-2 border-white">
              ${kid.avatar || '👸'}
            </div>
            <div class="absolute -top-2 -right-1 text-sm">${kid.equipped?.head || '👑'}</div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-xl md:text-2xl font-black text-gray-800">${kid.name}</h2>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                🔥 ${kid.streak || 1}日れんぞく
              </span>
            </div>
            <p class="text-xs font-bold text-pink-600">${kid.title || 'みならいプリンセス'}</p>
          </div>
        </div>

        <!-- コイン残高 & ガチャリンク -->
        <button onclick="openBookModal('${kid.id}')" class="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-2xl shadow-sm hover:scale-105 transition-transform">
          <span class="text-xl">💎</span>
          <span class="font-extrabold text-amber-900 font-num text-sm md:text-base">${kid.coins || 0}</span>
          <span class="text-xs font-bold text-amber-700 ml-1">ずかん</span>
        </button>
      </div>

      <!-- プログレスバー -->
      <div class="mb-4">
        <div class="flex justify-between items-center text-xs md:text-sm font-bold text-gray-600 mb-1.5">
          <span>まほうのじゅんび度</span>
          <span class="font-num text-pink-600 font-extrabold text-base">${progressPercent}% (${doneCount}/${total})</span>
        </div>
        <div class="w-full h-4 bg-pink-100/80 rounded-full overflow-hidden p-0.5 border border-pink-200 shadow-inner">
          <div 
            class="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1"
            style="width: ${progressPercent}%"
          >
            ${progressPercent > 10 ? '<span class="text-[9px] text-white font-black">✨</span>' : ''}
          </div>
        </div>
      </div>

      <!-- タスク一覧 -->
      <div class="space-y-3 flex-1 overflow-y-auto pr-1 pb-2">
        ${tasksListHtml}
      </div>

      <!-- 全クリア時のガチャ出現エリア -->
      ${isAllClear ? `
        <div class="mt-4 pt-3 border-t border-pink-200">
          <button 
            onclick="triggerGachaSpin('${kid.id}')"
            class="gacha-btn-glow w-full py-4 px-6 rounded-2xl text-white font-black text-lg md:text-xl shadow-xl flex items-center justify-center space-x-3 transform transition hover:scale-105"
          >
            <span class="text-2xl animate-spin">💎</span>
            <span>パーフェクト！ まほうガチャをまわす！</span>
            <span class="text-2xl">🎁</span>
          </button>
          ${state.realRewardEnabled ? `
            <div class="mt-2 text-center text-xs font-bold text-pink-700 bg-pink-50 p-2 rounded-xl border border-pink-200">
              🎉 リアルごほうびゲット: <span class="text-pink-900 font-black">${state.realRewardText}</span>
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="mt-3 text-center text-xs font-bold text-gray-400">
          ✨ ぜんぶチェックすると【まほうガチャ】がひけるよ！
        </div>
      `}
    </div>
  `;
}

// ==================== 6. タスク完了・トグル処理 ====================
window.toggleTask = function(kidId, taskId) {
  initAudio();
  const completedIds = getCompletedTaskIds(kidId, state.mode);
  const isDone = completedIds.includes(taskId);

  if (isDone) {
    // 解除
    const idx = completedIds.indexOf(taskId);
    if (idx > -1) completedIds.splice(idx, 1);
  } else {
    // 完了
    completedIds.push(taskId);
    playSparkleSound();
    launchTaskConfetti();

    // 全完了チェック
    const availableTasks = state.tasks.filter(t => t.timeOfDay === state.mode && (t.targetKidId === 'all' || t.targetKidId === kidId));
    if (availableTasks.every(t => completedIds.includes(t.id))) {
      // 祝！全完了
      setTimeout(() => {
        playFanfareSound();
        launchFullConfetti();
        // コイン+1
        const kid = state.kids.find(k => k.id === kidId);
        if (kid) {
          kid.coins = (kid.coins || 0) + 1;
        }
        saveState();
        renderApp();
      }, 400);
    }
  }

  saveState();
  renderApp();
};

// ==================== 7. 親用「まほうのカウントダウン」 ====================
let countdownTimer = null;
window.startParentCountdown = function() {
  initAudio();
  let count = 10;
  const overlay = document.getElementById('countdownOverlay');
  const numDisplay = document.getElementById('countdownNumber');
  if (!overlay || !numDisplay) return;

  overlay.classList.remove('hidden');
  numDisplay.textContent = count;
  playAlarmBeep();

  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      numDisplay.textContent = count;
      playAlarmBeep();
    } else {
      clearInterval(countdownTimer);
      numDisplay.textContent = 'START!';
      playFanfareSound();
      launchTaskConfetti();
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 1200);
    }
  }, 1000);
};

window.cancelCountdown = function() {
  if (countdownTimer) clearInterval(countdownTimer);
  const overlay = document.getElementById('countdownOverlay');
  if (overlay) overlay.classList.add('hidden');
};

// ==================== 8. 紙吹雪・星屑パーティクル ====================
function launchTaskConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ec4899', '#f472b6', '#fbbf24', '#c084fc', '#ffffff']
    });
  }
}

function launchFullConfetti() {
  if (window.confetti) {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#ec4899', '#fbbf24', '#a855f7', '#38bdf8', '#ffffff'];
    (function frame() {
      window.confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      window.confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// ==================== 9. ガチャシステム ＆ モーダル ====================
let currentGachaKidId = null;

window.triggerGachaSpin = function(kidId) {
  currentGachaKidId = kidId;
  const kid = state.kids.find(k => k.id === kidId);
  if (!kid) return;

  const modal = document.getElementById('gachaModal');
  const stage = document.getElementById('gachaStage');
  const result = document.getElementById('gachaResult');
  if (!modal || !stage || !result) return;

  modal.classList.remove('hidden');
  stage.classList.remove('hidden');
  result.classList.add('hidden');
};

window.executeSpin = function() {
  initAudio();
  const kid = state.kids.find(k => k.id === currentGachaKidId);
  if (!kid) return;

  const stage = document.getElementById('gachaStage');
  const result = document.getElementById('gachaResult');
  const egg = document.getElementById('gachaEgg');
  
  if (egg) {
    egg.classList.add('animate-bounce');
  }

  // サウンド
  playSparkleSound();

  // 抽選アルゴリズム
  setTimeout(() => {
    const rand = Math.random();
    let pool = [];
    if (rand < 0.15) {
      pool = DEFAULT_ITEMS.filter(i => i.rarity === 'SSR');
    } else if (rand < 0.45) {
      pool = DEFAULT_ITEMS.filter(i => i.rarity === 'SR');
    } else if (rand < 0.75) {
      pool = DEFAULT_ITEMS.filter(i => i.rarity === 'R');
    } else {
      pool = DEFAULT_ITEMS.filter(i => i.rarity === 'N');
    }
    const wonItem = pool[Math.floor(Math.random() * pool.length)] || DEFAULT_ITEMS[0];

    // 所持品に追加（重複なし）
    if (!kid.inventory) kid.inventory = [];
    if (!kid.inventory.includes(wonItem.id)) {
      kid.inventory.push(wonItem.id);
    }
    saveState();

    playFanfareSound();
    launchFullConfetti();

    // 結果表示
    if (stage) stage.classList.add('hidden');
    if (result) {
      result.classList.remove('hidden');
      document.getElementById('wonItemIcon').textContent = wonItem.icon;
      document.getElementById('wonItemName').textContent = wonItem.name;
      document.getElementById('wonItemDesc').textContent = wonItem.desc;
      
      const rarityBadge = document.getElementById('wonItemRarity');
      rarityBadge.textContent = wonItem.rarity;
      rarityBadge.className = `text-xs font-black px-3 py-1 rounded-full text-white ${
        wonItem.rarity === 'SSR' ? 'bg-gradient-to-r from-amber-400 to-rose-500 animate-pulse' :
        wonItem.rarity === 'SR' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
        wonItem.rarity === 'R' ? 'bg-pink-500' : 'bg-gray-400'
      }`;
    }
  }, 1200);
};

window.closeGachaModal = function() {
  const modal = document.getElementById('gachaModal');
  if (modal) modal.classList.add('hidden');
  renderApp();
};

// ==================== 10. プリンセス図鑑 ＆ 着せ替えモーダル ====================
window.openBookModal = function(kidId) {
  const kid = state.kids.find(k => k.id === kidId);
  if (!kid) return;

  const modal = document.getElementById('bookModal');
  const grid = document.getElementById('bookGrid');
  const title = document.getElementById('bookKidName');
  if (!modal || !grid) return;

  if (title) title.textContent = `${kid.name}のコレクションずかん`;

  const inventory = kid.inventory || [];
  grid.innerHTML = DEFAULT_ITEMS.map((item) => {
    const isOwned = inventory.includes(item.id);
    return `
      <div class="p-3 rounded-2xl border text-center transition-all ${
        isOwned 
          ? 'bg-gradient-to-b from-white to-pink-50 border-pink-200 shadow-sm' 
          : 'bg-gray-100/70 border-gray-200 opacity-50 grayscale'
      }">
        <div class="text-3xl mb-1">${isOwned ? item.icon : '❓'}</div>
        <div class="text-xs font-bold text-gray-800 truncate">${isOwned ? item.name : '？？？'}</div>
        <div class="text-[10px] font-extrabold mt-0.5 ${
          item.rarity === 'SSR' ? 'text-amber-600' :
          item.rarity === 'SR' ? 'text-purple-600' :
          item.rarity === 'R' ? 'text-pink-600' : 'text-gray-500'
        }">${item.rarity}</div>
      </div>
    `;
  }).join('');

  modal.classList.remove('hidden');
};

window.closeBookModal = function() {
  const modal = document.getElementById('bookModal');
  if (modal) modal.classList.add('hidden');
};

// ==================== 11. 親用設定モーダル ====================
window.openSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;

  // 設定フォームの初期値反映
  document.getElementById('setKid1Name').value = state.kids[0]?.name || '';
  document.getElementById('setKid2Name').value = state.kids[1]?.name || '';
  document.getElementById('setRealRewardText').value = state.realRewardText || '';
  document.getElementById('setRealRewardToggle').checked = state.realRewardEnabled;
  document.getElementById('setLayoutToggle').value = state.layout;

  renderSettingsTaskList();
  modal.classList.remove('hidden');
};

window.closeSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.add('hidden');
};

function renderSettingsTaskList() {
  const listEl = document.getElementById('settingsTaskList');
  if (!listEl) return;

  const currentMode = state.mode;
  const filtered = state.tasks
    .filter(t => t.timeOfDay === currentMode)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  listEl.innerHTML = filtered.map((t, idx) => `
    <div class="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 text-sm">
      <div class="flex items-center space-x-2 min-w-0 flex-1">
        <span class="text-xl">${t.icon}</span>
        <span class="font-bold text-gray-800 truncate">${t.text}</span>
        <span class="text-xs px-2 py-0.5 rounded-full ${t.targetKidId === 'k1' ? 'bg-pink-100 text-pink-700' : t.targetKidId === 'k2' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'} font-bold">
          ${t.targetKidId === 'k1' ? state.kids[0].name : t.targetKidId === 'k2' ? state.kids[1].name : 'ふたり'}
        </span>
      </div>
      <div class="flex items-center space-x-2 flex-shrink-0">
        <button onclick="moveTaskOrder('${t.id}', -1)" class="p-1 hover:bg-gray-100 rounded text-gray-600 font-bold" ${idx === 0 ? 'disabled' : ''}>▲</button>
        <button onclick="moveTaskOrder('${t.id}', 1)" class="p-1 hover:bg-gray-100 rounded text-gray-600 font-bold" ${idx === filtered.length - 1 ? 'disabled' : ''}>▼</button>
        <button onclick="deleteTask('${t.id}')" class="text-red-500 hover:text-red-700 font-bold p-1">🗑️</button>
      </div>
    </div>
  `).join('');
}

window.moveTaskOrder = function(taskId, dir) {
  const currentMode = state.mode;
  const filtered = state.tasks
    .filter(t => t.timeOfDay === currentMode)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const idx = filtered.findIndex(t => t.id === taskId);
  if (idx < 0) return;
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= filtered.length) return;

  const tempOrder = filtered[idx].order;
  filtered[idx].order = filtered[targetIdx].order;
  filtered[targetIdx].order = tempOrder;

  saveState();
  renderSettingsTaskList();
  renderApp();
};

window.addNewTask = function() {
  const text = prompt('追加するタスク名を入力してください（例: おくすりをのむ）');
  if (!text) return;
  const icon = prompt('アイコン絵文字を入力してください（例: 💊, 🦷, 👗）', '✨') || '✨';
  const target = prompt('対象を選んでください\n0: ふたり共通\n1: ' + state.kids[0].name + '\n2: ' + state.kids[1].name, '0');

  let targetKidId = 'all';
  if (target === '1') targetKidId = 'k1';
  if (target === '2') targetKidId = 'k2';

  const newId = 'task_' + Date.now();
  const maxOrder = Math.max(0, ...state.tasks.filter(t => t.timeOfDay === state.mode).map(t => t.order || 0));

  state.tasks.push({
    id: newId,
    timeOfDay: state.mode,
    text: text,
    icon: icon,
    time: '08:00',
    targetKidId: targetKidId,
    order: maxOrder + 1
  });

  saveState();
  renderSettingsTaskList();
  renderApp();
};

window.deleteTask = function(taskId) {
  if (!confirm('このタスクを削除しますか？')) return;
  state.tasks = state.tasks.filter(t => t.id !== taskId);
  saveState();
  renderSettingsTaskList();
  renderApp();
};

window.saveSettings = function() {
  const k1 = document.getElementById('setKid1Name').value.trim();
  const k2 = document.getElementById('setKid2Name').value.trim();
  const reward = document.getElementById('setRealRewardText').value.trim();
  const rewardEnabled = document.getElementById('setRealRewardToggle').checked;
  const layout = document.getElementById('setLayoutToggle').value;

  if (k1 && state.kids[0]) state.kids[0].name = k1;
  if (k2 && state.kids[1]) state.kids[1].name = k2;
  state.realRewardText = reward;
  state.realRewardEnabled = rewardEnabled;
  state.layout = layout;

  saveState();
  closeSettingsModal();
  renderApp();
};

// ==================== 12. イベントリスナー ====================
function setupEventListeners() {
  // モード切り替え（朝 / 夜）
  const toggleModeBtn = document.getElementById('toggleModeBtn');
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', () => {
      initAudio();
      state.mode = state.mode === 'morning' ? 'evening' : 'morning';
      saveState();
      renderApp();
    });
  }

  // 1人/2人切り替えボタン
  const toggleLayoutBtn = document.getElementById('toggleLayoutBtn');
  if (toggleLayoutBtn) {
    toggleLayoutBtn.addEventListener('click', () => {
      initAudio();
      state.layout = state.layout === 'split' ? 'single' : 'split';
      saveState();
      renderApp();
    });
  }
}
