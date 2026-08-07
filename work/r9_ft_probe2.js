// Dump exact contexts for A12/A13/A14 and both A15 occurrences
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;

const fields = [];
fields.push({ loc: 'FSD', val: p.finalSystemDirective });
for (const t of (p.plotTasks || [])) {
  fields.push({ loc: `desc:${t.id}`, val: t.description });
  (t.promptGroup || []).forEach((m, i) => fields.push({ loc: `${t.id}[${i}]:${m.role}`, val: m.content }));
}

function dumpAll(sub) {
  for (const f of fields) {
    if (!f.val) continue;
    let idx = 0;
    while ((idx = f.val.indexOf(sub, idx)) !== -1) {
      console.log(`--- loc=${f.loc} idx=${idx}`);
      console.log(JSON.stringify(f.val.slice(Math.max(0, idx - 120), Math.min(f.val.length, idx + sub.length + 220))));
      idx += sub.length;
    }
  }
}

console.log('===== A12 (男娘系黄毛败·友好（天意待触发）) =====');
dumpAll('男娘系黄毛败·友好（天意待触发）不算闭合');

console.log('===== A13 (黄毛以朋友身份可写入登场名单) =====');
dumpAll('黄毛以朋友身份可写入登场名单');

console.log('===== A14 (后续轮回归 no-act) =====');
dumpAll('黄毛败·友好的后续轮回归 no-act');

console.log('===== A15 all occurrences (场景外行动 {{user}} 必不在场) =====');
dumpAll('（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）');

console.log('===== A16 context =====');
dumpAll('黄毛作为本轮正式登场角色（竞争者）');
