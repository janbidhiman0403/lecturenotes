import { useState, useEffect, useRef } from "react";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const SAMPLE_LECTURES = [
  {
    id: 1,
    title: "Lecture 10/05/2026 15:45:37",
    date: "10/05/2026",
    status: "completed",
    classroomId: "daa",
    summary: `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn. It enables computers to perform tasks like reasoning, learning, and problem-solving across healthcare, finance, education, and transportation.`,
    summaryBullets: [
      "AI enables machines to mimic human cognitive functions",
      "Subfields include Machine Learning, Deep Learning, NLP, and Computer Vision",
      "Applications: healthcare diagnosis, autonomous vehicles, chatbots, fraud detection",
      "ML Types: Supervised, Unsupervised, Reinforcement Learning",
      "Advantages: 24/7 availability, reduced human error, handles big data",
      "Disadvantages: Job displacement, high implementation cost, lacks emotion, ethical bias, privacy risks",
    ],
    mindmap: {
      center: "Artificial Intelligence",
      branches: [
        { label: "Deep Learning", color: "#f59e0b", children: ["Facial Recognition", "Chatbots", "Image Classification"] },
        { label: "ML Types", color: "#f59e0b", children: ["Supervised", "Unsupervised", "Reinforcement"] },
        { label: "Advantages", color: "#22c55e", children: ["24/7 Availability", "Reduced Errors", "Big Data"] },
        { label: "Disadvantages", color: "#ef4444", children: ["Job Displacement", "High Cost", "Ethical Bias", "Privacy Risks"] },
        { label: "Applications", color: "#8b5cf6", children: ["Healthcare", "Finance", "Education"] },
      ],
    },
    diagramNodes: [
      { id: "A", label: "Artificial Intelligence", level: 0 },
      { id: "B", label: "Machine Learning", level: 1, parent: "A" },
      { id: "C", label: "Deep Learning", level: 1, parent: "A" },
      { id: "D", label: "NLP", level: 1, parent: "A" },
      { id: "E", label: "Supervised", level: 2, parent: "B" },
      { id: "F", label: "Unsupervised", level: 2, parent: "B" },
      { id: "G", label: "Reinforcement", level: 2, parent: "B" },
      { id: "H", label: "Neural Networks", level: 2, parent: "C" },
      { id: "I", label: "Facial Recognition", level: 3, parent: "H" },
      { id: "J", label: "Chatbots", level: 3, parent: "H" },
    ],
    transcript: `Below is the accurate transcription of the lecture on Artificial Intelligence (AI):

"Dear students, welcome. In today's lecture, we are going to explore Artificial Intelligence — what it is, how it works, and where it's being used. AI refers to the simulation of human intelligence in machines programmed to think and act like humans.

### What is Artificial Intelligence?
AI is the branch of computer science that focuses on building smart machines capable of performing tasks that typically require human intelligence. These include learning, reasoning, problem-solving, perceiving, and language understanding.

### Types of Machine Learning:
*  **Supervised Learning:** The model learns from labeled data. Example: classifying emails as spam.
*  **Unsupervised Learning:** The model finds hidden patterns in unlabeled data. Example: customer clustering.
*  **Reinforcement Learning:** The model learns by trial and error, receiving rewards. Example: AlphaGo.

### Deep Learning:
Deep Learning uses multi-layered neural networks to model complex patterns. It powers:
*  Facial Recognition systems
*  Voice assistants like Siri and Alexa
*  Autonomous vehicles

### Advantages of AI:
*  Available 24/7 without fatigue
*  Reduces human error in repetitive tasks
*  Processes massive datasets quickly

### Disadvantages of AI:
*  **Job Displacement:** Automation replaces human workers
*  **High Cost:** Development and maintenance is expensive
*  **Lack of Emotion:** AI cannot replicate human empathy
*  **Ethical Bias:** AI trained on biased data perpetuates discrimination
*  **Privacy Risks:** AI-powered surveillance raises serious concerns"`,
  },
  {
    id: 2,
    title: "Lecture 10/05/2026 12:56:17",
    date: "10/05/2026",
    status: "completed",
    classroomId: "daa",
    summary: `This lecture provides an overview of Artificial Intelligence (AI) as a branch of computer science that enables machines to emulate human cognitive processes including learning and reasoning.`,
    summaryBullets: [
      "AI defined as machines simulating human thought",
      "Core areas: perception, reasoning, learning, language",
      "Historical development from Turing Test to modern LLMs",
    ],
    mindmap: {
      center: "AI Overview",
      branches: [
        { label: "History", color: "#f59e0b", children: ["Turing Test", "Expert Systems", "Deep Learning Era"] },
        { label: "Core Areas", color: "#22c55e", children: ["Perception", "Reasoning", "Learning", "Language"] },
      ],
    },
    diagramNodes: [],
    transcript: `Transcript of AI Overview lecture — covers historical development from the Turing Test in 1950 through expert systems in the 1980s to the modern deep learning era powered by large datasets and GPUs...`,
  },
  {
    id: 3,
    title: "Lecture 29/04/2026 21:34:03",
    date: "29/04/2026",
    status: "completed",
    classroomId: "daa",
    summary: `This lecture introduces Database Management Systems (DBMS) as a framework for managing and storing data. It emphasizes the use of structured query language and relational models.`,
    summaryBullets: [
      "DBMS: software for creating and managing databases",
      "Relational model: tables, rows, columns",
      "SQL: SELECT, INSERT, UPDATE, DELETE",
      "ACID properties ensure data integrity",
      "Types: Relational, NoSQL, NewSQL",
    ],
    mindmap: {
      center: "DBMS",
      branches: [
        { label: "Types", color: "#f59e0b", children: ["Relational", "NoSQL", "NewSQL"] },
        { label: "SQL", color: "#22c55e", children: ["SELECT", "INSERT", "UPDATE", "DELETE"] },
        { label: "ACID", color: "#8b5cf6", children: ["Atomicity", "Consistency", "Isolation", "Durability"] },
      ],
    },
    diagramNodes: [],
    transcript: `Transcript of DBMS lecture — introduces relational databases, SQL syntax, normalization (1NF, 2NF, 3NF), and practical examples using SQLite and PostgreSQL...`,
  },
];

