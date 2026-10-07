import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Captions, Maximize2 } from "lucide-react";
import { hemicycle } from "./ui.jsx";

// Fixed film palette: the video looks the same in light and dark themes and in the MP4 export.
const C = { bg: "#181818", panel: "#262626", ink: "#ffffff", mute: "#969696", line: "#303030", green: "#ffffff", red: "#da291c", navy: "#4c98b9", brass: "#969696", amber: "#d2d2d2", dim: "#3a3a3a", off: "#242424", state: "#03904a" };

const cl = (x) => Math.max(0, Math.min(1, x));
const eo = (x) => 1 - Math.pow(1 - x, 3);
const k = (t, a, b) => eo(cl((t - a) / (b - a)));
const lerp = (a, b, p) => a + (b - a) * p;

function T({ x, y, s = 40, c = C.ink, f = "vb", w, a = "start", o = 1, ls, children, tr }) {
  return (
    <text x={x} y={y} fontSize={s} fill={c} className={f} fontWeight={w} textAnchor={a} opacity={o} letterSpacing={ls} transform={tr}>
      {children}
    </text>
  );
}

function Seats({ cx, cy, R, n, rows = 6, colorFor, r }) {
  const seats = hemicycle(n, rows);
  const rr = r || (n > 80 ? 0.034 : 0.045);
  return (
    <g>
      {seats.map((s, i) => <circle key={i} cx={cx + s.x * R} cy={cy + s.y * R} r={rr * R} fill={colorFor(i)} />)}
      <rect x={cx - 0.16 * R} y={cy - 0.08 * R} width={0.32 * R} height={0.08 * R} fill={C.red} />
    </g>
  );
}

function Person({ x, y, s = 1, c = C.ink, crown }) {
  return (
    <g>
      <circle cx={x} cy={y - 34 * s} r={24 * s} fill={c} />
      <path d={`M${x - 38 * s} ${y + 56 * s} Q ${x - 38 * s} ${y} ${x} ${y} Q ${x + 38 * s} ${y} ${x + 38 * s} ${y + 56 * s} Z`} fill={c} />
      {crown && <polygon points={`${x - 22 * s},${y - 62 * s} ${x - 22 * s},${y - 84 * s} ${x - 11 * s},${y - 72 * s} ${x},${y - 90 * s} ${x + 11 * s},${y - 72 * s} ${x + 22 * s},${y - 84 * s} ${x + 22 * s},${y - 62 * s}`} fill={C.brass} />}
    </g>
  );
}

function Tag({ x, y, w, h = 62, c, label, o = 1, s = 30 }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} fillOpacity="0.16" stroke={c} strokeWidth="2.5" />
      <T x={x + w / 2} y={y + h / 2 + s * 0.36} s={s} c={c} a="middle" w={700}>{label}</T>
    </g>
  );
}

// ---------------- scenes ----------------
const S_title = ({ t }) => {
  const lit = Math.round(k(t, 0.3, 3.4) * 100);
  return (
    <g>
      <T x={640} y={130} s={30} c={C.brass} f="vm" a="middle" o={k(t, 0, 0.8)} ls={5}>CIVICS · STATE GOVERNMENT</T>
      <g opacity={k(t, 0.2, 1.2)} transform={`translate(0 ${lerp(30, 0, k(t, 0.2, 1.2))})`}>
        <T x={640} y={225} s={86} f="vd" w={500} a="middle">Who runs your state?</T>
      </g>
      <Seats cx={640} cy={650} R={330} n={100} colorFor={(i) => (i < lit ? (i < 58 ? C.green : C.dim) : C.off)} />
    </g>
  );
};

