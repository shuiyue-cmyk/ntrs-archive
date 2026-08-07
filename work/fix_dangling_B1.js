// Fix dangling cross-reference left by B1: （对象已站队不豁免，见上方） -> （对象已站队→亲密开局分流，见上方）
const fs = require('fs');
const PATH = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
let raw = fs.readFileSync(PATH, 'utf8');
let bom = false;
if (raw.charCodeAt(0) === 0xfeff) { bom = true; raw = raw.slice(1); }
const j = JSON.parse(raw);
const OLD = '（对象已站队不豁免，见上方）';
const NEW = '（对象已站队→亲密开局分流，见上方）';
let count = 0;
function walk(n) {
  if (typeof n === 'string') {
    if (n.includes(OLD)) { count += n.split(OLD).length - 1; return n.split(OLD).join(NEW); }
    return n;
  }
  if (Array.isArray(n)) return n.map(walk);
  if (n && typeof n === 'object') { Object.keys(n).forEach(k => { n[k] = walk(n[k]); }); return n; }
  return n;
}
walk(j);
console.log('replacements:', count);
const out = (bom ? '\ufeff' : '') + JSON.stringify(j, null, 2);
if (!out.trimStart().startsWith('[')) throw new Error('not array top level');
fs.writeFileSync(PATH, out, 'utf8');
// verify
const j2 = JSON.parse(fs.readFileSync(PATH, 'utf8').replace(/^\ufeff/, ''));
const strs = [];
(function col(n, p) {
  if (typeof n === 'string') strs.push(n);
  else if (Array.isArray(n)) n.forEach(v => col(v, p));
  else if (n && typeof n === 'object') Object.keys(n).forEach(k => col(n[k], p));
})(j2, '');
console.log('对象已站队不豁免 remaining:', strs.filter(s => s.includes('对象已站队不豁免')).length);
console.log('对象已站队→亲密开局分流，见上方 present:', strs.some(s => s.includes('（对象已站队→亲密开局分流，见上方）')));
console.log('top-level array:', Array.isArray(j2));
