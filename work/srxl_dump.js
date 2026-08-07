// 提取 NTRS 两块 + 全部黄毛/ntrs 相关上下文
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/三人逆行v11.0—PrismFox~NTRS.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
for (const pr of j.prompts) {
  const name = pr.name || '';
  if (name.includes('NTRS') || name.includes('NTR') || name.includes('黄毛')) {
    console.log('\n========== [' + name + '] role=' + pr.role + ' len=' + (pr.content || '').length + ' ==========');
    console.log(pr.content);
  }
}
// 找含 ntrs/黄毛 的其他 prompt
console.log('\n\n########## 其他含 ntrs/黄毛 的 prompt ##########');
for (const pr of j.prompts) {
  const c = pr.content || '';
  if (!/NTRS|NTR|黄毛/.test(pr.name || '') && /ntrs|黄毛/.test(c)) {
    console.log('\n--- [' + pr.name + '] ---');
    // 只显示含关键词的行
    for (const line of c.split('\n')) {
      if (/ntrs|黄毛/.test(line)) console.log(line.slice(0, 200));
    }
  }
}
// 顶层字段里还有别的 NTRS 引用吗
console.log('\n\n########## extensions 字段 ##########');
console.log(JSON.stringify(j.extensions, null, 1).slice(0, 1500));
