import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig, useSpring, useTransform } from "framer-motion";
import { Play, BookOpenText, Layers, GraduationCap, Gavel, Zap, Flame, X, Check, Circle, RotateCcw, ArrowRight, Trophy, Target, ListChecks } from "lucide-react";
import { ProgressProvider, useProgress, REQ, sectionDone, ACT_LABELS } from "./store.jsx";
import { Toasts } from "./ui.jsx";
import { Hero, Hook, S1, S2 } from "./learnA.jsx";
import { S3, S4 } from "./learnB.jsx";
import { S5, S6, S7, S8 } from "./learnC.jsx";
import { Flashcards, Exam, Final, Recap } from "./modes.jsx";
import { SECTIONS } from "./data.js";
import { VideoPlayer, TOTAL } from "./Video.jsx";

function Watch({ id = "watch", compact }) {
  const { complete } = useProgress();
  return (
    <section id={id} className={"watch" + (compact ? " watch-compact" : "")}>
      <div className="watch-head">
        <p className="eyebrow"><Play size={13} /> Motion explainer · {Math.floor(TOTAL / 60)}:{String(TOTAL % 60).padStart(2, "0")}</p>
        <h2>{compact ? "Rewatch the video" : "The chapter in 100 seconds"}</h2>
        {!compact && <p className="muted">Watch it once, then play through each part below. Captions are on, and you can jump to any chapter.</p>}
      </div>
      <VideoPlayer onDone={() => complete("act-video", 150)} />
    </section>
  );
}

const MODES = [
  { id: "learn", label: "Learn", icon: BookOpenText },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "exam", label: "Exam prep", icon: GraduationCap },
  { id: "final", label: "Final test", icon: Gavel },
  { id: "recap", label: "2-min recap", icon: Zap },
];

function Num({ v }) {
  const s = useSpring(v, { stiffness: 80, damping: 18 });
  const t = useTransform(s, (x) => Math.round(x).toLocaleString("en-IN"));
  useEffect(() => { s.set(v); }, [v]);
  return <motion.span className="tnum">{t}</motion.span>;
}

function Ring({ pct, size = 34 }) {
  const r = 14, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
      <motion.circle cx="17" cy="17" r={r} fill="none" stroke="var(--fg)" strokeWidth="3" transform="rotate(-90 17 17)" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 0.6 }} />
    </svg>
  );
}

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M3 19 A9 9 0 0 1 21 19" fill="none" stroke="#fff" strokeWidth="2.2" />
          <path d="M8 19 A4 4 0 0 1 16 19" fill="none" stroke="#fff" strokeWidth="2.2" />
        </svg>
      </span>
      <span className="brand-t">Inside the Vidhan Sabha</span>
    </span>
  );
}

function ChapterList() {
  const { st } = useProgress();
  const rows = [
    ["hook", "hook", "00", "Day 1 in office", "Your first three files as CM"],
    ["video", "watch", "▶", "Watch the video", "The chapter in 100 seconds"],
    ...SECTIONS.map((x) => [x.id, x.id, x.num, x.title, x.short]),
  ];
  return (
    <nav className="cal" aria-label="Chapter contents">
      <div className="cal-head">
        <span className="cap-up">The chapter</span>
        <span className="cap-up muted">{rows.filter(([k]) => sectionDone(st, k)).length} / {rows.length} cleared</span>
      </div>
      {rows.map(([k, anchor, n, t, sub]) => {
        const items = REQ[k];
        const got = items.filter((i) => st.answered[i] || st.acts[i]).length;
        const done = got === items.length;
        return (
          <a key={k} href={"#" + anchor} className={"cal-row" + (done ? " done" : "")}>
            <span className="cal-n tnum">{n}</span>
            <span className="cal-t">{t}<small>{sub}</small></span>
            <span className="cal-s">{done ? "Cleared" : got ? `${got} / ${items.length}` : "Start"}</span>
          </a>
        );
      })}
    </nav>
  );
}

