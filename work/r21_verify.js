// R21 最终验证：说明层修复 + 结构不回归
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
// 应清零的旧句
const RESID = ['thugSpawn 内输出【对象动向追踪】', 'thugSpawn 内附【对象动向追踪】行', '含【黄毛动向追踪】区块 + 本轮刷新判定', '写进 <thugSpawn> 的【黄毛动向追踪】区块', '标签内放刷新状态+黄毛人设+追踪区块', 'thugSpawn>+<thugSpawnReason>（含黄毛动向追踪）', '追踪见下）：：', '黄毛人设+【黄毛动向追踪】区块'];
let fail = 0;
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('[FAIL] JSON ' + fn); fail++; continue; }
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  let s2all = '', s3all = '';
  for (const m of s2.promptGroup) s2all += (m.content || '') + '\n';
  for (const m of s3.promptGroup) s3all += (m.content || '') + '\n';
  const resid = RESID.filter(t => s2all.includes(t) || s3all.includes(t));
  // 新句就位
  const orderLine = s2all.includes('Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>.');
  const ntrInS2 = s2all.includes('<NTRtrack>');
  const s3ref = s3all.includes('{{NTRtrack}}');
  const fsdOk = (root.finalSystemDirective || '').includes('{{NTRtrack}}');
  const ok = resid.length === 0 && orderLine && ntrInS2 && s3ref && fsdOk;
  console.log(fn + ': 残留=' + (resid.length ? resid.join('|') : '无') + ' 顺序行=' + orderLine + ' S2NTR=' + ntrInS2 + ' S3引用=' + s3ref + ' FSD=' + fsdOk + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
