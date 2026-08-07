// R20 验证：33 文件 NTRtrack 改造完整性
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
  const fsd = root.finalSystemDirective || '';
  // 1. thugSpawn 内追踪残留（模板内 【黄毛动向追踪】 应只在 NTRtrack 上下文中）
  // 检查：追踪说明允许提【黄毛动向追踪】（A1 说明保留词），但 thugSpawn 模板内不应再有（已移出）
  // 简化检查：NTRtrack 标签存在 + extractInjectTags 含 NTRtrack + S3 引用 {{NTRtrack}} + FSD 不含 {{NTRtrack}}
  const hasNtr = blob.includes('<NTRtrack>');
  const eitOk = s2 && s2.extractInjectTags && s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const s3Ref = s3 && JSON.stringify(s3.promptGroup).includes('{{NTRtrack}}');
  const fsdClean = !fsd.includes('NTRtrack');
  // 2. BATTLE 系模板追踪块已移出（模板内不再有「【黄毛动向追踪】（每轮必列」在 <thugSpawn> 内）
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  let tmplClean = true;
  if (isB) {
    // 检查 thugSpawn 模板段内是否还有追踪块标题紧跟 </thugSpawn> 前
    const c4 = s2.promptGroup.map(m => m.content || '').join('\n');
    // 追踪块应出现在 </thugSpawn> 之后（NTRtrack 内）
    const re = /<thugSpawn>[\s\S]*?<\/thugSpawn>[\s\S]*?<NTRtrack>/g;
    tmplClean = re.test(c4);
  }
  const ok = hasNtr && eitOk && s3Ref && fsdClean && tmplClean;
  console.log(fn + (isB ? ' [B]' : ' [N12]') + ': NTRtrack=' + hasNtr + ' eit=' + eitOk + ' S3引用=' + s3Ref + ' FSD隔离=' + fsdClean + ' 模板移出=' + tmplClean + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
