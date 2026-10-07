// All content is drawn from the supplied textbook pages (196–199).
// Anything outside the chapter is marked with extra: true and shown with an "Extra context" label.

export const SECTIONS = [
  { id: "s1", num: "01", title: "The State Machine", short: "Legislature & Executive" },
  { id: "s2", num: "02", title: "Who Makes Which Law", short: "Union, State & Concurrent Lists" },
  { id: "s3", num: "03", title: "Mirror Image", short: "Union vs State government" },
  { id: "s4", num: "04", title: "One House or Two", short: "Unicameral & bicameral" },
  { id: "s5", num: "05", title: "When the House Meets", short: "Roles & sessions" },
  { id: "s6", num: "06", title: "Why the House Stalls", short: "Challenges to legislatures" },
  { id: "s7", num: "07", title: "The Data Room", short: "Sitting days over time" },
  { id: "s8", num: "08", title: "Citizens Are Watching", short: "Public trust & the media" },
];

// ---------- Hook ----------
export const HOOK_FILES = [
  {
    id: "police",
    title: "Recruit more police for the state",
    list: "State",
    answer: "alone",
    why: "Police is on the State List. Your State Legislature can make this law by itself.",
  },
  {
    id: "currency",
    title: "Issue a new currency for the state",
    list: "Union",
    answer: "parliament",
    why: "Currency is on the Union List — a subject of national importance. Only Parliament can make laws on it.",
  },
  {
    id: "adoption",
    title: "Change the rules on adoption",
    list: "Concurrent",
    answer: "both",
    why: "Adoption is on the Concurrent List. Both Parliament and the State Legislature can make laws on it — but if the two laws clash, Parliament's law prevails.",
  },
];

export const HOOK_CHOICES = [
  { id: "alone", label: "My state can do it alone" },
  { id: "parliament", label: "Only Parliament can" },
  { id: "both", label: "Both can — with a catch" },
];

// ---------- Section 1: structure diagram ----------
export const MACHINE_NODES = {
  president: {
    label: "President of India",
    tag: "Union",
    text: "Appoints the Governor of each state.",
  },
  governor: {
    label: "Governor",
    tag: "Nominal head",
    text: "The nominal (constitutional) head of the state executive. Appointed by the President. Term: 5 years.",
  },
  cm: {
    label: "Chief Minister",
    tag: "Real head",
    text: "Heads the Council of Ministers. The CM is the leader of the majority party or coalition in the Vidhan Sabha.",
  },
  council: {
    label: "Council of Ministers",
    tag: "Real executive power",
    text: "Selected by the Chief Minister. Holds the real executive power: implements laws and runs the state government.",
  },
  assembly: {
    label: "Vidhan Sabha",
    tag: "Legislative Assembly · MLAs",
    text: "The lawmaking body in most states. Its members are MLAs. Makes laws on State List and Concurrent List subjects.",
  },
  parishad: {
    label: "Vidhan Parishad",
    tag: "Legislative Council · some states",
    text: "The upper house — exists only in states with a bicameral legislature (six states currently).",
  },
  hc: {
    label: "High Court",
    tag: "Judiciary",
    text: "The judiciary at the state level, just as the Supreme Court is at the Union level.",
  },
};

// ---------- Section 2: three lists ----------
export const LISTS = {
  Union: {
    name: "Union List",
    who: "Only Parliament makes laws",
    why: "Subjects of national importance",
    items: ["Defence", "Foreign Affairs", "Railways", "Banking", "Atomic Energy", "Citizenship", "Currency"],
  },
  State: {
    name: "State List",
    who: "State Legislatures make laws",
    why: "Subjects of local and regional importance",
    items: ["Agriculture", "Police", "Public Health", "Local Government"],
  },
  Concurrent: {
    name: "Concurrent List",
    who: "Both can make laws — Parliament's law prevails in a clash",
    why: "Subjects needing Union–State collaboration",
    items: ["Education", "Marriage & Divorce", "Adoption", "Forests", "Criminal Laws"],
  },
};

export const SORT_ITEMS = Object.entries(LISTS).flatMap(([k, v]) =>
  v.items.map((it) => ({ id: it, list: k }))
);

export const CLASH_SUBJECTS = ["Education", "Marriage & Divorce", "Adoption", "Forests", "Criminal Laws"];

