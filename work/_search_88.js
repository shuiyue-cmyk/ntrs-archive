// 在 数据库8.8.js 搜索：剧情推进 prompt 构建 + 表格注入 + $0 处理
const fs = require('fs');
const fp = 'C:/Users/zouyu/Downloads/酒馆/数据库/数据库8.8.js';
const src = fs.readFileSync(fp, 'utf8');
const kws = ['buildPlotPrompt', 'plotPrompt', 'renderPlotTask', 'promptGroup', '表格数据', 'injectTable', 'plotTableData', 'tableDataIntoPrompt', 'placeholderMap', 'normalizedPreset', 'plotSettings.promptGroup', 'contextExtractRules', 'contextExcludeRules', 'plotWorldbookConfig', 'finalSystemDirective'];
for (const kw of kws) {
  let i = src.indexOf(kw);
  let n = 0;
  let hits = [];
  while (i >= 0 && n < 4) {
    hits.push('@' + i + ' ' + JSON.stringify(src.slice(Math.max(0, i - 80), i + 120)).slice(0, 210));
    i = src.indexOf(kw, i + 1);
    n++;
  }
  if (hits.length) {
    console.log('==== ' + kw + ' (' + hits.length + ')');
    hits.forEach(h => console.log('  ' + h));
  }
}
