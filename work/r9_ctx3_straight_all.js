const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const t2 = j[0].plotTasks[2];

['跟随{{user}}输入的主线走', '快速通道', '不复述用户输入原文', '暗线戏'].forEach(p => {
  console.log(`--- "${p}" ---`);
  t2.promptGroup.forEach((pg, i) => {
    if (pg.content && pg.content.includes(p)) {
      console.log(`  pg[${i}] (len=${pg.content.length})`);
    }
  });
});
console.log('\n--- 导演台本 promptGroup[1] FULL ---');
console.log(JSON.stringify(t2.promptGroup[1].content));
console.log('\n--- 导演台本 promptGroup[7] FULL (first 600) ---');
console.log(JSON.stringify(t2.promptGroup[7].content.slice(0, 600)));
