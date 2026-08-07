// r8s probe for Cirno_BATTLE_Turn_FT_NTRS.json
// Verify spec G1..G4 OLD strings against current file text, count occurrences.
const fs = require('fs');
const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(FILE, 'utf8');
const j = JSON.parse(raw);
const blob = JSON.stringify(j);

const olds = {
  G1: `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`,
  G2: `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`,
  G3: `**spawn=本轮黄毛在 {{user}} 当前场景画面内在场（或本轮新刷新进入画面）；黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪/场景外行动）=no_spawn**`,
  G4: `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`,
};

for (const [id, old] of Object.entries(olds)) {
  const n = blob.split(old).length - 1;
  console.log(id + ': exact-hit=' + n);
  if (n === 0) {
    // find partial prefix to locate the actual text
    const prefix = id === 'G1' ? '以 **{{user}} 本轮当前场景画面** 为唯一基准'
      : id === 'G2' ? '**刷新成功判定标准 = 本轮黄毛能否进入'
      : id === 'G3' ? '**spawn=本轮黄毛在'
      : '- **no_spawn**：本轮无黄毛在';
    const i = blob.indexOf(prefix);
    console.log('  prefix index: ' + i);
    if (i >= 0) {
      console.log('  context: ' + JSON.stringify(blob.slice(i, i + 320)));
    } else {
      // maybe the string is present but with different spacing; try to locate a fragment
      const frag = id === 'G1' ? '为唯一基准' : id === 'G2' ? '刷新成功判定标准' : id === 'G3' ? 'spawn=' : 'no_spawn';
      const jdx = blob.indexOf(frag);
      console.log('  frag "' + frag + '" index: ' + jdx);
      if (jdx >= 0) console.log('  ctx: ' + JSON.stringify(blob.slice(Math.max(0, jdx - 60), jdx + 340)));
    }
  }
}
console.log('top-level array: ' + Array.isArray(j) + ' starts-with-[ : ' + raw.trimStart().startsWith('['));
console.log('db blocks count: ' + (blob.split('{[db.黄毛表.get()]}').length - 1));
