// 查 replaceDbSqlVariables + {[db...]} 语法 + renderPlotTaskMessages 占位符替换
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. replaceDbSqlVariables 函数
let i = src.indexOf('function replaceDbSqlVariables');
console.log('==== replaceDbSqlVariables ====');
if (i >= 0) console.log(src.slice(i, i + 1800));

// 2. renderPlotTaskMessages_ACU 全文（找占位符替换）
i = src.indexOf('async function renderPlotTaskMessages_ACU');
console.log('==== renderPlotTaskMessages_ACU ====');
if (i >= 0) console.log(src.slice(i, i + 2500));
