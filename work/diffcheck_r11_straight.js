const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));

const r4 = j[0].plotTasks[1].promptGroup[4].content;
const m17 = j[0].plotTasks[2].promptGroup[17].content;

const i = r4.indexOf('本轮黄毛能否进入');
console.log('I1 ACTUAL : ' + JSON.stringify(r4.slice(i - 20, i + 160)));
console.log('I1 SPEC   : ' + JSON.stringify('本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径'));

const k = m17.indexOf('名单标注为');
console.log('\nI6 ACTUAL : ' + JSON.stringify(m17.slice(k, k + 110)));
console.log('I6 SPEC   : ' + JSON.stringify('名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？'));

// char-by-char diff
function diff(a, b) {
  for (let n = 0; n < Math.max(a.length, b.length); n++) {
    if (a[n] !== b[n]) return { pos: n, a: a[n], b: b[n], ac: a.charCodeAt(n), bc: b.charCodeAt(n) };
  }
  return null;
}
const d1 = diff(r4.slice(i, i + 160), '本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径');
const d2 = diff(m17.slice(k, k + 110), '名单标注为导演台本内部调度（以剧情语言写"追求者/情敌·[外貌气质]"），雄竞期不写"竞争者·[五型]"、不标线状态——prologue 正文禁止系统术语？');
console.log('\nI1 diff:', d1);
console.log('I6 diff:', d2);