const S_legis = ({ t }) => {
  const lit = Math.round(k(t, 0.5, 3.2) * 60);
  return (
    <g>
      <g opacity={k(t, 0, 0.8)}>
        <T x={90} y={190} s={28} c={C.brass} f="vm" ls={4}>THE LAWMAKERS</T>
        <T x={90} y={285} s={96} f="vd" w={500}>Vidhan Sabha</T>
        <T x={90} y={340} s={34} c={C.mute}>State Legislature · Legislative Assembly</T>
      </g>
      <Tag x={90} y={380} w={330} c={C.ink} label="Members = MLAs" o={k(t, 2, 2.8)} />
      <T x={90} y={510} s={30} c={C.mute} o={k(t, 3.8, 4.5)}>makes laws on…</T>
      <Tag x={90} y={535} w={240} c={C.state} label="State List" o={k(t, 4.3, 5)} />
      <Tag x={350} y={535} w={300} c={C.amber} label="Concurrent List" o={k(t, 4.9, 5.6)} />
      <Seats cx={960} cy={560} R={250} n={60} rows={5} colorFor={(i) => (i < lit ? C.green : C.off)} />
      <T x={960} y={625} s={30} c={C.mute} f="vm" a="middle" o={k(t, 1, 2)}>each dot = an MLA</T>
    </g>
  );
};

const S_exec = ({ t }) => {
  const lo = k(t, 0.2, 1.2), ro = k(t, 1.8, 2.8);
  return (
    <g>
      <T x={640} y={110} s={54} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>Two kinds of "head"</T>
      <g opacity={lo}>
        <Person x={350} y={290} s={1.3} c={C.mute} crown />
        <T x={350} y={440} s={54} f="vd" w={500} a="middle">Governor</T>
        <T x={350} y={488} s={32} c={C.brass} a="middle" w={700}>nominal head</T>
        <T x={350} y={530} s={26} c={C.mute} a="middle">appointed by the President</T>
      </g>
      <g opacity={ro}>
        {[-150, -80, 80, 150].map((dx, i) => <Person key={i} x={930 + dx} y={320} s={0.75} c={C.dim} />)}
        <Person x={930} y={300} s={1.3} c={C.green} />
        <T x={930} y={440} s={50} f="vd" w={500} a="middle">CM + Council of Ministers</T>
        <T x={930} y={488} s={32} c={C.green} a="middle" w={700}>real executive power</T>
        <T x={930} y={530} s={26} c={C.mute} a="middle">the CM heads the Council</T>
      </g>
      <g opacity={k(t, 3.6, 4.2)}>
        <T x={160} y={590} s={22} c={C.mute} f="vm" ls={3}>REAL POWER</T>
        <rect x={160} y={605} width={380} height={22} rx={11} fill={C.off} />
        <rect x={160} y={605} width={380 * 0.18 * k(t, 4, 6)} height={22} rx={11} fill={C.mute} />
        <T x={740} y={590} s={22} c={C.mute} f="vm" ls={3}>REAL POWER</T>
        <rect x={740} y={605} width={380} height={22} rx={11} fill={C.off} />
        <rect x={740} y={605} width={380 * 0.92 * k(t, 4, 6.5)} height={22} rx={11} fill={C.green} />
      </g>
    </g>
  );
};

const S_conf = ({ t }) => {
  const support = Math.round(lerp(62, 44, k(t, 2.2, 5.5)));
  const fell = support < 51;
  const sp = k(t, 3.2, 3.6);
  return (
    <g>
      <T x={640} y={105} s={56} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>Collective responsibility</T>
      <T x={640} y={160} s={30} c={C.brass} f="vm" a="middle" o={k(t, 0.4, 1)}>majority = 51 of 100 MLAs</T>
      <Seats cx={640} cy={540} R={290} n={100} colorFor={(i) => (i < support ? C.green : C.dim)} />
      <T x={600} y={630} s={84} f="vd" w={700} a="end" c={fell ? C.red : C.green}>{support}</T>
      <T x={620} y={612} s={28} c={C.mute}>of 100 MLAs back</T>
      <T x={620} y={644} s={28} c={C.mute}>the government</T>
      {fell && (
        <g opacity={sp} transform={`translate(640 320) rotate(-6) scale(${lerp(1.5, 1, sp)})`}>
          <rect x={-250} y={-52} width={500} height={92} rx={0} fill={C.bg} stroke={C.red} strokeWidth="6" />
          <T x={0} y={18} s={56} f="vd" w={500} a="middle" c={C.red}>MUST RESIGN</T>
        </g>
      )}
      <T x={640} y={700} s={30} c={C.red} a="middle" w={700} o={k(t, 4, 4.8)}>CM + all ministers resign together</T>
    </g>
  );
};

