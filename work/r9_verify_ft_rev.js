// Rigorous verify for R9 Part B FT_revise fix: check parsed field values, not raw text.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw); // throws if invalid
console.log('JSON.parse: OK');
console.log('top-level array:', Array.isArray(j), '| first char:', JSON.stringify(raw.trimStart()[0]));

const pairs = [
  ['B1', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
        `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场（身份+在场姿态，作为路人/熟人的自然互动，不越界）**）`],
  ['B2', `属 📹 事后知情或 🌙 完全不知的暗线戏`,
        `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `- 锁定指令：锁定 / 维持背景板`,
        `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3-sec', `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；`,
        `**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）；`],
  ['B4', `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
        `上轮阶段名 + 上轮%：（以 黄毛表 progress_percent 为准，无表行则首轮基线 0%/忠诚型，概览/前文仅作校验）`],
  ['B5', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
        `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn`],
  ['B8', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
        `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B8b', `locked_target 命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`,
        `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`],
  ['B10', `篇幅压缩为一行（身份+在场姿态），只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标。`,
        `篇幅压缩为一行（身份+在场姿态），只能以路人/同事/同学/熟人身份出现，不得主动追求/暧昧/单独接触目标（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）。`],
];

// collect all string fields
const strings = [];
(function walk(o) {
  if (typeof o === 'string') strings.push(o);
  else if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k]));
})(j);

function count(hay, needle) { return hay.split(needle).length - 1; }

let bad = 0;
for (const [tag, old, nw] of pairs) {
  let oldTotal = 0, newTotal = 0;
  for (const s of strings) { oldTotal += count(s, old); newTotal += count(s, nw); }
  // residual OLD = occurrences not accounted for inside NEW (NEW may start with OLD for B2/B3)
  const residual = oldTotal - newTotal * (nw.includes(old) ? 1 : 0);
  const ok = residual === 0 && newTotal >= 1;
  if (!ok) bad++;
  console.log(`${tag}: OLD_total=${oldTotal} NEW_total=${newTotal} -> residual=${residual} ${ok ? 'OK' : 'FAIL'}`);
}
console.log(bad === 0 ? 'ALL PAIRS OK' : bad + ' PAIRS FAIL');
