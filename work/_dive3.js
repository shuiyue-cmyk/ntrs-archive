// 查 performReplacements（$0替换）+ createDbProxy API + resolveTaskTableWorldbookTokens
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. performReplacements 定义
let i = src.indexOf('performReplacements');
let n = 0;
console.log('==== performReplacements ====');
while (i >= 0 && n < 4) {
  const seg = src.slice(i, i + 1200);
  if (seg.includes('function') || seg.includes('=>') || seg.includes('$0') || seg.includes('replace')) {
    console.log('@' + i, JSON.stringify(src.slice(Math.max(0, i - 60), i + 900)).slice(0, 1000));
    break;
  }
  i = src.indexOf('performReplacements', i + 1);
  n++;
}

// 2. createDbProxy（找 db. 的可用方法：where/find/get/count 等）
i = src.indexOf('function createDbProxy');
console.log('==== createDbProxy ====');
if (i >= 0) console.log(src.slice(i, i + 1500));

// 3. resolveTaskTableWorldbookTokens
i = src.indexOf('resolveTaskTableWorldbookTokens');
console.log('==== resolveTaskTableWorldbookTokens ====');
if (i >= 0) console.log(JSON.stringify(src.slice(i - 80, i + 600)).slice(0, 700));
