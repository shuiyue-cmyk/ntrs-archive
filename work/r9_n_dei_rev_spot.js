const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const p = j[0];
const searchables = [];
for (const t of p.plotTasks || []) {
  for (const m of (t.promptGroup || [])) searchables.push({ task: t.id || t.name, content: m.content || '' });
  if (t.description) searchables.push({ task: t.id || t.name + '/desc', content: t.description });
}
if (p.finalSystemDirective) searchables.push({ task: 'FSD', content: p.finalSystemDirective });

function show(needle, ctx = 90) {
  for (const s of searchables) {
    const i = s.content.indexOf(needle);
    if (i >= 0) {
      const a = Math.max(0, i - 30), b = Math.min(s.content.length, i + needle.length + ctx);
      console.log(`[${s.task}]\n  ...${JSON.stringify(s.content.slice(a, b))}...\n`);
      return;
    }
  }
  console.log('NOT FOUND: ' + needle);
}

console.log('=== B1 NEW ==='); show('若本轮 spawn 且存在背景板');
console.log('=== B2 NEW ==='); show('📹 事后知情仅限察觉型 41% 起');
console.log('=== B3 NEW ==='); show('锁定指令：锁定 / 维持背景板（调度指令');
console.log('=== B3b NEW ==='); show('正文 AI 忽略即可，人设字段才用于正文');
console.log('=== B4 NEW ==='); show('以 黄毛表 progress_percent 为准');
console.log('=== B5 NEW ==='); show('判断该黄毛本轮在场/出场是否合理');
console.log('=== B8 NEW ==='); show('locked_target（即「锁定目标/锁定对象」列）');
console.log('=== B10 NEW ==='); show('为同义调度行，与「锁定状态」一致');
// structure sanity
console.log('plotTasks count:', (p.plotTasks || []).length);
console.log('plotTasks ids:', (p.plotTasks || []).map(t => t.id || t.name).join(', '));
console.log('task keys:', Object.keys(p).filter(k => ['plotTasks', 'finalSystemDirective', 'name', 'extractTags'].includes(k)).join(', '));
