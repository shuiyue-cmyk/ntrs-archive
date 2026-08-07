const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;

const out = [];
out.push('=== TOP ===');
out.push('top-level array: ' + Array.isArray(j));
out.push('name: ' + p.name);
out.push('=== finalSystemDirective ===');
out.push(p.finalSystemDirective);
out.push('');
out.push('=== plotTasks ===');
for (const t of p.plotTasks) {
  out.push('');
  out.push('----- TASK: ' + t.id + ' | ' + t.name + ' | stage=' + t.stage + ' | order=' + t.order + ' | enabled=' + t.enabled + ' -----');
  out.push('description: ' + t.description);
  if (t.promptGroup && Array.isArray(t.promptGroup)) {
    for (let i = 0; i < t.promptGroup.length; i++) {
      const m = t.promptGroup[i];
      out.push('');
      out.push(`--- promptGroup[${i}] role=${m.role} deletable=${m.deletable} len=${(m.content || '').length} ---`);
      out.push(m.content);
    }
  }
}
fs.writeFileSync('C:/Users/zouyu/Downloads/BATTLE_work/review_dump/Cirno_NTRS_turn_edit_FT_ALLin_4.7.txt', out.join('\n'), 'utf8');
console.log('dump written, tasks:', p.plotTasks.length);
