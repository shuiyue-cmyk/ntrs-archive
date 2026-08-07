// Repair: collapse double-appended suffixes for B2/B3/B3b (append-style pairs are not idempotent)
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_4.7.json';
const j = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const p = j[0];
const refs = [];
for (const t of p.plotTasks || []) {
  refs.push({ where: `task[${t.id}].description`, obj: t, key: 'description' });
  (t.promptGroup || []).forEach((m, i) => refs.push({ where: `task[${t.id}].promptGroup[${i}]`, obj: m, key: 'content' }));
}
refs.push({ where: 'finalSystemDirective', obj: p, key: 'finalSystemDirective' });

const suffixPairs = [
  ['B2', `（📹 事后知情仅限察觉型 41% 起的目标，忠诚/动摇期目标一律 🌙 完全不知）`],
  ['B3', `（调度指令，仅供下游填表 AI 与 stage3 识别，正文不呈现）`],
  ['B3b', `（刷新状态/锁定指令为下游调度字段，正文 AI 忽略即可，人设字段才用于正文）`],
];
for (const [tag, suf] of suffixPairs) {
  let total = 0;
  for (const r of refs) {
    const doubled = suf + suf;
    const c = r.obj[r.key].split(doubled).length - 1;
    if (c > 0) { r.obj[r.key] = r.obj[r.key].split(doubled).join(suf); total += c; }
  }
  console.log(`${tag}: doubled occurrences collapsed = ${total}`);
}
const out = JSON.stringify(j, null, 2);
JSON.parse(out); // throws on fail
if (!out.trim().startsWith('[')) { console.log('ABORT not array'); process.exit(1); }
fs.writeFileSync(PATH, out, 'utf8');
console.log('WROTE OK bytes:', Buffer.byteLength(out, 'utf8'));

// independent verify
const vj = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const p2 = vj[0];
const parts = [];
for (const t of p2.plotTasks || []) { parts.push(t.description || ''); (t.promptGroup || []).forEach(m => parts.push(m.content || '')); }
parts.push(p2.finalSystemDirective || '');
const blob = parts.join('\n');
const checks = {
  'B2 key 察觉型 41% 起的目标': '察觉型 41% 起的目标',
  'B3 key 调度指令，仅供下游': '调度指令，仅供下游',
  'B3b key 刷新状态/锁定指令为下游调度字段': '刷新状态/锁定指令为下游调度字段',
  'B1 key 若本轮 spawn 且存在背景板': '若本轮 spawn 且存在背景板',
  'B4 key 黄毛表 progress_percent 为准': '黄毛表 progress_percent 为准',
  'B5 key 在场/出场是否合理': '在场/出场是否合理',
  'B8 key 锁定目标/锁定对象」列': '锁定目标/锁定对象」列',
  'B10 key 与「锁定状态」一致': '与「锁定状态」一致',
};
for (const [k, s] of Object.entries(checks)) console.log(`${k} = ${blob.split(s).length - 1}`);
console.log('top array:', Array.isArray(vj), '| starts [:', fs.readFileSync(PATH, 'utf8').trim().startsWith('['));
