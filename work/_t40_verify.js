// T40 验证：15 文件（NTRS12 + BATTLE NTRS3）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const battle = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const all = [...ntrs12, ...battle];
let ok = 0;
for (const fn of all) {
  const raw = fs.readFileSync(base + fn, 'utf8');
  const j = JSON.parse(raw);
  const o = Array.isArray(j) ? j[0] : j;
  const s2 = JSON.stringify(o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准').promptGroup);
  const s3 = JSON.stringify(o.plotTasks.find(t => t.name === '导演台本').promptGroup);
  const hasDb = s2.includes('{[db.黄毛表.get()]}') && s3.includes('{[db.黄毛表.get()]}');
  const hasImportChar = (s2 + s3).includes('{[db.重要角色表.get()]}');
  const hasMemo = (s2 + s3).includes('{[db.NTRS备忘录.get()]}');
  const noDollar0 = !JSON.stringify(o).includes('$0');
  const topArr = raw.trim().startsWith('[');
  const okFile = hasDb && hasImportChar && hasMemo && noDollar0 && topArr;
  if (okFile) ok++;
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, ''), '| db三表:', hasDb && hasImportChar && hasMemo ? '✓' : '✗', '| $0清除:', noDollar0 ? '✓' : '✗', '| 顶层:', topArr ? '✓' : '✗', okFile ? '' : '❌');
}
console.log('=== 通过: ' + ok + '/' + all.length + ' ===');
