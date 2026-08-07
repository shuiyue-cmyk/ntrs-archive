// Final independent verification (fresh read from disk)
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const raw = fs.readFileSync(PATH, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('FAIL parse:', e.message); process.exit(1); }
console.log('JSON valid: true | top array:', Array.isArray(j), '| starts [: ', raw.trim().startsWith('['));
const p = j[0];
console.log('name:', p.name);
console.log('plotTasks:', (p.plotTasks || []).map(t => t.id).join(', '));
const parts = [];
for (const t of p.plotTasks || []) { parts.push(t.description || ''); (t.promptGroup || []).forEach(m => parts.push(m.content || '')); }
parts.push(p.finalSystemDirective || '');
const blob = parts.join('\n');

console.log('\n-- OLD residuals (expect 0) --');
const olds = {
  'B1': `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
  'B2': `属 📹 事后知情或 🌙 完全不知的暗线戏`,
  'B3': `- 锁定指令：锁定 / 维持背景板`,
  'B4': `· 上轮阶段名 + 上轮%：（从概览/前文/上轮 stage 读；没有则写「首轮基线」并给合理起点）`,
  'B5': `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn`,
  'B8a': `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  'B8b': `locked_target 命中本轮登场名单里某💔敏感角色名。命中即视为"该目标已绑定黄毛"`,
  'B10': `违反 = 输出失败）：` ,
};
for (const [k, s] of Object.entries(olds)) console.log(` ${k}: ${blob.split(s).length - 1}`);

console.log('\n-- NEW present (expect >=1; B8 = 2) --');
const news = {
  'B1': `若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场`,
  'B2': `📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知`,
  'B3': `（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`,
  'B3b': `（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`,
  'B4': `以 黄毛表 progress_percent 为准；无表行则首轮基线 0%/忠诚型，概览/前文仅作校验`,
  'B5': `判断该黄毛本轮在场/出场是否合理`,
  'B8': `锁定目标/锁定对象」列`,
  'B10': `thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致`,
};
for (const [k, s] of Object.entries(news)) console.log(` ${k}: ${blob.split(s).length - 1}`);

console.log('\n-- doubled-suffix guard (expect 0) --');
for (const s of [`完全不知）（📹 事后知情`, `正文不呈现）（调度指令`, `才用于正文）（刷新状态/锁定指令`]) {
  console.log(' doubled:', blob.split(s).length - 1);
}

console.log('\n-- spec residual scan (expect 0; pure-male-competition words legal only in non-NTRS) --');
for (const kw of ['黄毛败·友好', '线闭合，黄毛不再行动判定', '刷新成功 = 接下来的场景中有出现的可能', '该对象线已闭合，不再推进判定', '锁定目标列表非空', 'After <thugAction>, output ONE tag']) {
  const c = blob.split(kw).length - 1;
  if (c > 0) console.log(' WARN residual:', JSON.stringify(kw), '=', c);
}
console.log('done');
