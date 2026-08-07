// 检查 NTRS12 各版 S2 MSG2 / S3 MSG15 的 $0 块措辞差异
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  // S2 MSG2 $0 块
  const m2 = t2.promptGroup[2].content;
  const s2Start = m2.indexOf('本轮<当前表格数据>');
  const s2Block = s2Start >= 0 ? m2.slice(s2Start, s2Start + 200) : '(无)';
  // S3 MSG15 $0 块
  const m15 = t3.promptGroup[15].content;
  const s3Start = m15.indexOf('本轮<当前表格数据>');
  const s3Block = s3Start >= 0 ? m15.slice(s3Start, s3Start + 160) : '(无)';
  console.log('====', fn.replace('Cirno_NTRS_turn_edit_', '').replace('_4.7.json', ''));
  console.log('  S2块:', JSON.stringify(s2Block).slice(0, 220));
  console.log('  S3块:', JSON.stringify(s3Block).slice(0, 180));
}
