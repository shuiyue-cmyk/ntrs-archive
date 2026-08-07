// Adapt the T1.pg[4] same-rule variant bullet to 自由身 scope (item 25 semantics) + full-sentence item-1 assert
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = Array.isArray(j) ? j[0] : j;

// 1) item 1 full-sentence assert
const full1 = '有没有尚无黄毛的角色，**本轮黄毛能否进入 {{user}} 当前场景画面**（公共空间宽松：同处该公共空间/可自然进入画面即可；私密空间严格：须实际进入该私密空间画面；同楼其他房间/走廊=不空刷新）？只是"存在"而无进入画面路径（同楼住户/无关联）→ 不空刷新';
let c1 = 0;
(o.plotTasks || []).forEach((t) => (t.promptGroup || []).forEach((m) => { c1 += (String(m.content).split(full1).length - 1); }));
console.log('ITEM1 full-new-sentence count=' + c1 + ' (expected 1)');

// 2) T1.pg[4] variant bullet adaptation
const oldV = '**对象的情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。';
const newV = '**对象的情感倾向影响雄竞难度（仅自由身目标）**：对象对 {{user}} 有明显情感倾向（{{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。（已站队/血亲义亲目标走亲密开局分流，不适用本条）';
let cv = 0;
(o.plotTasks || []).forEach((t) => (t.promptGroup || []).forEach((m) => {
  if (typeof m.content === 'string' && m.content.includes(oldV)) {
    cv += m.content.split(oldV).length - 1;
    m.content = m.content.split(oldV).join(newV);
  }
}));
console.log('VARIANT25 found=' + cv + ' (expected 1) ' + (cv === 1 ? 'OK' : 'MISMATCH'));

const out = JSON.stringify(j, null, 2);
fs.writeFileSync(path, out, 'utf8');
console.log('written. raw starts with [ : ' + out.trim().startsWith('['));
