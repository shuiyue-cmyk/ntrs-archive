// T41 修正：从 .bak-pre-noq 恢复 S3-MSG0 原始快速通道段（撤销错误的"废止"改动）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_(NTRS_turn_edit|BATTLE_Turn).*\.json$/.test(f));

// 从备份提取 S3-MSG0 的快速通道段（从"【快速通道"到"恢复完整导演分析。"结尾）
function extractFast(raw) {
  const j = JSON.parse(raw);
  const o = Array.isArray(j) ? j[0] : j;
  const m0 = o.plotTasks.find(t => t.name === '导演台本').promptGroup[0].content;
  const si = m0.indexOf('【快速通道');
  if (si < 0) return null;
  const endMark = '恢复完整导演分析。';
  const ei = m0.indexOf(endMark, si);
  if (ei < 0) return null;
  return m0.slice(si, ei + endMark.length);
}

// 当前文件的快速通道段边界（两种可能标题）
function findCurrentFast(m0) {
  const starts = ['【快速通道', '【no-act 编排', '【快速通道与 no-act'];
  let si = -1;
  for (const s of starts) {
    const i = m0.indexOf(s);
    if (i >= 0) { si = i; break; }
  }
  if (si < 0) return null;
  // 结束标记：快速通道段在"【用户本轮输入】"或"【本轮黄毛"之前
  const endMarks = ['【用户本轮输入】', '**【用户本轮输入】', '【本轮黄毛'];
  let ei = -1;
  for (const e of endMarks) {
    const i = m0.indexOf(e, si + 10);
    if (i >= 0) { ei = i; break; }
  }
  if (ei < 0) ei = si + 600;
  return { si, ei };
}

let ok = 0, fail = [];
for (const fn of files) {
  const bak = base + fn.replace('.json', '') + '.bak-pre-noq';
  if (!fs.existsSync(bak)) { fail.push(fn + ':无备份'); continue; }
  const fastFromBak = extractFast(fs.readFileSync(bak, 'utf8'));
  if (!fastFromBak) { fail.push(fn + ':备份无快速通道段'); continue; }

  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const m0 = o.plotTasks.find(t => t.name === '导演台本').promptGroup[0];
  const cur = m0.content;
  const curFast = findCurrentFast(cur);
  if (!curFast) { fail.push(fn + ':当前无快速通道段'); continue; }

  // 替换：当前段 → 备份段（保持段前内容不变）
  m0.content = cur.slice(0, curFast.si) + fastFromBak + cur.slice(curFast.ei);
  fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
  ok++;
  console.log(fn.replace(/^Cirno_NTRS_turn_edit_|^Cirno_BATTLE_Turn_|\.json$/g, '') + ': 恢复快速通道 ✓');
}
console.log('恢复: ' + ok + '/' + files.length);
if (fail.length) console.log('失败:', fail.join(' | '));
