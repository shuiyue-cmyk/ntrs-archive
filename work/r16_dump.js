// dump P0/P1/P2 锚点精确文本
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
// BATTLE A 句（追踪区块每轮输出段）
let b = fs.readFileSync(dir + 'Cirno_BATTLE_Turn_straight.json', 'utf8');
let i = b.indexOf('追踪区块必须每轮输出');
console.log('BATTLE A: ' + JSON.stringify(b.slice(i - 20, i + 260)));
// NTRS 12 B 句（R15 追踪说明）
let n = fs.readFileSync(dir + 'Cirno_NTRS_turn_edit_straight_4.7.json', 'utf8');
let k = n.indexOf('动向连续性');
console.log('NTRS12 B: ' + JSON.stringify(n.slice(k - 30, k + 260)));
// NTRS·雄竞 C 句（黄毛胜·终局）
let h = fs.readFileSync(dir + 'Cirno_BATTLE_Turn_straight_NTRS.json', 'utf8');
let j = h.indexOf('黄毛胜·终局**：黄毛胜');
console.log('HYB C: ' + JSON.stringify(h.slice(j - 40, j + 300)));
// NTRS·雄竞 E 句 2 处（41% 起步）
let p = 0, c = 0;
while ((p = h.indexOf('从察觉型（41%）起步', p)) !== -1) { c++; console.log('HYB E[' + c + ']: ' + JSON.stringify(h.slice(Math.max(0, p - 50), p + 80))); p += 10; }
// NTRS 12 F 句（对象察觉）
let f = n.indexOf('对象察觉');
console.log('NTRS12 F: ' + JSON.stringify(n.slice(Math.max(0, f - 60), f + 150)));
