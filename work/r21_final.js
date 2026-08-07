// R21 最终验证：解析后字符串（真实换行）——模板 NTRtrack 结构 / thugSpawn 内追踪 / S3 双引用 / eit / FSD
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
  // 收集解析后的 content 字符串
  let s2texts = [], s3texts = [];
  function collect(o, arr) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (const v of o) collect(v, arr); return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') arr.push(v); else collect(v, arr); }
  }
  collect(s2.promptGroup, s2texts);
  collect(s3.promptGroup, s3texts);
  const s2all = s2texts.join('\n');
  const s3all = s3texts.join('\n');
  const eitOk = s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const s3NTR = s3all.includes('{{NTRtrack}}');
  const s3thug = s3all.includes('{{thugSpawn}}');
  const fsdClean = !(root.finalSystemDirective || '').includes('NTRtrack');
  // thugSpawn 闭合内追踪（真实换行下）
  const inThug = (s2all.match(/<thugSpawn>[\s\S]*?【黄毛动向追踪】[\s\S]*?<\/thugSpawn>/g) || []).length;
  // BATTLE：</thugSpawn>\n<NTRtrack> 对 + </NTRtrack> 闭合
  let tmplOk = true, pairs = 0, closed = 0;
  if (isB) {
    pairs = (s2all.match(/<\/thugSpawn>\n<NTRtrack>/g) || []).length;
    closed = (s2all.match(/<\/NTRtrack>/g) || []).length;
    tmplOk = pairs === 3 && closed === 3;
  }
  const ok = eitOk && s3NTR && s3thug && fsdClean && inThug === 0 && tmplOk;
  console.log(fn + (isB ? ' [B]' : ' [N12]') + ': eit=' + eitOk + ' S3NTR=' + s3NTR + ' S3thug=' + s3thug + ' FSD=' + fsdClean + ' thug内追踪=' + inThug + ' 模板对=' + (isB ? pairs + '/' + closed : 'n/a') + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
