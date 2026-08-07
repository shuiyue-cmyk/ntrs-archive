// 1. BATTLE NTRS 后缀三版当前表格引用状态
// 2. 8.8.js: replaceDbExpressions / TableQueryBuilder.get() 返回 / getNameMapper 表名映射
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
console.log('==== BATTLE NTRS 三版表格引用 ====');
for (const fn of ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json']) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const all = JSON.stringify(o);
  console.log(fn, '| $0:', all.includes('$0') ? '有' : '无', '| 当前表格数据:', all.includes('当前表格数据') ? '有' : '无', '| 黄毛表:', all.includes('黄毛表') ? '有' : '无', '| {[db:', all.includes('{[db') ? '有' : '无');
}

const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');
// replaceDbExpressions 函数
let i = src.indexOf('function replaceDbExpressions');
console.log('==== replaceDbExpressions ====');
if (i >= 0) console.log(src.slice(i, i + 1600));
