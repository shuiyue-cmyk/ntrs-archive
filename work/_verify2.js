const fs = require('fs');
const cur = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const bak = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/备份/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.bak-pre-r8s.json', 'utf8');

const dbCur = (cur.match(/\{\[db\./g) || []).length;
const dbBak = (bak.match(/\{\[db\./g) || []).length;
console.log('{[db.*]} count current:', dbCur, 'backup:', dbBak);

// Spec G1 NEW verbatim, to diff against what's now in the file
const specG1New = `以 **{{user}} 本轮当前场景画面** 为唯一基准，并按**空间性质**分级判定：**公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定**——黄毛与目标同处该公共空间、或本轮可自然进入该公共空间画面（偶遇/在场/进入路径合理）→ 判 **spawn**（不必拘泥于贴身画面内）；**私密空间（家中/房间/密闭独处等封闭式场景）严格判定**——黄毛必须本轮实际进入该私密空间画面（当场出现/合理进入）→ 判 **spawn**，同楼其他房间、隔壁、门外走廊等一律 **no_spawn**（不空刷新，即使后续轮次可能有出场机会）。黄毛与配对对象在本轮 {{user}} 场景之外互动 = 场景外行动（no_spawn 仍可判 act，见行动判定段），与 spawn 判定无关。`;

const specG2New = `**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面）**——**黄毛不在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊、或公共空间也不在画面/无法自然进入，即使后续可能有出场机会）→ 判 no_spawn，不空刷新**`;

const specG4New = `- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（私密空间同楼其他房间/隔壁/门外走廊；公共空间不在画面且无法自然进入；或离场追踪/场景外行动——追踪中/离场黄毛仍可能行动）。两种情形：`;

console.log('spec G1 NEW present in file:', cur.includes(specG1New));
console.log('spec G2 NEW present in file:', cur.includes(specG2New));
console.log('spec G4 NEW present in file:', cur.includes(specG4New));

// semantic phrase check per spec 验证要求#3 (concept, since spec text interposes scene lists)
for (const frag of ['公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定', '私密空间（家中/房间/密闭独处等封闭式场景）严格判定', '公共空间宽松', '私密空间严格']) {
  console.log('phrase', JSON.stringify(frag), '=>', cur.split(frag).length - 1);
}
