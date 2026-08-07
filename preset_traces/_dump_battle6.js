// dump 6 BATTLE preset files to a single audit txt with line ranges per file
const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = [
  'Cirno_BATTLE_Turn_straight.json',
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
const out = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const p = Array.isArray(j) ? j[0] : j;
  out.push(`########## FILE START: ${f} ##########`);
  out.push(`name: ${p.name}`);
  out.push(`recallCount: ${p.recallCount}`);
  out.push(`contextTurnCount: ${p.contextTurnCount}`);
  out.push(`extractTags(top): ${p.extractTags} | extractInjectTags(top): ${p.extractInjectTags}`);
  out.push(`---- FSD ----`);
  out.push(p.finalSystemDirective || '(none)');
  out.push(`---- TASKS ----`);
  for (const t of (p.plotTasks || [])) {
    out.push(`== TASK id=${t.id} name=${t.name} stage=${t.stage} order=${t.order} extractTags=${t.extractTags} extractInjectTags=${t.extractInjectTags} dependsOn=${JSON.stringify((t.agentControl || {}).dependsOnTaskIds || [])} minLength=${t.minLength} maxRetries=${t.maxRetries} mergeStrategy=${t.mergeStrategy}`);
    out.push(`-- description --`);
    out.push(t.description || '(none)');
    out.push(`-- promptGroup (${(t.promptGroup || []).length} msgs) --`);
    (t.promptGroup || []).forEach((m, i) => {
      out.push(`[msg${i}] role=${m.role} deletable=${m.deletable} len=${(m.content || '').length}`);
      out.push(m.content || '');
    });
  }
  if (p.promptGroup && p.promptGroup.length) {
    out.push(`-- TOP promptGroup (${p.promptGroup.length} msgs) --`);
    p.promptGroup.forEach((m, i) => {
      out.push(`[topmsg${i}] role=${m.role} deletable=${m.deletable} len=${(m.content || '').length}`);
      out.push(m.content || '');
    });
  }
  out.push(`########## FILE END: ${f} ##########`);
  out.push('');
}
const txt = out.join('\n');
fs.writeFileSync(path.join(dir, '_audit_battle6.txt'), txt, 'utf8');
console.log('total chars:', txt.length);
console.log('total lines:', txt.split('\n').length);
