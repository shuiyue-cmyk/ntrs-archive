// R21 补修4：NTRS12 L13 硬约束 / DEI_revise_ALLin 归属残留 / ALLin 术语 / 紧随其后
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
for (const fn of files) {
  const p = dir + fn;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
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
  };
  // F9. NTRS12 系 L13 硬约束（Immediately after </thugSpawn> 加 NTRtrack）
  if (isN) {
    rep(s2.promptGroup, 'Immediately after </thugSpawn>, output <thugSpawnReason>一句话</thugSpawnReason>', 'Immediately after </thugSpawn>, output <NTRtrack>（追踪区块）then <thugSpawnReason>一句话</thugSpawnReason>');
  }
  // F12. 紧随其后 措辞（NTRS12 系 MSG0）
  if (isN) {
    rep(s2.promptGroup, '产出是 <thugSpawn>（标签内只放刷新状态+黄毛人设）与紧随其后的 <thugSpawnReason>', '产出是 <thugSpawn>（标签内只放刷新状态+黄毛人设）、<NTRtrack>（追踪）与 <thugSpawnReason>');
  }
  // F10. DEI_revise_ALLin 归属残留变体
  rep(s3.promptGroup, '黄毛动向+对象动向、人设、六型、融入方式、锁定状态（真正锁定/仅背景板登场；', '黄毛动向+对象动向（人设/六型/融入方式见 {{thugSpawn}}）；锁定状态（真正锁定/仅背景板登场；');
  // F11. ALLin 术语泄漏（人尽可夫补充细则）
  rep(s3.promptGroup, '一黄毛多目标（ALLin）时', '一黄毛多目标时');
  if (n > 0) fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log(fn + ': 补修 ' + n + ' 处');
}
console.log('DONE');
