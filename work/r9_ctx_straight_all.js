const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_ALLin_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const root = j[0];

function ctx(text, phrase, pad) {
  const i = text.indexOf(phrase);
  if (i < 0) return `[NOT FOUND: ${phrase}]`;
  const s = Math.max(0, i - pad), e = Math.min(text.length, i + phrase.length + pad);
  return JSON.stringify(text.slice(s, e));
}

const t1 = root.plotTasks[1];
const t2 = root.plotTasks[2];

// B5: 黄毛判定 promptGroup[0]
console.log('=== B5 pg0 (黄毛判定 promptGroup[0]) ===');
console.log(ctx(t1.promptGroup[0].content, '判断该黄毛本轮是否可行动', 80));

// B3: 黄毛判定 promptGroup[4] — 锁定指令行 + 刷新状态句
console.log('\n=== B3 pg4 (黄毛判定 promptGroup[4]) ===');
console.log(ctx(t1.promptGroup[4].content, '锁定指令：锁定', 150));
console.log('---thugSpawn 标签内句---');
console.log(ctx(t1.promptGroup[4].content, 'thugSpawn> 标签内只放刷新状态', 120));

// B4: 导演台本 promptGroup[17]
console.log('\n=== B4 pg17 (导演台本 promptGroup[17]) ===');
console.log(ctx(t2.promptGroup[17].content, '从概览/前文/上轮 stage 读', 150));

// B1/B2: 导演台本 promptGroup[0]
console.log('\n=== B1 pg0 (导演台本 promptGroup[0]) ===');
console.log(ctx(t2.promptGroup[0].content, 'prologue：仅一行', 120));
console.log('\n=== B2 pg0 (导演台本 promptGroup[0]) ===');
console.log(ctx(t2.promptGroup[0].content, '事后知情或 🌙 完全不知的暗线戏', 60));

// B7: 导演台本 promptGroup[2]
console.log('\n=== B7 pg2 (导演台本 promptGroup[2]) ===');
console.log(ctx(t2.promptGroup[2].content, '锁定目标列表非空', 120));
console.log('---');
console.log(ctx(t2.promptGroup[2].content, '锁定目标列表为空', 120));

// B10 anchor check: 快速通道 prologue 在 pg0 完整段
console.log('\n=== 导演台本 promptGroup[0] FULL ===');
console.log(JSON.stringify(t2.promptGroup[0].content));

console.log('\n=== 导演台本 promptGroup[17] FULL ===');
console.log(JSON.stringify(t2.promptGroup[17].content));
