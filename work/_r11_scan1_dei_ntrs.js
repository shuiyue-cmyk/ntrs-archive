const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;
const blobs = [];
(o.plotTasks || []).forEach((t, ti) => {
  (t.promptGroup || []).forEach((m, mi) => {
    blobs.push({ label: `T${ti}.pg[${mi}] ${m.role}`, content: String(m.content) });
  });
});
['本轮黄毛能否进入 {{user}} 当前场景画面', '当前场景画面', '进入画面路径', '进入该私密空间画面'].forEach((n) => {
  let t = 0;
  console.log(`\n== needle: ${JSON.stringify(n)}`);
  blobs.forEach((b) => {
    let idx = b.content.indexOf(n);
    while (idx !== -1) {
      t++;
      console.log(`  ${b.label} idx=${idx} ctx=${JSON.stringify(b.content.slice(Math.max(0, idx - 50), idx + n.length + 50))}`);
      idx = b.content.indexOf(n, idx + n.length);
    }
  });
  console.log(`  total=${t}`);
});
