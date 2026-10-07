import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileText, ArrowDown, Landmark, Gavel, Users, Crown, UserRound, Scale, RotateCcw, Swords, CircleAlert, ArrowRight, Hand } from "lucide-react";
import { useProgress } from "./store.jsx";
import { Section, Card, KeyIdea, Explain, QuizBlock, Hemicycle, Extra, shuffle } from "./ui.jsx";
import { HOOK_FILES, HOOK_CHOICES, MACHINE_NODES, LISTS, SORT_ITEMS, CLASH_SUBJECTS, QUIZZES } from "./data.js";

const LIST_COLOR = { Union: "var(--union)", State: "var(--state)", Concurrent: "var(--conc)" };

// =============== HERO + HOOK ===============
export function Hero() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(reduce ? 100 : 0);
  useEffect(() => {
    if (reduce) return;
    let k = 0;
    const t = setInterval(() => {
      k += 3;
      setLit(Math.min(k, 100));
      if (k >= 100) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <div className="hero">
      <div className="hero-art" aria-hidden="true">
        <Hemicycle n={420} rows={13} seatR={0.012} size={1400} label="A model assembly lighting up seat by seat" colorFor={(i) => (i < lit * 4.2 ? (i < 244 ? "var(--seat-on)" : "var(--seat-dim)") : "var(--seat-off)")} />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-text">
        <span className="badge">Civics · State Government</span>
        <h1>Inside the Vidhan Sabha</h1>
        <p className="lead">
          Who makes the laws for your state, who actually runs it, and why the House sometimes grinds to a halt. Play through it, then prove it in the final test.
        </p>
        <div className="cta-row">
          <a className="btn" href="#hook">Start the chapter</a>
          <a className="btn-ghost" href="#watch">Watch the video</a>
        </div>
        <p className="deva" lang="hi">विधान सभा · विधान परिषद · संसद</p>
      </div>
    </div>
  );
}

export function Hook() {
  const { complete, isDone } = useProgress();
  const [picks, setPicks] = useState({});
  const allDone = HOOK_FILES.every((f) => picks[f.id]);
  const right = HOOK_FILES.filter((f) => picks[f.id] === f.answer).length;
  useEffect(() => {
    if (allDone) complete("act-hook", 50 + right * 50);
  }, [allDone]);
  const already = isDone("act-hook");
  return (
    <section className="hook" id="hook">
      <div className="hook-intro">
        <p className="eyebrow">Day 1 in office</p>
        <h2>You've just been sworn in as Chief Minister.</h2>
        <p>Three files are waiting on your desk. For each one: can your state's legislature pass this law on its own?</p>
      </div>
      <div className="files">
        {HOOK_FILES.map((f, idx) => {
          const p = picks[f.id];
          const ok = p === f.answer;
          return (
            <motion.div key={f.id} className={"file" + (p ? (ok ? " file-ok" : " file-no") : "")} layout>
              <div className="file-tab mono">FILE {String(idx + 1).padStart(2, "0")}</div>
              <div className="file-title"><FileText size={18} /> {f.title}</div>
              <div className="file-choices">
                {HOOK_CHOICES.map((c) => (
                  <button
                    key={c.id}
                    className={"fc" + (p === c.id ? " picked" : "") + (p && c.id === f.answer ? " answer" : "")}
                    disabled={!!p}
                    onClick={() => setPicks((s) => ({ ...s, [f.id]: c.id }))}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {p && (
                  <motion.div className="file-why" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <span className="list-badge" style={{ "--c": LIST_COLOR[f.list] }}>{f.list} List</span>
                    <p><strong>{ok ? "Spot on." : "Plot twist."}</strong> {f.why}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {(allDone || already) && (
          <motion.div className="hook-out" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {allDone && <p className="mono">{right}/3 correct.</p>}
            <p>
              Some laws are yours to make, some belong only to Parliament, and some are shared. To see why, you need to know how a state is run.
            </p>
            <a className="btn" href="#s1">Open the state machine <ArrowDown size={16} /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// =============== SECTION 1: THE STATE MACHINE ===============
const REL = [
  { from: "president", to: "governor", text: "The President appoints the Governor." },
  { from: "assembly", to: "cm", text: "The leader of the majority party or coalition in the Vidhan Sabha becomes Chief Minister." },
  { from: "cm", to: "council", text: "The CM selects and heads the Council of Ministers." },
  { from: "council", to: "assembly", text: "The CM and Council of Ministers are collectively responsible to the Vidhan Sabha." },
  { from: "assembly", to: "council", text: "The legislature makes laws; the executive implements them." },
];

function Node({ id, sel, setSel, icon, dashed, small }) {
  const n = MACHINE_NODES[id];
  const related = sel && REL.some((r) => (r.from === sel && r.to === id) || (r.to === sel && r.from === id));
  return (
    <motion.button
      className={"node" + (sel === id ? " node-on" : "") + (related ? " node-rel" : "") + (dashed ? " node-dashed" : "") + (small ? " node-sm" : "")}
      onClick={() => setSel(id)}
      whileTap={{ scale: 0.97 }}
      aria-pressed={sel === id}
    >
      <span className="node-ic">{icon}</span>
      <span className="node-txt">
        <span className="node-label">{n.label}</span>
        <span className="node-tag">{n.tag}</span>
      </span>
    </motion.button>
  );
}

function Flow({ label }) {
  return (
    <div className="flow" aria-hidden="true">
      <span className="flow-line" />
      <span className="flow-label mono">{label}</span>
    </div>
  );
}

function StateMachine() {
  const { complete } = useProgress();
  const [sel, setSel] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const choose = (id) => {
    setSel(id);
    setSeen((s) => {
      const n = new Set(s).add(id);
      if (n.size >= 5) complete("act-machine", 100);
      return n;
    });
  };
  const rels = sel ? REL.filter((r) => r.from === sel || r.to === sel) : [];
  return (
    <Card className="machine-card" title="The state machine" icon={<Landmark size={18} />} hint={`Tap the parts · ${seen.size}/7 explored`}>
      <div className="machine">
        <div className="mcol">
          <p className="mcol-h mono">LEGISLATURE · makes laws</p>
          <Node id="parishad" sel={sel} setSel={choose} icon={<Users size={18} />} dashed small />
          <Node id="assembly" sel={sel} setSel={choose} icon={<Users size={18} />} />
        </div>
        <div className="mcol">
          <p className="mcol-h mono">EXECUTIVE · implements laws</p>
          <Node id="president" sel={sel} setSel={choose} icon={<Landmark size={18} />} dashed small />
          <Flow label="appoints" />
          <Node id="governor" sel={sel} setSel={choose} icon={<Crown size={18} />} />
          <div className="divider-note mono">nominal ↑ · real power ↓</div>
          <Node id="cm" sel={sel} setSel={choose} icon={<UserRound size={18} />} />
          <Flow label="selects & heads" />
          <Node id="council" sel={sel} setSel={choose} icon={<Users size={18} />} />
        </div>
        <div className="mcol">
          <p className="mcol-h mono">JUDICIARY</p>
          <Node id="hc" sel={sel} setSel={choose} icon={<Scale size={18} />} />
        </div>
      </div>
      <div className="machine-detail" aria-live="polite">
        {sel ? (
          <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <h4>{MACHINE_NODES[sel].label}</h4>
            <p>{MACHINE_NODES[sel].text}</p>
            {rels.length > 0 && (
              <ul className="rels">
                {rels.map((r, i) => (
                  <li key={i}><ArrowRight size={14} /> {r.text}</li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <p className="muted">Tap any box to see what it does and how it connects. Dashed boxes are outside the state or exist only in some states.</p>
        )}
      </div>
    </Card>
  );
}

function ConfidenceSim() {
  const { complete } = useProgress();
  const N = 100, MAJ = 51;
  const [seats, setSeats] = useState(() => Array.from({ length: N }, (_, i) => i < 58));
  const [fell, setFell] = useState(false);
  const count = seats.filter(Boolean).length;
  const hasMajority = count >= MAJ;
  useEffect(() => {
    if (!hasMajority && !fell) {
      setFell(true);
      complete("act-confidence", 120);
    }
  }, [hasMajority]);
  const setCount = (k) => setSeats(Array.from({ length: N }, (_, i) => i < k));
  const reset = () => { setCount(58); setFell(false); };
  return (
    <Card className="sim" title="Confidence simulator" icon={<Hand size={18} />} hint="Model assembly · 100 MLAs">
      <p className="sim-intro">
        Green seats back the government. Tap seats to switch an MLA's support, or drag the slider. Can the government survive?
      </p>
      <div className="sim-grid">
        <div className="sim-hemi">
          <Hemicycle n={N} size={380} label={`${count} of 100 MLAs support the government`} colorFor={(i) => (seats[i] ? "var(--seat-on)" : "var(--seat-dim)")} onSeat={(i) => setSeats((s) => s.map((v, j) => (j === i ? !v : v)))} />
          <div className="maj-row mono">
            <span><b className="tnum">{count}</b> support</span>
            <span>majority line: {MAJ}</span>
            <span><b className="tnum">{N - count}</b> against</span>
          </div>
          <label className="slider-wrap" htmlFor="conf-slider">
            <span className="small">MLAs supporting the government</span>
            <input id="conf-slider" type="range" min="0" max="100" value={count} onChange={(e) => setCount(+e.target.value)} style={{ "--p": count + "%" }} />
          </label>
        </div>
        <div className="sim-status">
          <AnimatePresence mode="wait">
            {hasMajority ? (
              <motion.div key="ok" className="status status-ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <p className="status-h">Government stands</p>
                <p>The CM and Council of Ministers have the confidence of the majority of MLAs ({count} of 100).</p>
                <div className="ministers">
                  {["CM", "M1", "M2", "M3", "M4", "M5"].map((m) => (
                    <span key={m} className={"minister" + (m === "CM" ? " cm" : "")}>{m}</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="no" className="status status-no" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <p className="status-h">Confidence lost</p>
                <p>Only {count} of 100 MLAs back the government. The CM <em>and</em> the whole Council of Ministers must resign — together.</p>
                <div className="ministers">
                  {["CM", "M1", "M2", "M3", "M4", "M5"].map((m, i) => (
                    <motion.span key={m} className={"minister" + (m === "CM" ? " cm" : "")} initial={{ y: 0, opacity: 1 }} animate={{ y: 34, opacity: 0.25, rotate: i % 2 ? 12 : -12 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 120 }}>{m}</motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="btn-ghost" onClick={reset}><RotateCcw size={15} /> Reset to 58</button>
        </div>
      </div>
      <p className="small muted">This is a model with 100 seats to make the maths easy. Real assemblies have different sizes.</p>
    </Card>
  );
}

export function S1() {
  return (
    <Section id="s1" num="01" title="The State Machine" kicker="Legislature & Executive">
      <div className="two-up">
        <div className="pillar">
          <p className="pillar-h"><Users size={18} /> The Legislature</p>
          <p>The <strong>State Legislature</strong> is the lawmaking body at the state level. In most states it's called the <strong>Legislative Assembly (Vidhan Sabha)</strong>, and its members are <strong>MLAs</strong> (Members of Legislative Assembly).</p>
          <p>They make laws on the <span className="tok tok-state">State List</span> (police, public health, agriculture, local governance) and the <span className="tok tok-conc">Concurrent List</span> (forest, marriage, criminal law).</p>
        </div>
        <div className="pillar">
          <p className="pillar-h"><Gavel size={18} /> The Executive</p>
          <p>The executive <strong>implements</strong> the laws and runs the state government.</p>
          <p>The <strong>Governor</strong> is the <em>nominal</em> head. The <em>real</em> executive power is with the <strong>Council of Ministers</strong>, headed by the <strong>Chief Minister (CM)</strong>.</p>
        </div>
      </div>

      <StateMachine />

      <Explain
        simple={<p><strong>Nominal</strong> means "in name". The Governor is the state's head <em>in name</em>. The people who actually hold the power and run the government are the Chief Minister and the Council of Ministers. So: Governor = official head, CM + ministers = real power.</p>}
        example={<p><em>Analogy only:</em> In many schools, the chairperson of the managing trust is the formal head, but the principal and teachers run daily school life. The Governor is like that formal head; the CM and ministers are the ones running the government day to day.</p>}
        visual={
          <div className="power-bars">
            {[["Governor", 20, "nominal head · appointed by the President"], ["CM + Council of Ministers", 92, "real executive power"]].map(([n, w, sub]) => (
              <div key={n} className="pb">
                <div className="pb-top"><span>{n}</span><span className="muted small">{sub}</span></div>
                <div className="pb-track"><motion.div className="pb-fill" initial={{ width: 0 }} animate={{ width: w + "%" }} transition={{ duration: 0.8 }} /></div>
              </div>
            ))}
            <p className="small muted">Bar = how much real executive power each holds.</p>
          </div>
        }
      />

      <div className="callout">
        <p className="callout-h">Collective responsibility</p>
        <p>The CM and the Council of Ministers are <strong>collectively responsible</strong> to the Legislative Assembly. If they lose the confidence of the majority of MLAs, they <strong>must resign</strong>. Try it below.</p>
      </div>

      <ConfidenceSim />

      <KeyIdea>
        The <strong>Vidhan Sabha (MLAs)</strong> makes state laws. The <strong>Governor</strong> is the nominal head; the <strong>CM and Council of Ministers</strong> hold real power and stay in office only while the <strong>majority of MLAs</strong> supports them.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s1} />
    </Section>
  );
}

// =============== SECTION 2: THREE LISTS ===============
function Venn() {
  const { complete } = useProgress();
  const [sel, setSel] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const pick = (k) => {
    setSel(k);
    setSeen((s) => {
      const n = new Set(s).add(k);
      if (n.size === 3) complete("act-venn", 75);
      return n;
    });
  };
  const L = sel && LISTS[sel];
  return (
    <Card title="The 7th Schedule: three lists" icon={<FileText size={18} />} hint="Tap each zone">
      <div className="venn-wrap">
        <svg viewBox="0 0 560 300" className="venn" role="group" aria-label="Venn diagram of the three lists">
          <g className={"vz" + (sel === "Union" ? " vz-on" : "")} onClick={() => pick("Union")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && pick("Union")} aria-label="Union List">
            <circle cx="200" cy="150" r="130" fill="var(--union)" fillOpacity="0.16" stroke="var(--union)" strokeWidth="3" />
            <text x="130" y="140" className="vt" fill="var(--union)">UNION</text>
            <text x="130" y="168" className="vs" fill="var(--fg-2)">Parliament</text>
          </g>
          <g className={"vz" + (sel === "State" ? " vz-on" : "")} onClick={() => pick("State")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && pick("State")} aria-label="State List">
            <circle cx="360" cy="150" r="130" fill="var(--state)" fillOpacity="0.16" stroke="var(--state)" strokeWidth="3" />
            <text x="430" y="140" className="vt" fill="var(--state)" textAnchor="middle">STATE</text>
            <text x="430" y="168" className="vs" fill="var(--fg-2)" textAnchor="middle">Legislatures</text>
          </g>
          <g className={"vz" + (sel === "Concurrent" ? " vz-on" : "")} onClick={() => pick("Concurrent")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && pick("Concurrent")} aria-label="Concurrent List">
            <path d="M280 47.5 A130 130 0 0 1 280 252.5 A130 130 0 0 1 280 47.5 Z" fill="var(--conc)" fillOpacity="0.35" stroke="var(--conc)" strokeWidth="3" />
            <text x="280" y="145" className="vt vt-sm" fill="var(--conc-ink)" textAnchor="middle">BOTH</text>
            <text x="280" y="168" className="vs" fill="var(--conc-ink)" textAnchor="middle">Concurrent</text>
          </g>
        </svg>
        <div className="venn-panel" aria-live="polite">
          {L ? (
            <motion.div key={sel} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
              <p className="list-badge" style={{ "--c": LIST_COLOR[sel] }}>{L.name}</p>
              <p className="vp-who">{L.who}</p>
              <p className="muted small">{L.why}</p>
              <div className="pill-row">
                {L.items.map((it) => <span key={it} className="pill" style={{ "--c": LIST_COLOR[sel] }}>{it}</span>)}
              </div>
            </motion.div>
          ) : (
            <p className="muted">The 7th Schedule of the Constitution has three lists that divide lawmaking power between the Union and the States. Tap a zone.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function Sorter() {
  const { complete, isDone } = useProgress();
  const [order] = useState(() => shuffle(SORT_ITEMS));
  const [placed, setPlaced] = useState({});
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const bucketRefs = { Union: useRef(), State: useRef(), Concurrent: useRef() };
  const left = order.filter((it) => !placed[it.id]);

  const place = (id, list) => {
    const item = SORT_ITEMS.find((i) => i.id === id);
    if (!item) return;
    if (item.list === list) {
      setPlaced((p) => {
        const np = { ...p, [id]: list };
        if (Object.keys(np).length === SORT_ITEMS.length) {
          complete("act-sort", Math.max(60, 200 - mistakes * 15));
        }
        return np;
      });
      setMsg({ ok: true, text: `${id} → ${LISTS[list].name}. ${LISTS[list].why}.` });
    } else {
      setMistakes((m) => m + 1);
      setShake(id);
      setTimeout(() => setShake(null), 450);
      setMsg({ ok: false, text: `${id} isn't on the ${LISTS[list].name}. Hint: ${LISTS[item.list].why.toLowerCase()}.` });
    }
    setSel(null);
  };

  const onDragEnd = (id, e) => {
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const y = e.clientY ?? e.changedTouches?.[0]?.clientY;
    if (x == null) return;
    for (const [k, r] of Object.entries(bucketRefs)) {
      const b = r.current?.getBoundingClientRect();
      if (b && x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) return place(id, k);
    }
  };

  const restart = () => { setPlaced({}); setMistakes(0); setMsg(null); };
  const finished = left.length === 0;

  return (
    <Card className="sorter" title="Sort the subjects" icon={<FileText size={18} />} hint={`${Object.keys(placed).length}/${SORT_ITEMS.length} placed · ${mistakes} mistakes`}>
      <p className="small muted">Tap a subject, then tap its list. Or drag it onto a list.</p>
      <div className="tray">
        {left.map((it) => (
          <motion.button
            key={it.id}
            className={"chip" + (sel === it.id ? " chip-sel" : "")}
            onClick={() => setSel(sel === it.id ? null : it.id)}
            drag
            dragSnapToOrigin
            dragElastic={0.9}
            whileDrag={{ scale: 1.08, zIndex: 20 }}
            onDragEnd={(e) => onDragEnd(it.id, e)}
            animate={shake === it.id ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {it.id}
          </motion.button>
        ))}
        {finished && <p className="mono small">All sorted with {mistakes} mistake{mistakes === 1 ? "" : "s"}. </p>}
      </div>
      <div className="buckets">
        {Object.entries(LISTS).map(([k, L]) => (
          <button key={k} ref={bucketRefs[k]} className={"bucket" + (sel ? " bucket-ready" : "")} style={{ "--c": LIST_COLOR[k] }} onClick={() => sel && place(sel, k)}>
            <span className="bucket-h">{L.name}</span>
            <span className="bucket-items">
              {Object.entries(placed).filter(([, v]) => v === k).map(([id]) => (
                <motion.span key={id} className="pill" style={{ "--c": LIST_COLOR[k] }} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>{id}</motion.span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {msg && (
          <motion.p key={msg.text} className={"sort-msg " + (msg.ok ? "ok" : "no")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {msg.text}
          </motion.p>
        )}
      </AnimatePresence>
      {(finished || isDone("act-sort")) && <button className="btn-ghost" onClick={restart}><RotateCcw size={15} /> Play again</button>}
    </Card>
  );
}

function Clash() {
  const { complete } = useProgress();
  const [subject, setSubject] = useState("Education");
  const [guess, setGuess] = useState(null);
  const [phase, setPhase] = useState("idle");
  const go = (g) => {
    setGuess(g);
    setPhase("clash");
    setTimeout(() => setPhase("done"), 900);
    complete("act-clash", 80);
  };
  const reset = (s) => { setSubject(s); setGuess(null); setPhase("idle"); };
  return (
    <Card className="clash" title="Clash of laws" icon={<Swords size={18} />} hint="Concurrent List">
      <p className="small">Pick a Concurrent List subject. The State Assembly and Parliament each pass a law on it, and the two laws conflict.</p>
      <div className="pill-row">
        {CLASH_SUBJECTS.map((s) => (
          <button key={s} className={"chip-btn" + (subject === s ? " on" : "")} onClick={() => reset(s)}>{s}</button>
        ))}
      </div>
      <div className="arena">
        <motion.div className={"law law-state" + (phase === "done" ? " law-lose" : "")} animate={phase === "clash" ? { x: 40 } : { x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
          <span className="law-h mono">STATE LAW</span>
          <span>{subject}</span>
          <span className="small muted">passed by the State Assembly</span>
        </motion.div>
        <span className="vs-badge">VS</span>
        <motion.div className={"law law-union" + (phase === "done" ? " law-win" : "")} animate={phase === "clash" ? { x: -40 } : { x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
          <span className="law-h mono">CENTRAL LAW</span>
          <span>{subject}</span>
          <span className="small muted">passed by Parliament</span>
        </motion.div>
      </div>
      {phase === "idle" && (
        <div className="predict">
          <p><strong>Predict:</strong> which law applies?</p>
          <div className="pill-row">
            <button className="btn-ghost" onClick={() => go("state")}>The state law</button>
            <button className="btn-ghost" onClick={() => go("central")}>The central law</button>
          </div>
        </div>
      )}
      {phase === "done" && (
        <motion.div className={"fb " + (guess === "central" ? "fb-ok" : "fb-no")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="fb-inner">
            <strong>{guess === "central" ? "Correct." : "Not quite."}</strong> When a state law conflicts with a central law on a Concurrent subject, <strong>the law made by Parliament prevails</strong>.
          </div>
        </motion.div>
      )}
      <div className="example-box">
        <p className="mono small">REAL EXAMPLE FROM THE CHAPTER</p>
        <p>The <strong>Right of Children to Free and Compulsory Education (RTE) Act, 2009</strong> was enacted by Parliament. It applies across the whole of India (except certain specific institutions), even though Education is on the Concurrent List.</p>
      </div>
    </Card>
  );
}

export function S2() {
  return (
    <Section id="s2" num="02" title="Who Makes Which Law" kicker="Union, State & Concurrent Lists">
      <p className="prose-lead">
        India's Constitution doesn't let everyone legislate on everything. The <strong>7th Schedule</strong> splits lawmaking powers into three lists.
      </p>
      <Venn />
      <Sorter />
      <Clash />
      <div className="callout callout-conc">
        <p className="callout-h">Why a shared list?</p>
        <p>Some matters, like education and environmental policy, need the Union and the States to work together. The Concurrent List shows the <strong>interdependent nature of federalism</strong>.</p>
      </div>
      <Extra label="Textbook check">
        Your textbook's comparison table lists "education" as a State List example, but its "More to Know" box and the RTE example place Education on the <strong>Concurrent List</strong>. This site follows the Concurrent List. Confirm with your teacher which one they expect in exams.
      </Extra>
      <KeyIdea>
        <span className="tok tok-union">Union List</span> → only Parliament. <span className="tok tok-state">State List</span> → State Legislatures. <span className="tok tok-conc">Concurrent List</span> → both, but in a clash <strong>Parliament's law prevails</strong>.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s2} />
    </Section>
  );
}
