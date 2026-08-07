const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('file bytes:', Buffer.byteLength(raw, 'utf8'));
const j = JSON.parse(raw);
console.log('top-level array:', Array.isArray(j), '| starts with [: ', raw.trimStart().startsWith('['));

// {db.*} blocks intact?
const dbBlocks = (raw.match(/\{\s*db\.[^}]*\}/g) || []);
console.log('\n{db.*} blocks count:', dbBlocks.length);
dbBlocks.forEach(b => console.log('  ', b.trim().slice(0, 80)));

// Spot-check each applied NEW
const t1 = j[0].plotTasks[1];
const t2 = j[0].plotTasks[2];
const checks = [
  ['B1 (pg0 快速通道 prologue)', t2.promptGroup[0].content.includes('若本轮 spawn 且存在背景板（未锁定）黄毛，此行附一句该黄毛的浅度出场')],
  ['B2 (pg0 场景外知情)', t2.promptGroup[0].content.includes('📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知')],
  ['B3 锁定指令行', t1.promptGroup[4].content.includes('无新增（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）')],
  ['B3 S2追加', t1.promptGroup[4].content.includes('正文 AI 忽略即可，人设字段才用于正文')],
  ['B4 (pg17 sparkNotes 上轮%)', t2.promptGroup[17].content.includes('以 黄毛表 progress_percent 为准（无表行则首轮基线 0%/忠诚型），概览/前文仅作校验')],
  ['B5 (pg0 黄毛判定)', t1.promptGroup[0].content.includes('判断该黄毛本轮在场/出场是否合理（合理→spawn，不合理→no_spawn；')],
  ['B7a', t2.promptGroup[2].content.includes('thugSpawn 状态=spawn 且锁定状态字段=真正锁定')],
  ['B7b', t2.promptGroup[2].content.includes('thugSpawn 状态=spawn 且锁定状态字段=仅背景板（所有目标均未真正锁定）')],
  ['B10 注', t2.promptGroup[2].content.includes('thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致')],
];
console.log('\n=== NEW presence ===');
checks.forEach(([n, ok]) => console.log(`${ok ? 'OK ' : 'MISSING'} ${n}`));

// Old residual (standalone)
const tAll = [];
for (const t of j[0].plotTasks) {
  if (typeof t.description === 'string') tAll.push(t.description);
  (t.promptGroup || []).forEach(pg => pg && typeof pg.content === 'string' && tAll.push(pg.content));
}
if (typeof j[0].finalSystemDirective === 'string') tAll.push(j[0].finalSystemDirective);
const joined = tAll.join('\n');
const oldPhrases = {
  'B1 OLD': '行文不少于 15 字）\\n- stage / cast / plot：整块省略',
  'B4 OLD': '从概览/前文/上轮 stage 读；没有则写「首轮基线」',
  'B5 OLD': '判断该黄毛本轮是否可行动',
  'B7a OLD': '锁定目标列表非空',
  'B7b OLD': '锁定目标列表为空',
};
console.log('\n=== standalone OLD residual ===');
Object.entries(oldPhrases).forEach(([n, p]) => {
  const re = new RegExp(p.replace(/\\n/g, '\\n'));
  console.log(`${re.test(joined) ? 'RESIDUAL!' : 'gone'} ${n}`);
});
console.log('\nplotTasks:', j[0].plotTasks.map(t => t.name).join(' | '));
console.log('finalSystemDirective len:', j[0].finalSystemDirective.length);
