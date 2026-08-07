// R21 共性 BUG 修复：prompts FSD 副本 / 开场白 / desc / S3 m15 / 标签顺序统一
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!Array.isArray(j)) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const root = j[0];
  const isRevise = fn.includes('revise');
  let n = 0; const log = [];
  const repAll = (arr, from, to, tag) => {
    let c = 0;
    for (const m of arr) {
      let t = m.content || '';
      if (t.includes(from)) { t = t.split(from).join(to); m.content = t; c++; }
    }
    if (c) { n += c; log.push(tag + 'x' + c); }
  };
  // F1. prompts[] finalSystemDirective 副本加 {{NTRtrack}}
  const pfsd = (root.prompts || []).find(p => p && p.id === 'finalSystemDirective');
  if (pfsd && pfsd.content && !pfsd.content.includes('{{NTRtrack}}')) {
    const c = pfsd.content;
    const idx = c.indexOf('{{thugAction}}');
    const end = c.indexOf('{{prologue}}');
    if (idx !== -1 && end !== -1 && idx < end) {
      pfsd.content = c.slice(0, end) + '{{NTRtrack}}\n\n' + c.slice(end);
      n++; log.push('F1');
    }
  }
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  // F2. m1 开场白
  repAll(s2.promptGroup, '给 <thugSpawn>（含黄毛动向追踪）', '给 <thugSpawn>+<NTRtrack>（追踪）', 'F2');
  // F3. description
  if (s2.description) {
    let d = s2.description;
    if (d.includes('输出 thugSpawn（含黄毛动向追踪）+thugSpawnReason+thugAction+thugActionReason')) {
      d = d.split('输出 thugSpawn（含黄毛动向追踪）+thugSpawnReason+thugAction+thugActionReason').join('输出 thugSpawn+thugSpawnReason+NTRtrack+thugAction+thugActionReason');
      n++; log.push('F3');
    }
    s2.description = d;
  }
  // F4. S3 m15 追踪区块旧引用
  repAll(s3.promptGroup, 'thugSpawn 追踪区块', 'NTRtrack 追踪区块', 'F4a');
  repAll(s3.promptGroup, '从 <thugSpawn> 标签内的【黄毛动向追踪】', '从 <NTRtrack> 标签内的【黄毛动向追踪】', 'F4b');
  repAll(s3.promptGroup, '配合 <thugSpawn> 追踪区块', '配合 <NTRtrack> 追踪区块', 'F4c');
  // F5. 顺序行 NTRtrack 移到第 2 位
  repAll(s2.promptGroup, 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>.', 'Output tags in order: <thugSpawn>, <NTRtrack>, <thugSpawnReason>, <thugAction>, <thugActionReason>.', 'F5a');
  repAll(s2.promptGroup, 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>, <userCalib>.', 'Output tags in order: <thugSpawn>, <NTRtrack>, <thugSpawnReason>, <thugAction>, <thugActionReason>, <userCalib>.', 'F5b');
  repAll(s2.promptGroup, '先 <thugSpawn>+<thugSpawnReason>+<NTRtrack>（追踪），再 <thugAction>+<thugActionReason>', '先 <thugSpawn>+<NTRtrack>（追踪）+<thugSpawnReason>，再 <thugAction>+<thugActionReason>', 'F5c');
  // F6. 第二步 Tags order 加 NTRtrack
  repAll(s2.promptGroup, 'Tags order: <thugSpawn> → <thugSpawnReason> → <thugAction> → <thugActionReason>.', 'Tags order: <thugSpawn> → <NTRtrack> → <thugSpawnReason> → <thugAction> → <thugActionReason>.', 'F6a');
  if (isRevise) {
    repAll(s2.promptGroup, '共五个标签一气呵成', '共六个标签一气呵成', 'F6b');
    repAll(s2.promptGroup, '（thugSpawn→thugSpawnReason→thugAction→thugActionReason→userCalib）', '（thugSpawn→NTRtrack→thugSpawnReason→thugAction→thugActionReason→userCalib）', 'F6c');
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': ' + (log.length ? log.join('+') : '(无匹配)') + ' OK');
}
console.log('==== DONE (fail=' + fail + ') ====');
process.exit(fail === 0 ? 0 : 1);
