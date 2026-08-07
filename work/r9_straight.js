// R9 fix: Cirno_BATTLE_Turn_straight.json (pure-rivalry straight)
// Part A items: A1, A2 (covers A3 - same single line), A8, A9, A10, A15 (pure-rivalry variant), A16, A17
// NTRS-suffix (A4-A7) and FT/DEI-specific (A11-A14) skipped per task scope.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';

const raw0 = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw0); // keep ORIGINAL top-level j; do NOT unwrap
if (!Array.isArray(j) || !raw0.trimStart().startsWith('[')) {
  console.error('ABORT: top level is not an array');
  process.exit(1);
}
const o = j[0];

// [old, new] pairs - OLD byte-for-byte from CURRENT file, NEW per spec
const pairs = [
  ['A1', `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）`,
         `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn**，不空刷新）`],
  ['A2/A3', ` * 线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定`,
         ` * 线状态=黄毛败·友好 → 线闭合，黄毛不再行动判定（胜负确认轮例外见触发规则）；线状态=黄毛胜·终局 → 线锁定非闭合，黄毛仍按追踪判定互动（夫妻级亲密戏可持续）`],
  ['A8', `黄毛胜·终局落实对象线闭合场景`,
         `黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续）`],
  ['A9', `黄毛胜/黄毛败则线闭合锁定`,
         `黄毛胜则线锁定（非闭合，夫妻戏可持续）；黄毛败则线闭合（黄毛退居朋友位）`],
  ['A10', `黄毛胜·终局：对象嫁黄毛、线闭合`,
         `黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**（黄毛仍追踪、夫妻戏可持续）`],
  ['A15', `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
         `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知——📹 事后知情=事后得知，🌙=事后也不知情）`],
  ['A16', `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。`,
         `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（名单标注为内部调度，以剧情语言写"追求者/情敌·[外貌气质]"，prologue 正文不得出现"竞争者/雄竞期/五型"等系统术语）。`],
  ['A17', `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
         `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进；**若场上存在已闭合（黄毛败·友好）对象，快速通道 prologue 附一行该对象的日常互动（朋友级）**）。`],
];

// Collect all mutable string fields: promptGroup[].content, task.description, finalSystemDirective
const fields = [];
for (const t of o.plotTasks || []) {
  if (t && typeof t.description === 'string') fields.push({ label: `${t.id}.description`, get: () => t.description, set: (v) => { t.description = v; } });
  for (let i = 0; i < (t.promptGroup || []).length; i++) {
    const msg = t.promptGroup[i];
    if (msg && typeof msg.content === 'string') {
      const idx = i;
      fields.push({ label: `${t.id}.promptGroup[${idx}]`, get: () => msg.content, set: (v) => { msg.content = v; } });
    }
  }
}
if (typeof o.finalSystemDirective === 'string') fields.push({ label: 'finalSystemDirective', get: () => o.finalSystemDirective, set: (v) => { o.finalSystemDirective = v; } });

console.log('string fields:', fields.length);

let total = 0;
for (const [tag, oldS, newS] of pairs) {
  let hits = 0;
  for (const f of fields) {
    const cur = f.get();
    let idx = -1;
    while ((idx = cur.indexOf(oldS, idx + 1)) !== -1) hits++;
    if (hits_has(cur, oldS)) { /* counted above */ }
  }
  // simpler recount
  hits = 0;
  for (const f of fields) hits += countOf(f.get(), oldS);
  if (hits > 0) {
    for (const f of fields) {
      const cur = f.get();
      if (cur.includes(oldS)) f.set(cur.split(oldS).join(newS));
    }
  }
  total += hits;
  console.log(`${tag}: ${hits} hit(s) -> ${hits > 0 ? 'APPLIED' : 'SKIPPED(0)'}`);
}

function countOf(s, sub) {
  let n = 0, i = -1;
  while ((i = s.indexOf(sub, i + 1)) !== -1) n++;
  return n;
}
function hits_has() { return false; }

console.log('total replacements:', total);

// Write back ONLY if JSON.parse OK AND raw starts with '['
const out = JSON.stringify(j, null, 2);
if (!out.startsWith('[')) { console.error('ABORT: serialized output does not start with ['); process.exit(1); }
JSON.parse(out); // throws if invalid
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN', path);
