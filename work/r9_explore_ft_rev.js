// Explore script: locate exact OLD strings for Part B items in FT_revise preset
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];

// collect all text-bearing fields
const blobs = [];
function walk(o, label) {
  if (typeof o === 'string') blobs.push({ label, s: o });
  else if (Array.isArray(o)) o.forEach((v, i) => walk(v, label + '[' + i + ']'));
  else if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k], label + '.' + k));
}
p.plotTasks.forEach((t, i) => walk(t, 'plotTasks[' + i + ']'));
walk(p.finalSystemDirective, 'finalSystemDirective');
walk(p.promptGroup, 'topPromptGroup');

const candidates = [
  ['B1', '跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进'],
  ['B1b', '- prologue：仅一行「跟随{{user}}输入的主线走'],
  ['B2', '属 📹 事后知情或 🌙 完全不知的暗线戏'],
  ['B3', '锁定指令：锁定 / 维持背景板'],
  ['B3b', '<thugSpawn> 标签内只放刷新状态+黄毛人设'],
  ['B4a', '上轮阶段名+上轮% 从概览/前文/上轮 stage 读'],
  ['B4b', '上轮% 从概览/前文/上轮 stage 读'],
  ['B4c', 'progress_percent 为准'],
  ['B5', '判断该已有黄毛本轮是否可行动'],
  ['B5b', '判断该黄毛本轮是否可行动'],
  ['B8', 'locked_target 命中本轮登场名单里某💔敏感角色名'],
  ['B10a', '锁定状态=真正锁定'],
  ['B10b', '仅背景板'],
  ['B10c', '锁定指令：'],
  ['B10d', '真正锁定'],
];

for (const [tag, needle] of candidates) {
  let total = 0;
  const hits = [];
  for (const { label, s } of blobs) {
    let idx = -1, count = 0;
    const positions = [];
    while ((idx = s.indexOf(needle, idx + 1)) !== -1) {
      count++;
      positions.push(idx);
    }
    if (count) {
      total += count;
      hits.push({ label, count, positions: positions.slice(0, 5) });
    }
  }
  console.log('=== ' + tag + ' | ' + JSON.stringify(needle) + ' | total=' + total);
  for (const h of hits) {
    const s = blobs.find(b => b.label === h.label).s;
    h.positions.forEach(pos => {
      const before = JSON.stringify(s.slice(Math.max(0, pos - 60), pos));
      const after = JSON.stringify(s.slice(pos + needle.length, pos + needle.length + 80));
      console.log('  [' + h.label + '] x' + h.count + ' @' + pos + ' ...' + before + ' >>> ' + JSON.stringify(needle) + ' >>> ' + after + '...');
    });
  }
}
