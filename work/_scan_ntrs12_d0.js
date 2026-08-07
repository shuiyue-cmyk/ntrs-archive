// 检查原 NTRS 12 版 $0 使用情况
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const all = JSON.stringify(o);
  const hasD0 = all.includes('$0');
  const hasTable = all.includes('当前表格数据');
  const d0Count = (all.match(/\$0/g) || []).length;
  console.log(fn.replace('Cirno_NTRS_turn_edit_', '').replace('_4.7.json', ''), '| $0:', hasD0 ? d0Count + '处' : '无', '| 当前表格数据:', hasTable ? '有' : '无');
}
