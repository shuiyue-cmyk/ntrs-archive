// Repair v2: apply S4a whole-line replacement to the CURRENT (post-G10-5) sparkNotes line
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_straight_NTRS.json';

let raw = fs.readFileSync(PATH, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
let j = JSON.parse(raw);

// OLD = current line WITHOUT leading-space prefix (prefix preserved outside replacement)
const OLD = `**雄竞期\u00b7胜负判定（纯剧情，无数值）**：对象是否明确选择黄毛（接受表白/确立关系/成婚）→ 黄毛胜，线状态=黄毛胜\u00b7终局？女主的行为是否已选择 {{user}}（综合对两人的态度/行为/话语判断） → 黄毛败，线状态=NTRS期？未分胜负则维持雄竞期。禁止用数值/进度条结算。`;
const NEW = `**雄竞期\u00b7胜负核对（以 stage 2 thugSpawn 线状态为准，仅核对剧情事件是否一致）**：thugSpawn 线状态=黄毛胜\u00b7终局？=NTRS期/黄毛败\u00b7友好？未分胜负则雄竞期——禁止 S3 自主判定胜负。`;

function countAll(node, s) {
  let c = 0;
  if (typeof node === 'string') return node.split(s).length - 1;
  if (Array.isArray(node)) { for (const v of node) c += countAll(v, s); return c; }
  if (node && typeof node === 'object') { for (const k of Object.keys(node)) c += countAll(node[k], s); return c; }
  return c;
}
function apply(node) {
  if (typeof node === 'string') return node.split(OLD).join(NEW);
  if (Array.isArray(node)) { for (let i = 0; i < node.length; i++) node[i] = apply(node[i]); return node; }
  if (node && typeof node === 'object') { for (const k of Object.keys(node)) node[k] = apply(node[k]); return node; }
  return node;
}

const preHits = countAll(j, OLD);
console.log('S4a OLD hits (before):', preHits);
j = apply(j);
console.log('S4a NEW present:', countAll(j, NEW));
console.log('OLD residual:', countAll(j, OLD));

const out = JSON.stringify(j, null, 2);
JSON.parse(out);
if (!out.trimStart().startsWith('[')) { console.log('NOT_WRITTEN'); process.exit(1); }
fs.writeFileSync(PATH, out, 'utf8');
console.log('WRITTEN (S4a repair v2)');

// final verify pass over everything
const r2 = fs.readFileSync(PATH, 'utf8');
const j2 = JSON.parse(r2);
const all = JSON.stringify(j2);
console.log('VERIFY topIsArray=', Array.isArray(j2), 'firstNonSpace=', JSON.stringify(r2.trimStart()[0]));
console.log('s4a new present:', all.includes('雄竞期\u00b7胜负核对') ? 'yes' : 'NO');
console.log('old 胜负判定（纯剧情，无数值） gone:', all.includes('雄竞期\u00b7胜负判定（纯剧情，无数值）') ? 'STILL PRESENT' : 'gone');
console.log('明确且长期拒绝 residual:', all.split('明确且长期拒绝').length - 1);
console.log('明确长期拒绝 residual:', all.split('明确长期拒绝').length - 1);
console.log('db injection blocks:', ['{[db.黄毛表.get()]}','{[db.重要角色表.get()]}','{[db.NTRS备忘录.get()]}'].map(x=>all.includes(x)).join(','));
console.log('权威源 residual (should be 0):', all.split('进度权威源').length - 1, '| 表格为权威源:', all.split('表格为权威源').length - 1, '| 查表判断已有黄毛:', all.split('查表判断已有黄毛').length - 1);
