// 查 $0 在 replacements 里的值 + TableQueryBuilder 方法
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. replacements 对象定义（找 $0: ...）
let i = src.indexOf('$0:');
let n = 0;
console.log('==== $0: 定义 ====');
while (i >= 0 && n < 6) {
  console.log('@' + i, JSON.stringify(src.slice(Math.max(0, i - 60), i + 80)).slice(0, 150));
  i = src.indexOf('$0:', i + 1);
  n++;
}

// 2. TableQueryBuilder 方法（where/get/count/limit/orderBy 等）
i = src.indexOf('class TableQueryBuilder');
console.log('==== TableQueryBuilder ====');
if (i >= 0) console.log(src.slice(i, i + 2000));
