const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const searchables = [];
for (const t of p.plotTasks) {
  for (const m of (t.promptGroup || [])) searchables.push({ task: t.id || t.name, content: m.content || '' });
  if (t.description) searchables.push({ task: t.id || t.name, content: t.description });
}
if (p.finalSystemDirective) searchables.push({ task: 'FSD', content: p.finalSystemDirective });

function showAll(needle, ctx = 250) {
  console.log('\n===== ' + needle + ' =====');
  let n = 0;
  for (const s of searchables) {
    let i = 0;
    while ((i = s.content.indexOf(needle, i)) >= 0) {
      n++;
      const a = Math.max(0, i - 120), b = Math.min(s.content.length, i + needle.length + ctx);
      console.log(`\n[${s.task}] hit#${n}:`);
      console.log(JSON.stringify(s.content.slice(a, b)));
      i += needle.length;
    }
  }
  if (n === 0) console.log('  (0 hits)');
}

// B3 part 2: 标签内只放刷新状态+人设 anchor
showAll('只放刷新状态');
// B4 exact substring
showAll('从概览/前文/上轮 stage 读');
// B1: check exact 15字 literal presence and count in raw
const lit = `- prologue：仅一行「跟随{{user}}输入的主线走，本轮黄毛不出手，剧情按输入自然推进」（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）`;
console.log('\nB1 literal raw count:', raw.split(lit).length - 1);
// B2 exact
console.log('B2 raw count:', raw.split('属 📹 事后知情或 🌙 完全不知的暗线戏').length - 1);
// B3 literal
console.log('B3 raw count:', raw.split('- 锁定指令：锁定 / 维持背景板').length - 1);
// B8 in parsed blob count
const blob = searchables.map(s => s.content).join('\n---\n');
console.log('B8 searchable count:', blob.split('locked_target 命中本轮登场名单里某💔敏感角色名即"该目标已绑定黄毛"').length - 1);
// B10: 锁定指令 mentions
showAll('锁定指令');
