// R9 PART B fix: Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json
// B1, B2, B3, B4, B5, B7, B9, B10 — in-place via obj[key] refs.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

if (!raw.trim().startsWith('[')) {
  console.error('ABORT: raw does not start with [');
  process.exit(1);
}
const j = JSON.parse(raw); // keep ORIGINAL top-level j
const p = Array.isArray(j) ? j[0] : j;

// [old, new] pairs — OLD byte-exact from current file (probe-verified)
const pairs = [
  // B1 — 快速通道 prologue 行附背景板浅度出场句
  [
    `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  ],
  // B2 — 场景外 act 知情度 41% 门槛
  [
    `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  ],
  // B3a — 锁定指令行加调度注（ALLin 版）
  [
    `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增`,
    `- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  ],
  // B3b — FSD 调度字段说明（按本版实际句追加）
  [
    `（会经 FSD 给花火·正文）；理由必须放在紧随其后的`,
    `（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）；理由必须放在紧随其后的`,
  ],
  // B4 — 上轮%权威源改为黄毛表 progress_percent（本版实际措辞）
  [
    `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  ],
  // B5 — 判定措辞 可行动→在场/出场是否合理（ALLin 版，保留后续子句）
  [
    `判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn；`,
    `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn；`,
  ],
  // B7a — 锁定目标列表非空 → 锁定状态字段=真正锁定
  [
    `  - thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
    `  - thugSpawn 状态=spawn 且锁定状态字段=真正锁定（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
  ],
  // B7b — 锁定目标列表为空 → 锁定状态字段=仅背景板
  [
    `  - thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
    `  - thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）`,
  ],
  // B9a — userCalib 位置指令 After <thugAction> → <thugActionReason>
  [
    `After <thugAction>, output ONE tag: <userCalib>`,
    `After <thugActionReason>, output ONE tag: <userCalib>`,
  ],
  // B9b — OUTPUT FORMAT 变体
  [
    `OUTPUT FORMAT (单标签，紧接在 <thugAction> 之后)`,
    `OUTPUT FORMAT (单标签，紧接在 <thugActionReason> 之后)`,
  ],
  // B10 — 锁定状态 vs 锁定指令 双词汇补注
  [
    `锁定状态（真正锁定/仅背景板登场）`,
    `锁定状态（真正锁定/仅背景板登场；thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
  ],
];

function countAll(hay, needle) {
  let c = 0, idx = -1;
  while ((idx = hay.indexOf(needle, idx + 1)) !== -1) c++;
  return c;
}

// Collect every target string reference (in-place via obj[key])
const targets = [];
for (const t of (p.plotTasks || [])) {
  if (typeof t.description === 'string') targets.push({ ref: () => t.description, set: (v) => { t.description = v; } });
  for (const m of (t.promptGroup || [])) {
    if (typeof m.content === 'string') targets.push({ ref: () => m.content, set: (v) => { m.content = v; } });
  }
}
if (typeof p.finalSystemDirective === 'string') targets.push({ ref: () => p.finalSystemDirective, set: (v) => { p.finalSystemDirective = v; } });

// Pre-check counts across all target strings (before any edit)
console.log('=== PRE-CHECK (counts over all target strings) ===');
const pre = pairs.map(([old, neww], i) => {
  const c = targets.reduce((acc, t) => acc + countAll(t.ref(), old), 0);
  console.log(`B-pair #${i + 1}: hits=${c}`);
  return c;
});

// Apply in place
let totalReplaced = 0;
pairs.forEach(([old, neww], i) => {
  let n = 0;
  for (const t of targets) {
    const cur = t.ref();
    if (cur.includes(old)) {
      const rep = cur.split(old).join(neww);
      const occ = cur.split(old).length - 1;
      n += occ;
      t.set(rep);
    }
  }
  console.log(`B-pair #${i + 1}: replaced=${n}`);
  totalReplaced += n;
});
console.log('total replaced:', totalReplaced);

// Write back ONLY if JSON parses and raw starts with '['
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws if broken
if (!out.trim().startsWith('[')) { console.error('ABORT: output does not start with ['); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE file OK, bytes:', out.length);

// === VERIFY: re-read ===
const raw2 = fs.readFileSync(path, 'utf8');
console.log('\n=== VERIFY (re-read) ===');
console.log('starts with [:', raw2.trim().startsWith('['));
const j2 = JSON.parse(raw2);
console.log('top-level array:', Array.isArray(j2));
const p2 = Array.isArray(j2) ? j2[0] : j2;
const parts = [];
for (const t of (p2.plotTasks || [])) {
  if (t.description) parts.push(t.description);
  for (const m of (t.promptGroup || [])) if (typeof m.content === 'string') parts.push(m.content);
}
parts.push(p2.finalSystemDirective || '');
const blob2 = parts.join('\n===MSG-BOUNDARY===\n');

console.log('--- OLD residual (must be 0) ---');
const oldKeys = [
  ['B1', `行文不少于 15 字）\n- stage / cast / plot：整块省略`],
  ['B2', `完全不知的暗线戏），prologue 不把该戏`],
  ['B3', `维持背景板 [目标名] / 无新增\n`],
  ['B4', `（从概览/前文/上轮 stage 读；没有则写「首轮基线」`],
  ['B5', `判断该黄毛本轮是否可行动（合理→`],
  ['B7a', `锁定目标列表非空`],
  ['B7b', `锁定目标列表为空`],
  ['B9a', `After <thugAction>, output ONE tag: <userCalib>`],
  ['B9b', `紧接在 <thugAction> 之后`],
];
for (const [k, o] of oldKeys) console.log(`  ${k}: ${countAll(blob2, o)}`);

console.log('--- NEW present (must be >=1) ---');
const newKeys = [
  ['B1', `若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场`],
  ['B2', `📹 事后知情仅限察觉型 41% 起的目标`],
  ['B3a', `无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3b', `刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可`],
  ['B4', `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准`],
  ['B5', `判断该黄毛本轮在场/出场是否合理（合理→`],
  ['B7a', `锁定状态字段=真正锁定`],
  ['B7b', `锁定状态字段=仅背景板`],
  ['B9a', `After <thugActionReason>, output ONE tag: <userCalib>`],
  ['B9b', `紧接在 <thugActionReason> 之后`],
  ['B10', `「锁定指令：锁定/维持背景板」为同义调度行`],
];
for (const [k, n] of newKeys) console.log(`  ${k}: ${countAll(blob2, n)}`);

// spec residual scan phrases
console.log('--- spec residual scan ---');
for (const s of ['锁定目标列表非空', '锁定目标列表为空', '判断该黄毛本轮是否可行动']) {
  console.log(`  [${s}]: ${countAll(JSON.stringify(j2), s)}`);
}
