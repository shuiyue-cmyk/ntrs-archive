const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const raw = fs.readFileSync(p, 'utf8');
function count(s, sub) { let n = 0, i = -1; while ((i = s.indexOf(sub, i + 1)) !== -1) n++; return n; }
// scan RAW text (unescaped source), not JSON.stringify blob
console.log('--- refined checks ---');
// A17: old tail was 。 after 主线推进）; NEW has ；**若场上 instead
console.log('A17 old-tail 主线推进）。 :', count(raw, '仅一行主线推进）。'));
console.log('A17 new clause 若场上存在已闭合（黄毛败·友好）对象:', count(raw, '若场上存在已闭合（黄毛败·友好）对象'));
// A16: NEW contains a literal double-quote inside the string; raw shows \"... in JSON. Match with escaped quote.
console.log('A16 NEW 名单标注为内部调度，以剧情语言写:', count(raw, '名单标注为内部调度，以剧情语言写'));
console.log('A16 NEW with escaped quote 追求者/情敌:', count(raw, '追求者/情敌'));
console.log('A16 NEW 正文不得出现"竞争者/雄竞期/五型":', count(raw, '正文不得出现'));
// A17 short-form line (行动判定为 no-act 时下游 stage3 走快速通道。) — was NOT in spec OLD, expected to remain
console.log('A17 short form 行动判定为 no-act 时下游 stage3 走快速通道。:', count(raw, '行动判定为 no-act 时下游 stage3 走快速通道。'));
// show A17 context around the applied NEW
let i = raw.indexOf('若场上存在已闭合');
console.log('A17 ctx:', JSON.stringify(raw.slice(i - 40, i + 80)));
let i16 = raw.indexOf('名单标注为内部调度');
console.log('A16 ctx:', JSON.stringify(raw.slice(i16 - 30, i16 + 90)));
