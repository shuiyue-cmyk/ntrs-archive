// R9 PART B check: verify OLD strings (byte-exact) exist in Cirno_NTRS_turn_edit_DEI_revise_4.7.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('topLevelArray:', Array.isArray(j), 'rawStarts[', raw.trimStart().startsWith('['));

// Gather all searchable strings: promptGroup content + description + finalSystemDirective
const searchables = [];
const p = j[0];
for (const t of p.plotTasks) {
  for (const m of (t.promptGroup || [])) searchables.push(m.content || '');
  if (t.description) searchables.push(t.description);
}
if (p.finalSystemDirective) searchables.push(p.finalSystemDirective);
const blob = searchables.join('\n---\n');
const fullBlob = raw;

function count(str) {
  return fullBlob.split(str).length - 1;
}
function countS(str) {
  return blob.split(str).length - 1;
}

const pairs = {
  B1_old: `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`,
  B2_old: `属 📹 事后知情或 🌙 完全不知的暗线戏`,
  B3_old: `- 锁定指令：锁定 / 维持背景板`,
  B4_oldA: `上轮阶段名+上轮% 从概览/前文/上轮 stage 读`,
  B4_oldB: `上轮% 从概览/前文/上轮 stage 读`,
  B5_old: `判断该已有黄毛本轮是否可行动（合理→spawn，不合理→no_spawn）`,
  B8_old: `locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"`,
  B10_probe: `锁定状态=真正锁定/仅背景板`,
  B10_probe2: `锁定状态`,
  B3_probe_allin: `- 锁定指令：锁定 [新增目标名]`,
};

for (const [k, v] of Object.entries(pairs)) {
  console.log(`${k}: raw=${count(v)} searchable=${countS(v)}`);
}

// Show indentation around B1 first occurrence
const i1 = fullBlob.indexOf(pairs.B1_old);
if (i1 >= 0) {
  const lineStart = fullBlob.lastIndexOf('\n', i1) + 1;
  console.log('B1 line prefix repr:', JSON.stringify(fullBlob.slice(lineStart, i1)));
}
// Show B4 variant context: find lines containing 上轮% 
const lines = fullBlob.split('\n');
lines.forEach((l, i) => {
  if (l.includes('上轮%')) console.log('line', i, ':', l.trim().slice(0, 120));
});