// ---------- Section 3: parallel structure (15 rows from the textbook table) ----------
export const MIRROR = [
  { f: "Legislature", u: "Parliament (Sansad)", s: "State Legislature (Vidhan Mandal)", same: true },
  { f: "Legislature structure", u: "Bicameral — Lok Sabha and Rajya Sabha", s: "Unicameral (Vidhan Sabha only) or bicameral (Vidhan Sabha and Vidhan Parishad)", same: false },
  { f: "Lower House", u: "Lok Sabha (House of the People)", s: "Vidhan Sabha (Legislative Assembly)", same: true },
  { f: "Upper House", u: "Rajya Sabha (Council of States)", s: "Vidhan Parishad (Legislative Council) — in some states only", same: false },
  { f: "Presiding officer", u: "Speaker (Lok Sabha); Chairman (Rajya Sabha)", s: "Speaker (Legislative Assembly); Chairman (Legislative Council)", same: true },
  { f: "Nominal head", u: "President of India, elected by an electoral college", s: "Governor of the state, appointed by the President", same: false },
  { f: "Term of office (head)", u: "5 years", s: "5 years", same: true },
  { f: "Real head of government", u: "Prime Minister (PM)", s: "Chief Minister (CM)", same: true },
  { f: "Selection of executive", u: "Leader of majority party/coalition in Lok Sabha", s: "Leader of majority party/coalition in Vidhan Sabha", same: true },
  { f: "Council of Ministers", u: "Selected by the Prime Minister", s: "Selected by the Chief Minister", same: true },
  { f: "Lawmaking powers", u: "Union List (e.g. defence, foreign affairs, currency); Concurrent List (shared)", s: "State List (e.g. police, agriculture); Concurrent List (shared)", same: false },
  { f: "Budget", u: "Union Budget, presented by the Finance Minister", s: "State Budget, presented by the State Finance Minister", same: true },
  { f: "Money Bills", u: "Originate only in Lok Sabha", s: "Originate only in Vidhan Sabha", same: true },
  { f: "Judiciary", u: "Supreme Court", s: "High Courts", same: false },
  { f: "Elections", u: "Lok Sabha elections (every 5 years)", s: "State Legislative Assembly elections (every 5 years)", same: true },
];

export const MEMORY_PAIRS = [
  ["Prime Minister", "Chief Minister"],
  ["President", "Governor"],
  ["Lok Sabha", "Vidhan Sabha"],
  ["Rajya Sabha", "Vidhan Parishad"],
  ["Supreme Court", "High Courts"],
  ["Parliament", "State Legislature"],
  ["Finance Minister", "State Finance Minister"],
  ["Lok Sabha elections", "Assembly elections"],
];

// ---------- Section 4: tile map of the 28 states ----------
// [code, name, col, row, bicameral]
export const STATES = [
  ["HP", "Himachal Pradesh", 3, 0],
  ["PB", "Punjab", 2, 1], ["HR", "Haryana", 3, 1], ["UK", "Uttarakhand", 4, 1], ["SK", "Sikkim", 6, 1], ["AR", "Arunachal Pradesh", 8, 1],
  ["RJ", "Rajasthan", 2, 2], ["UP", "Uttar Pradesh", 4, 2, true], ["BR", "Bihar", 5, 2, true], ["WB", "West Bengal", 6, 2], ["AS", "Assam", 7, 2], ["NL", "Nagaland", 8, 2],
  ["GJ", "Gujarat", 1, 3], ["MP", "Madhya Pradesh", 3, 3], ["CG", "Chhattisgarh", 4, 3], ["JH", "Jharkhand", 5, 3], ["ML", "Meghalaya", 7, 3], ["MN", "Manipur", 8, 3],
  ["MH", "Maharashtra", 2, 4, true], ["TS", "Telangana", 3, 4, true], ["OD", "Odisha", 4, 4], ["TR", "Tripura", 7, 4], ["MZ", "Mizoram", 8, 4],
  ["GA", "Goa", 1, 5], ["KA", "Karnataka", 2, 5, true], ["AP", "Andhra Pradesh", 3, 5, true],
  ["KL", "Kerala", 2, 6], ["TN", "Tamil Nadu", 3, 6],
];

export const CHECK_YOUR_PROGRESS = [
  { id: "cyp1", q: "What is another name for State Legislative Assembly?", a: "Vidhan Sabha." },
  { id: "cyp2", q: "Who is the nominal head of the state?", a: "The Governor." },
  { id: "cyp3", q: "Name two subjects of the State List.", a: "Any two of: Agriculture, Police, Public Health, Local Government." },
  { id: "cyp4", q: "Name two subjects of the Concurrent List.", a: "Any two of: Education, Marriage and divorce, Adoption, Forests, Criminal Laws." },
  { id: "cyp5", q: "Name two states having bicameral legislatures.", a: "Any two of: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh." },
];

