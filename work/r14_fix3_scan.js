// 扫描 R14 修复 1/2 锚点：NTRS 12 系 24 文件 m4 格式区锚 + S3 引用段锚
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno_NTRS_turn_edit') && !f.includes('bak'));
const candidates = [
  '格式（spawn - 分支A',      // 格式区锚
  '格式（no_spawn 时）：',     // no_spawn 格式锚
  '不在 thugSpawn 标签里找）', // S3 引用段锚
  '【黄毛刷新状态】spawn=本轮有黄毛在场', // S3 引用段宽锚
];
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const hits = candidates.map(a => a + ':' + (raw.split(a).length - 1)).filter(h => !h.endsWith(':0'));
  console.log(fn + (hits.length ? ' | ' + hits.join(' ') : ' | (none)'));
}
