// Search entire DEI file for A3 anchor variants
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const tasks = {};
for (const t of j[0].plotTasks) tasks[t.id] = t;

const variants = [
  '雄竞期黄毛可以真正赢得',
  '黄毛胜即该对象线终局锁定',
  '雄竞期编排',
  '已站队对象',
  '亲密开局',
  '对象情感倾向影响雄竞难度',
  '竞争张力核验',
];

for (const t of j[0].plotTasks) {
  t.promptGroup.forEach((m, mi) => {
    const c = m.content || '';
    for (const v of variants) {
      const n = c.split(v).length - 1;
      if (n > 0) {
        const i = c.indexOf(v);
        console.log(`[${t.id}] msg[${mi}] role=${m.role} variant="${v}" count=${n}`);
        console.log('  ctx: ' + JSON.stringify(c.slice(Math.max(0, i - 60), i + 160)));
      }
    }
  });
  if (t.description) {
    for (const v of variants) {
      const n = t.description.split(v).length - 1;
      if (n > 0) console.log(`[${t.id}] description variant="${v}" count=${n}`);
    }
  }
}

// also scan whole raw json blob
console.log('\nWHOLE-BLOB scan:');
const blob = JSON.stringify(j);
for (const v of variants) {
  const n = blob.split(v).length - 1;
  if (n > 0) console.log(`  "${v}" in whole blob: ${n}`);
}
