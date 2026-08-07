const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';

// ---- load, keep ORIGINAL top-level j (array), do NOT unwrap ----
const raw0 = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw0);
if (!Array.isArray(j) || !raw0.trim().startsWith('[')) throw new Error('top-level not array');

const p = j[0];

// build list of [obj, key] property references for IN-PLACE edits
const refs = [];
for (const t of p.plotTasks || []) {
  if (typeof t.description === 'string') refs.push([t, 'description']);
  for (const m of t.promptGroup || []) {
    if (m && typeof m.content === 'string') refs.push([m, 'content']);
  }
}
if (typeof p.finalSystemDirective === 'string') refs.push([p, 'finalSystemDirective']);

// ---- replacement pairs: [label, old, new, expectedHits] ----
const pairs = [
  ['B1', '仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）',
          '仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）', 1],
  ['B2', '属 📹 事后知情或 🌙 完全不知的暗线戏',
          '属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）', 1],
  ['B3-1', '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增',
           '- 锁定指令：锁定 [新增目标名] / 锁定 [目标A, 目标B]（多目标同时跃迁时逗号分隔） / 维持背景板 [目标名] / 无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）', 1],
  ['B3-2', '黄毛人设（会经 FSD 给花火·正文）',
           '黄毛人设（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）', 1],
  ['B4', '上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）',
          '上轮阶段名 + 上轮%：（以 黄毛表 progress_percent 为准；无表行则首轮基线 0%/忠诚型，概览/前文仅作校验）', 1],
  ['B5', '判断该黄毛本轮是否可行动（合理→spawn，不合理→no_spawn',
          '判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn', 1],
  ['B7-1', 'thugSpawn 状态=spawn 且锁定目标列表非空（至少一个目标已真正锁定）→ 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。',
           '', 0], // expected 0: already applied
  ['B7-2', 'thugSpawn 状态=spawn 且锁定目标列表为空（所有目标均仅背景板，即 {{user}}-所有目标均尚未亲密）→ 黄毛**必须**写入 prologue 登场角色名单（标注"潜在黄毛[未锁定·背景板]"），篇幅压缩为一行（身份+在场姿态）',
           '', 0], // expected 0: already applied
  ['B9-1', 'After <thugAction>, output ONE tag: <userCalib>',
           'After <thugActionReason>, output ONE tag: <userCalib>', 1],
  ['B9-2', '紧接在 <thugAction> 之后',
           '紧接在 <thugActionReason> 之后', 1],
  ['B10', 'thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。',
          'thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）', 1],
];

// ---- count + apply IN PLACE via [obj, key] property references ----
const report = [];
let anyApplied = false;
for (const [label, old, next, expected] of pairs) {
  let total = 0;
  for (const [o, k] of refs) {
    const s = o[k];
    const cnt = s.split(old).length - 1;
    if (cnt > 0) {
      o[k] = s.split(old).join(next);
      total += cnt;
    }
  }
  report.push({ label, old, next, hits: total, expected });
  if (total > 0) anyApplied = true;
}

console.log('=== hit counts (applied in place) ===');
for (const r of report) console.log(r.label + ': hits=' + r.hits + ' expected=' + r.expected);

// ---- write back: only if JSON.parse OK and raw starts with '[' ----
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws if invalid
if (!out.trim().startsWith('[')) throw new Error('output not array top-level');
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE ' + out.length + ' bytes, applied=' + anyApplied);

// ---- verify: re-read ----
const rawV = fs.readFileSync(path, 'utf8');
const jv = JSON.parse(rawV);
console.log('VERIFY top-level array:', Array.isArray(jv), 'starts-with-[ :', rawV.trim().startsWith('['));
console.log('VERIFY name:', jv[0].name);
for (const r of report) {
  const residual = rawV.split(r.old).length - 1;
  const present = r.next ? rawV.split(r.next).length - 1 : 0;
  console.log('VERIFY ' + r.label + ': residual=' + residual + ' newPresent=' + present);
}
