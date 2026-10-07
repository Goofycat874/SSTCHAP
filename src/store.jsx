import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const KEY = "vidhan-sabha-progress-v1";

export const REQ = {
  hook: ["act-hook"],
  video: ["act-video"],
  s1: ["act-machine", "act-confidence", "s1q1", "s1q2", "s1q3"],
  s2: ["act-venn", "act-sort", "act-clash", "s2q1", "s2q2", "s2q3"],
  s3: ["act-mirror", "act-memory", "s3q1", "s3q2", "s3q3"],
  s4: ["act-map", "act-cyp", "s4q1", "s4q2"],
  s5: ["act-roles", "s5q1", "s5q2"],
  s6: ["act-day", "act-match", "s6q1", "s6q2"],
  s7: ["act-chart", "s7q1", "s7q2"],
  s8: ["act-forecast", "s8q1", "s8q2"],
  flash: ["act-flash"],
  exam: ["act-exam"],
  final: ["act-final"],
  recap: ["act-recap"],
};

const ACT_LABELS = {
  "act-hook": "Chief Minister's first files",
  "act-video": "Watched the chapter video",
  "act-machine": "Explored the state machine",
  "act-confidence": "Confidence simulator",
  "act-venn": "Three lists explorer",
  "act-sort": "List sorter game",
  "act-clash": "Clash of laws",
  "act-mirror": "Mirror table",
  "act-memory": "Twin-match memory game",
  "act-map": "Find the six states",
  "act-cyp": "Check Your Progress",
  "act-roles": "Roles of legislatures",
  "act-day": "One sitting day simulator",
  "act-match": "Problem → impact matching",
  "act-chart": "Sitting days chart",
  "act-forecast": "Cartoon decoder",
  "act-flash": "Flashcard deck",
  "act-exam": "Exam prep",
  "act-final": "Order in the House",
  "act-recap": "Two-minute recap",
};
export { ACT_LABELS };

const blank = () => ({ xp: 0, streak: 0, best: 0, answered: {}, acts: {}, cards: {}, revealed: {} });

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    return { ...blank(), ...JSON.parse(raw) };
  } catch (e) {
    return blank();
  }
}

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [st, setSt] = useState(load);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }, [st]);

  const toast = useCallback((t) => {
    const id = ++tid.current;
    setToasts((ts) => [...ts.slice(-2), { id, ...t }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2400);
  }, []);

  const stRef = useRef(st);
  stRef.current = st;
  const commit = useCallback((fn) => {
    const prev = stRef.current;
    const ns = fn(prev);
    if (ns === prev) return false;
    stRef.current = ns;
    setSt(ns);
    return true;
  }, []);

  // Answer a quiz question once.
  const answer = useCallback((id, correct, base = 50) => {
    let res = null;
    commit((s) => {
      if (s.answered[id]) return s;
      const streak = correct ? s.streak + 1 : 0;
      const combo = correct ? Math.min(Math.max(streak, 1), 5) : 1;
      const xp = correct ? base * combo : 0;
      res = { xp, combo, streak };
      return { ...s, xp: s.xp + xp, streak, best: Math.max(s.best, streak), answered: { ...s.answered, [id]: { correct } } };
    });
    if (res) toast(res.xp ? { xp: res.xp, combo: res.combo, streak: res.streak } : { miss: true });
    return res;
  }, [commit, toast]);

  const complete = useCallback((id, xp = 100) => {
    const gave = commit((s) => (s.acts[id] ? s : { ...s, xp: s.xp + xp, acts: { ...s.acts, [id]: true } }));
    if (gave && xp) toast({ xp, label: ACT_LABELS[id] || "Activity complete" });
  }, [commit, toast]);

  const addXp = useCallback((xp, label) => {
    commit((s) => ({ ...s, xp: s.xp + xp }));
    if (xp) toast({ xp, label });
  }, [commit, toast]);

  const setCard = useCallback((id, v) => commit((s) => ({ ...s, cards: { ...s.cards, [id]: v } })), [commit]);
  const reveal = useCallback((id) => commit((s) => (s.revealed[id] ? s : { ...s, revealed: { ...s.revealed, [id]: true } })), [commit]);
  const reset = useCallback(() => commit(() => blank()), [commit]);

  const isDone = useCallback((item) => !!(st.answered[item] || st.acts[item]), [st]);

  const stats = useMemo(() => {
    const all = Object.values(REQ).flat();
    const done = all.filter((i) => st.answered[i] || st.acts[i]).length;
    const sectionsDone = Object.entries(REQ).filter(([, items]) => items.every((i) => st.answered[i] || st.acts[i])).map(([k]) => k);
    const answered = Object.values(st.answered);
    const correct = answered.filter((a) => a.correct).length;
    const actCount = Object.keys(st.acts).length;
    return {
      pct: Math.round((done / all.length) * 100),
      sectionsDone,
      quizTotal: answered.length,
      quizCorrect: correct,
      actCount,
      actTotal: Object.keys(ACT_LABELS).length,
    };
  }, [st]);

  const value = { st, answer, complete, addXp, setCard, reveal, reset, isDone, stats, toasts, toast };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useProgress = () => useContext(Ctx);

export const sectionDone = (st, key) => REQ[key].every((i) => st.answered[i] || st.acts[i]);
