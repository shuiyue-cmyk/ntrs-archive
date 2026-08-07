const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(PATH, 'utf8').replace(/^\ufeff/, '');
const j = JSON.parse(raw);
const strings = [];
(function col(n) {
  if (typeof n === 'string') strings.push(n);
  else if (Array.isArray(n)) n.forEach(col);
  else if (n && typeof n === 'object') Object.keys(n).forEach(k => col(n[k]));
})(j);

const checks = {
  'B1·分流bullet': '- **对象已站队→亲密开局分流（替代雄竞竞争）**：对象已是 {{user}} 的恋人/配偶/已明确站队 {{user}} 时，该目标**不进入雄竞期**——刷新黄毛锁定后线状态直接=NTRS期·亲密开局，黄毛积极行动门（对象与 {{user}} 亲密即激活）满足即 act，按 NTRS推进逻辑推进（见 B2）。',
  'B1·起点bullet': '- **亲密开局 NTRS 线起点**：NTRS期·亲密开局的对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步（区别于黄毛败转 NTRS期的 41% 察觉型起步）；推波助澜从暗中起步；📹 事后知情从察觉型起（忠诚/动摇期一律 🌙）。',
  'B2·分流句': '【分支 B-亲密开局分流】：对有待刷新目标先判其与 {{user}} 的关系状态——目标出场即与 {{user}} 已建立亲密关系（恋人/配偶/已明确站队）→ 走亲密开局分流：刷新黄毛锁定后线状态直接=NTRS期·亲密开局（接受程度从低接受度五阶段起步），不经过雄竞期，黄毛积极行动门满足即 act；目标未与 {{user}} 亲密 → 照常进入雄竞期。',
  'B3·desc': '黄毛出手不依赖 {{user}}-对象亲密关系：自由身目标只要可攻略角色出现+刷新合理+行动合理即出手与 {{user}} 竞争（雄竞期）；对象已站队（出场即恋人/配偶/已明确站队）→ 亲密开局分流——刷新锁定后直接 NTRS期·亲密开局（接受程度从低接受度五阶段起步、黄毛积极行动门满足即 act），不经过雄竞期',
  'B4a·状态机': '- **NTRS期·亲密开局（对象出场即与 {{user}} 亲密）**：不走雄竞期，直接进入 NTRS 线——对象接受程度从低接受度完整五阶段（忠诚/动摇/察觉/默契/乐享）起步、推波助澜从暗中起步，随接受程度逐阶段演进；对象察觉后迎合（察觉型起），口述报告/视频=兴奋源（📹 事后知情从察觉型起，忠诚/动摇期一律 🌙）；区别于黄毛败转 NTRS期（41% 察觉型起步）。',
  'B4b·编排段': '**【NTRS期·亲密开局编排（线状态=NTRS期·亲密开局）】**对象出场即与 {{user}} 已是恋人/配偶/已站队——本路径跳过雄竞期直接进入 NTRS 线：对象接受程度五阶段从忠诚/动摇起步，黄毛行动=对亲密对象的暧昧/渗透（按黄毛五型手段），user 有 NTRS 癖好、推波助澜从暗中起步（暗中安排机会/创造独处/制造巧合，对象未察觉），接受程度升入察觉型后对象察觉迎合、推波转半明示（放行/默契），口述报告/录像=兴奋源（📹 事后知情从察觉型起）；接受程度进度按触发事件分量 +0~5%/轮推进（同 NTRS期规则）。',
  'B5·desc': 'NTRS期落实知情度三档（在场见证/事后知情/完全不知）与淫妻线进度（含亲密开局路径：对象出场即与{{user}}亲密→直接 NTRS期·亲密开局，接受程度从低接受度五阶段起步、推波从暗中起步、察觉型起📹事后知情）',
  'B6·自检': '3. **进度一致（仅 NTRS期适用，含亲密开局）**：stage 里每个 X% / +X% 是否都能在 sparkNotes「NTRS 进度结算」找到同一数字？sparkNotes 未写清结算 → 先补思考再写 content。快速通道场景下整段自检跳过、本条不适用；act 档下 NTRS期 act 幅度是否落在 +0~5%？雄竞期无数值进度，此项不适用；NTRS期·亲密开局进度同 NTRS期规则（低接受度起步、+0~5%/轮）。',
};
let ok = true;
for (const [k, v] of Object.entries(checks)) {
  const n = strings.filter(s => s.includes(v)).length;
  if (n !== 1) ok = false;
  console.log((n === 1 ? 'OK  ' : 'FAIL') + '  ' + k + '  (count=' + n + ')');
}
const gone = ['对象已站队不豁免', '对象已站队也不豁免'];
for (const g of gone) {
  const n = strings.filter(s => s.includes(g)).length;
  if (n !== 0) ok = false;
  console.log((n === 0 ? 'OK  ' : 'FAIL') + '  gone「' + g + '」 (count=' + n + ')');
}
const keep = strings.filter(s => s.includes('性别类型硬约束：spawn 时性别类型必须是 伪娘 / 药娘 / 假小子 之一')).length;
console.log((keep === 1 ? 'OK  ' : 'FAIL') + '  性别类型硬约束 kept (count=' + keep + ')');
if (keep !== 1) ok = false;
const keep2 = strings.filter(s => s.includes('【分支 B — 有待刷新目标】')).length;
console.log((keep2 === 1 ? 'OK  ' : 'FAIL') + '  分支B原句 kept (count=' + keep2 + ')');
if (keep2 !== 1) ok = false;
const keep3 = strings.filter(s => s.includes('**【NTRS期编排（线状态=NTRS期，黄毛败后激活）】**')).length;
console.log((keep3 === 1 ? 'OK  ' : 'FAIL') + '  NTRS期编排标题 kept (count=' + keep3 + ')');
if (keep3 !== 1) ok = false;
console.log('---');
console.log('JSON.parse: OK');
console.log('top-level array: ' + Array.isArray(j));
console.log('raw starts with [: ' + raw.trimStart().startsWith('['));
console.log('indent 2-space check (line2 starts with 2 spaces): ' + /^\n  \{/.test(raw));
console.log('total content strings: ' + strings.length);
console.log('=== ' + (ok ? 'ALL PASS' : 'SOME FAIL') + ' ===');
