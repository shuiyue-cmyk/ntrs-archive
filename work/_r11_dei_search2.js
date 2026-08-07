const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];

const locations = [];
locations.push({ label: 'T0', blob: JSON.stringify(p.plotTasks[0]) });
locations.push({ label: 'T1', blob: JSON.stringify(p.plotTasks[1]) });
locations.push({ label: 'T2', blob: JSON.stringify(p.plotTasks[2]) });
locations.push({ label: 'FSD', blob: JSON.stringify(p.finalSystemDirective || '') });
locations.push({ label: 'TOP-PG', blob: JSON.stringify(p.promptGroup) });

const partials = [
  '竞争者·[五型]',
  '登场角色名单',
  '雄竞期标注',
  '并标线状态',
  '标签内只放刷新状态',
  '会经 FSD 给花火',
  '刷新状态+黄毛人设',
  'thugSpawn> 标签内',
  '规则 1b',
  '规则1b',
  ' 1b',
  '1b 的',
  '恢复完整导演分析',
  '用户本轮输入',
  '快速通道',
];

for (const needle of partials) {
  const hits = [];
  for (const loc of locations) {
    let idx = loc.blob.indexOf(needle);
    while (idx !== -1) {
      hits.push({ loc: loc.label, idx });
      idx = loc.blob.indexOf(needle, idx + 1);
    }
  }
  if (hits.length === 0) {
    console.log(`PARTIAL "${needle}": NOT FOUND anywhere`);
  } else {
    hits.forEach(h => {
      const loc = locations.find(l => l.label === h.loc);
      const start = Math.max(0, h.idx - 20);
      const ctx = JSON.stringify(loc.blob.slice(start, h.idx + needle.length + 40));
      console.log(`PARTIAL "${needle}": ${hits.length} hits, first in ${h.loc} @${h.idx}: ...${ctx}...`);
    });
  }
}
