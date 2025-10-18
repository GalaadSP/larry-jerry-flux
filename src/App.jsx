import React, { useMemo, useState, useEffect } from "react";

const FEEDS = [
  { url: "https://bitcoinmagazine.com/.rss", title: "Bitcoin Magazine", topic: "Crypto" },
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml", title: "CoinDesk", topic: "Crypto" },
  { url: "https://www.reuters.com/finance/rss", title: "Reuters Finance", topic: "Macro" },
  { url: "https://www.lesswrong.com/feed.xml", title: "LessWrong", topic: "IA/Philo" },
];

const API_URL = import.meta.env?.VITE_API_URL || "https://rss-worker.sapiniere45.workers.dev/news?summarize=true";

export default function App() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const r = await fetch(API_URL, { headers: { "accept": "application/json" } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("API error:", e);
        setError("Impossible de récupérer les articles (API).");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
export default function App() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [items, setItems] = useState(items);
  const [feeds, setFeeds] = useState(FEEDS);
  const [spice, setSpice] = useState(60);

  useEffect(() => {
    document.body.style.fontFamily =
      "-apple-system, Segoe UI, Roboto, Inter, system-ui, Arial";
    document.body.style.margin = 0;
    document.body.style.background = "#0b0c0f";
    document.body.style.color = "#e6e6e6";
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((i) => (topic === "All" ? true : i.topic === topic))
      .filter((i) =>
        query.trim()
          ? (i.title + i.summary).toLowerCase().includes(query.toLowerCase())
          : true
      )
      .sort((a, b) => b.score - a.score);
  }, [items, topic, query]);

  const topics = ["All", ...Array.from(new Set(items.map((i) => i.topic)))];

  function addFeed(url, title, t) {
    try {
      const name = title || new URL(url).hostname.replace("www.", "");
      setFeeds((prev) => [...prev, { url, title: name, topic: t || "Divers" }]);
    } catch {
      alert("URL invalide");
    }
  }

  function tone(s) {
    if (spice > 70) return s + " — TL;DR: ça peut pump… ou crasher. Plan de jeu impératif.";
    if (spice > 40) return s + " — En bref: intéressant, prudence requise.";
    return s + " — Conclusion: à suivre sans se précipiter.";
  }

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          backdropFilter: "blur(6px)",
          background: "rgba(11,12,15,0.6)",
          borderBottom: "1px solid #1f2430",
          marginBottom: 16,
          padding: "12px 0",
          zIndex: 2,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>Larry & Jerry — Flux Actu sur mesure</h1>
        <small style={{ color: "#9aa4b2" }}>Prototype React + Vite (build Cloudflare Pages)</small>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        <aside
          style={{
            border: "1px solid #1f2430",
            borderRadius: 12,
            padding: 16,
            background: "#0f1217",
            height: "fit-content",
            position: "sticky",
            top: 72,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label>Recherche</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="mots-clés…"
              style={{
                width: "100%",
                marginTop: 6,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #263042",
                background: "#0b0c0f",
                color: "#e6e6e6",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Thèmes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid " + (t === topic ? "#5865f2" : "#263042"),
                    background: t === topic ? "#2b2f55" : "transparent",
                    color: "#e6e6e6",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Tonicité des résumés : {spice}</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={spice}
              onChange={(e) => setSpice(parseInt(e.target.value, 10))}
              style={{ width: "100%", marginTop: 6 }}
            />
          </div>

          <hr style={{ borderColor: "#1f2430", margin: "14px 0" }} />

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Flux suivis</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {feeds.map((f, i) => (
                <li key={i} style={{ color: "#c6cbd4" }}>
                  <span style={{ color: "#8aa1ff" }}>[{f.topic}]</span> {f.title}
                </li>
              ))}
            </ul>
            <details style={{ marginTop: 10 }}>
              <summary>Ajouter un flux</summary>
              <AddFeedForm onAdd={addFeed} />
            </details>
          </div>
        </aside>

        <main style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              border: "1px solid #1f2430",
              borderRadius: 12,
              padding: 16,
              background: "linear-gradient(140deg,#151a24,#10141b)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Ton fil d’actus, sans blabla</h2>
            <p style={{ color: "#9aa4b2", marginBottom: 0 }}>
              Agrège tes flux RSS, classe par thème, résumés mordants façon Jerry, et
              déclenche des alertes quand ça compte.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {filtered.map((a) => (
              <article
                key={a.id}
                style={{
                  border: "1px solid #1f2430",
                  borderRadius: 12,
                  padding: 16,
                  background: "#0f1217",
                }}
              >
                <div style={{ fontSize: 12, color: "#9aa4b2" }}>
                  <b style={{ color: "#8aa1ff" }}>{a.topic}</b> • {fmt(a.date)}
                </div>
                <h3 style={{ margin: "6px 0 8px", fontSize: 18 }}>{a.title}</h3>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ border: "1px solid #263042", borderRadius: 999, padding: "2px 8px" }}>
                    {a.source}
                  </span>
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        border: "1px solid #263042",
                        borderRadius: 999,
                        padding: "2px 8px",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p style={{ color: "#c6cbd4" }}>{tone(a.summary)}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <button
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #263042",
                      background: "transparent",
                      color: "#e6e6e6",
                      cursor: "pointer",
                    }}
                  >
                    Utile
                  </button>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#8aa1ff", textDecoration: "none" }}
                  >
                    Lire →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </main>
      </section>

      <footer style={{ color: "#9aa4b2", marginTop: 36, padding: "16px 0", borderTop: "1px solid #1f2430" }}>
        Prototype par Jerry. Tech : React + Vite. Déploiement Cloudflare Pages.
      </footer>
    </div>
  );
}

function AddFeedForm({ onAdd }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Divers");

  return (
    <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
      <input
        placeholder="https://…/feed.xml"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #263042",
          background: "#0b0c0f",
          color: "#e6e6e6",
        }}
      />
      <input
        placeholder="Titre lisible (optionnel)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #263042",
          background: "#0b0c0f",
          color: "#e6e6e6",
        }}
      />
      <input
        placeholder="Thème (Crypto / Macro / IA…)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #263042",
          background: "#0b0c0f",
          color: "#e6e6e6",
        }}
      />
      <button
        onClick={() => {
          if (!url) return;
          onAdd(url, title, topic);
          setUrl("");
          setTitle("");
          setTopic("Divers");
        }}
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #5865f2",
          background: "#2b2f55",
          color: "white",
          cursor: "pointer",
        }}
      >
        Ajouter
      </button>
    </div>
  );
}
