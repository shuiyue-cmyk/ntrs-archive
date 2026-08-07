// Spot-check final rendered context of key edits
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = j[0];

const find = (anchor, before = 70, after = 260) => {
  for (const t of o.plotTasks) {
    for (const m of t.promptGroup) {
      const c = String(m.content);
      const i = c.indexOf(anchor);
      if (i !== -1) {
        console.log(`--- ${t.id} / pg: [.. ${anchor.slice(0, 24)} ..]`);
        console.log(JSON.stringify(c.slice(Math.max(0, i - before), i + after)));
        console.log();
        return;
      }
    }
  }
  console.log('*** NOT FOUND:', anchor.slice(0, 40));
};

find('有没有尚无黄毛的角色', 20, 220);              // item 1
find('线已定对象（黄毛胜·终局=线锁定非闭合', 60, 80); // item 2
find('黄毛胜·终局：对象嫁黄毛、**线锁定非闭合**', 30, 90); // item 3
find('九题自检', 30, 60);                          // item 4
find('若场上存在已闭合（黄毛败·友好）对象', 90, 120);  // item 5
find('名单标注为导演台本内部调度', 70, 90);           // item 6
find('不再有行动判定（**男娘系黄毛除外**', 60, 90);    // item 7
find('黄毛败·友好线闭合不再判定（男娘系除外', 40, 80);  // item 7note
find('<plot> 内是否出现任何进度标签？', 20, 60);       // item 8
find('👁️ **明面竞争（在场见证）**', 20, 60);          // item 9
find('⚠️ **<thugSpawn> 标签内只放刷新状态', 0, 200);  // item 10
find('- Log：仅一行「no-act，快速通道输出」', 0, 120);  // item 11
find('本版全员男娘系无正常男性分支——黄毛败·友好', 50, 80); // 12a
find('其他败·友好黄毛按剧情自然可淡出', 60, 80);        // 12b
