const trends = [
  "努力論は才能論に勝てるのか",
  "AI時代に読書する意味",
  "孤独を金に変える方法",
  "哲学っぽい5chスレまとめ",
  "中年からの勉強は遅いのか",
  "なぜ夜中に人生を考えてしまうのか"
];

const trendList = document.getElementById("trendList");
if (trendList) {
  trends.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    trendList.appendChild(li);
  });
}
