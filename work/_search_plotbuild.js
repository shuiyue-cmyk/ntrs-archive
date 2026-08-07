// 搜索插件：剧情推进 prompt 构建 + 表格数据注入逻辑
const fs = require('fs');
const fp = 'C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.7.2.js';
const src = fs.readFileSync(fp, 'utf8');
const kws = ['buildPlot', 'plotPrompt', 'renderPlotTask', 'plotTaskPrompt', 'promptGroup', '表格数据注入', 'injectTable', 'plotTableData', 'tableDataIntoPrompt', 'contextInject', 'plotSettings.tableData', 'plotPlaceholder', 'fillPlaceholder', 'placeholderMap', 'normalizedPreset', 'plotSettings.promptGroup'];
for (const kw of kws) {
  let i = src.indexOf(kw);
  let n = 0;
  console.log('==== ' + kw);
  while (i >= 0 && n < 3) {
    console.log(' @' + i, JSON.stringify(src.slice(Math.max(0, i - 100), i + 150)).slice(0, 260));
    i = src.indexOf(kw, i + 1);
    n++;
  }
}
