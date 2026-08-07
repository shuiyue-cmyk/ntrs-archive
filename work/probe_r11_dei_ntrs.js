// Probe anchors for fix_spec_r11 items 1,9,15-30 on Cirno_BATTLE_Turn_DEI_NTRS.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;
console.log('top keys:', Object.keys(o));
console.log('plotTasks count:', (o.plotTasks || []).length);
(o.plotTasks || []).forEach((t, ti) => {
  console.log(`TASK ${ti}: id=${t.id} name=${JSON.stringify(t.name)} stage=${t.stage} order=${t.order} extractTags=${t.extractTags} enabled=${t.enabled}`);
  (t.promptGroup || []).forEach((m, mi) => {
    console.log(`  [${ti}.${mi}] role=${m.role} len=${(m.content || '').length} head=${JSON.stringify((m.content || '').slice(0, 40))}`);
  });
});
console.log('FSD len:', (o.finalSystemDirective || '').length);

const blobs = [];
(o.plotTasks || []).forEach((t, ti) => {
  (t.promptGroup || []).forEach((m, mi) => {
    blobs.push({ label: `T${ti}.pg[${mi}] ${m.role}`, content: String(m.content) });
  });
});
blobs.push({ label: 'finalSystemDirective', content: String(o.finalSystemDirective) });

const anchors = [
  ['1', '接下来的场景中该黄毛是否有出现的可能'],
  ['9', '明面竞争'],
  ['15', '即使对象已站队'],
  ['16', '亲情/义亲目标不豁免'],
  ['16b', '亲情/义亲目标计入亲密开局分流'],
  ['17', '已站队的对象（已是'],
  ['18x', '三种线状态'],
  ['18a', '雄竞期/NTRS期/黄毛胜·终局'],
  ['18b', '线状态判定'],
  ['19', '首轮基线'],
  ['20', '推波助澜'],
  ['21', '当前阶段'],
  ['22', 'NTRS期→淫妻戏'],
  ['23', '事后知情仅限已入 NTRS期'],
  ['24', '对象与 {{user}} 是恋人'],
  ['24b', '对象已站队→亲密开局分流'],
  ['24c', '对象已站队走亲密开局分流'],
  ['25', '对象情感倾向影响雄竞难度'],
  ['26', '本版淫妻线从察觉型（41%）起步'],
  ['27', '41% 起步'],
  ['29', '不可避XP'],
  ['30', '竞争者'],
];

for (const [tag, anchor] of anchors) {
  let total = 0;
  console.log(`\n===== ANCHOR [${tag}] : ${JSON.stringify(anchor)}`);
  blobs.forEach((b) => {
    let idx = b.content.indexOf(anchor);
    while (idx !== -1) {
      total++;
      const from = Math.max(0, idx - 70);
      const to = Math.min(b.content.length, idx + anchor.length + 180);
      console.log(`--- [${tag}] ${b.label} idx=${idx}`);
      console.log(JSON.stringify(b.content.slice(from, to)));
      idx = b.content.indexOf(anchor, idx + anchor.length);
    }
  });
  if (total === 0) console.log(`*** [${tag}] NOT FOUND anywhere`);
  else console.log(`[${tag}] total occurrences: ${total}`);
}
