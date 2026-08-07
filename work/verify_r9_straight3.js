const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(p, 'utf8');
function count(s, sub) { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) !== -1) n++; return n; }
console.log('indent head:', JSON.stringify(raw.slice(0, 12)));
console.log('--- spec residual phrases (pure-rivalry straight: 黄毛败·友好 must REMAIN) ---');
console.log('旧式 线已闭合，黄毛不再行动判定:', count(raw, '线已闭合，黄毛不再行动判定'));
console.log('旧式 刷新成功 = 接下来的场景中有出现的可能:', count(raw, '刷新成功 = 接下来的场景中有出现的可能'));
console.log('黄毛败·友好 (legal keep, straight):', count(raw, '黄毛败·友好'));
console.log('线闭合不再行动判定（A3-style 短式）:', count(raw, '线闭合不再行动判定'));
console.log('--- spec NEW phrases ---');
console.log('线锁定非闭合:', count(raw, '线锁定非闭合'));
console.log('黄毛退居朋友位:', count(raw, '黄毛退居朋友位'));
const baks = fs.readdirSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/').filter(f => f.includes('bak-pre'));
console.log('backup files present:', baks);
