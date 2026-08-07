// 清理 NTRS12 版 <当前表格数据> 引用性残留 → <黄毛表当前条目>
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();
const RE = [
  ['下方<当前表格数据>中 黄毛表', '下方<黄毛表当前条目>中'],
  ['先查<当前表格数据>中 黄毛表', '先查上方<黄毛表当前条目>中'],
  ['先查<当前表格数据>里 黄毛表', '先查上方<黄毛表当前条目>里'],
  ['下接本轮当前表格数据', '下接本轮黄毛表数据'],
  ['<当前表格数据>', '上方注入的黄毛表条目'],
];
let ok = 0;
for (const fn of files) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const tasks = [o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准'), o.plotTasks.find(t => t.name === '导演台本')];
  let changed = false;
  for (const task of tasks) {
    for (let mi = 0; mi < task.promptGroup.length; mi++) {
      let c = task.promptGroup[mi].content || '';
      if (c.includes('当前表格数据')) {
        for (const [old, nw] of RE) {
          if (c.includes(old)) c = c.split(old).join(nw);
        }
        task.promptGroup[mi].content = c;
        changed = true;
      }
    }
  }
  if (changed) { fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8'); ok++; }
}
console.log('清理: ' + ok + '/' + files.length);
