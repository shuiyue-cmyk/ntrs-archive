// R21 修复：NTRtrack 改造的说明层 BUG/OBS 统一修复（33 文件）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!Array.isArray(j)) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const root = j[0];
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const isHyb = isB && fn.includes('_NTRS');
  const is2 = fn.endsWith('_2ALL.json');
  if (!isB && !isN) continue;
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  let n = 0; const applied = [];
  const rep = (arr, from, to) => {
    let c = 0;
    for (const m of arr) {
      let t = m.content || '';
      if (t.includes(from)) { t = t.split(from).join(to); m.content = t; c++; }
    }
    if (c) { n += c; }
    return c;
  };
  // A. MSG0 旧句
  if (isB) {
    rep(s2.promptGroup, '输出 <thugSpawn>（含【黄毛动向追踪】区块 + 本轮刷新判定）与 <thugSpawnReason>', '输出 <thugSpawn> 与 <thugSpawnReason>');
    rep(s2.promptGroup, '写进 <thugSpawn> 的【黄毛动向追踪】区块', '写进 <NTRtrack> 的【黄毛动向追踪】区块');
    rep(s2.promptGroup, '标签内放刷新状态+黄毛人设+追踪区块', '标签内放刷新状态+黄毛人设');
  } else if (isN) {
    rep(s2.promptGroup, '**thugSpawn 内输出【对象动向追踪】（仅离场对象）**', '**<NTRtrack> 内输出【对象动向追踪】（仅离场对象）**');
    rep(s2.promptGroup, '**thugSpawn 内附【对象动向追踪】行**', '**<NTRtrack> 内附【对象动向追踪】行**');
  }
  // B. 输出顺序行加 NTRtrack
  const bCnt = rep(s2.promptGroup, 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <thugAction>, <thugActionReason>.', 'Output tags in order: <thugSpawn>, <thugSpawnReason>, <NTRtrack>, <thugAction>, <thugActionReason>.');
  // C. Immediately after（BATTLE）
  if (isB) {
    rep(s2.promptGroup, 'Immediately after </thugSpawn>, output <thugSpawnReason>一句话</thugSpawnReason>', 'Immediately after </thugSpawn>, output <NTRtrack>（追踪区块，then）<thugSpawnReason>一句话</thugSpawnReason>');
  }
  // D. STEP3 表头（straight_NTRS 系残留「+【黄毛动向追踪】区块」）
  if (isHyb && fn.startsWith('Cirno_BATTLE_Turn_straight')) {
    rep(s2.promptGroup, '<thugSpawn> 标签内只放刷新状态+黄毛人设+【黄毛动向追踪】区块（会经 FSD 给花火·正文）', '<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）；追踪输出到 <NTRtrack>');
  }
  // E. sparkNotes 收尾
  if (isB) {
    rep(s2.promptGroup, '先 <thugSpawn>+<thugSpawnReason>（含黄毛动向追踪），再 <thugAction>+<thugActionReason>，一气呵成', '先 <thugSpawn>+<thugSpawnReason>+<NTRtrack>（追踪），再 <thugAction>+<thugActionReason>，一气呵成');
  } else if (isN) {
    rep(s2.promptGroup, '先 <thugSpawn>+<thugSpawnReason>，再 <thugAction>+<thugActionReason>，一气呵成', '先 <thugSpawn>+<thugSpawnReason>+<NTRtrack>（追踪），再 <thugAction>+<thugActionReason>，一气呵成');
  }
  // F. S3 角色描述加 NTRtrack（NTRS12）
  if (isN) {
    rep(s3.promptGroup, ' - **黄毛刷新状态** `<thugSpawn>`（见下方该块内容）— 告诉你本轮是否引入新黄毛', ' - **黄毛刷新状态** `<thugSpawn>`（见下方该块内容）— 告诉你本轮是否引入新黄毛；**追踪** `<NTRtrack>` — 黄毛动向+对象动向');
  }
  // G. 双冒号
  rep(s3.promptGroup, '（人设见 {{thugSpawn}}，追踪见下）：：', '（人设见 {{thugSpawn}}，追踪见下）：');
  // I. _2ALL 骚扰者联动进 MSG4（NTRS12 _2ALL）
  if (isN && is2) {
    rep(s2.promptGroup, '**<NTRtrack> 标签内附【黄毛动向追踪】区块**（兼容查表：黄毛表仍为型体设定/锁定状态/进度权威源；追踪区块负责动向连续性，每轮必列所有已刷新黄毛，no_spawn 轮同样列出）', '**<NTRtrack> 标签内附【黄毛动向追踪】区块**（兼容查表：黄毛表仍为型体设定/锁定状态/进度权威源；追踪区块负责动向连续性，每轮必列所有已刷新黄毛，no_spawn 轮同样列出；_2ALL：对象为乐享型·人尽可夫时，离场动向中可自然刷新临时性骚扰者——对象动向行带出「遭遇性骚扰」）');
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': 修复 ' + n + ' 处 ' + (bCnt ? '' : '') + ' OK');
}
console.log('==== DONE (fail=' + fail + ') ====');
process.exit(fail === 0 ? 0 : 1);
