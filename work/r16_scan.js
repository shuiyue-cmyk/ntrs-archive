// 扫描 P0/P1/P2 修复锚点在 33 文件的分布
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const anchors = {
  A: '即使动向/线状态与上轮相同也须完整列出',
  B: '每轮必列所有已刷新黄毛',
  C: '黄毛胜·终局**：黄毛胜（剧情确认对象明确选择黄毛',
  D: '察觉型（41%',
  E: '从察觉型（41%）起步',
  F: '对象察觉',
};
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const hits = [];
  for (const [k, v] of Object.entries(anchors)) {
    const n = raw.split(v).length - 1;
    if (n > 0) hits.push(k + 'x' + n);
  }
  console.log(fn + ': ' + (hits.length ? hits.join(' ') : '-'));
}
