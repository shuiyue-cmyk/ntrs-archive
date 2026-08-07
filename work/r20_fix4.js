// R20 调整：NTRtrack 从 extractInjectTags 移到 extractTags（进 FSD 用户可见）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  if (!s2) { console.log('[FAIL] no s2 ' + fn); fail++; continue; }
  // extractTags 加 NTRtrack
  const et = (s2.extractTags || '').split(',').map(x => x.trim()).filter(Boolean);
  if (!et.includes('NTRtrack')) { et.push('NTRtrack'); s2.extractTags = et.join(','); }
  // extractInjectTags 移除 NTRtrack
  const eit = (s2.extractInjectTags || '').split(',').map(x => x.trim()).filter(Boolean);
  const eitNew = eit.filter(x => x !== 'NTRtrack');
  s2.extractInjectTags = eitNew.join(',');
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': extractTags=[' + s2.extractTags + '] extractInjectTags=[' + s2.extractInjectTags + '] OK');
}
console.log('==== DONE (fail=' + fail + ') ====');
process.exit(fail === 0 ? 0 : 1);
