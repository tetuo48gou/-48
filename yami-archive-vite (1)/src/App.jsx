import React, { useEffect, useMemo, useState } from "react";

// 闇市アーカイブ — 都市伝説・オカルト百貨 単一ファイル版
// Tailwind前提。Viteで動作確認済み。

const SAMPLE_ARTICLES = [
  {
    id: "mothman",
    title: "モスマン騒動（1966-67）",
    lead: "巨大な翼と赤い目。ウェストバージニア州ポイントプレザントで相次いだ怪異。",
    body:
      "1966年から1967年にかけての目撃証言とシルバーブリッジ崩落事故をめぐる相関。心理的感染、メディア報道、冷戦期の不安の増幅効果など複数仮説を併記。",
    region: "アメリカ",
    era: "1960s",
    tags: ["未確認生物", "予兆", "災害"],
    credibility: 2.5,
    danger: 3,
    image: "https://picsum.photos/seed/mothman/800/500",
    sources: [
      { label: "新聞アーカイブ", url: "#" },
      { label: "研究ノート", url: "#" },
    ],
  },
  {
    id: "hachishaku",
    title: "八尺様（東北の怪談）",
    lead: "8尺ほどの背丈、笑い声『ぽぽぽ…』とともに現れる長身の女の怪異。",
    body:
      "地方伝承の集合体とみられる民俗合成型怪談。視覚イメージの共通化、隔離儀礼、祖父母の権威の役割など、家族構造に埋め込まれた恐怖のメカニズムを分析。",
    region: "日本",
    era: "1990s-",
    tags: ["怪談", "民俗", "子ども"],
    credibility: 1.5,
    danger: 4,
    image: "https://picsum.photos/seed/hachishaku/800/500",
    sources: [{ label: "怪談採集録", url: "#" }],
  },
  {
    id: "kukisake",
    title: "口裂け女（昭和末）",
    lead: "『私、キレイ？』からの逃走パターン。1978年前後に全国的パニック。",
    body:
      "通学路での噂伝播、新聞報道の相互増幅、治安意識の変化。マスク・外見・同調圧力という現代的トピックとの連結。",
    region: "日本",
    era: "1970s",
    tags: ["都市伝説", "学校", "パニック"],
    credibility: 3,
    danger: 2,
    image: "https://picsum.photos/seed/kuchisake/800/500",
    sources: [{ label: "新聞切り抜き", url: "#" }],
  },
  {
    id: "atlantis",
    title: "アトランティス失われた帝国",
    lead: "プラトンの記述を起点に拡大した理想郷と滅亡神話。",
    body:
      "地中海・大西洋諸説、考古学的否定・慎重論、近代オカルティズムが与えた想像力の補助線。",
    region: "伝承",
    era: "古代?",
    tags: ["失われた文明", "神話", "考古学"],
    credibility: 1,
    danger: 1,
    image: "https://picsum.photos/seed/atlantis/800/500",
    sources: [
      { label: "古典文献", url: "#" },
      { label: "地質調査メモ", url: "#" },
    ],
  },
];