const LISTCOLS = [
  { name: "UNION LIST", who: "Parliament only", c: C.navy, items: ["Defence", "Foreign Affairs", "Railways", "Banking", "Atomic Energy", "Citizenship", "Currency"] },
  { name: "STATE LIST", who: "State Legislatures", c: C.green, items: ["Agriculture", "Police", "Public Health", "Local Government"] },
  { name: "CONCURRENT", who: "Both can make laws", c: C.amber, items: ["Education", "Marriage & Divorce", "Adoption", "Forests", "Criminal Laws"] },
];
const S_lists = ({ t }) => (
  <g>
    <T x={640} y={100} s={58} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>The 7th Schedule</T>
    <T x={640} y={148} s={28} c={C.mute} a="middle" o={k(t, 0.3, 0.9)}>three lists divide lawmaking power</T>
    {LISTCOLS.map((col, j) => {
      const p = k(t, 0.6 + j * 0.5, 1.4 + j * 0.5);
      const x = 90 + j * 375;
      return (
        <g key={col.name} opacity={p} transform={`translate(0 ${lerp(40, 0, p)})`}>
          <rect x={x} y={185} width={350} height={500} rx={0} fill={C.panel} />
          <rect x={x} y={185} width={350} height={8} rx={4} fill={col.c} />
          <T x={x + 26} y={244} s={32} c={col.c} f="vm" w={700} ls={2}>{col.name}</T>
          <T x={x + 26} y={284} s={26} c={C.mute}>{col.who}</T>
          {col.items.map((it, i) => (
            <T key={it} x={x + 26} y={345 + i * 47} s={30} o={k(t, 2.2 + j * 0.35 + i * 0.22, 2.6 + j * 0.35 + i * 0.22)}>{it}</T>
          ))}
        </g>
      );
    })}
  </g>
);

const S_clash = ({ t }) => {
  const m = k(t, 1, 2.2);
  const lose = k(t, 2.6, 3.4);
  const flash = cl((t - 2.2) / 0.6);
  return (
    <g>
      <T x={640} y={110} s={58} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>When laws clash</T>
      <T x={640} y={158} s={28} c={C.amber} a="middle" o={k(t, 0.3, 0.9)}>on a Concurrent List subject</T>
      <g opacity={lerp(1, 0.25, lose)} transform={`translate(${lerp(60, 270, m)} ${260 + lose * 50})`}>
        <rect width={360} height={200} rx={0} fill={C.panel} stroke={C.green} strokeWidth="4" />
        <T x={30} y={58} s={26} c={C.green} f="vm" ls={3}>STATE LAW</T>
        <T x={30} y={120} s={50} f="vd" w={500}>Education</T>
        <T x={30} y={165} s={24} c={C.mute}>by the State Assembly</T>
      </g>
      <g transform={`translate(${lerp(860, 650, m)} 260)`}>
        <rect width={360} height={200} rx={0} fill={C.panel} stroke={C.navy} strokeWidth={lerp(4, 7, lose)} />
        <T x={30} y={58} s={26} c={C.navy} f="vm" ls={3}>CENTRAL LAW</T>
        <T x={30} y={120} s={50} f="vd" w={500}>Education</T>
        <T x={30} y={165} s={24} c={C.mute}>by Parliament</T>
        <g opacity={k(t, 2.9, 3.3)} transform="translate(250 -18) rotate(8)">
          <rect x={-90} y={-30} width={180} height={52} fill={C.ink} />
          <T x={0} y={8} s={28} c={C.bg} f="vm" w={700} a="middle">PREVAILS</T>
        </g>
      </g>
      {t > 2.2 && t < 2.8 && <circle cx={640} cy={360} r={40 + flash * 260} fill={C.ink} opacity={0.35 * (1 - flash)} />}
      <T x={640} y={590} s={34} a="middle" o={k(t, 4, 4.8)}>e.g. the RTE Act, 2009 — enacted by Parliament,</T>
      <T x={640} y={636} s={34} a="middle" o={k(t, 4, 4.8)}>applies across the whole of India</T>
      <T x={640} y={680} s={24} c={C.mute} a="middle" o={k(t, 4.4, 5.2)}>(except certain specific institutions)</T>
    </g>
  );
};