// ---------- Section 5: roles ----------
export const ROLES = [
  { id: "laws", label: "Make laws", detail: "For the nation (Parliament) and for the state (State Legislatures)." },
  { id: "oversee", label: "Oversee administration", detail: "Review the work of the government." },
  { id: "policy", label: "Frame policies & plans", detail: "Draft and frame policies and development plans." },
  { id: "budget", label: "Pass budgets", detail: "Pass budgets, including for infrastructure." },
  { id: "opinion", label: "Consider public opinion", detail: "Take people's views into account while performing their duties." },
];

export const SESSIONS = [
  { id: "budget", name: "Budget Session", months: "Usually Jan/Feb – Apr", start: 0.08, end: 0.33 },
  { id: "monsoon", name: "Monsoon Session", months: "Usually Jul – Aug", start: 0.54, end: 0.68 },
  { id: "winter", name: "Winter Session", months: "Usually Nov – Dec", start: 0.87, end: 0.97 },
];

// ---------- Section 6: challenges ----------
export const CHALLENGE_GROUPS = [
  {
    id: "time",
    name: "Time & attendance",
    items: [
      "Many legislators remain absent during sessions",
      "Low number of sittings of Parliament and State Legislatures",
      "Limited time and frequent disruptions lead to rushed decision-making",
    ],
  },
  {
    id: "conduct",
    name: "Disruption & conduct",
    items: [
      "Frequent disruptions — protests and walkouts",
      "Non-cooperative conduct of members",
      "Frequent interruptions during Question Hour",
      "Personal attacks and sloganeering → poor-quality debates",
      "Non-serious and biased debates waste productive hours",
    ],
  },
  {
    id: "scrutiny",
    name: "Weak scrutiny",
    items: [
      "Insufficient scrutiny of Bills — many passed without detailed discussion",
      "Inadequate use of committees reduces quality of legislative review",
    ],
  },
  {
    id: "integrity",
    name: "Integrity",
    items: [
      "Criminalisation of politics — many legislators have criminal cases against them",
      "Influence of money and lobbying shifts focus away from public welfare",
    ],
  },
];

export const DAY_FACTORS = [
  { id: "walkout", label: "Protests & walkout", mins: 90, debate: 10, scrutiny: 10, trust: 12, note: "Frequent disruptions in the form of protests and walkouts." },
  { id: "slogans", label: "Personal attacks & sloganeering", mins: 50, debate: 35, scrutiny: 5, trust: 12, note: "Leads to poor-quality debates." },
  { id: "qhour", label: "Question Hour interrupted", mins: 45, debate: 10, scrutiny: 15, trust: 8, note: "Frequent interruptions during the Question Hour." },
  { id: "absent", label: "Many members absent", mins: 0, debate: 20, scrutiny: 15, trust: 10, note: "Many legislators remain absent during sessions." },
  { id: "biased", label: "Non-serious, biased debate", mins: 45, debate: 25, scrutiny: 5, trust: 8, note: "Wastes productive working hours." },
  { id: "rushed", label: "Bill passed without discussion", mins: 0, debate: 5, scrutiny: 40, trust: 10, note: "Insufficient scrutiny of Bills; rushed decision-making." },
];

export const MATCH_PAIRS = [
  { id: "m1", a: "Personal attacks and sloganeering", b: "Poor-quality debates" },
  { id: "m2", a: "Inadequate use of committees", b: "Reduced quality of legislative review" },
  { id: "m3", a: "Influence of money and lobbying", b: "Focus shifts away from public welfare" },
  { id: "m4", a: "Limited time and frequent disruptions", b: "Rushed decision-making" },
  { id: "m5", a: "Non-serious and biased debates", b: "Productive working hours wasted" },
  { id: "m6", a: "Insufficient scrutiny of Bills", b: "Bills passed without detailed discussion" },
];

// ---------- Section 7: sitting days ----------
export const LOK_SABHAS = [
  { n: "13th", term: "1999–2004", total: 356, avg: 71, approx: true },
  { n: "14th", term: "2004–2009", total: 356, avg: 71, approx: true },
  { n: "15th", term: "2009–2014", total: 332, avg: 66, approx: true },
  { n: "16th", term: "2014–2019", total: 331, avg: 66, approx: false },
  { n: "17th", term: "2019–2024", total: 274, avg: 55, approx: false },
];

// ---------- Section 8: cartoon reading ----------
export const FORECAST = [
  { id: "thunder", label: "Thunder", reading: "Loud sloganeering and shouting in the House." },
  { id: "lightning", label: "Lightning", reading: "Sharp personal attacks between members." },
  { id: "storms", label: "Storms", reading: "Protests and walkouts that stop the House from working." },
  { id: "breaches", label: "Breaches", reading: "Disruptions that break the order of the House and waste sitting time." },
];

