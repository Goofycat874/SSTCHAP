import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Lightbulb, Sparkles, Eye, BookOpen, Zap, Flame, CircleCheck, Info } from "lucide-react";
import { useProgress, sectionDone } from "./store.jsx";

// ---------- Hemicycle seat geometry ----------
export function hemicycle(n, rows = 6, r0 = 0.42, r1 = 1) {
  const radii = Array.from({ length: rows }, (_, i) => r0 + ((r1 - r0) * i) / (rows - 1));
  const total = radii.reduce((a, b) => a + b, 0);
  let counts = radii.map((r) => Math.floor((n * r) / total));
  let rem = n - counts.reduce((a, b) => a + b, 0);
  for (let i = rows - 1; rem > 0; i = (i - 1 + rows) % rows, rem--) counts[i]++;
  const seats = [];
  radii.forEach((r, ri) => {
    const c = counts[ri];
    for (let k = 0; k < c; k++) {
      const t = c === 1 ? 0.5 : k / (c - 1);
      const ang = Math.PI - t * Math.PI;
      seats.push({ x: Math.cos(ang) * r, y: -Math.sin(ang) * r, ang: t, row: ri });
    }
  });
  seats.sort((a, b) => a.ang - b.ang || a.row - b.row);
  return seats;
}

export function Hemicycle({ n = 100, colorFor, onSeat, size = 320, seatR, rows = 6, label }) {
  const seats = useMemo(() => hemicycle(n, rows), [n, rows]);
  const r = seatR || (n > 80 ? 0.034 : 0.045);
  return (
    <svg className="hemi" viewBox="-1.08 -1.08 2.16 1.16" style={{ maxWidth: size }} role="img" aria-label={label || "Assembly seats"}>
      {seats.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={r}
          fill={colorFor(i)}
          onClick={onSeat ? () => onSeat(i) : undefined}
          style={{ cursor: onSeat ? "pointer" : "default", transition: "fill .35s ease" }}
        />
      ))}
      <rect x="-0.16" y="-0.08" width="0.32" height="0.08" rx="0.015" fill="var(--red)" />
    </svg>
  );
}

// ---------- Section shell ----------
export function Section({ id, num, title, kicker, children }) {
  const { st } = useProgress();
  const done = sectionDone(st, id);
  return (
    <section id={id} className="sec">
      <header className="sec-head">
        <div className="sec-num" aria-hidden="true">{num}</div>
        <div className="sec-titles">
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <AnimatePresence>
          {done && (
            <motion.span className="done-chip" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CircleCheck size={16} /> Section cleared
            </motion.span>
          )}
        </AnimatePresence>
      </header>
      {children}
    </section>
  );
}

export function Prose({ children }) {
  return <div className="prose">{children}</div>;
}

export function Card({ children, className = "", title, icon, hint }) {
  return (
    <div className={"card " + className}>
      {title && (
        <div className="card-head">
          {icon}
          <h3>{title}</h3>
          {hint && <span className="card-hint">{hint}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function KeyIdea({ children }) {
  return (
    <div className="key-idea">
      <div className="key-tag"><Lightbulb size={16} /> KEY IDEA</div>
      <div>{children}</div>
    </div>
  );
}

export function Extra({ children, label = "Extra context" }) {
  return (
    <div className="extra">
      <span className="extra-tag"><Info size={13} /> {label}</span>
      <span>{children}</span>
    </div>
  );
}

// ---------- Explain toggles ----------
export function Explain({ simple, example, visual }) {
  const [tab, setTab] = useState(null);
  const tabs = [
    simple && { id: "simple", label: "Explain simply", icon: <Sparkles size={15} />, body: simple },
    example && { id: "example", label: "Show an example", icon: <BookOpen size={15} />, body: example },
    visual && { id: "visual", label: "Show visually", icon: <Eye size={15} />, body: visual },
  ].filter(Boolean);
  const cur = tabs.find((t) => t.id === tab);
  return (
    <div className="explain">
      <div className="explain-btns">
        {tabs.map((t) => (
          <button key={t.id} className={"chip-btn" + (tab === t.id ? " on" : "")} onClick={() => setTab(tab === t.id ? null : t.id)} aria-expanded={tab === t.id}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {cur && (
          <motion.div key={cur.id} className="explain-body" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {cur.body}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Quiz ----------
export function QuizBlock({ items, title = "Quick check" }) {
  const { st } = useProgress();
  const done = items.filter((q) => st.answered[q.id]).length;
  return (
    <div className="quiz-block">
      <div className="quiz-head">
        <span className="eyebrow"><Zap size={14} /> {title}</span>
        <span className="mono small">{done}/{items.length} answered</span>
      </div>
      {items.map((q, i) => (
        <QuizItem key={q.id} q={q} n={i + 1} />
      ))}
    </div>
  );
}

export function QuizItem({ q, n }) {
  const { st, answer } = useProgress();
  const saved = st.answered[q.id];
  const [picked, setPicked] = useState(null);
  const isTF = q.type === "tf";
  const opts = isTF ? ["True", "False"] : q.opts;
  const correctIdx = isTF ? (q.a ? 0 : 1) : q.a;
  const locked = !!saved;
  const pick = (i) => {
    if (locked) return;
    setPicked(i);
    answer(q.id, i === correctIdx);
  };
  const shownPick = picked ?? (saved ? (saved.correct ? correctIdx : -1) : null);
  const wasRight = saved?.correct;
  return (
    <div className={"q" + (locked ? (wasRight ? " q-right" : " q-wrong") : "")}>
      <p className="q-text"><span className="q-n mono">Q{n}</span> {q.q}</p>
      <div className={"opts" + (isTF ? " opts-tf" : "")}>
        {opts.map((o, i) => {
          let cls = "opt";
          if (locked) {
            if (i === correctIdx) cls += " opt-correct";
            else if (i === shownPick) cls += " opt-bad";
            else cls += " opt-dim";
          }
          return (
            <motion.button key={i} className={cls} onClick={() => pick(i)} disabled={locked} whileTap={locked ? undefined : { scale: 0.97 }}>
              <span className="opt-letter mono">{isTF ? (i === 0 ? "T" : "F") : "ABCD"[i]}</span>
              <span>{o}</span>
              {locked && i === correctIdx && <Check size={16} className="opt-ic" />}
              {locked && i === shownPick && i !== correctIdx && <X size={16} className="opt-ic" />}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {locked && (
          <motion.div className={"fb " + (wasRight ? "fb-ok" : "fb-no")} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <div className="fb-inner">
              <strong>{wasRight ? "Correct." : "Not quite."}</strong>{" "}
              {!wasRight && picked != null && q.wrong && q.wrong[picked] && <span className="fb-why">{q.wrong[picked]} </span>}
              <span>{q.why}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- XP toasts ----------
export function Toasts() {
  const { toasts } = useProgress();
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className={"toast" + (t.miss ? " toast-miss" : "")} initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}>
            {t.miss ? (
              <span>Streak reset. Read the why, then keep going.</span>
            ) : (
              <>
                <span className="toast-xp mono">+{t.xp} XP</span>
                {t.combo > 1 && (
                  <span className="toast-combo"><Flame size={14} /> {t.combo}× {t.combo >= 3 ? "STREAK" : "COMBO"}</span>
                )}
                {t.label && <span className="toast-label">{t.label}</span>}
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