const PAIRS = [
  ["Prime Minister", "Chief Minister", "", ""],
  ["President", "Governor", "elected", "appointed by President"],
  ["Lok Sabha", "Vidhan Sabha", "", ""],
  ["Rajya Sabha", "Vidhan Parishad", "", "some states only"],
  ["Supreme Court", "High Courts", "", ""],
];
const S_mirror = ({ t }) => {
  const line = k(t, 0.3, 1.2);
  return (
    <g>
      <T x={400} y={110} s={36} c={C.navy} f="vm" w={700} a="middle" ls={4} o={k(t, 0, 0.6)}>UNION</T>
      <T x={880} y={110} s={36} c={C.green} f="vm" w={700} a="middle" ls={4} o={k(t, 0, 0.6)}>STATE</T>
      <line x1={640} y1={140} x2={640} y2={140 + 540 * line} stroke={C.brass} strokeWidth="3" strokeDasharray="10 8" />
      {PAIRS.map(([u, s, nu, ns], i) => {
        const p = k(t, 1 + i * 0.9, 1.7 + i * 0.9);
        const y = 200 + i * 100;
        return (
          <g key={u} opacity={p}>
            <T x={lerp(640, 600, p)} y={y} s={44} f="vd" w={700} a="end" c={C.ink}>{u}</T>
            <T x={lerp(640, 680, p)} y={y} s={44} f="vd" w={700} c={C.ink}>{s}</T>
            {nu && <T x={600} y={y + 34} s={22} c={C.mute} a="end">{nu}</T>}
            {ns && <T x={680} y={y + 34} s={22} c={C.amber}>{ns}</T>}
          </g>
        );
      })}
    </g>
  );
};

const SIX = ["Andhra Pradesh", "Bihar", "Karnataka", "Maharashtra", "Telangana", "Uttar Pradesh"];
const S_houses = ({ t }) => {
  const up = k(t, 2, 3);
  return (
    <g>
      <T x={90} y={140} s={44} f="vd" w={500} o={k(t, 0, 0.6)}>1 house → unicameral</T>
      <T x={90} y={200} s={44} f="vd" w={500} c={C.red} o={up}>2 houses → bicameral</T>
      <line x1={70} y1={520} x2={700} y2={520} stroke={C.line} strokeWidth="3" />
      <g opacity={k(t, 0.3, 1)}>
        <path d="M100 520 V430 A120 90 0 0 1 340 430 V520 Z" fill={C.green} fillOpacity="0.2" stroke={C.green} strokeWidth="4" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={122 + i * 36} y={455} width={16} height={65} rx={3} fill={C.green} fillOpacity="0.6" />)}
        <T x={220} y={570} s={30} a="middle" w={700}>Vidhan Sabha</T>
      </g>
      <g opacity={up} transform={`translate(0 ${lerp(80, 0, up)})`}>
        <path d="M410 520 V445 A105 78 0 0 1 620 445 V520 Z" fill={C.red} fillOpacity="0.18" stroke={C.red} strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={432 + i * 36} y={468} width={16} height={52} rx={3} fill={C.red} fillOpacity="0.55" />)}
        <T x={515} y={570} s={30} a="middle" w={700}>Vidhan Parishad</T>
      </g>
      <T x={960} y={330} s={230} f="vd" w={700} c={C.red} a="middle" o={k(t, 3.2, 4)}>6</T>
      <T x={960} y={385} s={32} a="middle" o={k(t, 3.4, 4.2)}>bicameral states</T>
      {SIX.map((n, i) => (
        <T key={n} x={i % 2 ? 1050 : 790} y={450 + Math.floor(i / 2) * 52} s={30} c={C.ink} o={k(t, 4.2 + i * 0.3, 4.6 + i * 0.3)}>{n}</T>
      ))}
    </g>
  );
};

