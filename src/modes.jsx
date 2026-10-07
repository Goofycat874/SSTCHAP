import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { ChevronLeft, ChevronRight, Shuffle, Check, Bookmark, RotateCcw, Eye, GripVertical, Gavel, Trophy, ArrowRight, ArrowDown, Lightbulb, Layers, Sparkles } from "lucide-react";
import { useProgress } from "./store.jsx";
import { Hemicycle, shuffle, Extra } from "./ui.jsx";
import { FLASHCARDS, EXAM, FINAL, LISTS } from "./data.js";

const LIST_COLOR = { Union: "var(--union)", State: "var(--state)", Concurrent: "var(--conc)" };

// =============== FLASHCARDS ===============
export function Flashcards() {
  const { st, setCard, complete } = useProgress();
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState(() => FLASHCARDS.map((c) => c.id));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [seen, setSeen] = useState(() => new Set());
  const deck = order.map((id) => FLASHCARDS.find((c) => c.id === id)).filter((c) => {
    const v = st.cards[c.id];
    if (filter === "review") return v === "review";
    if (filter === "unknown") return v !== "known";
    return true;
  });
  const card = deck[Math.min(i, deck.length - 1)];
  useEffect(() => { setI(0); setFlip(false); }, [filter]);
  useEffect(() => {
    if (!card) return;
    setSeen((s) => {
      if (s.has(card.id)) return s;
      const n = new Set(s).add(card.id);
      if (n.size === FLASHCARDS.length) complete("act-flash", 150);
      return n;
    });
  }, [card?.id]);
  const go = (d) => { setFlip(false); setI((x) => (deck.length ? (x + d + deck.length) % deck.length : 0)); };
  useEffect(() => {
    const k = (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " ") { e.preventDefault(); setFlip((f) => !f); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const known = FLASHCARDS.filter((c) => st.cards[c.id] === "known").length;
  const review = FLASHCARDS.filter((c) => st.cards[c.id] === "review").length;
  return (
    <div className="mode mode-flash">
      <header className="mode-head">
        <p className="eyebrow">Revise</p>
        <h2>Flashcards</h2>
        <p className="muted">{FLASHCARDS.length} cards · <span className="ok-t">{known} known</span> · <span className="rev-t">{review} to review</span> · seen {seen.size}/{FLASHCARDS.length} this visit</p>
      </header>
      <div className="seg" role="tablist">
        {[["all", "All cards"], ["unknown", "Not yet known"], ["review", "Review later"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      {!card ? (
        <div className="empty">
          <p>{filter === "review" ? "Nothing marked for review yet." : "You've marked every card as known."}</p>
          <button className="btn-ghost" onClick={() => setFilter("all")}>Show all cards</button>
        </div>
      ) : (
        <>
          <div className="fc-stage">
            <button className="flashcard" onClick={() => setFlip((f) => !f)} aria-label={flip ? "Card back. Tap to flip." : "Card front. Tap to flip."}>
              <motion.div className="fc-inner" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.45, type: "spring", stiffness: 160, damping: 20 }}>
                <div className="fc-face fc-front">
                  <span className="mono small fc-count">{Math.min(i, deck.length - 1) + 1} / {deck.length}</span>
                  <span className="fc-term">{card.front}</span>
                  <span className="mono small muted">tap or press space to flip</span>
                </div>
                <div className="fc-face fc-back">
                  <span className="mono small fc-count">{card.front}</span>
                  <span className="fc-def">{card.back}</span>
                  {st.cards[card.id] && <span className={"mono small " + (st.cards[card.id] === "known" ? "ok-t" : "rev-t")}>{st.cards[card.id] === "known" ? "marked known" : "marked for review"}</span>}
                </div>
              </motion.div>
            </button>
          </div>
          <div className="fc-controls">
            <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous card"><ChevronLeft size={20} /></button>
            <button className="btn-ghost ok" onClick={() => { setCard(card.id, "known"); go(1); }}><Check size={16} /> Know it</button>
            <button className="btn-ghost rev" onClick={() => { setCard(card.id, "review"); go(1); }}><Bookmark size={16} /> Review later</button>
            <button className="icon-btn" onClick={() => go(1)} aria-label="Next card"><ChevronRight size={20} /></button>
          </div>
          <div className="fc-controls">
            <button className="btn-ghost sm" onClick={() => { setOrder(shuffle(order)); setI(0); setFlip(false); }}><Shuffle size={14} /> Shuffle</button>
            <button className="btn-ghost sm" onClick={() => { setOrder(FLASHCARDS.map((c) => c.id)); setI(0); setFlip(false); }}><RotateCcw size={14} /> Original order</button>
          </div>
        </>
      )}
    </div>
  );
}

// =============== EXAM PREP ===============
const EXAM_TABS = [
  ["defs", "Definitions"],
  ["facts", "Key facts"],
  ["diff", "Differences"],
  ["ce", "Cause → effect"],
  ["short", "Short answers"],
  ["long", "Long answers"],
  ["reason", "Give reasons"],
  ["data", "Data-based"],
];

function QA({ items }) {
  const { st, reveal, complete } = useProgress();
  const examIds = [...EXAM.short, ...EXAM.long, ...EXAM.reasoning, ...EXAM.data].map((q) => q.id);
  const count = examIds.filter((id) => st.revealed[id]).length;
  useEffect(() => { if (count >= 6) complete("act-exam", 120); }, [count]);
  return (
    <div className="qa-list">
      {items.map((q) => (
        <div key={q.id} className="qa">
          <p className="qa-q">{q.q}</p>
          {st.revealed[q.id] ? (
            <motion.div className="qa-a" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mono small">MODEL ANSWER</p>
              <p>{q.a}</p>
            </motion.div>
          ) : (
            <button className="btn-ghost sm" onClick={() => reveal(q.id)}><Eye size={14} /> Try it first, then reveal</button>
          )}
        </div>
      ))}
    </div>
  );
}

export function Exam() {
  const [tab, setTab] = useState("defs");
  const { st } = useProgress();
  const examIds = [...EXAM.short, ...EXAM.long, ...EXAM.reasoning, ...EXAM.data].map((q) => q.id);
  const count = examIds.filter((id) => st.revealed[id]).length;
  return (
    <div className="mode mode-exam">
      <header className="mode-head">
        <p className="eyebrow">Exam prep</p>
        <h2>What's likely to come up</h2>
        <p className="muted">Everything here is based on the chapter. Model answers revealed: {count}/{examIds.length}.</p>
      </header>
      <div className="tabs-scroll">
        <div className="seg seg-scroll" role="tablist">
          {EXAM_TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {tab === "defs" && (
            <dl className="defs">
              {EXAM.definitions.map(([t, d]) => (
                <div key={t} className="def"><dt>{t}</dt><dd>{d}</dd></div>
              ))}
            </dl>
          )}
          {tab === "facts" && (
            <ul className="facts">
              {EXAM.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          {tab === "diff" && (
            <div className="diffs">
              {EXAM.differences.map((d) => (
                <div key={d.title} className="diff-table-wrap light">
                  <p className="diff-title">{d.title}</p>
                  <table className="diff-table">
                    <thead><tr>{d.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                    <tbody>{d.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              ))}
              <p className="small muted">The full 15-point Union vs State comparison is in section 03 of Learn.</p>
            </div>
          )}
          {tab === "ce" && (
            <div className="ce-list">
              {EXAM.causeEffect.map(([c, e]) => (
                <div key={c} className="ce"><span className="ce-c">{c}</span><ArrowRight size={18} className="ce-ar" /><span className="ce-e">{e}</span></div>
              ))}
            </div>
          )}
          {tab === "short" && <QA items={EXAM.short} />}
          {tab === "long" && <QA items={EXAM.long} />}
          {tab === "reason" && <QA items={EXAM.reasoning} />}
          {tab === "data" && <QA items={EXAM.data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============== FINAL CHALLENGE: ORDER IN THE HOUSE ===============
function Teach({ text, onRetry }) {
  return (
    <motion.div className="teach" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <p className="teach-h"><Lightbulb size={16} /> Quick reteach</p>
      <p>{text}</p>
      <button className="btn" onClick={onRetry}><RotateCcw size={15} /> Try again</button>
    </motion.div>
  );
}

function FinalMCQ({ q, onSolve, onMiss }) {
  const opts = q.type === "tf" ? ["True", "False"] : q.opts;
  const correct = q.type === "tf" ? (q.a ? 0 : 1) : q.a;
  const [wrong, setWrong] = useState(new Set());
  const [teach, setTeach] = useState(false);
  const [ok, setOk] = useState(false);
  const pick = (i) => {
    if (teach || ok || wrong.has(i)) return;
    if (i === correct) { setOk(true); onSolve(wrong.size === 0); }
    else { setWrong((w) => new Set(w).add(i)); setTeach(true); onMiss(); }
  };
  return (
    <div>
      <div className={"opts" + (q.type === "tf" ? " opts-tf" : "")}>
        {opts.map((o, i) => (
          <button key={i} className={"opt" + (wrong.has(i) ? " opt-bad" : "") + (ok && i === correct ? " opt-correct" : "")} disabled={teach || ok || wrong.has(i)} onClick={() => pick(i)}>
            <span className="opt-letter mono">{q.type === "tf" ? (i ? "F" : "T") : "ABCD"[i]}</span>
            <span>{o}</span>
          </button>
        ))}
      </div>
      {teach && <Teach text={q.teach} onRetry={() => setTeach(false)} />}
    </div>
  );
}

function FinalSort({ q, onSolve, onMiss }) {
  const [left, setLeft] = useState(() => shuffle(q.items));
  const [placed, setPlaced] = useState([]);
  const [sel, setSel] = useState(null);
  const [teach, setTeach] = useState(false);
  const [missed, setMissed] = useState(false);
  const put = (list) => {
    if (sel == null || teach) return;
    const it = left[sel];
    if (it[1] === list) {
      const nl = left.filter((_, j) => j !== sel);
      setLeft(nl);
      setPlaced((p) => [...p, it]);
      setSel(null);
      if (nl.length === 0) onSolve(!missed);
    } else {
      setMissed(true);
      setTeach(true);
      setSel(null);
      onMiss();
    }
  };
  return (
    <div>
      <div className="tray">
        {left.map((it, j) => (
          <button key={it[0]} className={"chip" + (sel === j ? " chip-sel" : "")} onClick={() => setSel(sel === j ? null : j)} disabled={teach}>{it[0]}</button>
        ))}
        {left.length === 0 && <span className="mono small ok-t">All sorted.</span>}
      </div>
      <div className="buckets">
        {Object.entries(LISTS).map(([k, L]) => (
          <button key={k} className={"bucket" + (sel != null ? " bucket-ready" : "")} style={{ "--c": LIST_COLOR[k] }} onClick={() => put(k)}>
            <span className="bucket-h">{L.name}</span>
            <span className="bucket-items">{placed.filter((p) => p[1] === k).map((p) => <span key={p[0]} className="pill" style={{ "--c": LIST_COLOR[k] }}>{p[0]}</span>)}</span>
          </button>
        ))}
      </div>
      {teach && <Teach text={q.teach} onRetry={() => setTeach(false)} />}
    </div>
  );
}

function SeqItem({ it, i, n, ok, state, move }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={it} className={"seq-item" + state} dragListener={false} dragControls={controls}>
      <span className="grip" onPointerDown={(e) => !ok && controls.start(e)} aria-hidden="true"><GripVertical size={16} /></span>
      <span className="mono seq-n">{i + 1}</span>
      <span className="seq-t">{it}</span>
      <span className="seq-btns">
        <button className="icon-btn sm" onClick={() => move(i, -1)} disabled={ok || i === 0} aria-label="Move up">↑</button>
        <button className="icon-btn sm" onClick={() => move(i, 1)} disabled={ok || i === n - 1} aria-label="Move down">↓</button>
      </span>
    </Reorder.Item>
  );
}

function FinalSequence({ q, onSolve, onMiss }) {
  const [items, setItems] = useState(() => {
    let s = shuffle(q.items);
    while (s.every((x, i) => x === q.items[i])) s = shuffle(q.items);
    return s;
  });
  const [checked, setChecked] = useState(false);
  const [teach, setTeach] = useState(false);
  const [missed, setMissed] = useState(false);
  const [ok, setOk] = useState(false);
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
    setChecked(false);
  };
  const check = () => {
    setChecked(true);
    if (items.every((x, i) => x === q.items[i])) { setOk(true); onSolve(!missed); }
    else { setMissed(true); setTeach(true); onMiss(); }
  };
  return (
    <div>
      <p className="small muted">Drag the handles, or use the arrows.</p>
      <Reorder.Group axis="y" values={items} onReorder={(v) => { if (!ok) { setItems(v); setChecked(false); } }} className="seq">
        {items.map((it, i) => (
          <SeqItem key={it} it={it} i={i} n={items.length} ok={ok} state={checked ? (it === q.items[i] ? " s-ok" : " s-no") : ""} move={move} />
        ))}
      </Reorder.Group>
      {!ok && !teach && <button className="btn" onClick={check}>Check order</button>}
      {teach && <Teach text={q.teach} onRetry={() => { setTeach(false); }} />}
    </div>
  );
}

function FinalMatch({ q, onSolve, onMiss }) {
  const [right] = useState(() => shuffle(q.pairs.map((p) => p[1])));
  const [selA, setSelA] = useState(null);
  const [done, setDone] = useState(new Set());
  const [teach, setTeach] = useState(false);
  const [missed, setMissed] = useState(false);
  const pickB = (b) => {
    if (selA == null || teach) return;
    const pair = q.pairs.find((p) => p[0] === selA);
    if (pair[1] === b) {
      const n = new Set(done).add(selA);
      setDone(n);
      setSelA(null);
      if (n.size === q.pairs.length) onSolve(!missed);
    } else {
      setMissed(true);
      setTeach(true);
      setSelA(null);
      onMiss();
    }
  };
  const doneB = new Set(q.pairs.filter((p) => done.has(p[0])).map((p) => p[1]));
  return (
    <div>
      <div className="match-cols">
        <div className="mcolumn">
          {q.pairs.map((p) => (
            <button key={p[0]} className={"mi mi-a" + (selA === p[0] ? " sel" : "") + (done.has(p[0]) ? " done" : "")} disabled={done.has(p[0]) || teach} onClick={() => setSelA(p[0])}>{p[0]}</button>
          ))}
        </div>
        <div className="mcolumn">
          {right.map((b) => (
            <button key={b} className={"mi mi-b" + (doneB.has(b) ? " done" : "") + (selA && !doneB.has(b) ? " ready" : "")} disabled={doneB.has(b) || teach} onClick={() => pickB(b)}>{b}</button>
          ))}
        </div>
      </div>
      {teach && <Teach text={q.teach} onRetry={() => setTeach(false)} />}
    </div>
  );
}

export function Final() {
  const { addXp, complete } = useProgress();
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [first, setFirst] = useState([]);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const total = FINAL.length;
  const finished = idx >= total;
  const per = Math.floor(98 / total);
  const calm = Math.min(98, first.length * per + (finished ? 98 - total * per : 0));
  const q = FINAL[idx];
  const onSolve = (ft) => {
    setSolved(true);
    setFirst((f) => [...f, ft]);
    addXp(ft ? 100 : 40, ft ? "First try" : "Solved after reteach");
  };
  useEffect(() => { if (finished) complete("act-final", 300); }, [finished]);
  const next = () => { setSolved(false); setIdx((i) => i + 1); };
  const restart = () => { setIdx(0); setSolved(false); setFirst([]); setRun((r) => r + 1); setStarted(true); };
  const score = first.filter(Boolean).length;
  const typeLabel = { mcq: "Multiple choice", tf: "True or false", sort: "Sort it", sequence: "Put in order", match: "Match the twins" };
  return (
    <div className="mode mode-final">
      <div className="final-top">
        <div>
          <p className="eyebrow">Final challenge</p>
          <h2>Order in the House!</h2>
          <p className="muted">You're the Speaker, and the Assembly is in uproar. Every correct answer calms a block of seats. Get it wrong and you'll get a quick reteach before trying again.</p>
        </div>
        <div className="final-meter">
          <Hemicycle n={98} rows={5} size={300} label={`${calm} of 98 seats in order`} colorFor={(i) => (i < calm ? "var(--seat-on)" : "var(--upper)")} />
          <div className="meter-track big"><motion.div className="meter-fill" animate={{ width: (Math.min(idx, total) / total) * 100 + "%" }} /></div>
          <p className="mono small">House in order: {Math.round((calm / 98) * 100)}% · Q {Math.min(idx + 1, total)}/{total}</p>
        </div>
      </div>

      {!started && !finished ? (
        <div className="final-start">
          <p><Gavel size={18} /> 14 rounds · MCQs, true/false, sorting, sequencing and matching from every part of the chapter.</p>
          <button className="btn big" onClick={() => setStarted(true)}>Bang the gavel. Start.</button>
        </div>
      ) : finished ? (
        <motion.div className="final-end" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy size={40} />
          <h3>The House is in order.</h3>
          <p className="big-n tnum">{score}<span>/{total}</span></p>
          <p>first-try answers. {score === total ? "Flawless session. Speaker energy." : score >= 10 ? "Strong session. Revise the ones you missed in Flashcards." : "Good effort. Run the Exam Prep tab, then come back for a rematch."}</p>
          <div className="final-review">
            {FINAL.map((f, i) => (
              <span key={f.id} className={"fr " + (first[i] ? "ok" : "no")} title={f.q}>{i + 1}</span>
            ))}
          </div>
          <button className="btn" onClick={restart}><RotateCcw size={15} /> New session</button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={run + "-" + idx} className="final-q" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <p className="mono small fq-type">ROUND {idx + 1} · {typeLabel[q.type]}</p>
            <h3 className="fq-text">{q.q}</h3>
            {(q.type === "mcq" || q.type === "tf") && <FinalMCQ q={q} onSolve={onSolve} onMiss={() => {}} />}
            {q.type === "sort" && <FinalSort q={q} onSolve={onSolve} onMiss={() => {}} />}
            {q.type === "sequence" && <FinalSequence q={q} onSolve={onSolve} onMiss={() => {}} />}
            {q.type === "match" && <FinalMatch q={q} onSolve={onSolve} onMiss={() => {}} />}
            {solved && (
              <motion.div className="solved" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <p><Check size={16} /> {first[first.length - 1] ? "First try. Order restored." : "Got there. Order restored."} <span className="muted">{q.teach}</span></p>
                <button className="btn" onClick={next}>{idx === total - 1 ? "Adjourn the House" : "Next round"} <ArrowRight size={16} /></button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// =============== RECAP ===============
export function Recap() {
  const { complete } = useProgress();
  useEffect(() => { const t = setTimeout(() => complete("act-recap", 50), 1500); return () => clearTimeout(t); }, []);
  return (
    <div className="mode mode-recap">
      <header className="mode-head">
        <p className="eyebrow">Recap</p>
        <h2>The whole thing in 2 minutes</h2>
      </header>
      <div className="recap-board">
        <div className="rb rb-wide">
          <p className="rb-h mono">STATE GOVERNMENT</p>
          <div className="rb-flow">
            <span className="rb-node leg">Legislature<small>Vidhan Sabha · MLAs · makes laws</small></span>
            <ArrowRight className="rb-ar" size={18} />
            <span className="rb-node exe">Executive<small>implements laws</small></span>
            <ArrowRight className="rb-ar" size={18} />
            <span className="rb-node jud">Judiciary<small>High Courts</small></span>
          </div>
          <div className="rb-split">
            <span><b>Governor</b> = nominal head · appointed by President</span>
            <span><b>CM + Council</b> = real power · CM leads majority in Vidhan Sabha</span>
            <span><b>Lose majority</b> → CM & Council resign together</span>
          </div>
        </div>
        <div className="rb">
          <p className="rb-h mono">7TH SCHEDULE</p>
          <div className="rb-lists">
            <span className="tok tok-union">Union → Parliament only</span>
            <span className="tok tok-state">State → State Legislature</span>
            <span className="tok tok-conc">Concurrent → both</span>
          </div>
          <p className="rb-k">Clash on Concurrent → <b>Parliament wins</b> (RTE Act 2009)</p>
        </div>
        <div className="rb">
          <p className="rb-h mono">MIRROR</p>
          <p className="rb-k">PM ↔ CM · President ↔ Governor · Lok Sabha ↔ Vidhan Sabha · Rajya Sabha ↔ Vidhan Parishad · SC ↔ HCs</p>
          <p className="rb-k">Money Bills start in the <b>lower house</b> at both levels.</p>
        </div>
        <div className="rb">
          <p className="rb-h mono">1 OR 2 HOUSES</p>
          <div className="rb-houses">
            <span className="rb-big">6</span>
            <span>bicameral states: AP, Bihar, Karnataka, Maharashtra, Telangana, UP. Rest: unicameral.</span>
          </div>
        </div>
        <div className="rb">
          <p className="rb-h mono">SESSIONS</p>
          <p className="rb-k">Budget · Monsoon · Winter — ~6 hrs a day. States: similar.</p>
        </div>
        <div className="rb rb-wide">
          <p className="rb-h mono">WHY THE HOUSE STALLS</p>
          <div className="rb-flow">
            <span className="rb-node warn">Absence · walkouts · sloganeering · Question Hour chaos · few sittings · criminalisation · money &amp; lobbying · Bills unscrutinised · committees unused</span>
            <ArrowRight className="rb-ar" size={18} />
            <span className="rb-node warn">Delay · low productivity · reduced effectiveness</span>
            <ArrowRight className="rb-ar" size={18} />
            <span className="rb-node warn">Public trust ↓</span>
            <ArrowRight className="rb-ar" size={18} />
            <span className="rb-node">Media: debates, cartoons, satire = healthy democracy</span>
          </div>
        </div>
        <div className="rb">
          <p className="rb-h mono">DATA</p>
          <p className="rb-k"><b>121 → 68</b> Lok Sabha days/yr (1952–70 vs since 2000)</p>
          <p className="rb-k">17th LS: <b>274</b> days — fewest. 13th & 14th: 356.</p>
        </div>
      </div>

      <section className="exam-version light">
        <p className="eyebrow">Exam revision version</p>
        <ol>
          <li>The State Legislature is the lawmaking body at the state level; in most states it is called the Legislative Assembly (Vidhan Sabha), and its members are MLAs.</li>
          <li>It makes laws on subjects in the State List and the Concurrent List. In a conflict on a Concurrent subject, the law made by Parliament prevails.</li>
          <li>The executive implements laws. The Governor is the nominal head; real power lies with the Council of Ministers headed by the Chief Minister.</li>
          <li>The CM and the Council of Ministers are collectively responsible to the Legislative Assembly and must resign if they lose the confidence of the majority of MLAs.</li>
          <li>The 7th Schedule contains the Union List (e.g. Defence, Currency), State List (e.g. Police, Agriculture) and Concurrent List (e.g. Education, Forests). The RTE Act, 2009 applies across India though Education is on the Concurrent List.</li>
          <li>The State government's structure parallels the Union's: Governor (appointed by the President) ↔ President (elected by an electoral college); CM ↔ PM; Vidhan Sabha ↔ Lok Sabha; High Courts ↔ Supreme Court.</li>
          <li>State legislatures may be unicameral (Vidhan Sabha) or bicameral (Vidhan Sabha and Vidhan Parishad). Only six states are bicameral: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana and Uttar Pradesh.</li>
          <li>Legislatures make laws, oversee administration, frame policies and plans, pass budgets and consider public opinion. Parliament holds three sessions a year — Budget, Monsoon and Winter — sitting about six hours a day.</li>
          <li>Challenges include absence of legislators, disruptions, interruptions in Question Hour, low number of sittings, personal attacks, criminalisation of politics, biased debates, insufficient scrutiny of Bills, inadequate use of committees and the influence of money and lobbying. These cause delay, low productivity and reduced effectiveness.</li>
          <li>Lok Sabha sitting days fell from an annual average of 121 (1952–70) to 68 (since 2000); the 17th Lok Sabha had the fewest (274).</li>
          <li>These problems reduce public trust. The media raises concerns through debates, cartoons and articles, often with humour and satire — a feature of healthy democracies.</li>
        </ol>
      </section>
    </div>
  );
}
