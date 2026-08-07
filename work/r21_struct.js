// R21 主代理结构验证：NTRtrack 改造完整性（33 文件）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('[FAIL] JSON ' + fn); fail++; continue; }
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  const blob = JSON.stringify(j);
  const open = (blob.match(/<NTRtrack>/g) || []).length;
  const close = (blob.match(/<\/NTRtrack>/g) || []).length;
  const eitOk = s2 && s2.extractInjectTags && s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const s3Ref = s3 && JSON.stringify(s3.promptGroup).includes('{{NTRtrack}}');
  const s3ThugStill = s3 && JSON.stringify(s3.promptGroup).includes('{{thugSpawn}}');
  const fsdClean = !(root.finalSystemDirective || '').includes('NTRtrack');
  // thugSpawn 内追踪残留：<thugSpawn>...</thugSpawn> 之间是否还有【黄毛动向追踪】
  const s2blob = JSON.stringify(s2.promptGroup.map(m => m.content || '').join('\n'));
  const inThug = (s2blob.match(/<thugSpawn>[\s\S]*?【黄毛动向追踪】/g) || []).length;
  const pairOk = open === close && open >= 1;
  const ok = pairOk && eitOk && s3Ref && s3ThugStill && fsdClean && inThug === 0;
  console.log(fn + ': 开闭=' + open + '/' + close + ' eit=' + eitOk + ' S3NTR=' + s3Ref + ' S3thug保留=' + s3ThugStill + ' FSD隔离=' + fsdClean + ' thug内追踪=' + inThug + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
