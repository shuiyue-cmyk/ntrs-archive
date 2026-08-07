const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const root = j[0];
const pg4 = root.plotTasks[1].promptGroup[4].content;

function show(text, phrase, pad) {
  const i = text.indexOf(phrase);
  if (i < 0) { console.log(`[NOT FOUND: ${phrase}]`); return; }
  console.log(JSON.stringify(text.slice(Math.max(0, i - pad), Math.min(text.length, i + phrase.length + pad))));
}

console.log('--- 维持背景板 ---');
show(pg4, '维持背景板', 100);
console.log('\n--- 锁定指令 template 行 (搜索 "无新增") ---');
show(pg4, '无新增', 200);
console.log('\n--- 刷新状态两档 ② 分支A 完整段 ---');
show(pg4, '分支A（复用已有黄毛）', 30);
console.log('\n--- "锁定指令：" 所有出现 ---');
let idx = 0, c = 0;
while ((idx = pg4.indexOf('锁定指令', idx)) >= 0 && c < 10) {
  console.log(`occurrence ${++c}:`, JSON.stringify(pg4.slice(Math.max(0, idx - 60), Math.min(pg4.length, idx + 120))));
  idx += 4;
}
