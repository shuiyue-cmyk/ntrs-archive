// 全面扫描 $0 / 当前表格数据 / 黄毛表 残留
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json', 'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
for (const fn of files) {
  const j = JSON.parse(fs.readFileSync(base + fn, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const all = JSON.stringify(o);
  const hasD0 = all.includes('$0');
  const hasTable = all.includes('当前表格数据');
  const hasMaoBiao = all.includes('黄毛表');
  console.log(fn);
  console.log('  $0:', hasD0 ? '有!' : '无');
  console.log('  当前表格数据:', hasTable ? '有!' : '无');
  console.log('  黄毛表:', hasMaoBiao ? '有(可能否定句)' : '无');
  if (hasD0) {
    let i = all.indexOf('$0');
    console.log('  $0 ctx:', JSON.stringify(all.slice(Math.max(0, i - 60), i + 60)).slice(0, 140));
  }
  if (hasTable) {
    let i = all.indexOf('当前表格数据');
    console.log('  表格 ctx:', JSON.stringify(all.slice(Math.max(0, i - 60), i + 60)).slice(0, 140));
  }
}
