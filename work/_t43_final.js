// T43 最终验证：18 文件全部改动项
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const battle = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json', 'Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const ntrs12 = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const all = [...battle, ...ntrs12];
let allOk = true;
for (const fn of all) {
  const raw = fs.readFileSync(base + fn, 'utf8');
  const j = JSON.parse(raw);
  const o = Array.isArray(j) ? j[0] : j;
  const all2 = JSON.stringify(o);
  const topArr = raw.trim().startsWith('[');
  const checks = [];
  // 通用
  if (!all2.includes('跳过全部导演分析')) checks.push('快速通道缺失');
  if (all2.includes('no-act 编排——不跳过')) checks.push('废止残留');
  if (!all2.includes('场景外场景')) checks.push('场景外标注缺失');
  if (!(all2.includes('黄毛行动不依赖本轮是否刷新在场') || all2.includes('黄毛行动不依赖本轮是否刷新'))) checks.push('未spawn可行动缺失');
  // 通用：≥2 清零
  if (all2.includes('≥2')) checks.push('≥2残留');
  // BATTLE 六版败判定去数值化
  if (battle.includes(fn)) {
    if (all2.includes('明确拒绝黄毛 ≥2') || all2.includes('明确且长期拒绝黄毛（≥2')) checks.push('败判定数值化');
    if (!all2.includes('综合判断女主的行为是否选择了') && !all2.includes('女主的行为有没有表现出已选择')) checks.push('败判定综合判断缺失');
  }
  const ok = topArr && checks.length === 0;
  if (!ok) allOk = false;
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, ''), ok ? '✓' : '❌', checks.length ? checks.join('|') : '', topArr ? '' : '顶层数组破坏');
}
console.log('=== ' + (allOk ? 'ALL OK ' + all.length + '/' + all.length : '有失败') + ' ===');