const SESS = [["Budget", 0.08, 0.33], ["Monsoon", 0.54, 0.68], ["Winter", 0.87, 0.97]];
const S_sessions = ({ t }) => {
  const ring = k(t, 3.2, 4.6);
  const circ = 2 * Math.PI * 64;
  return (
    <g>
      <T x={640} y={120} s={56} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>Three sessions a year</T>
      {"JFMAMJJASOND".split("").map((m, i) => (
        <g key={i}>
          <T x={140 + i * (1000 / 12) + 1000 / 24} y={250} s={24} c={C.mute} f="vm" a="middle">{m}</T>
          <rect x={140 + i * (1000 / 12) + 2} y={270} width={1000 / 12 - 4} height={90} rx={0} fill={C.panel} />
        </g>
      ))}
      {SESS.map(([n, a, b], i) => {
        const p = k(t, 0.7 + i * 0.5, 1.3 + i * 0.5);
        return (
          <g key={n} opacity={p} transform={`translate(0 ${lerp(-60, 0, p)})`}>
            <rect x={140 + a * 1000} y={282} width={(b - a) * 1000} height={66} rx={0} fill={C.green} />
            <T x={140 + ((a + b) / 2) * 1000} y={325} s={28} c={C.bg} w={500} a="middle">{n}</T>
          </g>
        );
      })}
      <T x={640} y={400} s={20} c={C.mute} a="middle" o={k(t, 2, 2.6)}>months show usual timing (extra context, not from the textbook)</T>
      <g opacity={k(t, 3, 3.6)}>
        <circle cx={380} cy={555} r={64} fill="none" stroke={C.off} strokeWidth="18" />
        <circle cx={380} cy={555} r={64} fill="none" stroke={C.green} strokeWidth="18" strokeLinecap="round" transform="rotate(-90 380 555)" strokeDasharray={circ} strokeDashoffset={circ * (1 - 0.25 * ring)} />
        <T x={380} y={568} s={38} f="vd" w={500} a="middle">~6h</T>
        <T x={490} y={545} s={42} f="vd" w={500}>about 6 hours a sitting day</T>
        <T x={490} y={595} s={30} c={C.mute}>State Assemblies follow similar schedules</T>
      </g>
    </g>
  );
};

const HITS = [
  ["walkouts & protests", 0.14, 290, 225], ["sloganeering", 0.1, 640, 225], ["absent members", 0.06, 990, 225],
  ["Question Hour interrupted", 0.08, 275, 315], ["personal attacks", 0.08, 690, 315], ["biased debates", 0.08, 1005, 315],
  ["Bills rushed through", 0.06, 465, 405], ["money & lobbying", 0.05, 815, 405],
];
const S_stall = ({ t }) => {
  let lost = 0;
  HITS.forEach(([, f], i) => { lost += f * k(t, 1.3 + i * 0.85, 1.8 + i * 0.85); });
  const w = 1000 * (1 - lost);
  return (
    <g>
      <T x={640} y={110} s={56} f="vd" w={500} a="middle" o={k(t, 0, 0.6)}>Why the House stalls</T>
      {HITS.map(([label, , x, y], i) => {
        const p = k(t, 1 + i * 0.85, 1.4 + i * 0.85);
        const pw = label.length * 15 + 50;
        return (
          <g key={label} opacity={p} transform={`translate(0 ${lerp(-24, 0, p)})`}>
            <rect x={x - pw / 2} y={y - 34} width={pw} height={52} rx={26} fill={C.panel} stroke={C.mute} strokeWidth="1.5" />
            <T x={x} y={y + 1} s={27} c={C.ink} a="middle" w={500}>{label}</T>
          </g>
        );
      })}
      <T x={140} y={500} s={24} c={C.mute} f="vm" ls={3}>ONE SITTING DAY</T>
      <rect x={140} y={515} width={1000} height={74} rx={0} fill={C.red} fillOpacity="0.35" />
      <rect x={140} y={515} width={w} height={74} rx={0} fill={C.green} />
      <T x={160} y={562} s={28} c={C.bg} w={500}>{Math.round((w / 1000) * 360)} min productive</T>
      <T x={640} y={660} s={34} c={C.red} a="middle" w={700} o={k(t, 8.2, 8.9)}>→ delay · low productivity · reduced effectiveness</T>
      <T x={640} y={700} s={20} c={C.mute} a="middle" o={k(t, 8.4, 9)}>illustration only, not real minutes</T>
    </g>
  );
};

