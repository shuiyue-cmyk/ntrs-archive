const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
const outDir = 'C:/Users/zouyu/Downloads/BATTLE_work/review_dump';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const out = [];
for (const t of p.plotTasks) {
  out.push(`\n========== TASK: ${t.id} | name=${t.name} | stage=${t.stage} | order=${t.order} ==========`);
  out.push(`description: ${t.description}`);
  out.push(`extractTags: ${t.extractTags}`);
  (t.promptGroup || []).forEach((m, i) => {
    out.push(`\n----- ${t.id} msg[${i}] role=${m.role} len=${m.content.length} -----`);
    out.push(m.content);
  });
}
out.push(`\n========== finalSystemDirective (len ${p.finalSystemDirective.length}) ==========`);
out.push(p.finalSystemDirective);
fs.writeFileSync(outDir + '/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.txt', out.join('\n'), 'utf8');
console.log('dump written, total chars:', out.join('\n').length);
