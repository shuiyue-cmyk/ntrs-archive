// Pre-modification review dump for Cirno_NTRS_turn_edit_FT_4.7.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_4.7.json';
const out = 'C:/Users/zouyu/Downloads/BATTLE_work/review_dump/Cirno_NTRS_turn_edit_FT_4.7.txt';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
let lines = [`# ${p.name} — pre-R8 dump (NTRS extension)`];
p.plotTasks.forEach((t, i) => {
  lines.push(`\n===== plotTask ${i}: id=${t.id} name=${t.name} stage=${t.stage} order=${t.order} =====`);
  lines.push(`--- description ---\n${t.description}`);
  (t.promptGroup || []).forEach((m, mi) => {
    lines.push(`\n--- promptGroup[${mi}] role=${m.role} len=${(m.content || '').length} ---`);
    lines.push(m.content || '');
  });
});
lines.push(`\n===== finalSystemDirective =====\n${p.finalSystemDirective}`);
fs.mkdirSync('C:/Users/zouyu/Downloads/BATTLE_work/review_dump', { recursive: true });
fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log('dump written:', out, lines.length, 'sections');