// ---------- Section quizzes ----------
// type: mcq | tf
export const QUIZZES = {
  hook: [],
  s1: [
    { id: "s1q1", q: "Who holds the REAL executive power in a state?", opts: ["The Governor", "The Council of Ministers headed by the CM", "The Speaker", "The High Court"], a: 1, why: "The Governor is only the nominal head. Real executive power lies with the Council of Ministers, headed by the Chief Minister.", wrong: { 0: "The Governor is the nominal head — the official head, but without real executive power.", 2: "The Speaker presides over the Legislative Assembly; that's the legislature, not the executive.", 3: "The High Court is the judiciary, not the executive." } },
    { id: "s1q2", q: "The CM and the Council of Ministers are collectively responsible to…", opts: ["The Governor", "The President", "The Legislative Assembly", "The High Court"], a: 2, why: "They are collectively responsible to the Legislative Assembly — and must resign if they lose the confidence of the majority of MLAs.", wrong: { 0: "The Governor is the nominal head. The CM and Council answer to the Legislative Assembly.", 1: "The President appoints the Governor; the state executive answers to the state's own Assembly.", 3: "Courts are the judiciary; collective responsibility is owed to the legislature." } },
    { id: "s1q3", type: "tf", q: "True or false: If the government loses the confidence of the majority of MLAs, only the Chief Minister has to resign.", a: false, why: "False. Responsibility is collective — the Chief Minister AND the Council of Ministers must resign together." },
  ],
  s2: [
    { id: "s2q1", q: "Which part of the Constitution contains the three lists?", opts: ["The Preamble", "The 7th Schedule", "The 5th Schedule", "Fundamental Rights"], a: 1, why: "The 7th Schedule contains the Union, State and Concurrent Lists.", wrong: { 0: "The Preamble doesn't divide lawmaking powers.", 2: "It's the 7th Schedule, not the 5th.", 3: "Fundamental Rights are a different part of the Constitution." } },
    { id: "s2q2", q: "A state law and a central law clash on 'Forests'. Which one applies?", opts: ["The state law", "The central law", "Neither — both are cancelled", "Whichever was passed first"], a: 1, why: "Forests is on the Concurrent List. When state and central laws conflict, the law made by Parliament prevails.", wrong: { 0: "On Concurrent subjects, the state law gives way in a clash.", 2: "Nothing is cancelled — the central law simply prevails.", 3: "The order of passing doesn't decide it; Parliament's law prevails." } },
    { id: "s2q3", q: "Why does the RTE Act, 2009 apply across all of India even though Education is on the Concurrent List?", opts: ["Because it was passed by a State Assembly", "Because the Governor signed it", "Because it was enacted by Parliament, and central law prevails", "Because Education is on the Union List"], a: 2, why: "Parliament enacted the RTE Act. On a Concurrent subject, the central law prevails, so it applies across India (except certain specific institutions).", wrong: { 0: "The RTE Act was enacted by Parliament, not a state.", 1: "The chapter's reason is about Parliament's law prevailing, not a Governor's signature.", 3: "The chapter places Education on the Concurrent List, not the Union List." } },
  ],
  s3: [
    { id: "s3q1", q: "How is the Governor chosen?", opts: ["Elected by an electoral college", "Appointed by the President", "Elected by MLAs", "Chosen by the CM"], a: 1, why: "The Governor is appointed by the President. (The President, by contrast, is elected by an electoral college.)", wrong: { 0: "That's how the President is chosen — not the Governor.", 2: "MLAs choose no Governor; the CM comes from the majority in the Vidhan Sabha.", 3: "The CM selects the Council of Ministers, not the Governor." } },
    { id: "s3q2", q: "In a state, Money Bills can originate only in…", opts: ["Vidhan Parishad", "Vidhan Sabha", "High Court", "Rajya Sabha"], a: 1, why: "Just as Money Bills originate only in the Lok Sabha at the Union level, in a state they originate only in the Vidhan Sabha.", wrong: { 0: "The Vidhan Parishad is the upper house — Money Bills start in the lower house.", 2: "Courts don't introduce Bills.", 3: "Rajya Sabha is a Union house, and Money Bills don't originate there either." } },
    { id: "s3q3", type: "tf", q: "True or false: The Union legislature can be unicameral.", a: false, why: "False. Parliament is always bicameral (Lok Sabha + Rajya Sabha). It's state legislatures that can be unicameral or bicameral." },
  ],
  s4: [
    { id: "s4q1", q: "A bicameral state legislature has…", opts: ["Only the Vidhan Sabha", "Vidhan Sabha and Vidhan Parishad", "Lok Sabha and Rajya Sabha", "Vidhan Sabha and the High Court"], a: 1, why: "Bicameral = two houses: Vidhan Sabha (Legislative Assembly) and Vidhan Parishad (Legislative Council).", wrong: { 0: "Only one house = unicameral.", 2: "Those are the two houses of Parliament, not a state.", 3: "The High Court is the judiciary, not a house of the legislature." } },
    { id: "s4q2", q: "Which of these states has a UNICAMERAL legislature?", opts: ["Bihar", "Karnataka", "Kerala", "Telangana"], a: 2, why: "Kerala is not one of the six bicameral states (AP, Bihar, Karnataka, Maharashtra, Telangana, UP), so it is unicameral.", wrong: { 0: "Bihar is one of the six bicameral states.", 1: "Karnataka is one of the six bicameral states.", 3: "Telangana is one of the six bicameral states." } },
  ],
  s5: [
    { id: "s5q1", q: "How many main sessions does Parliament hold each year?", opts: ["Two", "Three", "Four", "Twelve"], a: 1, why: "Three: the Budget Session, the Monsoon Session and the Winter Session.", wrong: { 0: "There are three — Budget, Monsoon and Winter.", 2: "There are three, not four.", 3: "Parliament meets in three sessions, not monthly." } },
    { id: "s5q2", q: "About how long does Parliament usually sit each day during a session?", opts: ["2 hours", "About 6 hours", "12 hours", "24 hours"], a: 1, why: "About six hours a day — extendable on special occasions or when urgent business must be completed.", wrong: { 0: "It's about six hours a day.", 2: "Usually about six hours, not twelve.", 3: "Usually about six hours a day." } },
  ],
  s6: [
    { id: "s6q1", q: "What does the chapter say these challenges lead to?", opts: ["Faster decisions and more laws", "Delay in decision-making, low productivity and reduced effectiveness", "More sittings each year", "Stronger committees"], a: 1, why: "The challenges lead to delay in decision-making, low productivity and reduced effectiveness in carrying out duties.", wrong: { 0: "The opposite — decisions get delayed.", 2: "A low number of sittings is itself listed as a challenge.", 3: "Inadequate use of committees is listed as a challenge." } },
    { id: "s6q2", type: "tf", q: "True or false: Criminalisation of politics means many legislators have criminal cases against them.", a: true, why: "True — that's exactly how the chapter describes criminalisation of politics." },
  ],
  s7: [
    { id: "s7q1", q: "Which full-term Lok Sabha had the fewest sitting days?", opts: ["13th", "15th", "16th", "17th"], a: 3, why: "The 17th Lok Sabha (2019–2024) had only 274 sitting days — the fewest among all full-term Lok Sabhas.", wrong: { 0: "The 13th had 356 — joint highest in the table.", 1: "The 15th had 332.", 2: "The 16th had 331." } },
    { id: "s7q2", q: "Average annual sitting days of Lok Sabha fell from ___ (1952–70) to ___ (since 2000).", opts: ["121 → 68", "71 → 55", "356 → 274", "100 → 50"], a: 0, why: "Annual average fell from 121 days during 1952–70 to 68 days since 2000.", wrong: { 1: "71 → 55 is the 13th vs 17th Lok Sabha comparison.", 2: "356 → 274 are total sitting days (13th vs 17th), not annual averages.", 3: "The chapter's figures are 121 and 68." } },
  ],
  s8: [
    { id: "s8q1", q: "According to the chapter, what happens when legislators fail to perform their duties responsibly?", opts: ["People trust institutions more", "Citizens feel their voices are not heard and welfare is neglected", "Elections are cancelled", "Media stops reporting"], a: 1, why: "It creates disappointment, reduces trust in democratic institutions, and makes citizens feel unheard and that public welfare is neglected.", wrong: { 0: "Trust goes down, not up.", 2: "The chapter says nothing about elections being cancelled.", 3: "The media actually raises these concerns." } },
    { id: "s8q2", type: "tf", q: "True or false: Cartoons using humour and satire to criticise legislators are a common feature of healthy democracies.", a: true, why: "True. The chapter says expressing concerns through cartoons with humour and satire is a common feature of healthy democracies." },
  ],
};

