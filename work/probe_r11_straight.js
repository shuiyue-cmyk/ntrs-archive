const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('top array:', Array.isArray(j), 'items:', j.length);

const anchors = [
  ['I1', '接下来的场景中该黄毛是否有出现的可能', 0],
  ['I2', '线已闭合的对象（黄毛胜·终局/黄毛败·友好）视为仍绑定', 0],
  ['I4', '本节登场角色分析、八题自检、sparkNotes 一律跳过', 0],
  ['I5', '（不复述用户输入原文，仅作一行主线指示，行文不少于 15 字）', 0],
  ['I6', '黄毛是否已写入 prologue 登场角色名单', 0],
  ['I9', '👁️ **明面竞争**', 0],
  ['I10', '**<thugSpawn> 标签内只放刷新状态+黄毛人设（会经 FSD 给花火·正文）**', 0],
];

// search across ALL promptGroup contents (recursive) + description/name fields
function walk(o, path) {
  if (typeof o === 'string') return [[path, o]];
  if (Array.isArray(o)) {
    const out = [];
    o.forEach((v, i) => out.push(...walk(v, path + '[' + i + ']')));
    return out;
  }
  if (o && typeof o === 'object') {
    const out = [];
    for (const k of Object.keys(o)) out.push(...walk(o[k], path + '.' + k));
    return out;
  }
  return [];
}

const strings = [];
j.forEach((obj, idx) => strings.push(...walk(obj, 'j[' + idx + ']')));

for (const [label, anchor] of anchors) {
  const hits = strings.filter(([p, s]) => s.includes(anchor));
  console.log('\n==== ' + label + ' ==== hits=' + hits.length);
  for (const [p, s] of hits) {
    const i = s.indexOf(anchor);
    console.log('path=' + p);
    console.log('CONTEXT: ' + JSON.stringify(s.slice(Math.max(0, i - 120), i + 220)));
  }
}