function StarBar({ value, max = 5, className = "" }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className={"flex items-center gap-1 " + className}>
      {stars.map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${value >= s ? "fill-yellow-400" : "fill-zinc-700"}`}
        >
          <path d="M12 2l3.09 6.26 6.91.99-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-.99z" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-200">
      {children}
    </span>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition ${
        active
          ? "bg-emerald-900/40 border-emerald-700 text-emerald-200"
          : "bg-zinc-900/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function formatDanger(n) {
  const labels = ["無害", "低", "中", "高", "危険", "禁忌"];
  const idx = Math.min(5, Math.max(0, Math.round(n)));
  return labels[idx];
}

export default function DarkMarketArchive() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [minCred, setMinCred] = useState(0);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem("yami_bookmarks");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState(null);
  const [belief, setBelief] = useState(() => {
    try {
      const raw = localStorage.getItem("yami_belief");
      return raw ? JSON.parse(raw) : {}; // {id: 1|-1}
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("yami_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);
  useEffect(() => {
    localStorage.setItem("yami_belief", JSON.stringify(belief));
  }, [belief]);

  const categories = [
    "すべて",
    "未確認生物",
    "怪談",
    "都市伝説",
    "失われた文明",
    "神話",
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_ARTICLES.filter((a) => {
      const inText =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.lead.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.region.toLowerCase().includes(q) ||
        a.era.toLowerCase().includes(q);
      const inCat =
        category === "すべて" || a.tags.includes(category) || a.tags[0] === category;
      const inCred = a.credibility >= minCred;
      return inText && inCat && inCred;
    });
  }, [query, category, minCred]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const vote = (id, v) => {
    setBelief((prev) => ({ ...prev, [id]: v }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70 bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-700/30 border border-emerald-600/50 grid place-content-center">
              <span className="text-emerald-300 font-black">闇</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">闇市アーカイブ</h1>
              <p className="text-xs text-zinc-400">都市伝説・オカルト百貨 — 信憑性★表示つき</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2">
            <a href="#" className="text-sm text-zinc-300 hover:text-emerald-300">
              記事投稿
            </a>
            <a href="#" className="text-sm text-zinc-300 hover:text-emerald-300">
              ガイドライン
            </a>
          </div>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-2">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 p-5 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 shadow-inner">
            <h2 className="text-lg font-semibold mb-2">今日の特集</h2>
            <p className="text-sm text-zinc-300">
              伝承・証言・研究ノートを一つの棚に。信じるかどうかはあなた次第。だけど、記録は残す。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Pill key={c} active={c === category} onClick={() => setCategory(c)}>
                  {c}
                </Pill>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <label className="text-sm text-zinc-400">サイト内検索</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例：モスマン / 八尺様 / 失われた文明"
              className="mt-2 w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="mt-4">
              <label className="text-sm text-zinc-400">最低信憑性（★）</label>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minCred}
                onChange={(e) => setMinCred(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-zinc-400">現在: {minCred} ★ 以上</div>
            </div>
          </div>
        </div>
      </section>

      {/* グリッド */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 hover:border-emerald-700/60 transition shadow"
            >
              <div className="relative">
                <img src={a.image} alt="" className="h-44 w-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge>{a.region}</Badge>
                  <Badge>{a.era}</Badge>
                </div>
                <button
                  onClick={() => toggleBookmark(a.id)}
                  className={`absolute top-2 right-2 rounded-full border px-2 py-1 text-xs ${
                    bookmarks.includes(a.id)
                      ? "bg-emerald-800/70 border-emerald-600 text-emerald-100"
                      : "bg-zinc-900/70 border-zinc-700 text-zinc-200"
                  }`}
                >
                  {bookmarks.includes(a.id) ? "保存済" : "保存"}
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold leading-tight group-hover:text-emerald-300">
                  {a.title}
                </h3>
                <p className="text-sm text-zinc-300 line-clamp-2">{a.lead}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-2 flex-wrap">
                    {a.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">信憑性</span>
                    <StarBar value={a.credibility} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-zinc-400">
                    危険度: <span className="text-zinc-200">{formatDanger(a.danger)}</span>
                  </div>
                  <button
                    onClick={() => setSelected(a)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/20"
                  >
                    詳細を読む
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 下部：保存済み */}
        <section className="mt-12">
          <h4 className="text-sm text-zinc-400 mb-3">保存した記事</h4>
          {bookmarks.length === 0 ? (
            <p className="text-zinc-500 text-sm">まだありません。</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {bookmarks.map((id) => {
                const a = SAMPLE_ARTICLES.find((x) => x.id === id);
                if (!a) return null;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(a)}
                    className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-sm hover:border-emerald-700/60"
                  >
                    {a.title}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* モーダル */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setSelected(null)}
          />
          <div className="absolute inset-x-0 bottom-0 md:inset-y-10 md:mx-auto md:max-w-3xl md:rounded-2xl md:border md:border-zinc-800 md:overflow-hidden bg-zinc-950">
            <div className="grid md:grid-cols-2 gap-0">
              <img src={selected.image} alt="" className="h-56 md:h-full w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selected.title}</h3>
                    <p className="text-sm text-zinc-300 mt-1">{selected.lead}</p>
                  </div>
                  <button
                    className="text-zinc-400 hover:text-zinc-200"
                    onClick={() => setSelected(null)}
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-200">
                  <p>{selected.body}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">信憑性</span>
                    <StarBar value={selected.credibility} />
                  </div>
                  <div className="text-xs text-zinc-400">
                    地域: <Badge>{selected.region}</Badge> 時代: <Badge>{selected.era}</Badge>
                  </div>
                  <div className="text-xs text-zinc-400">
                    危険度: <span className="text-zinc-200">{formatDanger(selected.danger)}</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-800">
                    <div className="text-xs text-zinc-400 mb-1">関連資料</div>
                    <ul className="list-disc list-inside space-y-1">
                      {selected.sources.map((s, i) => (
                        <li key={i}>
                          <a className="underline decoration-emerald-600 underline-offset-4 hover:text-emerald-300" href={s.url}>
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 投票・保存 */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => vote(selected.id, 1)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      belief[selected.id] === 1
                        ? "border-emerald-600 bg-emerald-900/30 text-emerald-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-200"
                    }`}
                  >
                    信じる
                  </button>
                  <button
                    onClick={() => vote(selected.id, -1)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      belief[selected.id] === -1
                        ? "border-rose-600 bg-rose-900/30 text-rose-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-200"
                    }`}
                  >
                    信じない
                  </button>
                  <button
                    onClick={() => toggleBookmark(selected.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      bookmarks.includes(selected.id)
                        ? "border-emerald-600 bg-emerald-900/30 text-emerald-100"
                        : "border-zinc-700 bg-zinc-900 text-zinc-200"
                    }`}
                  >
                    {bookmarks.includes(selected.id) ? "保存済み" : "保存"}
                  </button>
                </div>

                {/* フッター行動 */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span>
                    タグ: {selected.tags.map((t) => (
                      <span key={t} className="mr-1">
                        <Badge>{t}</Badge>
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-zinc-400 flex flex-wrap items-center gap-3">
          <span>© {new Date().getFullYear()} 闇市アーカイブ</span>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-emerald-300">問い合わせ</a>
          <a href="#" className="hover:text-emerald-300">プライバシー</a>
          <a href="#" className="hover:text-emerald-300">投稿ガイドライン</a>
        </div>
      </footer>
    </div>
  );
}