// ---------- Flashcards ----------
export const FLASHCARDS = [
  { id: "f1", front: "State Legislature", back: "The lawmaking body at the state level." },
  { id: "f2", front: "Vidhan Sabha", back: "Legislative Assembly — the name of the State Legislature (lower house) in most states." },
  { id: "f3", front: "MLA", back: "Member of Legislative Assembly — a member of the Vidhan Sabha." },
  { id: "f4", front: "Vidhan Parishad", back: "Legislative Council — the upper house; exists only in some states." },
  { id: "f5", front: "Nominal head of the state", back: "The Governor — appointed by the President." },
  { id: "f6", front: "Real executive power in a state", back: "The Council of Ministers, headed by the Chief Minister." },
  { id: "f7", front: "Collective responsibility", back: "The CM and Council of Ministers are together responsible to the Legislative Assembly and must resign if they lose the confidence of the majority of MLAs." },
  { id: "f8", front: "7th Schedule", back: "Part of the Constitution containing the Union, State and Concurrent Lists, which distribute lawmaking powers." },
  { id: "f9", front: "Union List", back: "National importance: Defence, Foreign Affairs, Railways, Banking, Atomic Energy, Citizenship, Currency." },
  { id: "f10", front: "State List", back: "Local & regional importance: Agriculture, Police, Public Health, Local Government." },
  { id: "f11", front: "Concurrent List", back: "Both Union and States can make laws: Education, Marriage & divorce, Adoption, Forests, Criminal Laws." },
  { id: "f12", front: "Conflict on a Concurrent subject", back: "The law made by Parliament (central law) prevails." },
  { id: "f13", front: "RTE Act, 2009", back: "Enacted by Parliament; applies across India (except certain specific institutions) though Education is on the Concurrent List." },
  { id: "f14", front: "Unicameral", back: "Legislature with one house — Vidhan Sabha only." },
  { id: "f15", front: "Bicameral", back: "Legislature with two houses — Vidhan Sabha and Vidhan Parishad." },
  { id: "f16", front: "The six bicameral states", back: "Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh." },
  { id: "f17", front: "How is the CM selected?", back: "Leader of the majority party or coalition in the Vidhan Sabha." },
  { id: "f18", front: "State Budget", back: "Presented by the State Finance Minister. Money Bills originate only in the Vidhan Sabha." },
  { id: "f19", front: "Sessions of Parliament", back: "Three a year: Budget, Monsoon and Winter. About six hours of sitting a day." },
  { id: "f20", front: "Lok Sabha sitting days: then vs now", back: "Annual average fell from 121 days (1952–70) to 68 days (since 2000)." },
  { id: "f21", front: "17th Lok Sabha (2019–24)", back: "274 sitting days, ~55 a year — the fewest among all full-term Lok Sabhas." },
  { id: "f22", front: "Effects of legislative challenges", back: "Delay in decision-making, low productivity and reduced effectiveness; reduced public trust." },
  { id: "f23", front: "Role of media", back: "Raises public concerns through debates, cartoons, journals, articles and social media — often with humour and satire." },
];

