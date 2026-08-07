// 确认 TableQueryBuilder.get() 返回格式 + getNameMapper 表名映射 + 实测替换
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. TableQueryBuilder get() 方法
let i = src.indexOf('get() {');
console.log('==== TableQueryBuilder get() ====');
// 找类里的 get 方法
let cls = src.indexOf('class TableQueryBuilder');
let getIdx = src.indexOf('get() {', cls);
if (getIdx >= 0 && getIdx < cls + 8000) console.log(src.slice(getIdx, getIdx + 1200));
else {
  // 尝试找 get( 带其他形式
  const m = src.slice(cls, cls + 12000);
  let g2 = m.indexOf('get()');
  if (g2 >= 0) console.log(m.slice(g2, g2 + 1200));
  else console.log('get() not found in class');
}

// 2. getNameMapper / resolveTableName 表名映射
i = src.indexOf('function getNameMapper');
console.log('==== getNameMapper ====');
if (i >= 0) console.log(src.slice(i, i + 800));
i = src.indexOf('resolveTableName');
console.log('==== resolveTableName ====');
if (i >= 0) console.log(JSON.stringify(src.slice(i - 100, i + 400)).slice(0, 500));
