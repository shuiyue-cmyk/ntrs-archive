// R21 补修3：<thugSpawn> 追踪区块变体 / S3 归属句 / 五型枚举舔狗型
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  let n = 0;
  const rep = (arr, from, to) => {
    let c = 0;
    for (const m of arr) {
      let t = m.content || '';
      if (t.includes(from)) { t = t.split(from).join(to); m.content = t; c++; }
    }
    if (c) n += c;
    return c;
  };
  // 1. <thugSpawn> 追踪区块 变体 → NTRtrack
  rep(s3.promptGroup, '从 <thugSpawn> 追踪区块/历史刷新记录直读', '从 <NTRtrack> 追踪区块/历史刷新记录直读');
  // 2. S3 msg2 归属句：人设/六型/融入方式 从 NTRtrack 摘出
  rep(s3.promptGroup, '黄毛动向+对象动向、人设、六型、融入方式、锁定状态（真正锁定/仅背景板登场）', '黄毛动向+对象动向（人设/六型/融入方式见 {{thugSpawn}}）；锁定状态（真正锁定/仅背景板登场）');
  // 3. 五型枚举补舔狗型（全文裸枚举）
  for (const arr of [s2.promptGroup, s3.promptGroup]) {
    for (const m of arr) {
      let t = m.content || '';
      if (t.includes('（权力型/魅力型/隐秘型/强制型/诱惑型）')) { t = t.split('（权力型/魅力型/隐秘型/强制型/诱惑型）').join('（权力型/魅力型/隐秘型/强制型/诱惑型/舔狗型）'); n++; }
      m.content = t;
    }
  }
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': 补修 ' + n + ' 处');
}
console.log('DONE');