// ---------- Exam prep ----------
export const EXAM = {
  definitions: [
    ["State Legislature", "The lawmaking body at the state level; called the Legislative Assembly (Vidhan Sabha) in most states."],
    ["Nominal head", "The formal head of the executive without real power — the Governor at the state level."],
    ["Real executive", "The Council of Ministers headed by the Chief Minister, which holds the real executive power."],
    ["Collective responsibility", "The CM and the Council of Ministers are together responsible to the Legislative Assembly and must resign if they lose the majority's confidence."],
    ["Unicameral legislature", "A legislature with only one house (Vidhan Sabha)."],
    ["Bicameral legislature", "A legislature with two houses (Vidhan Sabha and Vidhan Parishad)."],
    ["Sessions of Parliament", "The meetings of Parliament — Budget, Monsoon and Winter — made up of sittings where Bills and national issues are discussed and the government's work is reviewed."],
  ],
  facts: [
    "The 7th Schedule contains three lists: Union, State and Concurrent.",
    "On a Concurrent List conflict, Parliament's law prevails.",
    "Governor: appointed by the President; term 5 years.",
    "CM: leader of the majority party/coalition in the Vidhan Sabha; selects the Council of Ministers.",
    "Only six states are bicameral: AP, Bihar, Karnataka, Maharashtra, Telangana, UP.",
    "Money Bills in a state originate only in the Vidhan Sabha.",
    "State-level judiciary: High Courts.",
    "Parliament: 3 sessions a year, about 6 hours a sitting day.",
    "Lok Sabha sitting days: 121/year (1952–70) → 68/year (since 2000).",
    "17th Lok Sabha: 274 sitting days, the fewest of all full-term Lok Sabhas.",
  ],
  differences: [
    {
      title: "Governor vs Chief Minister",
      cols: ["Governor", "Chief Minister"],
      rows: [
        ["Nominal head of the state executive", "Real head of the state government"],
        ["Appointed by the President", "Leader of majority party/coalition in Vidhan Sabha"],
        ["Does not head the Council of Ministers", "Heads the Council of Ministers and selects it"],
      ],
    },
    {
      title: "Unicameral vs Bicameral",
      cols: ["Unicameral", "Bicameral"],
      rows: [
        ["One house", "Two houses"],
        ["Vidhan Sabha only", "Vidhan Sabha + Vidhan Parishad"],
        ["Most states", "Only six states currently"],
      ],
    },
    {
      title: "President vs Governor",
      cols: ["President", "Governor"],
      rows: [
        ["Nominal head of the Union", "Nominal head of the state"],
        ["Elected by an electoral college", "Appointed by the President"],
        ["Term: 5 years", "Term: 5 years"],
      ],
    },
  ],
  causeEffect: [
    ["Loss of majority's confidence", "CM and Council of Ministers must resign"],
    ["State law clashes with central law (Concurrent List)", "Central law prevails"],
    ["Personal attacks and sloganeering", "Poor-quality debates"],
    ["Inadequate use of committees", "Lower quality of legislative review"],
    ["Money and lobbying", "Focus shifts away from public welfare"],
    ["Legislators fail in their duties", "Disappointment and reduced public trust in democratic institutions"],
  ],
  short: [
    { id: "ex1", q: "What are the three lists in the 7th Schedule? Give one example of each.", a: "Union List (e.g. Defence), State List (e.g. Police) and Concurrent List (e.g. Education). They distribute lawmaking powers between the Union and the State governments." },
    { id: "ex2", q: "What happens if a state law conflicts with a central law on a Concurrent List subject? Give an example.", a: "The law made by Parliament (central law) prevails. For example, the RTE Act, 2009, enacted by Parliament, applies across the whole of India (except certain specific institutions) even though Education is on the Concurrent List." },
    { id: "ex3", q: "Differentiate between a unicameral and a bicameral state legislature.", a: "A unicameral legislature has only one house, the Vidhan Sabha. A bicameral legislature has two houses, the Vidhan Sabha and the Vidhan Parishad. Only six states — Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana and Uttar Pradesh — are bicameral." },
    { id: "ex4", q: "Name the three sessions of Parliament.", a: "The Budget Session, the Monsoon Session and the Winter Session. Parliament usually sits about six hours a day during these sessions." },
  ],
  long: [
    { id: "ex5", q: "Describe the structure and functioning of the state executive.", a: "The executive implements laws and runs the state government. The Governor, appointed by the President, is the nominal head of the state executive. The real executive power is held by the Council of Ministers headed by the Chief Minister. The CM is the leader of the majority party or coalition in the Vidhan Sabha and selects the Council of Ministers. The CM and the Council of Ministers are collectively responsible to the Legislative Assembly, which means they must resign if they lose the confidence of the majority of MLAs." },
    { id: "ex6", q: "Explain any five challenges to the effective functioning of legislatures in India.", a: "(1) Many legislators remain absent during sessions. (2) Frequent disruptions in the form of protests and walkouts. (3) Personal attacks and sloganeering lead to poor-quality debates. (4) Insufficient scrutiny of Bills — many are passed without detailed discussion. (5) Influence of money and lobbying shifts focus away from public welfare. Others: low number of sittings, criminalisation of politics, interruptions during Question Hour, inadequate use of committees. These lead to delay in decision-making, low productivity and reduced effectiveness." },
    { id: "ex7", q: "Compare the structure of the Union government and the State government.", a: "The structures are parallel. Parliament is the Union legislature; the State Legislature is the state's. Parliament is bicameral (Lok Sabha, Rajya Sabha); a state legislature may be unicameral (Vidhan Sabha) or bicameral (Vidhan Sabha, Vidhan Parishad). The President (elected by an electoral college) is the Union's nominal head; the Governor (appointed by the President) is the state's. The PM and the CM are the real heads, each the leader of the majority in the lower house, and each selects the Council of Ministers. Money Bills originate only in the Lok Sabha / Vidhan Sabha. The Supreme Court is the Union judiciary; High Courts are at state level. Elections to both are held every 5 years." },
  ],
  reasoning: [
    { id: "ex8", q: "Give reason: The Governor is called the nominal head of the state.", a: "Because although the Governor is the official head of the state executive, the real executive power is held by the Council of Ministers headed by the Chief Minister." },
    { id: "ex9", q: "Give reason: The Concurrent List shows the interdependent nature of federalism.", a: "Because matters on it, like education and environmental policy, require collaboration between the Union and the States — both can make laws on them." },
    { id: "ex10", q: "Give reason: Challenges in legislatures reduce people's trust in democracy.", a: "Because when legislators fail to perform their duties responsibly, citizens feel their voices are not heard and public welfare is neglected, causing disappointment." },
  ],
  data: [
    { id: "ex11", q: "From the table (13th–17th Lok Sabha), which Lok Sabha had the maximum and minimum sitting days?", a: "Maximum: the 13th and 14th Lok Sabhas, 356 days each (~71 a year). Minimum: the 17th Lok Sabha, 274 days (55 a year)." },
  ],
};

