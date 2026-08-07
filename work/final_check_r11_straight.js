const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const r4 = j[0].plotTasks[1].promptGroup[4].content;
const m17 = j[0].plotTasks[2].promptGroup[17].content;

const s1 = '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新';
const s6 = '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？';
const o1 = '有没有尚无黄毛的角色，**接下来的场景中该黄毛是否有出现的可能**（有出场契机/进入画面路径/互动机会）？只是"存在"而无出场可能（同楼住户/无关联）→ 不空刷新';
const o6 = '雄竞期标注"竞争者·[五型]"，并标线状态？';

console.log('I1 new in s2rules:', r4.includes(s1));
console.log('I6 new in msg17:', m17.includes(s6));
console.log('I1 old gone:', !r4.includes(o1));
console.log('I6 old gone:', !m17.includes(o6));

// print exact I1 sentence bytes from file for the report
const i = r4.indexOf('有没有尚无黄毛的角色');
console.log('I1 bytes: ' + JSON.stringify(r4.slice(i, i + s1.length)));
