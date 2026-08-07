// 清除 NTRS12 版剩余 $0 引用（5处模式）
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const RE = [
  ['$0 黄毛表', '上方<黄毛表当前条目>'],
  ['$0 当前表格数据', '上方注入的黄毛表条目'],
  ['查 $0 当前表格数据', '查上方<黄毛表当前条目>'],
  ['从 msg15 的 $0 黄毛表 直读', '从上方<黄毛表当前条目>直读'],
  ['从 msg15 的 $0 黄毛表 直读', '从上方<黄毛表当前条目>直读'],
  ['$0', '上方<黄毛表当前条目>'], // 兜底：其余裸 $0
];
let ok = 0;
for (const fn of files) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const allTasks = [o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准'), o.plotTasks.find(t => t.name === '导演台本')];
  let changed = false;
  for (const task of allTasks) {
    for (let mi = 0; mi < task.promptGroup.length; mi++) {
      const c = task.promptGroup[mi].content || '';
      if (c.includes('$0')) {
        let nc = c;
        // 先处理长模式（顺序重要）
        nc = nc.split('从 msg15 的 $0 黄毛表 直读').join('从上方<黄毛表当前条目>直读');
        nc = nc.split('查 $0 当前表格数据').join('查上方<黄毛表当前条目>');
        nc = nc.split('$0 黄毛表').join('上方<黄毛表当前条目>');
        nc = nc.split('$0 当前表格数据').join('上方<黄毛表当前条目>');
        nc = nc.split('$0').join('上方<黄毛表当前条目>'); // 兜底
        if (nc !== c) {
          task.promptGroup[mi].content = nc;
          changed = true;
        }
      }
    }
  }
  if (changed) { fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8'); ok++; }
}
console.log('清理完成: ' + ok + '/' + files.length);