const INITIAL_CLASSROOMS = [
  { id: "daa", name: "daa" },
  { id: "ai", name: "AI" },
];

// ─── SVG ICON ────────────────────────────────────────────────────────────────
function Ico({ path, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

const P = {
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus: "M12 5v14 M5 12h14",
  mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  cal: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  map: "M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M12 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M4 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M20 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M12 6v4 M12 14v4 M6 11h4 M14 11h4",
  dia: "M3 3h6v6H3z M15 3h6v6h-6z M9 15h6v6H9z M6 9v6 M18 9v3h-3",
  back: "M19 12H5 M12 19l-7-7 7-7",
  rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;--sb:#0d0d18;--card:#13131f;--card2:#18182a;--inp:#1a1a2c;
  --act:#1c1c34;--bdr:#252538;--bdr2:#30305a;
  --t1:#e8e8f2;--t2:#8888aa;--tm:#50506a;
  --acc:#4f6ef7;--acc2:#6080ff;--adim:#1a2060;
  --grn:#22c55e;--gdim:#0f3320;--amb:#f59e0b;--red:#ef4444;--pur:#8b5cf6;
  --sw:240px;--hh:56px
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh}
.app{display:flex;height:100vh;overflow:hidden}
/* sidebar */
.sb{width:var(--sw);background:var(--sb);border-right:1px solid var(--bdr);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.sb-logo{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid var(--bdr)}
.logo-ico{width:36px;height:36px;background:var(--acc);border-radius:10px;display:flex;align-items:center;justify-content:center}
.logo-n{font-weight:700;font-size:15px;letter-spacing:-0.3px}
.logo-r{font-size:10px;color:var(--tm);text-transform:uppercase;letter-spacing:1px;margin-top:1px}
.sb-sec{padding:6px 0}
.sb-lbl{font-size:10px;color:var(--tm);text-transform:uppercase;letter-spacing:1.2px;padding:8px 14px 4px;font-weight:600;display:flex;align-items:center;justify-content:space-between;padding-right:10px}
.sb-item{display:flex;align-items:center;gap:9px;padding:8px 14px;font-size:13.5px;color:var(--t2);cursor:pointer;transition:all .15s;user-select:none}
.sb-item:hover{color:var(--t1);background:var(--act)}
.sb-item.on{color:var(--t1);background:var(--act);border-left:2px solid var(--acc)}
.sb-foot{margin-top:auto;border-top:1px solid var(--bdr);padding:12px 14px;display:flex;align-items:center;gap:10px}
.av{width:30px;height:30px;background:var(--acc);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;flex-shrink:0}
.un{font-size:12.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ue{font-size:11px;color:var(--tm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{height:var(--hh);border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:12px;padding:0 20px;flex-shrink:0;background:var(--sb)}
.sbox{flex:1;max-width:480px;display:flex;align-items:center;gap:8px;background:var(--inp);border:1px solid var(--bdr);border-radius:8px;padding:7px 12px;color:var(--tm);font-size:13px}
.sbox input{background:transparent;border:none;outline:none;color:var(--t2);font-size:13px;width:100%;font-family:inherit}
.ta{margin-left:auto;display:flex;align-items:center;gap:10px}
.btn{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:inherit}
.bp{background:var(--acc);color:#fff}.bp:hover{background:var(--acc2)}
.bg{background:transparent;color:var(--t2);border:1px solid var(--bdr)}.bg:hover{color:var(--t1);border-color:var(--bdr2)}
.bsm{padding:5px 10px;font-size:12px}
.ib{background:transparent;border:none;cursor:pointer;color:var(--t2);display:flex;align-items:center;justify-content:center;padding:6px;border-radius:6px;transition:all .15s}.ib:hover{color:var(--t1);background:var(--inp)}
.content{flex:1;overflow-y:auto;padding:24px}
/* page */
.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px}
.pt{font-size:24px;font-weight:700;letter-spacing:-0.5px}
.ps{font-size:13px;color:var(--tm);margin-top:3px}
.vtog{display:flex;gap:4px;background:var(--card);border:1px solid var(--bdr);border-radius:8px;padding:3px}
.vb{padding:4px 10px;border-radius:5px;font-size:12px;cursor:pointer;border:none;background:transparent;color:var(--tm);font-family:inherit;transition:all .15s}
.vb.on{background:var(--act);color:var(--t1)}
/* grid */
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.lcard{background:var(--card);border:1px solid var(--bdr);border-radius:12px;padding:18px;cursor:pointer;transition:all .2s}
.lcard:hover{border-color:var(--bdr2);background:var(--card2);transform:translateY(-1px)}
.cmeta{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--tm);margin-bottom:4px}
.cico{width:38px;height:38px;background:var(--gdim);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--grn)}
.ctit{font-size:14.5px;font-weight:600;margin:8px 0 6px;letter-spacing:-0.2px}
.cpre{font-size:12.5px;color:var(--tm);line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.ctags{display:flex;gap:6px;margin-top:14px;flex-wrap:wrap;align-items:center}
.tag{font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:4px;letter-spacing:.5px}
.tb{background:var(--adim);color:var(--acc)}
.sb2{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;padding:2px 7px;border-radius:4px}
.sc{background:var(--gdim);color:var(--grn)}
.sp{background:#1a1500;color:var(--amb)}
/* list */
.llist{display:flex;flex-direction:column;gap:10px}
.lli{background:var(--card);border:1px solid var(--bdr);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .15s}
.lli:hover{border-color:var(--bdr2);background:var(--card2)}
/* detail */
.dback{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--tm);cursor:pointer;margin-bottom:20px;transition:color .15s;background:none;border:none;font-family:inherit}
.dback:hover{color:var(--t1)}
.dcard{background:var(--card);border:1px solid var(--bdr);border-radius:14px;overflow:hidden}
.dhead{padding:18px 22px;display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--bdr)}
.dtit{font-size:16px;font-weight:600}
.ddat{font-size:12px;color:var(--tm);display:flex;align-items:center;gap:5px;margin-top:3px}
.dclock{width:38px;height:38px;background:var(--adim);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--acc);flex-shrink:0}
/* tabs */
.tabs{display:flex;border-bottom:1px solid var(--bdr);padding:0 22px;overflow-x:auto}
.tab{display:flex;align-items:center;gap:7px;padding:13px 0;margin-right:28px;font-size:13px;color:var(--t2);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}
.tab:hover{color:var(--t1)}
.tab.on{color:var(--acc);border-bottom-color:var(--acc)}
.tc{padding:22px}
/* summary */
.sp2{font-size:13.5px;line-height:1.7;color:var(--t2);margin-bottom:16px}
.buls{list-style:none;display:flex;flex-direction:column;gap:8px}
.buls li{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:var(--t2);line-height:1.5}
.bd{width:6px;height:6px;background:var(--acc);border-radius:50%;margin-top:7px;flex-shrink:0}
/* mindmap */
.mmcont{width:100%;overflow:auto}
/* diagram */
.dflow{display:flex;flex-direction:column;align-items:center;gap:0;padding:20px}
.fnode{background:#1a3060;border:1px solid #2563eb;color:#93c5fd;padding:10px 20px;border-radius:6px;font-size:12.5px;font-weight:500;text-align:center;min-width:150px}
.fconn{width:2px;height:18px;background:var(--bdr2)}
.frow{display:flex;gap:12px;align-items:flex-start}
.fbranch{display:flex;flex-direction:column;align-items:center;gap:0}
/* transcript */
.ttext{font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.85;color:var(--t2);white-space:pre-wrap;word-break:break-word}
/* recording */
.recov{position:fixed;inset:0;background:rgba(0,0,0,.72);display:flex;align-items:flex-start;justify-content:center;z-index:50;padding-top:60px;backdrop-filter:blur(2px)}
.recin{display:flex;flex-direction:column;align-items:center;gap:20px}
.recback{cursor:pointer;color:var(--tm);font-size:13px;display:flex;align-items:center;gap:6px;transition:color .15s;background:none;border:none;font-family:inherit}
.recback:hover{color:var(--t1)}
.recbox{background:var(--card);border:1px solid var(--bdr);border-radius:16px;padding:36px 48px;min-width:360px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.reclbl{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--tm)}
.recspin{width:52px;height:52px;border:3px solid var(--bdr);border-top-color:var(--acc);border-radius:50%;animation:spin .9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.recstat{font-size:18px;font-weight:600}
.recsub{font-size:12.5px;color:var(--tm)}
.rectimer{font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:600;letter-spacing:3px}
.pulse{width:12px;height:12px;background:var(--red);border-radius:50%;animation:pl 1.2s ease-in-out infinite}
@keyframes pl{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
/* modal */
.mov{position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:flex-start;justify-content:center;z-index:50;padding-top:80px;backdrop-filter:blur(2px)}
.mbox{background:var(--card);border:1px solid var(--bdr);border-radius:16px;padding:28px 32px;width:340px}
.mtrow{display:flex;align-items:center;gap:10px;margin-bottom:22px}
.mico{width:36px;height:36px;background:var(--adim);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--acc)}
.mtit{font-size:17px;font-weight:700}
.flbl{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--tm);margin-bottom:8px}
.finp{width:100%;background:var(--inp);border:1px solid var(--bdr);border-radius:8px;padding:11px 14px;font-size:15px;color:var(--t1);font-family:'JetBrains Mono',monospace;letter-spacing:3px;text-align:center;outline:none;transition:border-color .15s}
.finp:focus{border-color:var(--acc)}
.macts{display:flex;flex-direction:column;gap:8px;margin-top:16px}
/* empty */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:60px 20px;color:var(--tm);text-align:center}
/* scrollbar */
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--bdr2)}
@media(max-width:768px){.sb{width:200px}.lgrid{grid-template-columns:1fr}.recbox{min-width:280px;padding:24px 20px}}
`;

// ─── MINDMAP ─────────────────────────────────────────────────────────────────
function Mindmap({ mm }) {
  const cx = 420, cy = 210;
  const br = mm.branches;
  const lines = [], nodes2 = [];

  br.forEach((b, i) => {
    const ang = (i / br.length) * 2 * Math.PI - Math.PI / 2;
    const bx = cx + Math.cos(ang) * 165;
    const by = cy + Math.sin(ang) * 125;
    lines.push(<line key={`bl${i}`} x1={cx} y1={cy} x2={bx} y2={by} stroke={b.color} strokeWidth="1.5" opacity="0.7" />);

    const bw = Math.max(b.label.length * 6.8, 70) + 14;
    nodes2.push(
      <g key={`bn${i}`}>
        <rect x={bx - bw / 2} y={by - 14} width={bw} height={28} rx="5" fill="#1e1e30" stroke={b.color} strokeWidth="1.5" />
        <text x={bx} y={by + 5} textAnchor="middle" fill={b.color} fontSize="11" fontWeight="500" fontFamily="Inter">{b.label}</text>
      </g>
    );

    b.children.forEach((ch, j) => {
      const sp = ((j - (b.children.length - 1) / 2) * 0.38);
      const ca = ang + sp;
      const cx2 = bx + Math.cos(ca) * 115;
      const cy2 = by + Math.sin(ca) * 85;
      lines.push(<line key={`cl${i}${j}`} x1={bx} y1={by} x2={cx2} y2={cy2} stroke={b.color + "66"} strokeWidth="1" />);
      const cw = Math.max(ch.length * 6.2, 55) + 12;
      nodes2.push(
        <g key={`cn${i}${j}`}>
          <rect x={cx2 - cw / 2} y={cy2 - 11} width={cw} height={22} rx="4" fill="#141420" stroke={b.color} strokeWidth="1" />
          <text x={cx2} y={cy2 + 4} textAnchor="middle" fill={b.color} fontSize="10" fontFamily="Inter">{ch}</text>
        </g>
      );
    });
  });

  return (
    <div className="mmcont">
      <svg viewBox="0 0 840 420" style={{ width: "100%", minHeight: 380 }}>
        {lines}
        <circle cx={cx} cy={cy} r={54} fill="#3b5bdb" opacity={0.92} />
        {mm.center.split(" ").map((w, i, arr) => (
          <text key={i} x={cx} y={cy - (arr.length - 1) * 7 + i * 14} textAnchor="middle"
            fill="#fff" fontSize="11.5" fontWeight="600" fontFamily="Inter">{w}</text>
        ))}
        {nodes2}
      </svg>
    </div>
  );
}

// ─── DIAGRAM ──────────────────────────────────────────────────────────────────
function Diagram({ nodes }) {
  if (!nodes || !nodes.length) return <div style={{ color: "var(--tm)", fontSize: 13 }}>No diagram for this lecture.</div>;
  const l0 = nodes.filter(n => n.level === 0);
  const l1 = nodes.filter(n => n.level === 1);

  return (
    <div className="dflow">
      {l0.map(n => (
        <div key={n.id} className="fbranch">
          <div className="fnode" style={{ background: "#1a3a6b", borderColor: "#2563eb", color: "#93c5fd", fontWeight: 700, fontSize: 13 }}>{n.label}</div>
          <div className="fconn" />
        </div>
      ))}
      <div className="frow">
        {l1.map(n => {
          const l2 = nodes.filter(c => c.level === 2 && c.parent === n.id);
          return (
            <div key={n.id} className="fbranch">
              <div className="fnode">{n.label}</div>
              {l2.length > 0 && <>
                <div className="fconn" />
                <div className="frow">
                  {l2.map(c => {
                    const l3 = nodes.filter(c3 => c3.level === 3 && c3.parent === c.id);
                    return (
                      <div key={c.id} className="fbranch">
                        <div className="fnode" style={{ minWidth: 120, fontSize: 11.5 }}>{c.label}</div>
                        {l3.length > 0 && <>
                          <div className="fconn" />
                          <div className="frow">
                            {l3.map(c3 => (
                              <div key={c3.id} className="fnode" style={{ minWidth: 110, fontSize: 11, background: "#1a2e1a", borderColor: "#2d6a2d", color: "#4ade80" }}>{c3.label}</div>
                            ))}
                          </div>
                        </>}
                      </div>
                    );
                  })}
                </div>
              </>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RECORDING ────────────────────────────────────────────────────────────────
function Recording({ onCancel, onFinish }) {
  const [secs, setSecs] = useState(0);
  const [phase, setPhase] = useState("rec");
  const ref = useRef();
  useEffect(() => { ref.current = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(ref.current); }, []);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const launch = () => { clearInterval(ref.current); setPhase("proc"); setTimeout(onFinish, 2500); };
  return (
    <div className="recov">
      <div className="recin">
        <button className="recback" onClick={onCancel}><Ico path={P.back} size={14} /> Cancel recording</button>
        {phase === "rec" ? (
          <div className="recbox">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="pulse" />
              <span style={{ fontSize: 13, color: "var(--red)", fontWeight: 600 }}>Recording</span>
            </div>
            <div className="rectimer">{fmt(secs)}</div>
            <div style={{ fontSize: 12.5, color: "var(--tm)" }}>Speak clearly into your microphone</div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button className="btn bp" onClick={launch}><Ico path={P.rocket} size={14} /> Launch!</button>
              <button className="btn bg" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="recbox">
            <div className="reclbl">AI Processing</div>
            <div className="recspin" />
            <div className="recstat">Transcribing...</div>
            <div className="recsub">Processing audio data</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JOIN MODAL ───────────────────────────────────────────────────────────────
function JoinModal({ onClose, onJoin }) {
  const [code, setCode] = useState("");
  return (
    <div className="mov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div>
        <button className="recback" style={{ marginBottom: 12, justifyContent: "center", width: "100%" }} onClick={onClose}>
          <Ico path={P.back} size={14} /> Back to Dashboard
        </button>
        <div className="mbox">
          <div className="mtrow">
            <div className="mico"><Ico path={P.users} size={18} /></div>
            <div className="mtit">Classroom Manager</div>
          </div>
          <div className="flbl">Classroom Code</div>
          <input className="finp" value={code} onChange={e => setCode(e.target.value.toUpperCase())} maxLength={8} placeholder="ABC123" />
          <div className="macts">
            <button className="btn bp" style={{ justifyContent: "center" }} onClick={() => { if (code.trim()) { onJoin(code.trim()); onClose(); } }}>
              Join Classroom
            </button>
            <button className="btn bg" style={{ justifyContent: "center" }} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LECTURE DETAIL ───────────────────────────────────────────────────────────
function Detail({ lec, onBack }) {
  const [tab, setTab] = useState("summary");
  const tabs = [
    { id: "summary", label: "Summary", ico: P.file },
    { id: "mindmap", label: "Mindmap", ico: P.map },
    { id: "diagrams", label: "Diagrams", ico: P.dia },
    { id: "transcript", label: "Full Transcript", ico: P.file },
  ];
  return (
    <div>
      <button className="dback" onClick={onBack}><Ico path={P.back} size={14} /> Back to Dashboard</button>
      <div className="dcard">
        <div className="dhead">
          <div className="dclock"><Ico path={P.clock} size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="dtit">{lec.title}</div>
            <div className="ddat">
              <Ico path={P.cal} size={12} />{lec.date}
              <span className={`sb2 s${lec.status[0]}`} style={{ marginLeft: 6, background: lec.status === "completed" ? "var(--gdim)" : "#1a1500", color: lec.status === "completed" ? "var(--grn)" : "var(--amb)" }}>{lec.status}</span>
            </div>
          </div>
        </div>
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
              <Ico path={t.ico} size={14} />{t.label}
            </div>
          ))}
        </div>
        <div className="tc">
          {tab === "summary" && (
            <div>
              <p className="sp2">{lec.summary}</p>
              <ul className="buls">{lec.summaryBullets?.map((b, i) => <li key={i}><div className="bd" />{b}</li>)}</ul>
            </div>
          )}
          {tab === "mindmap" && <Mindmap mm={lec.mindmap} />}
          {tab === "diagrams" && <Diagram nodes={lec.diagramNodes} />}
          {tab === "transcript" && <div className="ttext">{lec.transcript}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dash");
  const [selLec, setSelLec] = useState(null);
  const [selRoom, setSelRoom] = useState("personal");
  const [vm, setVm] = useState("grid");
  const [lectures, setLectures] = useState(SAMPLE_LECTURES);
  const [rooms, setRooms] = useState(INITIAL_CLASSROOMS);
  const [showJoin, setShowJoin] = useState(false);
  const [q, setQ] = useState("");

  const filtered = lectures.filter(l => {
    const rm = selRoom === "personal" ? true : l.classroomId === selRoom;
    const sq = !q || l.title.toLowerCase().includes(q.toLowerCase()) || l.summary.toLowerCase().includes(q.toLowerCase());
    return rm && sq;
  });

  const openLec = (l) => { setSelLec(l); setView("detail"); };

  const onFinish = () => {
    const now = new Date();
    const d = now.toLocaleDateString("en-GB");
    const t = now.toLocaleTimeString("en-GB");
    setLectures(p => [{
      id: Date.now(), title: `Lecture ${d} ${t}`, date: d, status: "completed",
      classroomId: selRoom === "personal" ? "personal" : selRoom,
      summary: "New lecture recorded and processed by AI. All study materials have been generated.",
      summaryBullets: ["Recording captured", "AI transcription complete", "Study materials ready"],
      mindmap: { center: "New Lecture", branches: [{ label: "Key Topics", color: "#f59e0b", children: ["Topic A", "Topic B"] }] },
      diagramNodes: [], transcript: "Transcript of the new recording is available here...",
    }, ...p]);
    setView("dash");
  };

  const roomName = selRoom === "personal" ? "Recent Lectures" : (rooms.find(r => r.id === selRoom)?.name || selRoom);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sb">
          <div className="sb-logo">
            <div className="logo-ico"><Ico path={P.book} size={18} /></div>
            <div><div className="logo-n">LectureNotes</div><div className="logo-r">Teacher</div></div>
          </div>
          <div className="sb-sec">
            <div className="sb-lbl">General</div>
            <div className={`sb-item${selRoom === "personal" ? " on" : ""}`} onClick={() => { setSelRoom("personal"); setView("dash"); }}>
              <Ico path={P.grid} size={15} /> Personal Notes
            </div>
          </div>
          <div className="sb-sec">
            <div className="sb-lbl">Classrooms</div>
            {rooms.map(r => (
              <div key={r.id} className={`sb-item${selRoom === r.id ? " on" : ""}`} onClick={() => { setSelRoom(r.id); setView("dash"); }}>
                <Ico path={P.users} size={15} /> {r.name}
              </div>
            ))}
          </div>
          <div className="sb-sec">
            <div className="sb-lbl">
              Subjects
              <button className="ib" style={{ width: 22, height: 22, padding: 3 }} onClick={() => setShowJoin(true)}><Ico path={P.plus} size={13} /></button>
            </div>
          </div>
          <div className="sb-foot">
            <div className="av">J</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="un">Janbi Dhiman</div>
              <div className="ue">dhimanjanbi@gmail.com</div>
            </div>
            <button className="ib" title="Logout"><Ico path={P.logout} size={15} /></button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div className="sbox">
              <Ico path={P.search} size={14} />
              <input placeholder="Search in your notes and lectures..." value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div className="ta">
              <button className="btn bg bsm"><Ico path={P.users} size={14} /> Manage Classes</button>
              <button className="ib"><Ico path={P.bell} size={16} /></button>
              <button className="btn bp" onClick={() => setView("recording")}><Ico path={P.plus} size={14} /> Record Lecture</button>
            </div>
          </header>

          <main className="content">
            {view === "dash" && (
              <>
                <div className="ph">
                  <div><div className="pt">{roomName}</div><div className="ps">Review your AI-powered lecture materials</div></div>
                  <div className="vtog">
                    <button className={`vb${vm === "grid" ? " on" : ""}`} onClick={() => setVm("grid")}>Grid</button>
                    <button className={`vb${vm === "list" ? " on" : ""}`} onClick={() => setVm("list")}>List</button>
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <div className="empty">
                    <Ico path={P.book} size={48} />
                    <div style={{ fontSize: 15, fontWeight: 600 }}>No lectures yet</div>
                    <div style={{ fontSize: 13 }}>Record your first lecture to get started</div>
                    <button className="btn bp" onClick={() => setView("recording")}><Ico path={P.mic} size={14} /> Record Lecture</button>
                  </div>
                ) : vm === "grid" ? (
                  <div className="lgrid">
                    {filtered.map(l => (
                      <div key={l.id} className="lcard" onClick={() => openLec(l)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div className="cico"><Ico path={P.book} size={18} /></div>
                          <div className="cmeta"><Ico path={P.clock} size={11} />{l.date}</div>
                        </div>
                        <div className="ctit">{l.title}</div>
                        <div className="cpre">{l.summary}</div>
                        <div className="ctags">
                          <span className="tag tb">MINDMAP</span>
                          <span className="tag tb">SUMMARY</span>
                          <span className="sb2" style={{ background: l.status === "completed" ? "var(--gdim)" : "#1a1500", color: l.status === "completed" ? "var(--grn)" : "var(--amb)" }}>{l.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="llist">
                    {filtered.map(l => (
                      <div key={l.id} className="lli" onClick={() => openLec(l)}>
                        <div className="cico"><Ico path={P.book} size={18} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{l.title}</div>
                          <div style={{ fontSize: 12, color: "var(--tm)", marginTop: 3 }}>{l.summary.slice(0, 90)}...</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span className="cmeta"><Ico path={P.clock} size={11} />{l.date}</span>
                          <span className="sb2" style={{ background: l.status === "completed" ? "var(--gdim)" : "#1a1500", color: l.status === "completed" ? "var(--grn)" : "var(--amb)" }}>{l.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {view === "detail" && selLec && <Detail lec={selLec} onBack={() => setView("dash")} />}
          </main>
        </div>

        {view === "recording" && <Recording onCancel={() => setView("dash")} onFinish={onFinish} />}
        {showJoin && (
          <JoinModal onClose={() => setShowJoin(false)} onJoin={code => {
            const id = code.toLowerCase();
            setRooms(p => p.find(r => r.id === id) ? p : [...p, { id, name: code }]);
          }} />
        )}

        <button className="ib" style={{ position: "fixed", bottom: 20, right: 20, background: "var(--card)", border: "1px solid var(--bdr)", padding: 10, borderRadius: "50%", zIndex: 40 }}>
          <Ico path={P.settings} size={18} />
        </button>
      </div>
    </>
  );
}
