const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const t = j[0];
const out = [];
let header = `TOP name=${t.name}\nFSD len=${t.finalSystemDirective.length}\n`;
out.push('==================== FINAL SYSTEM DIRECTIVE ====================\n');
out.push(t.finalSystemDirective + '\n');
out.push('==================== TOP-LEVEL PROMPT GROUP (if any) ====================\n');
if (Array.isArray(t.promptGroup)) {
  t.promptGroup.forEach((m, i) => {
    out.push(`--- pg[${i}] role=${m.role} len=${m.content.length}\n`);
    out.push(m.content + '\n');
  });
} else {
  out.push('(none)\n');
}
t.plotTasks.forEach((p, ti) => {
  out.push(`\n@@@@@@@@@@@@ TASK ${ti}: ${p.id} name=${p.name} stage=${p.stage} order=${p.order} enabled=${p.enabled} extractTags=${p.extractTags}\n`);
  p.promptGroup.forEach((m, i) => {
    out.push(`------ T${ti}.pg[${i}] role=${m.role} len=${m.content.length} deletable=${m.deletable}\n`);
    out.push(m.content + '\n');
  });
});
const blob = out.join('');
fs.writeFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/_dump_ftallin_4.7.txt', blob, 'utf8');
console.log('total chars:', blob.length);
