const fs = require('fs');
const path = require('path');
const outDir = 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\_audit_dual\\';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [
  ['male', 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\Cirno_NTRS_turn_edit_1.36.json'],
  ['dei', 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\Cirno_NTRS_turn_edit_DEI_1.35.json'],
];

for (const [tag, p] of files) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const preset = data[0];
  let meta = `name: ${preset.name}\nplotTasks: ${preset.plotTasks.length}\n`;
  for (const t of preset.plotTasks) {
    meta += `- ${t.id} | ${t.name} | stage=${t.stage} order=${t.order} msgs=${t.promptGroup.length} extractTags=${t.extractTags} inject=${t.extractInjectTags} dependsOn=${JSON.stringify(t.agentControl?.dependsOnTaskIds)} minLen=${t.minLength}\n`;
  }
  meta += `\n=== FSD ===\n${preset.finalSystemDirective}\n`;
  meta += `\n=== prompts[2] ===\n${(preset.prompts.find(x=>x.id==='finalSystemDirective')||{}).content}\n`;
  fs.writeFileSync(path.join(outDir, `${tag}_meta.txt`), meta, 'utf8');

  for (const t of preset.plotTasks) {
    let out = `=== ${tag} TASK ${t.id} ${t.name} stage=${t.stage} ===\nextractTags=${t.extractTags}\ndescription=${t.description}\ndependsOn=${JSON.stringify(t.agentControl?.dependsOnTaskIds)}\n\n`;
    for (let i = 0; i < t.promptGroup.length; i++) {
      const m = t.promptGroup[i];
      out += `--- msg[${i}] role=${m.role} ---\n${m.content}\n\n`;
    }
    fs.writeFileSync(path.join(outDir, `${tag}_${t.id}.txt`), out, 'utf8');
  }
  console.log(tag, 'name=', preset.name, 'tasks=', preset.plotTasks.map(t=>t.id).join(','));
}
console.log('out', outDir);