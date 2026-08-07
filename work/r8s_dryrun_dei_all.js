// Dry-run: verify exact full OLD strings for G1,G2,G4 in target file (count only, no write)
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_ALLin_4.7.json';
const raw = fs.readFileSync(p, 'utf8');

const G1_OLD = `以 **{{user}} 本轮当前场景画面** 为唯一基准——黄毛**本轮能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径与目标互动）→ 判 **spawn**；**黄毛不在 {{user}} 当前场景画面内**（同楼其他房间、隔壁、附近区域、远房等——即使后续轮次可能有出场机会）→ 一律判 **no_spawn**（不空刷新）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;

const G2_OLD = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现 / 本轮内有合理进入画面的路径）——**黄毛不在 {{user}} 当前场景画面内（同楼其他房间/隔壁/附近/远房等，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;

const G4_OLD = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;

for (const [name, old] of [['G1', G1_OLD], ['G2', G2_OLD], ['G4', G4_OLD]]) {
  const c = raw.split(old).length - 1;
  console.log(name, 'count:', c);
  if (c > 0) {
    const i = raw.indexOf(old);
    console.log('  before:', JSON.stringify(raw.slice(i - 30, i)));
    console.log('  after :', JSON.stringify(raw.slice(i + old.length, i + old.length + 30)));
  }
}
// also confirm no {[db.*]} overlap
const overlap = ['{', '[', ']', '}'];
for (const ch of overlap) console.log('char', JSON.stringify(ch), 'in OLDs:', (G1_OLD + G2_OLD + G4_OLD).includes(ch) ? 'YES' : 'no');