// ---------- Final challenge ----------
export const FINAL = [
  { id: "fc1", type: "mcq", q: "MLAs are members of which house?", opts: ["Lok Sabha", "Rajya Sabha", "Vidhan Sabha", "Vidhan Parishad only"], a: 2, teach: "MLA = Member of Legislative Assembly. The Legislative Assembly is the Vidhan Sabha." },
  { id: "fc2", type: "sort", q: "Tap each subject, then tap its list.", items: [["Railways", "Union"], ["Police", "State"], ["Marriage & Divorce", "Concurrent"], ["Atomic Energy", "Union"], ["Public Health", "State"], ["Criminal Laws", "Concurrent"]], teach: "Union = national importance (Railways, Atomic Energy). State = local/regional (Police, Public Health). Concurrent = both can legislate (Marriage & divorce, Criminal Laws)." },
  { id: "fc3", type: "tf", q: "The Governor of a state is elected by an electoral college.", a: false, teach: "The President is elected by an electoral college. The Governor is APPOINTED by the President." },
  { id: "fc4", type: "sequence", q: "Put the steps in order — from election to a working state government.", items: ["State Legislative Assembly elections are held", "A party or coalition wins the majority in the Vidhan Sabha", "Its leader becomes the Chief Minister", "The CM selects the Council of Ministers", "The Council stays in office only while it has the confidence of the majority of MLAs"], teach: "Elections → majority in Vidhan Sabha → its leader becomes CM → CM selects Council of Ministers → collective responsibility to the Assembly." },
  { id: "fc5", type: "mcq", q: "The state government loses the confidence of the majority of MLAs. What must happen?", opts: ["The Governor resigns", "Only the CM resigns", "The CM and the Council of Ministers resign", "The High Court takes over"], a: 2, teach: "Collective responsibility: the CM and Council of Ministers are responsible together to the Legislative Assembly, so they resign together." },
  { id: "fc6", type: "match", q: "Match each Union post or body to its state twin.", pairs: [["Prime Minister", "Chief Minister"], ["Rajya Sabha", "Vidhan Parishad"], ["Supreme Court", "High Courts"], ["Lok Sabha", "Vidhan Sabha"]], teach: "PM ↔ CM, Rajya Sabha ↔ Vidhan Parishad, Supreme Court ↔ High Courts, Lok Sabha ↔ Vidhan Sabha." },
  { id: "fc7", type: "mcq", q: "Which of these is NOT a bicameral state?", opts: ["Maharashtra", "Uttar Pradesh", "West Bengal", "Andhra Pradesh"], a: 2, teach: "The six bicameral states: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh. West Bengal isn't on the list." },
  { id: "fc8", type: "mcq", q: "The RTE Act, 2009 applies across India because…", opts: ["Education is on the State List", "It was enacted by Parliament and central law prevails on Concurrent subjects", "Every Governor signed it", "The High Courts ordered it"], a: 1, teach: "Education is a Concurrent subject. Parliament enacted the RTE Act, and on a conflict the central law prevails." },
  { id: "fc9", type: "tf", q: "In a state, Money Bills can originate in the Vidhan Parishad.", a: false, teach: "Money Bills originate only in the Vidhan Sabha (just as at the Union level they originate only in the Lok Sabha)." },
  { id: "fc10", type: "mcq", q: "Which session is NOT one of Parliament's three main sessions?", opts: ["Budget Session", "Summer Session", "Monsoon Session", "Winter Session"], a: 1, teach: "The three sessions are Budget, Monsoon and Winter. There's no 'Summer Session' in the chapter." },
  { id: "fc11", type: "mcq", q: "'Many Bills are passed without detailed discussion.' Which challenge is this?", opts: ["Criminalisation of politics", "Insufficient scrutiny of Bills", "Influence of lobbying", "Absent legislators"], a: 1, teach: "Insufficient scrutiny of Bills = passing Bills without detailed discussion." },
  { id: "fc12", type: "mcq", q: "The 17th Lok Sabha had 274 sitting days. The 13th had 356. How many fewer did the 17th have?", opts: ["72", "82", "92", "25"], a: 1, teach: "356 − 274 = 82 fewer sitting days." },
  { id: "fc13", type: "tf", q: "Personal attacks and sloganeering lead to poor-quality debates.", a: true, teach: "Yes — the chapter links personal attacks and sloganeering directly to poor-quality debates." },
  { id: "fc14", type: "mcq", q: "A cartoon jokes that the Monsoon Session brings 'thunder, lightning, storms'. What is it doing?", opts: ["Reporting the weather", "Using satire to criticise disruptions in Parliament", "Advertising a holiday", "Explaining the Budget"], a: 1, teach: "Media raises public concerns through cartoons with humour and satire — a common feature of healthy democracies." },
];
