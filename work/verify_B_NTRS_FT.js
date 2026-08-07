const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(PATH, 'utf8').replace(/^\ufeff/, '');
const j = JSON.parse(raw);

const targets = [
  { name: 'B1新·分流bullet', s: '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**——刷新黄毛锁定后线状态直接=NTRS期·亲密开局，黄毛积极行动门（对象与 {{user}} 亲密即激活）满足即 act，按 NTRS推进逻辑推进（见 B2）。', field: 'plotTaskThugTempo promptGroup[0].content' },
  { name: 'B1新·起点bullet', s: '- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步（区别于黄毛败转 NTRS期的 41% 察觉型起步）；推波助澜从暗中起步；📹 事后知情从察觉型起（忠诚/动摇期一律 🌙）。', field: 'plotTaskThugTempo promptGroup[0].content' },
  { name: 'B2新·分流句', s: '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态——目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队）→ 走亲密开局分流：刷新黄毛锁定后线状态直接=NTRS期·亲密开局（接受程度从低接受度五阶段起步），不经过雄竞期，黄毛积极行动门满足即 act；目标未与 {{user}} 亲密 → 照常进入雄竞期。', field: 'plotTaskThugTempo promptGroup[4].content' },
  { name: 'B3新·desc', s: '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）；对象已站队（出场即恋人/配偶/已明确站队）→ 亲密开局分流——刷新锁定后直接 NTRS期·亲密开局（接受程度从低接受度五阶段起步、黄毛积极行动门满足即 act），不经过雄竞期', field: 'plotTaskThugTempo.description' },
  { name: 'B4a新·状态机', s: '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线——对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步、推波助澜从暗中起步，随接受程度逐阶段演进；对象察觉后迎合（察觉型起），口述报告/视频=兴奋源（📹 事后知情从察觉型起，忠诚/动摇期一律 🌙）；区别于黄毛败转 NTRS期（41% 察觉型起步）。', field: 'defaultPlotTask promptGroup[2].content' },
  { name: 'B4b新·编排段', s: '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队——本路径跳过雄竞期直接进入 NTRS 线：对象接受程度五阶段从忠诚/动摇起步，黄毛行动=对亲密对象的暧昧/渗透（按黄毛五型手段），user 有 NTRS 癖好、推波助澜从暗中起步（暗中安排机会/创造独处/制造巧合，对象未察觉），接受程度升入察觉型后对象察觉迎合、推波转半明示（放行/默契），口述报告/录像=兴奋源（📹 事后知情从察觉型起）；接受程度进度按触发事件分量 +0~5%/轮推进（同 NTRS期规则）。', field: 'defaultPlotTask promptGroup[2].content' },
  { name: 'B5新·desc', s: 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局，接受程度从低接受度五阶段起步、推波从暗中起步、察觉型起📹事后知情）', field: 'defaultPlotTask.description' },
  { name: 'B6新·自检', s: '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。', field: 'defaultPlotTask promptGroup[17].content' },
];

// collect all string values with field paths
function collectStrings(node, pathArr, out) {
  if (typeof node === 'string') out.push({ s: node, path: pathArr.join(' > ') });
  else if (Array.isArray(node)) node.forEach((v, i) => collectStrings(v, pathArr.concat('[' + i + ']'), out));
  else if (node && typeof node === 'object') Object.keys(node).forEach(k => collectStrings(node[k], pathArr.concat(k), out));
}
const strings = [];
collectStrings(j, ['j'], strings);

let allOk = true;
for (const t of targets) {
  const hit = strings.find(x => x.s.includes(t.s));
  console.log((hit ? 'OK  ' : 'MISS') + '  ' + t.name + '  @ ' + (hit ? hit.path + ' / expected: ' + t.field : 'NOT FOUND'));
  if (!hit) allOk = false;
}

// gone-words: 对象已站队不豁免 must be fully gone from parsed strings
const goneTargets = ['对象已站队不豁免', '对象已站队也不豁免'];
for (const g of goneTargets) {
  const hits = strings.filter(x => x.s.includes(g));
  console.log((hits.length === 0 ? 'OK  ' : 'LEAK') + '  gone-word「' + g + '」 remaining count=' + hits.length);
  if (hits.length) allOk = false;
}
// keep-words: 性别类型硬约束 untouched
const keep = strings.filter(x => x.s.includes('性别类型硬约束：spawn 时性别类型必须是 伪娘 / 药娘 / 假小子 之一'));
console.log((keep.length >= 1 ? 'OK  ' : 'MISS') + '  性别类型硬约束 kept (count=' + keep.length + ')');
if (!keep.length) allOk = false;

console.log('top-level array: ' + Array.isArray(j));
console.log('raw starts with [ : ' + raw.trimStart().startsWith('['));
console.log('=== ALL CHECK ' + (allOk ? 'PASS' : 'FAIL') + ' ===');
