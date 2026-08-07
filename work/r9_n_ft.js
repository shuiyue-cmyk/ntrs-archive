const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) { console.error('FATAL: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw);
if (!Array.isArray(j) || j.length === 0) { console.error('FATAL: top-level not array'); process.exit(1); }

// [label, old, new]
const pairs = [
  ['B1', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
        `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`],
  ['B2', `属 📹 事后知情或 🌙 完全不知的暗线戏`,
        `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `- 锁定指令：锁定 / 维持背景板`,
        `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3-cond', `（会经 FSD 给花火·正文）；理由必须放在紧随其后的 <thugSpawnReason> 内`,
        `（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）；理由必须放在紧随其后的 <thugSpawnReason> 内`],
  ['B4', `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
        `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`],
  ['B5', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
        `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`],
  ['B8', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
        `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B10', ` - thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
        ` - thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`],
];

function count(s, sub) {
  let n = 0, i = 0;
  while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; }
  return n;
}

// Collect in-place string refs: promptGroup[].content, task.description, j[0].finalSystemDirective
const refList = [];
for (const t of j[0].plotTasks) {
  for (const m of t.promptGroup) if (typeof m.content === 'string') refList.push({ obj: m, key: 'content' });
  if (typeof t.description === 'string') refList.push({ obj: t, key: 'description' });
}
if (typeof j[0].finalSystemDirective === 'string') refList.push({ obj: j[0], key: 'finalSystemDirective' });

const stats = [];
for (const [label, old, nw] of pairs) {
  const before = refList.reduce((a, c) => a + count(c.obj[c.key], old), 0);
  if (before === 0) { stats.push({ label, hit: 0, ok: false }); continue; }
  for (const c of refList) {
    const s = c.obj[c.key];
    if (s.includes(old)) c.obj[c.key] = s.split(old).join(nw);
  }
  const after = refList.reduce((a, c) => a + count(c.obj[c.key], old), 0);
  stats.push({ label, hit: before, residual: after, ok: after === 0 });
}

for (const s of stats) console.log(`${s.label}: hits=${s.hit} residual=${s.residual ?? '-'} ${s.ok ? 'OK' : (s.hit === 0 ? '0-HIT' : 'FAIL')}`);

// Write back
const out = JSON.stringify(j, null, 2);
try { JSON.parse(out); } catch (e) { console.error('FATAL: serialized output invalid JSON', e.message); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE', out.length, 'bytes');
