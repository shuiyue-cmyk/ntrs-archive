const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('top-level type:', Array.isArray(j) ? 'ARRAY' : typeof j, 'len:', j.length);
const root = j[0];
console.log('root keys:', Object.keys(root).join(', '));
console.log('root name:', root.name);

const texts = [];
if (Array.isArray(root.plotTasks)) {
  root.plotTasks.forEach((t, i) => {
    const label = `plotTasks[${i}].name=${JSON.stringify(t.name)}`;
    if (typeof t.description === 'string') texts.push({ label: `${label}.description`, text: t.description });
    if (Array.isArray(t.promptGroup)) {
      t.promptGroup.forEach((pg, k) => {
        if (pg && typeof pg.content === 'string') {
          texts.push({ label: `${label}.promptGroup[${k}].content`, text: pg.content });
        }
      });
    }
  });
}
if (typeof root.finalSystemDirective === 'string') {
  texts.push({ label: 'j[0].finalSystemDirective', text: root.finalSystemDirective });
}

console.log('\n=== text fields ===');
texts.forEach((t, i) => console.log(`[${i}] ${t.label} (len=${t.text.length})`));

const phrases = [
  'prologue：仅一行',
  '事后知情或 🌙 完全不知的暗线戏',
  '锁定指令：锁定',
  '维持背景板',
  '判断该黄毛本轮是否可行动',
  '判断该黄毛本轮在场是否合理',
  '锁定目标列表非空',
  '锁定目标列表为空',
  '锁定状态字段',
  '锁定状态=真正锁定',
  '锁定状态=仅背景板',
  '上轮%',
  '上轮阶段名',
  '从概览/前文/上轮 stage 读',
  'progress_percent',
  'thugSpawn> 标签内只放刷新状态',
  '第三者·[五型]',
  '潜在黄毛[未锁定·背景板]',
  '真正锁定（至少一个目标已真正锁定）',
  '快速通道',
  '黄毛表 progress_percent 为准',
];
console.log('\n=== phrase hits ===');
phrases.forEach(p => {
  const hits = texts.filter(t => t.text.includes(p));
  console.log(`--- "${p}" => ${hits.length} hit(s): ${hits.map(h => h.label).join(', ') || 'NONE'}`);
});