const LS = [["13th", 356], ["14th", 356], ["15th", 332], ["16th", 331], ["17th", 274]];
const S_data = ({ t }) => {
  const base = 600, H = 380;
  const n = Math.round(lerp(121, 68, k(t, 5, 7)));
  const era = t < 6 ? "1952–70" : "since 2000";
  return (
    <g>
      <T x={90} y={110} s={46} f="vd" w={500} o={k(t, 0, 0.6)}>Lok Sabha sitting days</T>
      <line x1={90} y1={base} x2={700} y2={base} stroke={C.line} strokeWidth="2" />
      {LS.map(([l, v], i) => {
        const p = k(t, 0.5 + i * 0.2, 1.8 + i * 0.2);
        const h = (v / 400) * H * p;
        const x = 110 + i * 120;
        const last = i === 4;
        return (
          <g key={l}>
            <rect x={x} y={base - h} width={84} height={h} rx={0} fill={last ? C.red : C.green} />
            <T x={x + 42} y={base - h - 12} s={28} f="vm" w={700} a="middle" o={p}>{v}</T>
            <T x={x + 42} y={base + 36} s={26} f="vm" a="middle" c={C.mute}>{l}</T>
          </g>
        );
      })}
      <T x={662} y={300} s={26} c={C.red} a="middle" w={700} o={k(t, 2.4, 3)}>fewest</T>
      <g opacity={k(t, 3.6, 4.3)}>
        <rect x={770} y={170} width={430} height={470} rx={0} fill={C.panel} />
        <T x={985} y={230} s={24} c={C.brass} f="vm" a="middle" ls={3}>AVERAGE PER YEAR</T>
        <T x={985} y={420} s={190} f="vd" w={700} a="middle" c={t < 6 ? C.green : C.red}>{n}</T>
        <T x={985} y={480} s={34} c={C.mute} a="middle">days · {era}</T>
        <rect x={805} y={530} width={360} height={20} rx={0} fill={C.off} />
        <rect x={805} y={530} width={360 * (n / 121)} height={20} rx={0} fill={t < 6 ? C.green : C.red} />
      </g>
    </g>
  );
};

const S_end = ({ t }) => {
  const boxes = [
    ["When legislators fail their duties → public trust drops", C.red, 0.3],
    ["Media raises concerns: debates · cartoons · articles · social media", C.brass, 1.6],
    ["Humour & satire = a sign of a healthy democracy", C.green, 2.9],
  ];
  const end = k(t, 5, 5.8);
  return (
    <g>
      {boxes.map(([txt, c, a], i) => {
        const p = k(t, a, a + 0.7);
        return (
          <g key={i} opacity={p * (1 - end)} transform={`translate(0 ${lerp(24, 0, p)})`}>
            <rect x={140} y={150 + i * 160} width={1000} height={100} rx={0} fill={C.panel} stroke={c} strokeWidth="3" />
            <T x={640} y={212 + i * 160} s={32} a="middle" w={700} c={C.ink}>{txt}</T>
            {i < 2 && <T x={640} y={290 + i * 160} s={36} a="middle" c={c}>↓</T>}
          </g>
        );
      })}
      <g opacity={end}>
        <Seats cx={640} cy={430} R={200} n={60} rows={5} colorFor={(i) => (i % 7 === 3 ? C.red : C.green)} />
        <T x={640} y={530} s={70} f="vd" w={500} a="middle">Now play the chapter.</T>
        <rect x={500} y={615} width={280} height={60} fill={C.red} />
        <T x={640} y={653} s={22} f="vm" w={700} a="middle" ls={3}>START THE CHAPTER</T>
      </g>
    </g>
  );
};

