// R9 Part B fix for Cirno_NTRS_turn_edit_FT_revise_4.7.json (FT_revise, 原 NTRS 12 版)
// Items: B1 (revise), B2, B3 (plain/revise, incl. secondary FSD note), B4, B5 (plain/revise), B8, B10
// Skip ALLin-specific items.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';

const raw = fs.readFileSync(path, 'utf8');
if (!raw.trimStart().startsWith('[')) throw new Error('top-level is not array, abort');
const j = JSON.parse(raw); // keep ORIGINAL top-level j
const p = j[0];

// ---- replacement pairs ----
const pairs = [
  {
    tag: 'B1',
    old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
    new: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`,
  },
  {
    tag: 'B2',
    old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
    new: `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`,
  },
  {
    tag: 'B3',
    old: `- 锁定指令：锁定 / 维持背景板`,
    new: `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  },
  {
    tag: 'B3-sec',
    old: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；`,
    new: `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）；`,
  },
  {
    tag: 'B4',
    old: `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
    new: `上轮阶段名 + 上轮%：（以 黄毛表 progress_percent 为准，无表行则首轮基线 0%/忠诚型，概览/前文仅作校验）`,
  },
  {
    tag: 'B5',
    old: `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
    new: `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`,
  },
  {
    tag: 'B8',
    old: `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
    new: `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  },
  {
    tag: 'B8b',
    old: `locked_target 命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`,
    new: `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`,
  },
  {
    tag: 'B10',
    old: `篇幅压缩为一行（身份+在场姿态），只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标。`,
    new: `篇幅压缩为一行（身份+在场姿态），只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）。`,
  },
];

// ---- collect in-place string slots ----
// slot = { get(), set(v) }
const slots = [];
for (const t of p.plotTasks || []) {
  for (const m of t.promptGroup || []) {
    const key = 'content';
    if (typeof m[key] === 'string') {
      const ref = m;
      slots.push({ label: 'task.' + t.id + '.promptGroup[].' + key, get: () => ref[key], set: v => { ref[key] = v; } });
    }
  }
  if (typeof t.description === 'string') {
    const ref = t;
    slots.push({ label: 'task.' + t.id + '.description', get: () => ref.description, set: v => { ref.description = v; } });
  }
}
if (typeof p.finalSystemDirective === 'string') {
  const ref = p;
  slots.push({ label: 'finalSystemDirective', get: () => ref.finalSystemDirective, set: v => { ref.finalSystemDirective = v; } });
}

// ---- apply with per-pair hit counts ----
const report = [];
for (const pair of pairs) {
  let total = 0;
  const perSlot = [];
  for (const s of slots) {
    const cur = s.get();
    const n = cur.split(pair.old).length - 1;
    if (n > 0) {
      total += n;
      perSlot.push(s.label + ':' + n);
      s.set(cur.split(pair.old).join(pair.new));
    }
  }
  report.push({ tag: pair.tag, hits: total, where: perSlot.join(', ') || '(none)' });
  console.log(pair.tag + ': hits=' + total + (perSlot.length ? ' @ ' + perSlot.join(' | ') : ''));
}

// ---- write back ----
const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
console.log('WRITTEN. bytes:', Buffer.byteLength(out, 'utf8'));

// ---- verify: re-read ----
const raw2 = fs.readFileSync(path, 'utf8');
JSON.parse(raw2); // throws if invalid
const topArr = raw2.trimStart().startsWith('[');
console.log('verify: JSON.parse OK, top-level array =', topArr);

let residual = 0;
for (const pair of pairs) {
  const n = raw2.split(pair.old).length - 1;
  const m = raw2.split(pair.new).length - 1;
  if (n !== 0) residual += n;
  console.log('verify ' + pair.tag + ': OLD residual=' + n + ', NEW count=' + m);
}
console.log('TOTAL residual OLD occurrences:', residual);
