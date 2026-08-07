const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('raw starts with [ :', raw.trimStart().startsWith('['));
let j; try { j = JSON.parse(raw); console.log('JSON.parse: OK'); } catch (e) { console.log('JSON.parse: FAIL', e.message); process.exit(1); }
console.log('top-level array:', Array.isArray(j), 'len', j.length);

const pairs = [
  ['B1', `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
        `行文不少于 15 字；**若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场`],
  ['B2', `属 📹 事后知情或 🌙 完全不知的暗线戏`,
        `属 📹 事后知情或 🌙 完全不知的暗线戏（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `- 锁定指令：锁定 / 维持背景板`,
        `- 锁定指令：锁定 / 维持背景板（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3-cond', `会经 FSD 给花火·正文）；理由必须放在紧随其后的`,
        `（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`],
  ['B4', `上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
        `上轮阶段名 + 上轮%：以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验`],
  ['B5', `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
        `判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn）`],
  ['B8', `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
        `locked_target（即「锁定目标/锁定对象」列）命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`],
  ['B10', ` - thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。`,
        `（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）`],
];

function count(s, sub) {
  let n = 0, i = 0;
  while ((i = s.indexOf(sub, i)) !== -1) { n++; i += sub.length; }
  return n;
}

const parts = [];
for (const t of j[0].plotTasks) {
  for (const m of t.promptGroup) if (typeof m.content === 'string') parts.push(m.content);
  if (typeof t.description === 'string') parts.push(t.description);
}
if (typeof j[0].finalSystemDirective === 'string') parts.push(j[0].finalSystemDirective);
const blob = parts.join('\n');
for (const [label, old, nw] of pairs) {
  const oldN = count(blob, old);
  const newN = count(blob, nw);
  const embedded = nw.includes(old);
  let ok;
  if (embedded) ok = (newN > 0 && oldN === newN); // all remaining OLD occurrences live inside NEW
  else ok = (oldN === 0 && newN > 0);
  console.log(`${label}: OLD=${oldN} NEW=${newN} embedded=${embedded} ${ok ? 'OK' : 'FAIL'}`);
}

// residual scan of key phrases
for (const s of ['从概览/前文/上轮 stage 读', '判断该已有黄毛本轮是否可行动', '仅作一行主线指示，行文不少于 15 字）\n- stage']) {
  console.log('residual', JSON.stringify(s), '=', count(blob, s));
}
