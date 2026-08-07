// 检查 33 文件 S2/S3 description 是否同步最新语义 + 误导表述残留
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const j = JSON.parse(raw);
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  const d2 = (s2 && s2.description) || root.description || '';
  const d3 = (s3 && s3.description) || '';
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const isHyb = fn.startsWith('Cirno_BATTLE_Turn') && fn.includes('_NTRS');
  const is2 = fn.endsWith('_2ALL.json');
  const blob = JSON.stringify({ d2, d3 });
  // 误导表述残留
  const resid = (blob.split('不发给').length - 1);
  // 关键语义（按体系）
  const checks = [];
  if (isN) {
    checks.push(['积极行动门', d2.includes('亲密') || d2.includes('锁定')]);
    checks.push(['察觉迎合', d3.includes('察觉')]);
    checks.push(['追踪分级', (d2 + d3).includes('极简')]);
  }
  if (isHyb) {
    checks.push(['亲密开局分流', (d2 + d3).includes('亲密开局')]);
    checks.push(['配合黄毛表', (d2 + d3).includes('表格') || (d2 + d3).includes('黄毛表')]);
    checks.push(['追踪分级', (d2 + d3).includes('极简')]);
    checks.push(['苦主', (d2 + d3).includes('苦主')]);
  }
  if (is2) checks.push(['人尽可夫', (d2 + d3).includes('人尽可夫')]);
  const miss = checks.filter(([, ok]) => !ok).map(([n]) => n);
  console.log(fn + ' | desc误导残留=' + resid + (miss.length ? ' desc缺:' + miss.join('|') : '') + (resid === 0 && miss.length === 0 ? ' OK' : ' [FAIL]'));
  if (resid !== 0 || miss.length) fail++;
}
console.log(fail === 0 ? 'ALL PASS' : fail + ' FAIL');
process.exit(fail === 0 ? 0 : 1);
