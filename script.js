const startBtn = document.getElementById('start-btn');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const failureScreen = document.getElementById('failure-screen');
const countdown = document.getElementById('countdown');
const kazuya = document.getElementById('kazuya');
const counter = document.getElementById('counter');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const rankingList = document.getElementById('ranking');
const bgm = document.getElementById('bgm');
const retryBtn = document.getElementById('retry-btn');
const retryFailureBtn = document.getElementById('retry-failure-btn');
let score = 0;
let username = '';

// ダブルタップズームの無効化（タップイベントには影響しない）
document.addEventListener('touchstart', (event) => {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
});

// BGMの音量設定
bgm.volume = 0.2;

// スタート画面からゲーム開始
startBtn.addEventListener('click', () => {
  username = document.getElementById('username').value.trim();
  if (!username) {
    alert("ユーザー名を入力してください！");
    return;
  }
  document.getElementById('start-screen').style.display = 'none';
  gameScreen.style.display = 'flex';
  bgm.play(); // BGM再生
  startCountdown();
});

// カウントダウンとゲーム開始
function startCountdown() {
  let time = 3;
  countdown.textContent = time;
  const interval = setInterval(() => {
    time--;
    if (time === 0) {
      clearInterval(interval);
      startGame();
    } else {
      countdown.textContent = time;
    }
  }, 1000);
}

// ゲームロジック
function startGame() {
  countdown.textContent = "スタート！";
  let timeLeft = 10;
  const gameInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft === 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);

  kazuya.addEventListener('touchstart', eatPudding); // タッチ対応
}

// プリンを食べる処理
function eatPudding(event) {
  event.preventDefault(); // タッチイベントのデフォルト動作を無効化
  score++;
  counter.textContent = `${score}個`;

  // 画像を切り替え
  kazuya.src = "kazuya2.jpg";

  // アニメーション追加
  kazuya.style.transform = "scale(1.2)";
  setTimeout(() => {
    kazuya.src = "kazuya1.jpg";
    kazuya.style.transform = "scale(1)";
  }, 200);
}

// ゲーム終了
function endGame() {
  gameScreen.style.display = 'none';
  bgm.pause(); // BGM停止
  bgm.currentTime = 0; // 再生位置をリセット

  if (score >= 50) {
    resultScreen.style.display = 'flex';
    finalScore.textContent = `あなたのスコア: ${score}個`;
    resultMessage.textContent = "素晴らしい！最高の結果です！";
    saveRanking(score, username);
  } else {
    failureScreen.style.display = 'flex';
  }
}

// 再挑戦ボタン
[retryBtn, retryFailureBtn].forEach((btn) =>
  btn.addEventListener('click', () => {
    resultScreen.style.display = 'none';
    failureScreen.style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    score = 0;
    counter.textContent = '0個';
  })
);

// ランキング保存
function saveRanking(score, username) {
  // ローカルストレージからデータを取得
  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');

  // 新しいデータを追加
  ranking.push({ username, score });

  // スコアの降順でソート
  ranking.sort((a, b) => b.score - a.score);

  // 上位3つを保存
  localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 3)));

  // ランキングを更新
  updateRanking();
}

function updateRanking() {
  const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
  rankingList.innerHTML = ranking
    .map((entry, i) => `<li>${i + 1}位: ${entry.username} - ${entry.score}個</li>`)
    .join('');
}
