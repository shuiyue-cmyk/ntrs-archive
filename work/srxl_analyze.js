// 三人逆行v11.0 结构分析：顶层字段 + NTRS 关键词定位
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/三人逆行v11.0—PrismFox~NTRS.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('顶层类型:', Array.isArray(j) ? 'array len=' + j.length : typeof j);
const root = Array.isArray(j) ? j[0] : j;
if (root && typeof root === 'object') {
  console.log('顶层键:', Object.keys(root).join(', '));
  if (root.plotTasks) {
    console.log('\nplotTasks:');
    for (const t of root.plotTasks) {
      console.log(' -', t.id, '| name:', t.name, '| stage:', t.stage, '| order:', t.order, '| extractTags:', t.extractTags, '| extractInjectTags:', t.extractInjectTags, '| msgs:', (t.promptGroup || []).length);
    }
  }
  if (root.prompts) {
    console.log('\nprompts:');
    for (const pr of root.prompts) console.log(' -', pr.id || pr.name, '| role:', pr.role, '| len:', (pr.content || '').length);
  }
  if (root.finalSystemDirective) console.log('\nFSD len:', root.finalSystemDirective.length);
  if (root.characterBook) console.log('\ncharacterBook keys:', Object.keys(root.characterBook).join(', '), '| entries:', (root.characterBook.entries || []).length);
  // 全文件 NTRS 关键词分布
  const blob = JSON.stringify(j);
  for (const kw of ['NTRS', 'NTR', '雄竞', '淫妻', '黄毛', '苦主', '牛头人', 'ntrs', '剧情推进']) {
    let n = 0, idx = -1, first = '';
    while ((idx = blob.indexOf(kw, idx + 1)) !== -1) { n++; if (n === 1) first = blob.slice(Math.max(0, idx - 80), idx + 120).replace(/\\n/g, ' '); }
    console.log('\n[' + kw + '] count=' + n + (n ? '\n  first: ' + first : ''));
  }
}
