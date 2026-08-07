// Probe: dump exact context around every R8 marker in the JSON, byte-accurate.
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
console.log('TOP_ARRAY:', Array.isArray(j), 'len:', j.length);
const p = j[0];
console.log('name:', p.name);
console.log('plotTasks:', (p.plotTasks||[]).length);

function findAll(hay, needle) {
  const out = [];
  let i = 0;
  while ((i = hay.indexOf(needle, i)) !== -1) { out.push(i); i += needle.length; }
  return out;
}

const markers = [
  '出场可能性判定',
  '刷新成功判定标准',
  'spawn=本轮黄毛在当前场景在场',
  '本轮无黄毛在当前场景在场',
  '② 分支A——已有追踪黄毛',
  '③ 分支A——已有追踪黄毛',
  '（锁定目标 [对象名]）',
  '**若黄毛与对象均在',
  '场景外标注',
  'thugSpawn 状态=no_spawn',
  '目标离场时黄毛仍可',
  '近身契机',
  'prologue 不展开该场景外戏',
];

const blobs = [];
for (const t of p.plotTasks || []) {
  for (const m of t.promptGroup || []) blobs.push({ role: m.role, s: m.content || '' });
  blobs.push({ role: 'TASK.descr', s: t.description || '' });
}
blobs.push({ role: 'FSD', s: p.finalSystemDirective || '' });

for (const mk of markers) {
  console.log('\n======== MARKER: ' + mk + ' ========');
  for (const b of blobs) {
    const hits = findAll(b.s, mk);
    if (hits.length) {
      for (const h of hits) {
        const start = Math.max(0, h - 60);
        const end = Math.min(b.s.length, h + mk.length + 700);
        console.log('--- [' + b.role + '] hit@' + h + ' ---');
        console.log(JSON.stringify(b.s.slice(start, end)));
      }
    }
  }
}
