// R20：33 文件预设 NTRtrack 改造（extractInjectTags + S2 说明 + thugSpawn 追踪块移出 + S3 引用）
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const OBJ_TRACK = '\n【对象动向追踪】（仅离场对象，每对象一行）\n- [对象名]：位置=[离场·[去向]]；状态=[独处/社交/外出/在家/工作等]';

// BATTLE A1 两版本
const A1_PURE_OLD = '**黄毛动向追踪是跨轮记忆的替代**：判定任务不读表格，改靠【黄毛动向追踪】区块维持每个黄毛的状态连续性——每轮必须把场上所有已刷新黄毛逐一列入追踪，标注其动向与线状态，供本轮行动判定与后续轮次衔接。';
const A1_PURE_NEW = '**黄毛动向追踪是跨轮记忆的替代**：判定任务不读表格，改靠 <NTRtrack> 标签内的【黄毛动向追踪】区块维持每个黄毛的状态连续性——每轮必须把场上所有已刷新黄毛逐一列入追踪（输出到 <NTRtrack>，不进 thugSpawn），标注其动向与线状态，供本轮行动判定与后续轮次衔接。';
const A1_HYB_OLD = '**黄毛动向追踪是跨轮记忆的补充**：判定任务配合黄毛表使用（黄毛表仍为型体设定/锁定状态/淫妻线进度的权威源），同时靠【黄毛动向追踪】区块维持每个黄毛的跨轮动向连续性——每轮必须把场上所有已刷新黄毛逐一列入追踪，标注其动向与线状态，供本轮行动判定与后续轮次衔接。';
const A1_HYB_NEW = '**黄毛动向追踪是跨轮记忆的补充**：判定任务配合黄毛表使用（黄毛表仍为型体设定/锁定状态/淫妻线进度的权威源），同时靠 <NTRtrack> 标签内的【黄毛动向追踪】区块维持每个黄毛的跨轮动向连续性——每轮必须把场上所有已刷新黄毛逐一列入追踪（输出到 <NTRtrack>，不进 thugSpawn），标注其动向与线状态，供本轮行动判定与后续轮次衔接。';

// BATTLE A3 S3 引用：追踪块后 {{thugSpawn}} -> {{NTRtrack}}（在「与黄毛动向联动编排：」后）
const A3_MARK = '与黄毛动向联动编排：';

// NTRS12 B1/B2
const B1_OLD = '**thugSpawn 内同时输出【黄毛动向追踪】**';
const B1_NEW = '**输出 <NTRtrack> 标签（含【黄毛动向追踪】+【对象动向追踪】，不进 thugSpawn）**';
const B2_OLD = '**thugSpawn 内附【黄毛动向追踪】区块**';
const B2_NEW = '**<NTRtrack> 标签内附【黄毛动向追踪】区块**';
const B3_MARK = '你须照其编排：';

let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + fn); fail++; continue; }
  const root = Array.isArray(j) ? j[0] : j;
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const isHyb = isB && fn.includes('_NTRS');
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const s2 = (root.plotTasks || []).find(t => t.id === 'plotTaskThugTempo');
  const s3 = (root.plotTasks || []).find(t => t.id === 'defaultPlotTask');
  if (!s2 || !s3) { console.log('[FAIL] tasks ' + fn); fail++; continue; }
  let log = [];
  // 0. extractInjectTags 加 NTRtrack
  if (s2.extractInjectTags && !s2.extractInjectTags.split(',').map(x => x.trim()).includes('NTRtrack')) {
    s2.extractInjectTags = s2.extractInjectTags + ',NTRtrack'; log.push('eit');
  }
  // 1. S2 追踪说明
  for (const m of s2.promptGroup) {
    let c = m.content || '';
    if (isB) {
      if (c.includes(A1_PURE_OLD)) { c = c.split(A1_PURE_OLD).join(A1_PURE_NEW); log.push('a1p'); }
      if (c.includes(A1_HYB_OLD)) { c = c.split(A1_HYB_OLD).join(A1_HYB_NEW); log.push('a1h'); }
    } else if (isN) {
      if (c.includes(B1_OLD)) { c = c.split(B1_OLD).join(B1_NEW); log.push('b1'); }
      if (c.includes(B2_OLD)) { c = c.split(B2_OLD).join(B2_NEW); log.push('b2'); }
    }
    m.content = c;
  }
  // 2. BATTLE thugSpawn 模板：追踪块移出到 NTRtrack（3 处：每轮必列/本轮新刷/仍须列出）
  if (isB) {
    for (const m of s2.promptGroup) {
      let c = m.content || '';
      // 对每个「【黄毛动向追踪】...」块，移到 </thugSpawn> 后的 NTRtrack
      const titles = ['【黄毛动向追踪】（每轮必列，追踪所有已刷新黄毛）', '【黄毛动向追踪】（本轮新刷新的黄毛列入', '【黄毛动向追踪】（仍须列出所有追踪中黄毛的动向'];
      let changed = false;
      for (const t of titles) {
        while (true) {
          const start = c.indexOf(t);
          if (start < 0) break;
          const closeIdx = c.indexOf('</thugSpawn>', start);
          if (closeIdx < 0) break;
          const block = c.slice(start, closeIdx); // 【黄毛动向追踪】...（不含 </thugSpawn>）
          const replacement = '</thugSpawn>\n<NTRtrack>\n' + block + OBJ_TRACK + '\n</NTRtrack>';
          c = c.slice(0, start) + replacement + c.slice(closeIdx + '</thugSpawn>'.length);
          changed = true;
        }
      }
      if (changed) { m.content = c; log.push('tmpl'); }
    }
  }
  // 3. S3 引用
  for (const m of s3.promptGroup) {
    let c = m.content || '';
    if (isB && c.includes(A3_MARK)) {
      // 在 A3_MARK 后的 {{thugSpawn}} 改为 {{NTRtrack}}
      const idx = c.indexOf(A3_MARK);
      const after = c.slice(idx);
      if (after.includes('{{thugSpawn}}')) { c = c.slice(0, idx) + after.split('{{thugSpawn}}').join('{{NTRtrack}}'); log.push('a3'); }
    } else if (isN && c.includes(B3_MARK)) {
      const idx = c.indexOf(B3_MARK);
      const after = c.slice(idx);
      if (after.includes('{{thugSpawn}}')) { c = c.slice(0, idx) + after.split('{{thugSpawn}}').join('{{NTRtrack}}'); log.push('b3'); }
    }
    m.content = c;
  }
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': ' + log.join('+') + ' OK');
}
console.log('==== DONE (fail=' + fail + ') ====');
process.exit(fail === 0 ? 0 : 1);
