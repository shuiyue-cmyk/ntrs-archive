const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = Array.isArray(j) ? j[0] : j;
console.log('topLevelIsArray:', Array.isArray(j));
console.log('name:', p.name);
console.log('rootKeys:', Object.keys(p).join(','));
if (p.plotTasks) {
  p.plotTasks.forEach((t) =>
    console.log(
      JSON.stringify({
        id: t.id,
        name: t.name,
        stage: t.stage,
        order: t.order,
        enabled: t.enabled,
        extractTags: t.extractTags,
        extractInjectTags: t.extractInjectTags,
        minLength: t.minLength,
        mergeStrategy: t.mergeStrategy,
        dependsOnTaskIds: t.agentControl ? t.agentControl.dependsOnTaskIds : undefined,
        msgCount: t.promptGroup ? t.promptGroup.length : '?',
      })
    )
  );
  console.log('FSD len:', (p.finalSystemDirective || '').length);
  console.log('FSD:', JSON.stringify(p.finalSystemDirective));
} else {
  console.log('NO plotTasks; top-level promptGroup count:', (p.promptGroup || []).length);
}
