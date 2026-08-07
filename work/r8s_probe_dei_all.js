// Probe: locate G1-G4 OLD candidates in the target file, dump exact bytes
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(p, 'utf8');
console.log('file length:', raw.length);
console.log('starts with [:', raw.trimStart().startsWith('['));

const markers = [
  '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  '刷新成功判定标准',
  'spawn=本轮黄毛在',
  'no_spawn**：本轮无黄毛在',
  '公共空间宽松判定',
  '私密空间严格判定',
  '与 spawn 判定无关',
  '不空刷新**',
  '=no_spawn**',
  '。两种情形：',
];

for (const m of markers) {
  const idxs = [];
  let i = 0;
  while ((i = raw.indexOf(m, i)) !== -1) { idxs.push(i); i += m.length; }
  console.log('\n=== marker:', JSON.stringify(m), 'count:', idxs.length);
  for (const idx of idxs.slice(0, 3)) {
    console.log('  @', idx, 'ctx:', JSON.stringify(raw.slice(Math.max(0, idx - 40), idx + m.length + 30)));
  }
}
