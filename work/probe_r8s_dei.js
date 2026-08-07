const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');

// Probes: prefix -> where the OLD string should start per spec
const probes = {
  G1: '以 **{{user}} 本轮当前场景画面** 为唯一基准',
  G2: '**刷新成功判定标准 = 本轮黄毛能否进入',
  G3: '**spawn=本轮黄毛在',
  G4: '- **no_spawn**：本轮无黄毛在',
};
for (const [g, start] of Object.entries(probes)) {
  const i = raw.indexOf(start);
  console.log(`=== ${g}: indexOf(${JSON.stringify(start.slice(0, 20))}...) = ${i}`);
  if (i >= 0) {
    // print a window starting a bit before to catch indentation, ending far enough
    const from = Math.max(0, i - 40);
    console.log(JSON.stringify(raw.slice(from, i + 700)));
  }
}
// also find 与 spawn 判定无关。 and 两种情形： to know endpoints
for (const tail of ['与 spawn 判定无关。', '两种情形：', '不空刷新**', '=no_spawn**']) {
  console.log(`tail ${JSON.stringify(tail)} lastIndex=${raw.lastIndexOf(tail)}`);
}
