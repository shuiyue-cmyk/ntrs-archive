// 查 NameMapper tableNameMap 构建来源 + TableQueryBuilder 完整方法
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. tableNameMap 构建
let i = src.indexOf('tableNameMap');
let n = 0;
console.log('==== tableNameMap ====');
while (i >= 0 && n < 6) {
  const seg = src.slice(Math.max(0, i - 100), i + 200);
  if (seg.includes('new Map') || seg.includes('.set(') || seg.includes('schema') || seg.includes('sheet_')) {
    console.log('@' + i, JSON.stringify(seg).slice(0, 300));
  }
  i = src.indexOf('tableNameMap', i + 1);
  n++;
}

// 2. TableQueryBuilder 类的所有方法名
i = src.indexOf('class TableQueryBuilder');
const cls = src.slice(i, i + 12000);
const methods = [...cls.matchAll(/^\s{8}([a-zA-Z_]+)\(/gm)].map(m => m[1]);
console.log('==== TableQueryBuilder methods ====', methods.join(', '));

// 3. schema 构建（表名映射来源）——搜 黄毛表 在 8.8.js 是否出现
i = src.indexOf('黄毛表');
console.log('==== 黄毛表 在 8.8.js ====', i >= 0 ? '出现' : '不出现');
if (i >= 0) console.log(JSON.stringify(src.slice(i - 120, i + 120)).slice(0, 260));