export const SCENES = [
  { id: "title", title: "Who runs your state?", dur: 6, R: S_title, cap: "Every state in India has its own government. Who makes its laws, and who actually runs it?" },
  { id: "legis", title: "The lawmakers", dur: 8, R: S_legis, cap: "The State Legislature makes the state's laws. In most states it's the Vidhan Sabha, and its members are MLAs. They legislate on the State List and the Concurrent List." },
  { id: "exec", title: "Nominal vs real head", dur: 9, R: S_exec, cap: "The Governor, appointed by the President, is the head in name. Real executive power lies with the Council of Ministers, headed by the Chief Minister." },
  { id: "conf", title: "Collective responsibility", dur: 9, R: S_conf, cap: "The CM and the Council of Ministers are collectively responsible to the Assembly. If they lose the confidence of the majority of MLAs, they must all resign." },
  { id: "lists", title: "Three lists", dur: 10, R: S_lists, cap: "The 7th Schedule divides lawmaking powers: the Union List for Parliament, the State List for the states, and the Concurrent List for both." },
  { id: "clash", title: "When laws clash", dur: 8, R: S_clash, cap: "If a state law and a central law conflict on a Concurrent List subject, Parliament's law prevails — like the RTE Act, 2009." },
  { id: "mirror", title: "Mirror image", dur: 10, R: S_mirror, cap: "The state government mirrors the Union: CM for PM, Governor for President, Vidhan Sabha for Lok Sabha, Vidhan Parishad for Rajya Sabha, High Courts for the Supreme Court." },
  { id: "houses", title: "One house or two", dur: 8, R: S_houses, cap: "Most states have one house. Only six have two houses: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana and Uttar Pradesh." },
  { id: "sessions", title: "Sessions", dur: 7, R: S_sessions, cap: "Parliament meets in three sessions — Budget, Monsoon and Winter — sitting about six hours a day. State Assemblies follow similar schedules." },
  { id: "stall", title: "Why the House stalls", dur: 10, R: S_stall, cap: "Walkouts, sloganeering, absent members and rushed Bills eat into the House's time, causing delay, low productivity and reduced effectiveness." },
  { id: "data", title: "The data", dur: 9, R: S_data, cap: "Sitting days are falling: the 17th Lok Sabha sat just 274 days, and the yearly average dropped from 121 (1952–70) to 68 (since 2000)." },
  { id: "trust", title: "Trust & the media", dur: 8, R: S_end, cap: "When the House fails, public trust drops. The media raises these concerns, often with humour and satire — a sign of a healthy democracy." },
];
export const STARTS = SCENES.reduce((acc, s, i) => [...acc, i ? acc[i - 1] + SCENES[i - 1].dur : 0], []);
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

export function sceneAt(t) {
  let i = SCENES.length - 1;
  while (i > 0 && t < STARTS[i]) i--;
  return i;
}

