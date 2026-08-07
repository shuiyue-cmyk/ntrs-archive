// Confirm actual G1..G4 NEW phrases present in the rewritten file
const fs = require('fs');
const FILE = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const raw = fs.readFileSync(FILE, 'utf8');
const j = JSON.parse(raw);
const blob = JSON.stringify(j);
const frags = [
  '公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定',
  '私密空间（家中/房间/密闭独处等封闭式场景）严格判定',
  '公共空间宽松',
  '私密空间严格',
  '同楼其他房间、隔壁、门外走廊',
  '公共空间也不在画面/无法自然进入',
  '同处该公共空间即视为在场',
];
for (const f of frags) console.log(JSON.stringify(f) + ': ' + (blob.split(f).length - 1));
console.log('array: ' + Array.isArray(j));
// also confirm no db block text mutated: count {[db.黄毛表.get()]} intact
console.log('黄毛表 blocks: ' + (blob.split('{[db.黄毛表.get()]}').length - 1));
