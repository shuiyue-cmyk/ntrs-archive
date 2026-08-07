// 深入 8.8.js：renderPlotTaskContentWithIsolatedVariables + allTablesJson + 占位符替换
const fs = require('fs');
const src = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js', 'utf8');

// 1. renderPlotTaskContentWithIsolatedVariables_ACU 完整函数
let i = src.indexOf('function renderPlotTaskContentWithIsolatedVariables_ACU');
console.log('==== renderPlotTaskContentWithIsolatedVariables ====');
if (i >= 0) console.log(src.slice(i, i + 1500));

// 2. allTablesJson 相关
i = src.indexOf('allTablesJson');
let n = 0;
console.log('==== allTablesJson 出现 ====');
while (i >= 0 && n < 10) {
  console.log('@' + i, JSON.stringify(src.slice(Math.max(0, i - 60), i + 80)).slice(0, 150));
  i = src.indexOf('allTablesJson', i + 1);
  n++;
}
