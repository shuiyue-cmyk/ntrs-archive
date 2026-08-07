// R21 精确结构验证（修正误报）：模板 NTRtrack 成对/追踪块位置/S3 双引用/eit/FSD
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
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const s2blob = JSON.stringify(s2.promptGroup.map(m => m.content || '').join('\n'));
  const s3blob = JSON.stringify(s3.promptGroup);
  const eitOk = s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const s3NTR = s3blob.includes('{{NTRtrack}}');
  const s3thug = s3blob.includes('{{thugSpawn}}');
  const fsdClean = !(root.finalSystemDirective || '').includes('NTRtrack');
  // 追踪块在 thugSpawn 闭合内残留：<thugSpawn>...【黄毛动向追踪】...</thugSpawn>（追踪在闭合前）
  const inThug = (s2blob.match(/<thugSpawn>[\s\S]*?【黄毛动向追踪】[\s\S]*?<\/thugSpawn>/g) || []).length;
  // BATTLE：每个 thugSpawn 模板后应有 NTRtrack（</thugSpawn>\n<NTRtrack> 成对出现 = 3 处模板）
  let tmplOk = true;
  if (isB) {
    const pairs = (s2blob.match(/<\/thugSpawn>\s*<NTRtrack>/g) || []).length;
    const closed = (s2blob.match(/<\/NTRtrack>/g) || []).length;
    tmplOk = pairs === 3 && closed === 3;
  }
  const ok = eitOk && s3NTR && s3thug && fsdClean && inThug === 0 && tmplOk;
  console.log(fn + (isB ? ' [B]' : ' [N12]') + ': eit=' + eitOk + ' S3NTR=' + s3NTR + ' S3thug=' + s3thug + ' FSD=' + fsdClean + ' thug内追踪=' + inThug + ' 模板NTR对=' + tmplOk + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
