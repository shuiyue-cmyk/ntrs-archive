// T40 最终验证：15 文件全清 + 占位符完整 + 顶层数组
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = [
  ...fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort(),
  'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
let allOk = true;
for (const fn of files) {
  const raw = fs.readFileSync(base + fn, 'utf8');
  const j = JSON.parse(raw);
  const o = Array.isArray(j) ? j[0] : j;
  const all = JSON.stringify(o);
  const hasDollar0 = all.includes('$0');
  const hasTableTag = all.includes('当前表格数据');
  const hasDbThug = all.includes('{[db.黄毛表.get()]}');
  const hasDbChar = all.includes('{[db.重要角色表.get()]}');
  const hasDbMemo = all.includes('{[db.NTRS备忘录.get()]}');
  const placeholders = ['$1', '$5', '$6', '$7', '$8', '$U', '$C'];
  const missingPh = placeholders.filter(p => !all.includes(p));
  const topArr = raw.trim().startsWith('[');
  const okFile = !hasDollar0 && !hasTableTag && hasDbThug && hasDbChar && hasDbMemo && missingPh.length === 0 && topArr;
  if (!okFile) allOk = false;
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, ''), okFile ? '✓' : '❌',
    hasDollar0 ? ' $0残留' : '', hasTableTag ? ' 表格标签残留' : '',
    !hasDbThug ? ' 缺黄毛表注入' : '', !hasDbChar ? ' 缺重要角色表' : '', !hasDbMemo ? ' 缺备忘录' : '',
    missingPh.length ? ' 缺占位符:' + missingPh.join(',') : '', topArr ? '' : ' 顶层数组破坏');
}
console.log('=== ' + (allOk ? 'ALL OK 15/15' : '有失败') + ' ===');
