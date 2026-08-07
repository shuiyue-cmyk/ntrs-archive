// 扫描 15 个 NTRS 系文件（12 版 + 3 雄竞）插入锚点存在性
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak') && (f.includes('NTRS_turn_edit') || f.includes('_NTRS')));
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const a = (raw.split('与"事后知情"的关系').length - 1);
  const b = (raw.split('**乐享型追加**').length - 1);
  const c = (raw.split('渐进跨越规则').length - 1);
  const d = (raw.split('乐享型（86-100%）').length - 1);
  console.log(fn + ' | 事后知情关系:' + a + ' 乐享型追加:' + b + ' 渐进跨越:' + c + ' 乐享型86:' + d);
}
