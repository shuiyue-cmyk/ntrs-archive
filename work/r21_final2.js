// R21 最终统一验证（修复后状态，33 文件）：结构 + NTRtrack 语义 + 旧句残留清零 + FSD 双副本
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
// 应清零的旧句/旧引用
const RESID = [
  'thugSpawn 内输出【对象动向追踪】', 'thugSpawn 内附【对象动向追踪】行', '含【黄毛动向追踪】区块 + 本轮刷新判定',
  '写进 <thugSpawn> 的【黄毛动向追踪】区块', '标签内放刷新状态+黄毛人设+追踪区块', 'thugSpawn>+<thugSpawnReason>（含黄毛动向追踪）',
  '追踪见下）：：', '黄毛人设+【黄毛动向追踪】区块', '从 <thugSpawn> 追踪区块', '（权力型/魅力型/隐秘型/强制型/诱惑型）',
  '先 <thugSpawn>+<thugSpawnReason>+<NTRtrack>', '共五个标签', '黄毛动向+对象动向、人设、六型、融入方式',
];
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
  const all = s2all + s3all;
  const resid = RESID.filter(t => all.includes(t));
  // NTRtrack 语义
  const eitOk = s2.extractTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const injNoNtr = !s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack');
  const s3ref = s3all.includes('{{NTRtrack}}');
  const s3thug = s3all.includes('{{thugSpawn}}');
  const orderOk = raw.includes('Output tags in order: <thugSpawn>, <NTRtrack>, <thugSpawnReason>');
  const fsdTop = (root.finalSystemDirective || '').includes('{{NTRtrack}}');
  // prompts[] FSD 副本
  const pfsd = (root.prompts || []).find(p => p && p.id === 'finalSystemDirective');
  const fsdCopy = pfsd ? pfsd.content.includes('{{NTRtrack}}') : true;
  // BATTLE 模板 NTRtrack 对
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  let tmplOk = true;
  if (isB) {
    const pairs = (s2all.match(/<\/thugSpawn>\n<NTRtrack>/g) || []).length;
    const closed = (s2all.match(/<\/NTRtrack>/g) || []).length;
    tmplOk = pairs === 3 && closed === 3;
  }
  const ok = resid.length === 0 && eitOk && injNoNtr && s3ref && s3thug && orderOk && fsdTop && fsdCopy && tmplOk;
  console.log(fn + (isB ? ' [B]' : ' [N12]') + ': ' + (ok ? 'OK' : '[FAIL]') +
    (resid.length ? ' 残留:' + resid.join('|') : '') +
    (!eitOk ? ' eit!' : '') + (!injNoNtr ? ' inj!' : '') + (!s3ref ? ' s3!' : '') +
    (!orderOk ? ' 顺序!' : '') + (!fsdTop ? ' fsd顶层!' : '') + (!fsdCopy ? ' fsd副本!' : '') + (!tmplOk ? ' 模板!' : ''));
  if (!ok) fail++;
}
console.log('\n==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
