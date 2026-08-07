// 查看各表 name + NTRS 12 版 $0 用法详情
const fs = require('fs');
// 表格 name
const t = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json', 'utf8'));
const t2 = Array.isArray(t) ? t[0] : t;
console.log('==== 表 name ====');
for (const k of Object.keys(t2)) {
  const v = t2[k];
  if (v && typeof v === 'object' && (v.name || v.uid)) {
    console.log(k, '-> name:', v.name, '| uid:', v.uid, '| sheets标题:', JSON.stringify(v.content || '').slice(0, 60));
  }
}
