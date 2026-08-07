// 核对当前 NTRS 预设真实结构：FSD / thugSpawn 六型 / 锁定状态 / NTRtrack / thugAction / ntrsProgress
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const samples = [
  'Cirno_NTRS_turn_edit_straight_4.7.json',
  'Cirno_NTRS_turn_edit_straight_revise_4.7.json',
  'Cirno_NTRS_turn_edit_straight_4.7_2ALL.json',
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_straight_NTRS_2ALL.json',
  'Cirno_BATTLE_Turn_straight.json',
];
for (const fn of samples) {
  const p = dir + fn;
  if (!fs.existsSync(p)) { console.log('SKIP ' + fn); continue; }
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = Array.isArray(j) ? j[0] : j;
  console.log('\n================ ' + fn + ' ================');
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  console.log('FSD: ' + (root.finalSystemDirective || '').slice(0, 300));
  let s2all = '', s3all = '';
  for (const m of s2.promptGroup) s2all += (m.content || '') + '\n';
  for (const m of s3.promptGroup) s3all += (m.content || '') + '\n';
  console.log('\n-- S2 关键片段 --');
  for (const kw of ['五型', '六型', '舔狗', '锁定状态', 'NTRtrack', 'ntrsProgress', '淫妻线五阶段', '黄毛积极行动门', '亲密', '41%', '雄竞']) {
    const i = s2all.indexOf(kw);
    if (i >= 0) console.log('[' + kw + ']: ...' + s2all.slice(Math.max(0, i - 60), i + 120).replace(/\n/g, ' '));
  }
  console.log('\n-- S3 关键片段 --');
  for (const kw of ['ntrsProgress', '进度', 'NTRtrack', 'thugSpawn', '雄竞', '第三阶段', '苦主', '人尽可夫', '乐享型', '性骚扰']) {
    const i = s3all.indexOf(kw);
    if (i >= 0) console.log('[' + kw + ']: ...' + s3all.slice(Math.max(0, i - 60), i + 120).replace(/\n/g, ' '));
  }
  // S2 输出标签顺序行
  const tagLine = s2all.split('\n').find(l => l.includes('Output tags in order'));
  if (tagLine) console.log('\n输出顺序行: ' + tagLine.trim());
}
