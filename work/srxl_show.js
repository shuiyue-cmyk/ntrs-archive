// 展示两块更新后内容
const fs = require('fs');
const j = JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/三人逆行v11.0—PrismFox~NTRS.json', 'utf8'));
for (const pr of j.prompts) {
  if ((pr.name || '').includes('NTRS')) {
    console.log('\n========== [' + pr.name + '] ==========');
    console.log(pr.content);
  }
}
