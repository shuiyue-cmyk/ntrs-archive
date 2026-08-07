// 搜索 DB 插件 $0 注入机制
const fs = require('fs');
const files = ['C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.7.2.js', 'C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.1.js'];
const kws = ['$0', '当前表格数据', 'contextExtractRules', 'tableData', 'sheetData', 'guideData', '上下文注入', '表格数据', 'plotSettings', '占位符', '替换'];
for (const fp of files) {
  if (!fs.existsSync(fp)) continue;
  const src = fs.readFileSync(fp, 'utf8');
  console.log('====', fp, 'size', src.length);
  for (const kw of kws) {
    let i = src.indexOf(kw);
    let n = 0;
    while (i >= 0 && n < 4) {
      console.log('[' + kw + ']', JSON.stringify(src.slice(Math.max(0, i - 80), i + 100)).slice(0, 200));
      i = src.indexOf(kw, i + 1);
      n++;
    }
  }
}