function Drawer({ open, onClose, goSection, setMode }) {
  const { st, stats, reset } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const acc = stats.quizTotal ? Math.round((stats.quizCorrect / stats.quizTotal) * 100) : 0;
  const keys = [["hook", "Day 1 hook"], ["video", "Chapter video"], ...SECTIONS.map((s) => [s.id, `${s.num} ${s.title}`]), ["flash", "Flashcards"], ["exam", "Exam prep"], ["final", "Final test"], ["recap", "2-min recap"]];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }} role="dialog" aria-label="Your progress">
            <div className="drawer-head">
              <h3>Your progress</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="stat-grid">
              <div className="stat"><Target size={16} /><b className="tnum">{stats.pct}%</b><span>complete</span></div>
              <div className="stat"><Zap size={16} /><b className="tnum">{st.xp.toLocaleString("en-IN")}</b><span>XP earned</span></div>
              <div className="stat"><Flame size={16} /><b className="tnum">{st.best}</b><span>best streak</span></div>
              <div className="stat"><ListChecks size={16} /><b className="tnum">{stats.actCount}/{stats.actTotal}</b><span>activities</span></div>
            </div>
            <div className="quiz-perf">
              <div className="meter-top"><span>Quiz performance</span><span className="mono tnum">{stats.quizCorrect}/{stats.quizTotal} · {acc}%</span></div>
              <div className="meter-track"><motion.div className="meter-fill" animate={{ width: acc + "%" }} /></div>
            </div>
            <p className="eyebrow">Sections</p>
            <ul className="sec-list">
              {keys.map(([k, l]) => {
                const done = sectionDone(st, k);
                const items = REQ[k];
                const n = items.filter((i) => st.answered[i] || st.acts[i]).length;
                return (
                  <li key={k}>
                    <button onClick={() => { goSection(k); onClose(); }}>
                      {done ? <Check size={15} className="ok-t" /> : <Circle size={15} className="muted" />}
                      <span>{l}</span>
                      <span className="mono small muted">{n}/{items.length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="reset-zone">
              {!confirm ? (
                <button className="btn-ghost sm" onClick={() => setConfirm(true)}><RotateCcw size={14} /> Reset all progress</button>
              ) : (
                <div className="confirm">
                  <p className="small">This clears XP, answers and flashcard marks on this device.</p>
                  <div className="pill-row">
                    <button className="btn-ghost sm no" onClick={() => { reset(); setConfirm(false); }}>Yes, reset</button>
                    <button className="btn-ghost sm" onClick={() => setConfirm(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <p className="small muted">Progress is saved in this browser only.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Toc() {
  const { st } = useProgress();
  const [active, setActive] = useState("hook");
  useEffect(() => {
    const ids = ["hook", "watch", ...SECTIONS.map((s) => s.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="toc" aria-label="Sections">
      <p className="eyebrow">Chapter map</p>
      <a href="#hook" className={active === "hook" ? "on" : ""}>
        <span className="toc-n mono">00</span><span>Day 1 in office</span>
        {sectionDone(st, "hook") && <Check size={14} className="ok-t" />}
      </a>
      <a href="#watch" className={active === "watch" ? "on" : ""}>
        <span className="toc-n mono"><Play size={11} /></span><span>Watch the video</span>
        {sectionDone(st, "video") && <Check size={14} className="ok-t" />}
      </a>
      {SECTIONS.map((s) => (
        <a key={s.id} href={"#" + s.id} className={active === s.id ? "on" : ""}>
          <span className="toc-n mono">{s.num}</span><span>{s.title}</span>
          {sectionDone(st, s.id) && <Check size={14} className="ok-t" />}
        </a>
      ))}
    </nav>
  );
}

function Shell() {
  const { st, stats } = useProgress();
  const initial = (() => {
    try {
      const h = location.hash.replace("#", "");
      if (MODES.some((m) => m.id === h)) return h;
    } catch (e) {}
    return "learn";
  })();
  const [mode, setModeRaw] = useState(initial);
  const [drawer, setDrawer] = useState(false);
  const setMode = (m) => {
    setModeRaw(m);
    try { history.replaceState(null, "", "#" + m); } catch (e) {}
    window.scrollTo({ top: 0 });
  };
  const goSection = (k) => {
    const map = { flash: "flashcards", exam: "exam", final: "final", recap: "recap" };
    if (map[k]) return setMode(map[k]);
    if (k === "video") k = "watch";
    setModeRaw("learn");
    setTimeout(() => document.getElementById(k)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <button className="brand-btn" onClick={() => setMode("learn")} aria-label="Go to Learn"><Brand /></button>
          <nav className="modes" aria-label="Modes">
            {MODES.map((m) => {
              const Ic = m.icon;
              return (
                <button key={m.id} className={"mode-btn" + (mode === m.id ? " on" : "")} onClick={() => setMode(m.id)} aria-current={mode === m.id ? "page" : undefined}>
                  <Ic size={16} /> <span>{m.label}</span>
                  {mode === m.id && <motion.span className="mode-pill" layoutId="modepill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                </button>
              );
            })}
          </nav>
          <button className="hud" onClick={() => setDrawer(true)} aria-label="Open progress">
            <span className="hud-xp"><Zap size={15} /> <Num v={st.xp} /> <small>XP</small></span>
            {st.streak >= 2 && <span className="hud-streak"><Flame size={15} /> {st.streak}</span>}
            <span className="hud-ring"><Ring pct={stats.pct} /><span className="hud-pct mono">{stats.pct}%</span></span>
          </button>
        </div>
        <div className="topline"><motion.div className="topline-fill" animate={{ width: stats.pct + "%" }} /></div>
      </header>

      <main className={"main mode-" + mode}>
        {mode === "learn" && (
          <div className="learn">
            <Hero />
            <div className="learn-main">
              <ChapterList />
              <Hook />
              <Watch />
              <S1 />
              <S2 />
              <S3 />
              <S4 />
              <S5 />
              <S6 />
              <S7 />
              <S8 />
              <div className="learn-end">
                <p className="eyebrow">You've reached the end of the section</p>
                <h2>Ready to run the House?</h2>
                <p>Test everything in one go, or revise first.</p>
                <div className="pill-row center">
                  <button className="btn big" onClick={() => setMode("final")}><Gavel size={18} /> Final test</button>
                  <button className="btn-ghost" onClick={() => setMode("recap")}>2-min recap <ArrowRight size={16} /></button>
                  <button className="btn-ghost" onClick={() => setMode("flashcards")}>Flashcards <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
        {mode === "flashcards" && <Flashcards />}
        {mode === "exam" && <Exam />}
        {mode === "final" && <Final />}
        {mode === "recap" && <><Recap /><div className="recap-video"><Watch id="watch-recap" compact /></div></>}
      </main>
      <footer className="foot">
        <p className="small muted">Built from your Civics textbook, pages 196–199. Anything outside the textbook is labelled. Progress is saved in this browser.</p>
      </footer>
      <Drawer open={drawer} onClose={() => setDrawer(false)} goSection={goSection} setMode={setMode} />
      <Toasts />
    </>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider>
        <Shell />
      </ProgressProvider>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")).render(<App />);
