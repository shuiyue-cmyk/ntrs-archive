const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(p, 'utf8');
let j;
try { j = JSON.parse(raw); console.log('JSON.parse: OK'); } catch (e) { console.log('JSON.parse FAIL:', e.message); process.exit(1); }
console.log('top-level array:', Array.isArray(j), 'first char:', JSON.stringify(raw.trimStart()[0]));
console.log('plotTasks:', j[0].plotTasks.length, 'fsd len:', j[0].finalSystemDirective.length);
function count(s, sub) { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) !== -1) n++; return n; }
const blob = JSON.stringify(j);
const olds = [
  ['A1 OLD 刷新成功=接下来的场景中有出现的可能', '刷新成功 = 接下来的场景中有出现的可能'],
  ['A2/A3 OLD 线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合', '线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合'],
  ['A8 OLD 落实对象线闭合场景', '黄毛胜·终局落实对象线闭合场景'],
  ['A9 OLD 则线闭合锁定', '黄毛胜/黄毛败则线闭合锁定'],
  ['A10 OLD 对象嫁黄毛、线闭合', '黄毛胜·终局：对象嫁黄毛、线闭合'],
  ['A15 OLD 只能 📹 事后知情或 🌙 完全不知）', '只能 📹 事后知情或 🌙 完全不知）'],
  ['A16 OLD 标注"竞争者·[五型]·雄竞期"', '标注"竞争者·[五型]·雄竞期"'],
  ['A17 OLD no-act 时下游 stage3 走快速通道（跳过导演分析', 'no-act 时下游 stage3 走快速通道（跳过导演分析'],
];
console.log('--- OLD residual scan (expect 0) ---');
let allOldGone = true;
for (const [n, o] of olds) { const c = count(blob, o); if (c > 0) allOldGone = false; console.log((c === 0 ? 'GONE ' : 'LEAK ') + n + ': ' + c); }
const news = [
  ['A1 NEW 本轮黄毛能否进入', '本轮黄毛能否进入 {{user}} 当前场景画面'],
  ['A2 NEW 线锁定非闭合', '线锁定非闭合'],
  ['A8 NEW 落实线锁定场景', '落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续）'],
  ['A9 NEW 黄毛败则线闭合（黄毛退居朋友位）', '黄毛败则线闭合（黄毛退居朋友位）'],
  ['A10 NEW 线锁定非闭合**（黄毛仍追踪', '线锁定非闭合**（黄毛仍追踪'],
  ['A15 NEW 📹 事后知情=事后得知', '📹 事后知情=事后得知'],
  ['A16 NEW 以剧情语言写', '以剧情语言写"追求者/情敌'],
  ['A17 NEW 附一行该对象的日常互动', '附一行该对象的日常互动（朋友级）'],
];
console.log('--- NEW presence scan (expect >=1) ---');
let allNewPresent = true;
for (const [n, o] of news) { const c = count(blob, o); if (c === 0) allNewPresent = false; console.log((c > 0 ? 'PRESENT ' : 'MISSING ') + n + ': ' + c); }
console.log('OLD all gone:', allOldGone, '| NEW all present:', allNewPresent);
