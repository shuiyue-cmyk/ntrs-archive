// Apply S4c: append 场景外-exception note to prologue 机缘节输出门 line (one-space prefix)
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_straight_NTRS.json';

let raw = fs.readFileSync(PATH, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
let j = JSON.parse(raw);

const OLD = ` - **prologue 机缘/暗流/互动感知节输出门**：thugAction=act → 该节必发（黄毛本轮出手触发的暗流/感知都要体现）；thugAction=no-act → 走快速通道，该节整块省略`;
const NEW = OLD + `（场景外 act 且 {{user}} 完全不知🌙 → 该节不输出，仅 stage 记录）`;

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

console.log('S4c OLD hits (before):', countAll(j, OLD));
j = apply(j);
console.log('S4c NEW present:', countAll(j, NEW));
console.log('S4c OLD residual:', countAll(j, OLD));

const out = JSON.stringify(j, null, 2);
JSON.parse(out);
if (!out.trimStart().startsWith('[')) { console.log('NOT_WRITTEN'); process.exit(1); }
fs.writeFileSync(PATH, out, 'utf8');
console.log('WRITTEN (S4c)');
