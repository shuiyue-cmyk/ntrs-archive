const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);

function walk(o, p) {
  if (typeof o === 'string') return [[p, o]];
  if (Array.isArray(o)) { const out = []; o.forEach((v, i) => out.push(...walk(v, p + '[' + i + ']'))); return out; }
  if (o && typeof o === 'object') { const out = []; for (const k of Object.keys(o)) out.push(...walk(o[k], p + '.' + k)); return out; }
  return [];
}
const strings = [];
j.forEach((obj, idx) => strings.push(...walk(obj, 'j[' + idx + ']')));

const partials = ['会经 FSD 给花火·正文', '<thugSpawn> 标签内只放刷新状态', 'FSD 给花火·正文', '刷新状态+黄毛人设'];
for (const a of partials) {
  const hits = strings.filter(([p, s]) => s.includes(a));
  console.log('\n==== ' + a + ' ==== hits=' + hits.length);
  for (const [p, s] of hits) {
    const i = s.indexOf(a);
    console.log('path=' + p);
    console.log('CTX: ' + JSON.stringify(s.slice(Math.max(0, i - 100), i + 200)));
  }
}
// also count how many times thugSpawn label phrase variants appear in S2 msg[4] (task_rules)
const s2rules = strings.find(([p]) => p.includes('plotTasks[1].promptGroup[4]'))[1];
const idx = s2rules.indexOf('标签内只放');
console.log('\nS2 rules "标签内只放" count:', (s2rules.match(/标签内只放/g) || []).length);
for (let i = 0; i < s2rules.length; ) {
  const k = s2rules.indexOf('标签内只放', i);
  if (k === -1) break;
  console.log('@' + k + ' CTX: ' + JSON.stringify(s2rules.slice(Math.max(0, k - 60), k + 120)));
  i = k + 1;
}
