const strangeWords = [
  "部屋の隅が少し明るい",
  "スマホが勝手に低音で鳴った",
  "読んでいない記事に既読がついた",
  "夢の駅名を起きても覚えている",
  "誰もいないのに床が三回鳴った"
];

const titles = [
  "絶対に住んではいけない部屋に共通する3つの特徴",
  "AIが幽霊を怖がらない理由",
  "投げ銭の正体は、現代の小さな祭壇である",
  "夜中に聞こえる声は本当に外から来ているのか",
  "なぜ人は怖い話を聞くと安心するのか"
];

const leads = [
  "これは単なる怪談ではありません。人間が暗闇に意味を作ってしまう、かなり厄介な性質の話です。",
  "最初は笑い話でした。しかし、三つ目の偶然が起きたところで、誰も笑わなくなりました。",
  "現代人は幽霊より通知を怖がっています。なぜなら通知は、必ず自分宛てに来るからです。",
  "怖いのは霊ではなく、説明できないものを説明しようとする自分の脳かもしれません。"
];

const twists = [
  "最後に、怖がっていた対象が自分自身だったと分かる。",
  "オチは派手にせず、読者が一拍遅れて気づく形にする。",
  "怪異を否定した人物だけが、最後に記録から消える。",
  "読者のスマホ通知と重なるような一文で終える。",
  "救いがあるように見せて、ほんの少しだけ嫌な違和感を残す。"
];

const strangeWord = document.getElementById("strangeWord");
setInterval(() => {
  strangeWord.textContent = strangeWords[Math.floor(Math.random() * strangeWords.length)];
}, 2500);

const cursorGlow = document.getElementById("cursorGlow");
window.addEventListener("mousemove", (e) => {
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});

const selectedScores = {};
document.querySelectorAll(".question button").forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.closest(".question");
    const questionIndex = [...document.querySelectorAll(".question")].indexOf(question);
    question.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    selectedScores[questionIndex] = Number(button.dataset.score);
    updateResult();
  });
});

function updateResult() {
  const result = document.getElementById("quizResult");
  if (Object.keys(selectedScores).length < 3) return;

  const total = Object.values(selectedScores).reduce((a, b) => a + b, 0);

  if (total <= 4) {
    result.innerHTML = `
      <h3>現実検証タイプ</h3>
      <p>あなたは怖いものをすぐ信じません。強みは冷静さ。ただし、面白い物語の入り口を見逃しやすい夜があります。</p>
    `;
  } else if (total <= 7) {
    result.innerHTML = `
      <h3>境界線の観察者タイプ</h3>
      <p>現実と怪談の境目を見ています。記事を書くなら、実体験風の考察が向いています。怖さと理屈の配合が武器です。</p>
    `;
  } else {
    result.innerHTML = `
      <h3>深夜の物語生成タイプ</h3>
      <p>あなたは異変をコンテンツに変える人です。怖い、変だ、気になる。その感情をすぐタイトルにしてください。</p>
    `;
  }
}

document.getElementById("ideaButton").addEventListener("click", () => {
  document.getElementById("ideaTitle").textContent = titles[Math.floor(Math.random() * titles.length)];
  document.getElementById("ideaLead").textContent = leads[Math.floor(Math.random() * leads.length)];
  document.getElementById("ideaTwist").textContent = twists[Math.floor(Math.random() * twists.length)];
});
