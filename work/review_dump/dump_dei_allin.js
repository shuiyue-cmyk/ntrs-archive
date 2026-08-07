// Dump DEI_ALLin preset content for review
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const out = [];
const root = j[0];
out.push('=== top keys ===');
out.push(Object.keys(root).join(', '));
out.push('=== finalSystemDirective ===');
out.push(root.finalSystemDirective || '(none)');
root.plotTasks.forEach((t, i) => {
  out.push(`\n\n########## plotTask ${i}: ${t.task || t.name} ##########`);
  if (t.description !== undefined) {
    out.push(`\n--- task.description ---\n${t.description}`);
  }
  if (Array.isArray(t.promptGroup)) {
    t.promptGroup.forEach((m, mi) => {
      out.push(`\n--- promptGroup[${mi}] (${m.role}) ---`);
      out.push(m.content || '');
    });
  }
});
fs.writeFileSync('C:/Users/zouyu/Downloads/BATTLE_work/review_dump/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.txt', out.join('\n'), 'utf8');
console.log('dump written, length:', out.join('\n').length);