// Pure render of one frame at time t.
export function Stage({ t }) {
  const i = sceneAt(Math.min(t, TOTAL - 0.001));
  const s = SCENES[i];
  const lt = t - STARTS[i];
  const fadeIn = i === 0 ? 1 : k(lt, 0, 0.35);
  const fadeOut = i === SCENES.length - 1 ? 1 : 1 - k(lt, s.dur - 0.4, s.dur);
  const R = s.R;
  return (
    <svg viewBox="0 0 1280 720" className="vstage-svg" role="img" aria-label={`${s.title}. ${s.cap}`}>
      <rect width="1280" height="720" fill={C.bg} />
      <g opacity={fadeIn * fadeOut}><R t={lt} d={s.dur} /></g>
      <T x={40} y={46} s={18} c={C.mute} f="vm" ls={2}>{String(i + 1).padStart(2, "0")} / {SCENES.length} · {s.title.toUpperCase()}</T>
      <rect x={0} y={714} width={1280} height={6} fill={C.off} />
      <rect x={0} y={714} width={1280 * (t / TOTAL)} height={6} fill={C.brass} />
    </svg>
  );
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VideoPlayer({ onDone }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cc, setCc] = useState(true);
  const wrap = useRef(null);
  const last = useRef(null);
  const doneRef = useRef(false);

  const tRef = useRef(0);
  tRef.current = t;
  useEffect(() => {
    if (!playing) return;
    let raf;
    const tick = (now) => {
      if (last.current == null) last.current = now;
      const dt = Math.min(0.1, (now - last.current) / 1000);
      last.current = now;
      const n = Math.min(TOTAL, tRef.current + dt);
      tRef.current = n;
      setT(n);
      if (n >= TOTAL) { setPlaying(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); last.current = null; };
  }, [playing]);

  useEffect(() => {
    if (!doneRef.current && t >= TOTAL - 1) { doneRef.current = true; onDone && onDone(); }
  }, [t]);

  const toggle = useCallback(() => {
    if (t >= TOTAL) { setT(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  }, [t]);
  const seek = (v) => setT(Math.max(0, Math.min(TOTAL, v)));
  const full = () => {
    const el = wrap.current;
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else el && el.requestFullscreen && el.requestFullscreen().catch(() => {});
    } catch (e) {}
  };
  const onKey = (e) => {
    if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); seek(t + 5); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); seek(t - 5); }
  };
  const si = sceneAt(Math.min(t, TOTAL - 0.001));
  const ended = t >= TOTAL;

  return (
    <div className="vplayer" ref={wrap} tabIndex={0} onKeyDown={onKey} aria-label="Chapter video player">
      <div className="vstage" onClick={toggle}>
        <Stage t={t} />
        {!playing && (
          <button className="vbig" onClick={(e) => { e.stopPropagation(); toggle(); }} aria-label={ended ? "Replay" : "Play"}>
            {ended ? <RotateCcw size={34} /> : <Play size={36} fill="currentColor" />}
          </button>
        )}
      </div>
      <div className="vcontrols">
        <button className="vbtn" onClick={toggle} aria-label={playing ? "Pause" : ended ? "Replay" : "Play"}>
          {playing ? <Pause size={18} fill="currentColor" /> : ended ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}
        </button>
        <span className="vtime mono tnum">{fmt(t)} / {fmt(TOTAL)}</span>
        <div className="vscrub">
          <input id="video-scrub" type="range" min="0" max={TOTAL} step="0.1" value={t} onChange={(e) => seek(+e.target.value)} aria-label="Seek" style={{ "--p": (t / TOTAL) * 100 + "%" }} />
          <div className="vticks" aria-hidden="true">
            {STARTS.slice(1).map((s) => <span key={s} style={{ left: (s / TOTAL) * 100 + "%" }} />)}
          </div>
        </div>
        <button className={"vbtn" + (cc ? " on" : "")} onClick={() => setCc((c) => !c)} aria-pressed={cc} aria-label="Captions"><Captions size={18} /></button>
        <button className="vbtn" onClick={full} aria-label="Fullscreen"><Maximize2 size={17} /></button>
      </div>
      {cc && <p className="vcap">{SCENES[si].cap}</p>}
      <div className="vchapters" role="list">
        {SCENES.map((s, i) => (
          <button key={s.id} role="listitem" className={"vch" + (i === si ? " on" : "")} onClick={() => { seek(STARTS[i] + 0.01); }}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span> {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
