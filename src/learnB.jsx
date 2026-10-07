import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlipHorizontal2, Brain, RotateCcw, Map as MapIcon, Building2, PenLine, Check, X, Eye } from "lucide-react";
import { useProgress } from "./store.jsx";
import { Section, Card, KeyIdea, Explain, QuizBlock, Extra, shuffle } from "./ui.jsx";
import { MIRROR, MEMORY_PAIRS, STATES, CHECK_YOUR_PROGRESS, QUIZZES } from "./data.js";

// =============== SECTION 3: MIRROR ===============
function MirrorTable() {
  const { complete } = useProgress();
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(() => new Set());
  const rows = MIRROR.map((r, i) => ({ ...r, i })).filter((r) => filter === "all" || (filter === "same" ? r.same : !r.same));
  useEffect(() => {
    if (shown.size === MIRROR.length) complete("act-mirror", 100);
  }, [shown]);
  const showRow = (i) => setShown((s) => new Set(s).add(i));
  const showAll = () => setShown(new Set(MIRROR.map((_, i) => i)));
  return (
    <Card className="mirror-card light" title="Guess the state twin" icon={<FlipHorizontal2 size={18} />} hint={`${shown.size}/15 revealed`}>
      <p className="small muted">You already know the Union government. For each row, guess the state version, then tap to check.</p>
      <div className="mirror-tools">
        <div className="seg" role="tablist">
          {[["all", "All 15"], ["same", "Same pattern"], ["diff", "Key differences"]].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <button className="btn-ghost sm" onClick={showAll}><Eye size={14} /> Reveal all</button>
      </div>
      <div className="mirror">
        <div className="mirror-head mono">
          <span className="mh-u">UNION · New Delhi</span>
          <span className="mh-s">STATE · state capital</span>
        </div>
        <AnimatePresence initial={false}>
          {rows.map((r) => {
            const open = shown.has(r.i);
            return (
              <motion.div key={r.i} layout className={"mrow" + (r.same ? "" : " mrow-diff")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mfeat"><span className="mono small">{String(r.i + 1).padStart(2, "0")}</span> {r.f} {!r.same && <span className="diff-tag">differs</span>}</div>
                <div className="mu">{r.u}</div>
                <button className={"ms" + (open ? " open" : "")} onClick={() => showRow(r.i)} aria-label={open ? r.s : `Reveal the state version of ${r.f}`}>
                  {open ? (
                    <motion.span initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.3 }}>{r.s}</motion.span>
                  ) : (
                    <span className="ms-cover">Tap to reveal</span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function MemoryGame() {
  const { complete } = useProgress();
  const build = () =>
    shuffle(
      MEMORY_PAIRS.flatMap(([u, s], pi) => [
        { key: pi + "u", pair: pi, text: u, side: "Union" },
        { key: pi + "s", pair: pi, text: s, side: "State" },
      ])
    );
  const [cards, setCards] = useState(build);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const won = matched.size === MEMORY_PAIRS.length;
  useEffect(() => {
    if (won) complete("act-memory", Math.max(80, 220 - Math.max(0, moves - 8) * 10));
  }, [won]);
  const flip = (idx) => {
    if (open.length === 2 || open.includes(idx) || matched.has(cards[idx].pair)) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].pair === cards[b].pair && cards[a].side !== cards[b].side) {
        setTimeout(() => { setMatched((m) => new Set(m).add(cards[a].pair)); setOpen([]); }, 350);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  };
  const restart = () => { setCards(build()); setOpen([]); setMatched(new Set()); setMoves(0); };
  return (
    <Card className="memory-card" title="Twin match" icon={<Brain size={18} />} hint={`${matched.size}/8 pairs · ${moves} moves`}>
      <p className="small muted">Flip two cards. Match each Union post or body with its state twin.</p>
      <div className="memory">
        {cards.map((c, i) => {
          const face = open.includes(i) || matched.has(c.pair);
          return (
            <button key={c.key} className={"mem" + (matched.has(c.pair) ? " mem-done" : "")} onClick={() => flip(i)} aria-label={face ? c.text : "Hidden card"}>
              <motion.span className="mem-inner" animate={{ rotateY: face ? 180 : 0 }} transition={{ duration: 0.35 }}>
                <span className="mem-back" aria-hidden="true"><span className="mem-seal">✦</span></span>
                <span className={"mem-front " + (c.side === "Union" ? "mf-u" : "mf-s")}>
                  <span className="mono mem-side">{c.side}</span>
                  {c.text}
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>
      {won && (
        <motion.div className="win" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p>All 8 twins matched in {moves} moves.</p>
          <button className="btn-ghost" onClick={restart}><RotateCcw size={15} /> Shuffle & replay</button>
        </motion.div>
      )}
    </Card>
  );
}

export function S3() {
  return (
    <Section id="s3" num="03" title="Mirror Image" kicker="Union vs State government">
      <p className="prose-lead">
        The State government is built like a smaller copy of the Union government. Learn the pattern once, then spot the few places where the copy is different.
      </p>
      <MirrorTable />
      <Explain
        simple={<p>Almost everything at the Union level has a state "twin": Parliament ↔ State Legislature, PM ↔ CM, Lok Sabha ↔ Vidhan Sabha. The big differences: the state's head (Governor) is <strong>appointed</strong>, not elected; a state may have just <strong>one house</strong>; and the state judiciary is the <strong>High Court</strong>.</p>}
        example={<p>Money Bills: at the Union level they start only in the <strong>Lok Sabha</strong>. Copy that pattern to the state: they start only in the <strong>Vidhan Sabha</strong>, the state's lower house.</p>}
        visual={
          <div className="twin-vis">
            {[["President", "Governor", "elected vs appointed"], ["Prime Minister", "Chief Minister", "same pattern"], ["Lok Sabha", "Vidhan Sabha", "same pattern"], ["Rajya Sabha", "Vidhan Parishad", "only some states"], ["Supreme Court", "High Courts", "different court"]].map(([a, b, n]) => (
              <div key={a} className="tv-row">
                <span className="tv-u">{a}</span>
                <span className="tv-arrow mono">⟷</span>
                <span className="tv-s">{b}</span>
                <span className="small muted tv-n">{n}</span>
              </div>
            ))}
          </div>
        }
      />
      <MemoryGame />
      <KeyIdea>
        The state copies the Union pattern: <strong>CM ↔ PM</strong>, <strong>Vidhan Sabha ↔ Lok Sabha</strong>, <strong>State Budget ↔ Union Budget</strong>. Key differences: <strong>Governor is appointed by the President</strong> (President is elected), states can be <strong>unicameral</strong>, and state judiciary = <strong>High Courts</strong>.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s3} />
    </Section>
  );
}

// =============== SECTION 4: ONE HOUSE OR TWO ===============
function Chambers() {
  const [two, setTwo] = useState(false);
  return (
    <Card className="chambers" title="One house or two?" icon={<Building2 size={18} />}>
      <div className="seg seg-wide" role="tablist">
        <button role="tab" aria-selected={!two} className={!two ? "on" : ""} onClick={() => setTwo(false)}>Unicameral · 1 house</button>
        <button role="tab" aria-selected={two} className={two ? "on" : ""} onClick={() => setTwo(true)}>Bicameral · 2 houses</button>
      </div>
      <div className="chamber-stage">
        <svg viewBox="0 0 520 200" className="chamber-svg" role="img" aria-label={two ? "Two houses: Vidhan Sabha and Vidhan Parishad" : "One house: Vidhan Sabha"}>
          <line x1="10" y1="186" x2="510" y2="186" stroke="var(--line-strong)" strokeWidth="2" />
          <motion.g animate={{ x: two ? 0 : 100 }} transition={{ type: "spring", stiffness: 140, damping: 18 }}>
            <path d="M70 180 V110 A90 70 0 0 1 250 110 V180 Z" fill="var(--fg)" fillOpacity="0.08" stroke="var(--fg)" strokeWidth="2" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={86 + i * 27} y="130" width="12" height="50" rx="2" fill="var(--fg)" fillOpacity="0.6" />)}
            <text x="160" y="96" textAnchor="middle" className="ch-t" fill="var(--fg)">Vidhan Sabha</text>
            <text x="160" y="76" textAnchor="middle" className="ch-s" fill="var(--fg-2)">Legislative Assembly · MLAs</text>
          </motion.g>
          <AnimatePresence>
            {two && (
              <motion.g initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4 }}>
                <path d="M300 180 V122 A80 62 0 0 1 460 122 V180 Z" fill="var(--upper)" fillOpacity="0.12" stroke="var(--upper)" strokeWidth="2" />
                {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={316 + i * 29} y="140" width="12" height="40" rx="2" fill="var(--upper)" fillOpacity="0.5" />)}
                <text x="380" y="108" textAnchor="middle" className="ch-t" fill="var(--fg)">Vidhan Parishad</text>
                <text x="380" y="88" textAnchor="middle" className="ch-s" fill="var(--fg-2)">Legislative Council</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>
      <p className="chamber-cap">
        {two
          ? "Bicameral: two houses — the Vidhan Sabha (Legislative Assembly) and the Vidhan Parishad (Legislative Council). Only six states currently."
          : "Unicameral: only one house — the Vidhan Sabha (Legislative Assembly). Most states work like this."}
      </p>
    </Card>
  );
}

function TileMap() {
  const { complete } = useProgress();
  const [sel, setSel] = useState(new Set());
  const [checked, setChecked] = useState(false);
  const toggle = (c) => {
    if (checked) return;
    setSel((s) => {
      const n = new Set(s);
      n.has(c) ? n.delete(c) : n.size < 6 && n.add(c);
      return n;
    });
  };
  const bic = STATES.filter((s) => s[4]).map((s) => s[0]);
  const hits = [...sel].filter((c) => bic.includes(c)).length;
  const check = () => {
    setChecked(true);
    complete("act-map", 40 + hits * 25);
  };
  const retry = () => { setSel(new Set()); setChecked(false); };
  return (
    <Card className="map-card" title="Find the six" icon={<MapIcon size={18} />} hint={checked ? `${hits}/6 found` : `${sel.size}/6 picked`}>
      <p className="small muted">Only six states have a bicameral legislature. Tap the six you think they are, then check.</p>
      <div className="tilemap-wrap">
        <div className="tilemap" role="group" aria-label="Tile map of Indian states">
          {STATES.map(([code, name, col, row, isBic]) => {
            const on = sel.has(code);
            let cls = "tile";
            if (checked) cls += isBic ? (on ? " t-hit" : " t-miss") : on ? " t-wrong" : " t-off";
            else if (on) cls += " t-on";
            return (
              <button key={code} className={cls} style={{ gridColumn: col + 1, gridRow: row + 1 }} onClick={() => toggle(code)} title={name} aria-pressed={on} aria-label={name}>
                <span className="t-code mono">{code}</span>
                <span className="t-name">{name}</span>
              </button>
            );
          })}
        </div>
        <div className="map-legend small">
          <p className="mono">Tile map · not to scale · each square = one state (28 states)</p>
          {checked && (
            <div className="legend-row">
              <span><i className="lg lg-hit" /> correct</span>
              <span><i className="lg lg-miss" /> missed</span>
              <span><i className="lg lg-wrong" /> not bicameral</span>
            </div>
          )}
        </div>
      </div>
      <div className="map-actions">
        {!checked ? (
          <button className="btn" disabled={sel.size !== 6} onClick={check}>Check my six</button>
        ) : (
          <>
            <p><strong>{hits}/6.</strong> The six: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh. Every other state is unicameral.</p>
            <button className="btn-ghost" onClick={retry}><RotateCcw size={15} /> Try again</button>
          </>
        )}
      </div>
      <Extra label="Memory trick">
        <strong>B</strong>ig <strong>U</strong>ncle <strong>M</strong>akes <strong>T</strong>asty <strong>A</strong>loo <strong>K</strong>achori → <strong>B</strong>ihar, <strong>U</strong>ttar Pradesh, <strong>M</strong>aharashtra, <strong>T</strong>elangana, <strong>A</strong>ndhra Pradesh, <strong>K</strong>arnataka. (Our trick, not from the textbook.)
      </Extra>
    </Card>
  );
}

function CheckYourProgress() {
  const { st, reveal, answer, complete } = useProgress();
  const [drafts, setDrafts] = useState({});
  const allMarked = CHECK_YOUR_PROGRESS.every((q) => st.answered[q.id]);
  useEffect(() => { if (allMarked) complete("act-cyp", 60); }, [allMarked]);
  return (
    <Card className="cyp" title="Check Your Progress" icon={<PenLine size={18} />} hint="From your textbook">
      <p className="small muted">Answer in your head or type it, reveal the answer, then mark yourself honestly.</p>
      <ol className="cyp-list">
        {CHECK_YOUR_PROGRESS.map((q) => {
          const shown = st.revealed[q.id];
          const marked = st.answered[q.id];
          return (
            <li key={q.id} className="cyp-item">
              <p className="cyp-q">{q.q}</p>
              <input id={"cyp-" + q.id} className="field" placeholder="Your answer (optional)" value={drafts[q.id] || ""} onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))} />
              {!shown ? (
                <button className="btn-ghost sm" onClick={() => reveal(q.id)}><Eye size={14} /> Reveal answer</button>
              ) : (
                <motion.div className="cyp-a" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p><strong>Answer:</strong> {q.a}</p>
                  {!marked ? (
                    <div className="pill-row">
                      <button className="btn-ghost sm ok" onClick={() => answer(q.id, true, 30)}><Check size={14} /> I got it</button>
                      <button className="btn-ghost sm no" onClick={() => answer(q.id, false, 30)}><X size={14} /> I missed it</button>
                    </div>
                  ) : (
                    <span className={"mono small " + (marked.correct ? "ok-t" : "no-t")}>{marked.correct ? "Marked: got it" : "Marked: review this"}</span>
                  )}
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export function S4() {
  return (
    <Section id="s4" num="04" title="One House or Two" kicker="Structure of State Legislatures">
      <p className="prose-lead">
        Parliament always has two houses. States get a choice: a state legislature can be <strong>unicameral</strong> (one house) or <strong>bicameral</strong> (two houses).
      </p>
      <Chambers />
      <TileMap />
      <div className="photo-note">
        <Building2 size={20} />
        <p><strong>Vidhan Bhavan, Mumbai</strong> — the seat of Maharashtra's legislature, one of the six bicameral states. Your textbook shows a photo of it.</p>
      </div>
      <KeyIdea>
        <strong>Unicameral</strong> = Vidhan Sabha only (most states). <strong>Bicameral</strong> = Vidhan Sabha + Vidhan Parishad — only <strong>six</strong> states: AP, Bihar, Karnataka, Maharashtra, Telangana, UP.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s4} />
      <CheckYourProgress />
    </Section>
  );
}
