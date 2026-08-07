// 检查 $ 占位符完整性（$1/$5/$6/$7/$8/$U/$C 不应被 $0 清理误伤）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = [
  ...fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort(),
  'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
let bad = 0;
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const all = JSON.stringify(o);
  // 检查常见占位符是否仍存在
  const checks = ['$1', '$5', '$6', '$7', '$8', '$U', '$C'];
  const missing = checks.filter(p => !all.includes(p));
  // 检查是否有 "上方<黄毛表当前条目>1" 这类误伤（$0→替换后接数字）
  const misDollar = /\$[0-9]/g;
  const realDollars = all.match(misDollar) || [];
  if (missing.length) {
    console.log(fn, '缺占位符:', missing.join(','));
    bad++;
  }
  // 验证 $0 确实清零但 $1/$5/$7/$8 存在
  if (all.includes('$0')) {
    console.log(fn, '$0 仍残留!');
    bad++;
  }
}
console.log(bad === 0 ? '=== 全部占位符完整，$0 清零 ✓ ===' : '=== 有 ' + bad + ' 个文件问题 ===');
