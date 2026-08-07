// Inspect anchors in Cirno_BATTLE_Turn_DEI.json (R9-final state)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
console.log('RAW_STARTS_WITH: ' + JSON.stringify(raw.slice(0, 1)));
const j = JSON.parse(raw);
console.log('TOP_LEVEL_IS_ARRAY: ' + Array.isArray(j));
const p = j[0];
console.log('NAME: ' + p.name);

const tasks = {};
for (const t of p.plotTasks) tasks[t.id] = t;

// A1 anchor: in plotTaskThugTempo promptGroup[0].content
const s2msg0 = tasks['plotTaskThugTempo'].promptGroup[0].content;
const a1 = '- **对象情感倾向影响雄竞难度**：对象对 {{user}} 有明显情感倾向（已是恋人/配偶、或 {{user}} 深爱且对象已察觉/有回应）→ 黄毛竞争难度高，黄毛需更多行动积累才可能赢得对象；对象对 {{user}} 无情感倾向或处于游离状态 → 黄毛竞争相对容易。';
console.log('\nA1 count: ' + s2msg0.split(a1).length - 1);
const i1 = s2msg0.indexOf(a1);
if (i1 >= 0) {
  console.log('A1 after (80): ' + JSON.stringify(s2msg0.slice(i1 + a1.length, i1 + a1.length + 80)));
}

// A2 anchor: in plotTaskThugTempo.description
const s2desc = tasks['plotTaskThugTempo'].description;
const a2 = '黄毛败=综合判断女主行为已选择{{user}}（对两人的态度/行为/话语倾向{{user}}）';
console.log('\nA2 count: ' + (s2desc.split(a2).length - 1));
const i2 = s2desc.indexOf(a2);
if (i2 >= 0) {
  console.log('A2 after (120): ' + JSON.stringify(s2desc.slice(i2 + a2.length, i2 + a2.length + 120)));
}
console.log('A2 desc full: ' + JSON.stringify(s2desc));

// A3 anchor: in defaultPlotTask promptGroup[1].content
const s3msg2 = tasks['defaultPlotTask'].promptGroup[1].content;
const a3 = '- 雄竞期黄毛可以真正赢得对象的心——黄毛胜即该对象线终局锁定。';
console.log('\nA3 count: ' + (s3msg2.split(a3).length - 1));
const i3 = s3msg2.indexOf(a3);
if (i3 >= 0) {
  console.log('A3 after (120): ' + JSON.stringify(s3msg2.slice(i3 + a3.length, i3 + a3.length + 120)));
}

// A4 anchor: in defaultPlotTask.description
const s3desc = tasks['defaultPlotTask'].description;
const a4 = '雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值）';
console.log('\nA4 count: ' + (s3desc.split(a4).length - 1));
const i4 = s3desc.indexOf(a4);
if (i4 >= 0) {
  console.log('A4 after (120): ' + JSON.stringify(s3desc.slice(i4 + a4.length, i4 + a4.length + 120)));
}
console.log('A4 desc full: ' + JSON.stringify(s3desc));

// A5 anchor: in defaultPlotTask promptGroup — the 注意力自检 message
const a5 = '5. **竞争张力核验**：本轮是否体现 {{user}} 与黄毛之间的竞争张力？{{user}} 的追求/竞争反应是否真实有效？';
let a5count = 0, a5idx = -1, a5msg = -1;
for (let mi = 0; mi < tasks['defaultPlotTask'].promptGroup.length; mi++) {
  const c = tasks['defaultPlotTask'].promptGroup[mi].content;
  if (!c) continue;
  const n = c.split(a5).length - 1;
  if (n > 0) { a5count += n; a5idx = c.indexOf(a5); a5msg = mi; }
}
console.log('\nA5 count: ' + a5count + ' in promptGroup[' + a5msg + ']');
if (a5count > 0) {
  const c = tasks['defaultPlotTask'].promptGroup[a5msg].content;
  console.log('A5 after (200): ' + JSON.stringify(c.slice(a5idx + a5.length, a5idx + a5.length + 200)));
  // dump items 6-8 of 注意力自检
  const start = c.indexOf('**十一、注意力自检');
  const end = c.indexOf('**十二、', start > -1 ? start : 0);
  const block = start >= 0 ? c.slice(start, end > start ? end : start + 3000) : '(attention block not found)';
  console.log('ATTN_BLOCK: ' + JSON.stringify(block));
}
