// 检查残留的 "msg15" 引用（表格现在在 MSG2 注入，S2 查表在 MSG2、S3 在 MSG15）
// 以及 <当前表格数据> 标签残留
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = [
  ...fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort(),
  'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  // S2 里提到 msg15 的 $0（旧引用）？
  const s2 = JSON.stringify(t2.promptGroup);
  const s3 = JSON.stringify(t3.promptGroup);
  const msg15Ref = (s2 + s3).includes('msg15 的 上方') || (s2 + s3).includes('msg15 的 $0');
  const tableTag = (s2 + s3).includes('<当前表格数据>');
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, ''), '| msg15旧引用:', msg15Ref ? '有!' : '无', '| <当前表格数据>残留:', tableTag ? '有!' : '无');
}
