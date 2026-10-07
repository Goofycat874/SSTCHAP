import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, Activity, Link2, RotateCcw, BarChart3, CloudLightning, Zap, Wind, Waves, Newspaper, Tv, MessageSquare, BookOpen, PenTool, ArrowRight, ArrowDown, AlertTriangle, Megaphone } from "lucide-react";
import { useProgress } from "./store.jsx";
import { Section, Card, KeyIdea, Explain, QuizBlock, Extra, shuffle } from "./ui.jsx";
import { ROLES, SESSIONS, CHALLENGE_GROUPS, DAY_FACTORS, MATCH_PAIRS, LOK_SABHAS, FORECAST, QUIZZES } from "./data.js";

// =============== SECTION 5: WHEN THE HOUSE MEETS ===============
function RolesWheel() {
  const { complete } = useProgress();
  const [sel, setSel] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const pick = (id) => {
    setSel(id);
    setSeen((s) => {
      const n = new Set(s).add(id);
      if (n.size === ROLES.length) complete("act-roles", 75);
      return n;
    });
  };
  const pos = ROLES.map((_, k) => {
    const a = (-90 + k * 72) * (Math.PI / 180);
    return { x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 36 };
  });
  const cur = ROLES.find((r) => r.id === sel);
  return (
    <Card title="What legislatures do" icon={<Activity size={18} />} hint={`${seen.size}/5 explored`}>
      <div className="roles-grid">
        <div className="wheel">
          <svg viewBox="0 0 100 100" className="wheel-lines" aria-hidden="true">
            {pos.map((p, i) => (
              <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} className={"spoke" + (sel === ROLES[i].id ? " spoke-on" : "")} />
            ))}
          </svg>
          <div className="wheel-hub">
            <span className="mono small">Parliament &amp;</span>
            <strong>State Legislatures</strong>
          </div>
          {ROLES.map((r, i) => (
            <button key={r.id} className={"wnode" + (sel === r.id ? " on" : "") + (seen.has(r.id) ? " seen" : "")} style={{ left: pos[i].x + "%", top: pos[i].y + "%" }} onClick={() => pick(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="roles-detail" aria-live="polite">
          {cur ? (
            <motion.div key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <h4>{cur.label}</h4>
              <p>{cur.detail}</p>
            </motion.div>
          ) : (
            <p className="muted">Parliament and the State Legislatures play a vital role in the smooth functioning of India's democracy. Tap each role.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function YearStrip() {
  const [sel, setSel] = useState("budget");
  const cur = SESSIONS.find((s) => s.id === sel);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <Card title="Parliament's year" icon={<CalendarDays size={18} />} hint="3 sessions">
      <div className="year">
        <div className="year-months mono">
          {months.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <div className="year-track">
          {SESSIONS.map((s) => (
            <button key={s.id} className={"sess" + (sel === s.id ? " on" : "")} style={{ left: s.start * 100 + "%", width: (s.end - s.start) * 100 + "%" }} onClick={() => setSel(s.id)} aria-label={s.name}>
              <span>{s.name.replace(" Session", "")}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sess-detail">
        <p><strong>{cur.name}.</strong> In every session, Parliament holds sittings where members discuss Bills, debate national issues and review the work of the government.</p>
        <Extra>Session months shown on the strip are the usual timing ({cur.months}). The chapter itself names the three sessions but not their months.</Extra>
      </div>
      <div className="clock-row">
        <div className="clock">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="10" />
            <motion.circle cx="50" cy="50" r="42" fill="none" stroke="var(--fg)" strokeWidth="10" transform="rotate(-90 50 50)" strokeDasharray={2 * Math.PI * 42} initial={{ strokeDashoffset: 2 * Math.PI * 42 }} animate={{ strokeDashoffset: 2 * Math.PI * 42 * 0.75 }} transition={{ duration: 1.2 }} />
          </svg>
          <span className="clock-n"><b>~6</b><small>hrs</small></span>
        </div>
        <p>Parliament usually sits <strong>about six hours a day</strong> during a session. It can be extended on special occasions or when urgent business must be completed. <strong>State Legislative Assemblies follow similar schedules.</strong></p>
      </div>
    </Card>
  );
}

export function S5() {
  return (
    <Section id="s5" num="05" title="When the House Meets" kicker="Roles & sessions">
      <RolesWheel />
      <YearStrip />
      <KeyIdea>
        Legislatures <strong>make laws, oversee administration, frame policies and plans, pass budgets</strong> and <strong>consider public opinion</strong>. Parliament meets in <strong>three sessions</strong> a year — Budget, Monsoon, Winter — sitting about <strong>six hours a day</strong>.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s5} />
    </Section>
  );
}

// =============== SECTION 6: WHY THE HOUSE STALLS ===============
function ChallengeBoard() {
  const [open, setOpen] = useState("conduct");
  return (
    <div className="cboard">
      {CHALLENGE_GROUPS.map((g) => (
        <div key={g.id} className={"cgroup" + (open === g.id ? " on" : "")}>
          <button className="cgroup-h" onClick={() => setOpen(open === g.id ? null : g.id)} aria-expanded={open === g.id}>
            <span>{g.name}</span>
            <span className="mono small">{g.items.length}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === g.id && (
              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="cgroup-list">
                {g.items.map((it) => <li key={it}><AlertTriangle size={14} /> {it}</li>)}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
      <p className="small muted cboard-note">All 12 challenges are from the chapter; the four groups are a study aid.</p>
    </div>
  );
}

function DaySim() {
  const { complete } = useProgress();
  const [on, setOn] = useState(new Set());
  const toggle = (id) => setOn((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const act = DAY_FACTORS.filter((f) => on.has(f.id));
  const lost = Math.min(360, act.reduce((a, f) => a + f.mins, 0));
  const productive = 360 - lost;
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const debate = clamp(100 - act.reduce((a, f) => a + f.debate, 0));
  const scrutiny = clamp(100 - act.reduce((a, f) => a + f.scrutiny, 0));
  const trust = clamp(100 - act.reduce((a, f) => a + f.trust, 0));
  useEffect(() => { if (on.size >= 3) complete("act-day", 100); }, [on]);
  const bad = productive < 240 || scrutiny < 60 || debate < 50;
  return (
    <Card className="day" title="One sitting day" icon={<Clock size={18} />} hint="Illustrative model">
      <p className="small">A sitting day is about <strong>6 hours (360 minutes)</strong>. Switch on the problems from the chapter and watch what's left of the day.</p>
      <div className="toggles">
        {DAY_FACTORS.map((f) => (
          <button key={f.id} className={"tg" + (on.has(f.id) ? " on" : "")} onClick={() => toggle(f.id)} aria-pressed={on.has(f.id)}>
            <span className="tg-sw" aria-hidden="true"><span /></span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      <div className="daybar" aria-label={`${productive} productive minutes out of 360`}>
        <motion.div className="db-prod" animate={{ width: (productive / 360) * 100 + "%" }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
          <span className="mono">{productive} min productive</span>
        </motion.div>
        {act.filter((f) => f.mins).map((f) => (
          <motion.div key={f.id} className="db-lost" initial={{ width: 0 }} animate={{ width: (f.mins / 360) * 100 + "%" }} title={`${f.label}: −${f.mins} min`} />
        ))}
      </div>
      <div className="meters">
        {[["Debate quality", debate], ["Scrutiny of Bills", scrutiny], ["Public trust", trust]].map(([n, v]) => (
          <div key={n} className="meter">
            <div className="meter-top"><span>{n}</span><span className="mono tnum">{v}</span></div>
            <div className="meter-track"><motion.div className={"meter-fill" + (v < 50 ? " low" : v < 75 ? " mid" : "")} animate={{ width: v + "%" }} /></div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={bad ? "bad" : act.length ? "meh" : "good"} className={"day-out " + (bad ? "bad" : "")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {act.length === 0 && <p>A full, working day: Bills discussed, questions asked, the government's work reviewed.</p>}
          {act.length > 0 && !bad && <p>The day is slipping. {act[act.length - 1].note}</p>}
          {bad && <p><strong>Result:</strong> delay in decision-making, low productivity and reduced effectiveness — exactly what the chapter warns about.</p>}
        </motion.div>
      </AnimatePresence>
      <p className="small muted">The minutes and scores are made up to show the idea. They are not real data.</p>
    </Card>
  );
}

function MatchGame() {
  const { complete, isDone } = useProgress();
  const [right, setRight] = useState(() => shuffle(MATCH_PAIRS));
  const [selA, setSelA] = useState(null);
  const [done, setDone] = useState(new Set());
  const [bad, setBad] = useState(null);
  const [miss, setMiss] = useState(0);
  const finished = done.size === MATCH_PAIRS.length;
  useEffect(() => { if (finished) complete("act-match", Math.max(60, 160 - miss * 15)); }, [finished]);
  const pickB = (id) => {
    if (!selA || done.has(id)) return;
    if (selA === id) {
      setDone((d) => new Set(d).add(id));
      setSelA(null);
    } else {
      setMiss((m) => m + 1);
      setBad(id);
      setTimeout(() => setBad(null), 500);
    }
  };
  const restart = () => { setRight(shuffle(MATCH_PAIRS)); setDone(new Set()); setSelA(null); setMiss(0); };
  return (
    <Card className="match" title="Problem → impact" icon={<Link2 size={18} />} hint={`${done.size}/6 linked · ${miss} misses`}>
      <p className="small muted">Tap a challenge, then tap the effect the chapter links it to.</p>
      <div className="match-cols">
        <div className="mcolumn">
          {MATCH_PAIRS.map((p) => (
            <button key={p.id} className={"mi mi-a" + (selA === p.id ? " sel" : "") + (done.has(p.id) ? " done" : "")} disabled={done.has(p.id)} onClick={() => setSelA(p.id)}>{p.a}</button>
          ))}
        </div>
        <div className="mcolumn">
          {right.map((p) => (
            <motion.button key={p.id} className={"mi mi-b" + (done.has(p.id) ? " done" : "") + (selA && !done.has(p.id) ? " ready" : "")} disabled={done.has(p.id)} onClick={() => pickB(p.id)} animate={bad === p.id ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}>
              {p.b}
            </motion.button>
          ))}
        </div>
      </div>
      {finished && <div className="win"><p>All six linked with {miss} miss{miss === 1 ? "" : "es"}.</p><button className="btn-ghost" onClick={restart}><RotateCcw size={15} /> Replay</button></div>}
    </Card>
  );
}

export function S6() {
  return (
    <Section id="s6" num="06" title="Why the House Stalls" kicker="Challenges to effective functioning">
      <p className="prose-lead">
        Legislatures at the national and state level face problems that cause <strong>delay in decision-making, low productivity</strong> and <strong>reduced effectiveness</strong>. Here are the twelve the chapter lists.
      </p>
      <ChallengeBoard />
      <DaySim />
      <Explain
        simple={<p>The House has limited time. Every minute lost to walkouts, shouting or personal attacks is a minute not spent discussing Bills or questioning the government. Less time → rushed decisions → Bills passed without proper checking.</p>}
        example={<p>Imagine an important Bill comes up on a day when protests and sloganeering take over. There's no time for detailed discussion, so it is passed quickly. That's <strong>insufficient scrutiny of Bills</strong> and <strong>rushed decision-making</strong>, both from the chapter's list.</p>}
        visual={
          <div className="chain">
            {["Disruptions & absent members", "Less productive time", "Rushed decisions, Bills not scrutinised", "Delay, low productivity, reduced effectiveness"].map((t, i, a) => (
              <React.Fragment key={t}>
                <span className="chain-node">{t}</span>
                {i < a.length - 1 && <ArrowRight className="chain-arrow" size={18} />}
              </React.Fragment>
            ))}
          </div>
        }
      />
      <MatchGame />
      <KeyIdea>
        Absence, disruptions, Question Hour interruptions, few sittings, personal attacks, criminalisation, biased debates, unscrutinised Bills, unused committees and money/lobbying → <strong>delay, low productivity, reduced effectiveness</strong>.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s6} />
    </Section>
  );
}

// =============== SECTION 7: DATA ROOM ===============
function SittingChart() {
  const { complete } = useProgress();
  const [mode, setMode] = useState("total");
  const [sel, setSel] = useState(4);
  const [touched, setTouched] = useState({ mode: false, bar: false });
  useEffect(() => { if (touched.mode && touched.bar) complete("act-chart", 80); }, [touched]);
  const max = mode === "total" ? 400 : 80;
  const ticks = mode === "total" ? [0, 100, 200, 300, 400] : [0, 20, 40, 60, 80];
  const W = 560, H = 290, L = 46, R = 12, T = 22, B = 44;
  const pw = W - L - R, ph = H - T - B;
  const bw = pw / LOK_SABHAS.length;
  const y = (v) => T + ph - (v / max) * ph;
  const minTotal = Math.min(...LOK_SABHAS.map((d) => d.total));
  const cur = LOK_SABHAS[sel];
  return (
    <Card className="chart-card" title="Lok Sabha sitting days" icon={<BarChart3 size={18} />} hint="13th to 17th Lok Sabha">
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={mode === "total"} className={mode === "total" ? "on" : ""} onClick={() => { setMode("total"); }}>Total sitting days</button>
        <button role="tab" aria-selected={mode === "avg"} className={mode === "avg" ? "on" : ""} onClick={() => { setMode("avg"); setTouched((t) => ({ ...t, mode: true })); }}>Average per year</button>
      </div>
      <div className="chart-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Bar chart of Lok Sabha sitting days">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
              <text x={L - 8} y={y(t) + 4} textAnchor="end" className="ax" fill="var(--fg-2)">{t}</text>
            </g>
          ))}
          {LOK_SABHAS.map((d, i) => {
            const v = mode === "total" ? d.total : d.avg;
            const x = L + i * bw + bw * 0.2;
            const w = bw * 0.6;
            const isMin = d.total === minTotal;
            return (
              <g key={d.n} onClick={() => { setSel(i); setTouched((t) => ({ ...t, bar: true })); }} style={{ cursor: "pointer" }} role="button" aria-label={`${d.n} Lok Sabha: ${v}`}>
                <rect x={L + i * bw} y={T} width={bw} height={ph} fill="transparent" />
                <motion.rect x={x} width={w} rx="3" fill={isMin ? "var(--upper)" : "var(--fg)"} fillOpacity={sel === i ? 1 : 0.62} initial={false} animate={{ y: y(v), height: T + ph - y(v) }} transition={{ type: "spring", stiffness: 90, damping: 16 }} />
                <motion.text x={x + w / 2} textAnchor="middle" className="bar-v" fill="var(--fg)" initial={false} animate={{ y: y(v) - 7 }}>
                  {(mode === "avg" && d.approx ? "~" : "") + v}
                </motion.text>
                <text x={x + w / 2} y={H - B + 18} textAnchor="middle" className="ax-l" fill="var(--fg)">{d.n}</text>
                <text x={x + w / 2} y={H - B + 34} textAnchor="middle" className="ax" fill="var(--fg-2)">{d.term}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="chart-detail">
        <p><strong>{cur.n} Lok Sabha</strong> ({cur.term}): <span className="tnum">{cur.total}</span> sitting days in total, <span className="tnum">{cur.approx ? "~" : ""}{cur.avg}</span> a year on average.{cur.total === minTotal && " The fewest of all full-term Lok Sabhas."}</p>
      </div>
      <p className="small muted">Source cited in the textbook: PRS Legislative Research, Vital Stats — 70 years of Parliament.</p>
    </Card>
  );
}

function YearGrid() {
  const [era, setEra] = useState("then");
  const n = era === "then" ? 121 : 68;
  return (
    <Card className="yeargrid-card" title="A year of the Lok Sabha" icon={<CalendarDays size={18} />} hint="1 square = 1 day">
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={era === "then"} className={era === "then" ? "on" : ""} onClick={() => setEra("then")}>1952–70</button>
        <button role="tab" aria-selected={era === "now"} className={era === "now" ? "on" : ""} onClick={() => setEra("now")}>Since 2000</button>
      </div>
      <div className="yg-head">
        <motion.span key={n} className="yg-n tnum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{n}</motion.span>
        <span>sitting days a year, on average</span>
      </div>
      <div className="yeargrid" aria-label={`${n} of 365 days filled`}>
        {Array.from({ length: 365 }, (_, i) => (
          <span key={i} className={"yd" + (i < n ? " on" : "")} style={{ transitionDelay: (i < 121 ? i * 3 : 0) + "ms" }} />
        ))}
      </div>
      <p className="small">From an average of <strong>121</strong> days a year (1952–70) to <strong>68</strong> since 2000 — that's 53 fewer days, roughly 44% less.</p>
    </Card>
  );
}

export function S7() {
  return (
    <Section id="s7" num="07" title="The Data Room" kicker="Sitting days over time">
      <p className="prose-lead">
        "Low number of sittings" is on the challenge list. Is it real? The chapter gives the data.
      </p>
      <SittingChart />
      <div className="livery">
        <div className="livery-in">
          <p className="cap-up">Lok Sabha · average sitting days a year</p>
          <div className="livery-nums">
            <div><b className="tnum">121</b><span>1952–70</span></div>
            <span className="livery-arrow" aria-hidden="true">→</span>
            <div><b className="tnum">68</b><span>since 2000</span></div>
          </div>
          <p className="livery-note">53 fewer days a year. Roughly 44% less time for the House to do its work.</p>
        </div>
      </div>
      <YearGrid />
      <div className="callout">
        <p className="callout-h">Textbook project</p>
        <p>Your textbook asks you to compile data for the last <strong>10</strong> full-term Lok Sabhas and write a report: which had the maximum and minimum sitting days, and the highest and lowest annual averages. It also asks you to study the decline in <strong>Rajya Sabha</strong> sitting days and analyse the reasons. The chapter only gives the five Lok Sabhas above, so use your library or teacher-approved sources for the rest.</p>
      </div>
      <KeyIdea>
        The 13th and 14th Lok Sabhas sat <strong>356</strong> days each; the 17th only <strong>274</strong> (~55/year), the fewest of any full-term Lok Sabha. Annual average: <strong>121 → 68</strong>.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s7} title="Data detective" />
    </Section>
  );
}

// =============== SECTION 8: CITIZENS ARE WATCHING ===============
const WX_ICONS = { thunder: CloudLightning, lightning: Zap, storms: Wind, breaches: Waves };

function Forecast() {
  const { complete } = useProgress();
  const [sel, setSel] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const pick = (id) => {
    setSel(id);
    setSeen((s) => {
      const n = new Set(s).add(id);
      if (n.size === FORECAST.length) complete("act-forecast", 75);
      return n;
    });
  };
  const cur = FORECAST.find((f) => f.id === sel);
  return (
    <Card className="forecast" title="Decode the cartoon" icon={<PenTool size={18} />} hint={`${seen.size}/4 decoded`}>
      <div className="fc-board">
        <p className="mono small fc-chan">PARLIAMENT WEATHER · LIVE</p>
        <p className="fc-cap">“Expect thunder, lightning, storms, breaches, etc. It's Monsoon Session.”</p>
        <div className="fc-icons">
          {FORECAST.map((f) => {
            const Ic = WX_ICONS[f.id];
            return (
              <motion.button key={f.id} className={"wx" + (sel === f.id ? " on" : "") + (seen.has(f.id) ? " seen" : "")} onClick={() => pick(f.id)} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <Ic size={30} strokeWidth={1.6} />
                <span>{f.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="fc-read" aria-live="polite">
        {cur ? (
          <motion.p key={cur.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><strong>{cur.label}</strong> → {cur.reading}</motion.p>
        ) : (
          <p className="muted">The textbook shows a cartoon with this caption. Tap each weather sign to see what it pokes fun at.</p>
        )}
      </div>
      <p className="small muted">These readings are one possible interpretation of the cartoon, matched to challenges named in the chapter.</p>
    </Card>
  );
}

export function S8() {
  const chain = [
    "Legislators fail to perform duties responsibly",
    "Disappointment among the public",
    "Reduced trust in democratic institutions",
    "Citizens feel unheard; public welfare seems neglected",
  ];
  const media = [
    [Tv, "Debates"],
    [PenTool, "Cartoons"],
    [BookOpen, "Journals"],
    [Newspaper, "Newspaper & magazine articles"],
    [MessageSquare, "Social media"],
  ];
  return (
    <Section id="s8" num="08" title="Citizens Are Watching" kicker="Public trust & the media">
      <p className="prose-lead">
        People elect their representatives and send them to Parliament. So when the House stalls, it's the public that feels let down.
      </p>
      <div className="trust-chain">
        {chain.map((c, i) => (
          <React.Fragment key={c}>
            <motion.div className="tc-node" initial={{ opacity: 0.4, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.15 }}>
              <span className="mono tc-i">{i + 1}</span>{c}
            </motion.div>
            {i < chain.length - 1 && <ArrowDown className="tc-arrow" size={18} />}
          </React.Fragment>
        ))}
      </div>
      <Card title="How the media raises concerns" icon={<Megaphone size={18} />}>
        <div className="media-row">
          {media.map(([Ic, l]) => (
            <span key={l} className="media-chip"><Ic size={16} /> {l}</span>
          ))}
        </div>
        <p>These concerns are often expressed through <strong>cartoons with humour and satire</strong>, which is a common feature of <strong>healthy democracies</strong>.</p>
      </Card>
      <Forecast />
      <KeyIdea>
        Low sittings, sloganeering, criminalisation and money power <strong>reduce people's trust</strong> in democratic institutions. The <strong>media</strong> raises these concerns — often through humour and satire, a sign of a healthy democracy.
      </KeyIdea>
      <QuizBlock items={QUIZZES.s8} />
    </Section>
  );
}
