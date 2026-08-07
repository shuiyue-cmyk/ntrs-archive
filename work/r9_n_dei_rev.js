// R9 PART B fix: Cirno_NTRS_turn_edit_DEI_revise_4.7.json
// Applies B1(revise), B2, B3(plain/revise incl. part2), B4, B5(plain/revise), B8, B10
// In-place via obj[key] on parsed content strings. Write back JSON.stringify(j, null, 2).
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) { console.error('FATAL: raw does not start with ['); process.exit(1); }
const j = JSON.parse(raw);
if (!Array.isArray(j)) { console.error('FATAL: top-level not array'); process.exit(1); }
const p = j[0];

// ---- replacement pairs (label, old, new) ----
const pairs = [
  {
    label: 'B1',
    old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    new: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  },
  {
    label: 'B2',
    old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    new: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  },
  {
    label: 'B3',
    old: `- 锁定指令：锁定 / 维持背景板`,
    new: `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  },
  {
    label: 'B3b',
    old: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；`,
    new: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）；`,
  },
  {
    label: 'B4',
    old: `· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    new: `· 上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`,
  },
  {
    label: 'B5',
    old: `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
    new: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  },
  {
    label: 'B8',
    old: `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
    new: `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  },
  {
    label: 'B10',
    old: `只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标。`,
    new: `只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`,
  },
];

// ---- walk all target string fields ----
function walk() {
  const targets = [];
  for (const t of p.plotTasks || []) {
    for (const m of t.promptGroup || []) targets.push({ obj: m, key: 'content' });
    if (t.description !== undefined) targets.push({ obj: t, key: 'description' });
  }
  if (p.finalSystemDirective !== undefined) targets.push({ obj: p, key: 'finalSystemDirective' });
  return targets;
}

const fields = walk();
const stats = {};

for (const pr of pairs) {
  let hits = 0;
  for (const f of fields) {
    const v = f.obj[f.key];
    if (typeof v !== 'string') continue;
    let i = 0;
    while ((i = v.indexOf(pr.old, i)) >= 0) { hits++; i += pr.old.length; }
    if (hits && v.includes(pr.old)) {
      // in-place replacement keeps object reference
      f.obj[f.key] = v.split(pr.old).join(pr.new);
    }
  }
  stats[pr.label] = hits;
  console.log(`${pr.label}: hit=${hits}`);
}

// ---- write back ----
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // must parse
if (!out.trimStart().startsWith('[')) { console.error('FATAL: output not array'); process.exit(1); }
fs.writeFileSync(path, out, 'utf8');
console.log('WROTE OK. bytes=', Buffer.byteLength(out, 'utf8'));
console.log(JSON.stringify(stats));
