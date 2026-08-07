const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('top-level array:', Array.isArray(j), 'len:', j.length);
const t = j[0];
const out = [];
out.push(`TOP name=${t.name}\n`);
out.push('==================== FINAL SYSTEM DIRECTIVE ====================\n');
out.push(t.finalSystemDirective + '\n');
out.push('==================== TOP-LEVEL PROMPT GROUP ====================\n');
if (Array.isArray(t.promptGroup)) {
  t.promptGroup.forEach((m, i) => {
    out.push(`--- pg[${i}] role=${m.role} len=${m.content.length}\n`);
    out.push(m.content + '\n');
  });
} else {
  out.push('(none)\n');
}
t.plotTasks.forEach((p, ti) => {
  out.push(`\n@@@@@@@@@@@@ TASK ${ti}: id=${p.id} name=${p.name} stage=${p.stage} order=${p.order} enabled=${p.enabled}\n`);
  if (p.description !== undefined && p.description !== null && p.description !== '') {
    out.push(`===== TASK ${ti} DESCRIPTION =====\n`);
    out.push(p.description + '\n');
  }
  (p.promptGroup || []).forEach((m, i) => {
    out.push(`------ T${ti}.pg[${i}] role=${m.role} len=${m.content.length}\n`);
    out.push(m.content + '\n');
  });
});
const blob = out.join('');
fs.writeFileSync('C:/Users/zouyu/Downloads/BATTLE_work/review_dump/Cirno_NTRS_turn_edit_FT_revise_4.7.txt', blob, 'utf8');
console.log('dump total chars:', blob.length);
