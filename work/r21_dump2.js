// dump 共性 BUG 锚点
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const probe = (fn) => {
  const j = JSON.parse(fs.readFileSync(dir + fn, 'utf8'));
  const root = j[0];
  const s2 = root.plotTasks.find(t => t.id === 'plotTaskThugTempo');
  const s3 = root.plotTasks.find(t => t.id === 'defaultPlotTask');
  console.log('##### ' + fn);
  // m1 开场白
  const m1 = s2.promptGroup[1];
  if (m1) { const c = m1.content || ''; const i = c.indexOf('含黄毛动向追踪'); if (i !== -1) console.log('m1开场白: ' + JSON.stringify(c.slice(i - 40, i + 25))); }
  // description
  const d = s2.description || '';
  let k = d.indexOf('含黄毛动向追踪');
  if (k !== -1) console.log('desc: ' + JSON.stringify(d.slice(k - 50, k + 40)));
  k = d.indexOf('输出 thugSpawn');
  if (k !== -1) console.log('desc输出: ' + JSON.stringify(d.slice(k, k + 90)));
  // S3 m15
  let s3all = s3.promptGroup.map(m => m.content || '').join('\n');
  k = s3all.indexOf('thugSpawn 追踪区块');
  if (k !== -1) console.log('m15追踪区块: ' + JSON.stringify(s3all.slice(k - 40, k + 40)));
  k = s3all.indexOf('thugSpawn> 标签内的【黄毛动向追踪】');
  if (k !== -1) console.log('m15标签内: ' + JSON.stringify(s3all.slice(k - 20, k + 40)));
  // 第二步 Tags order
  let s2all = s2.promptGroup.map(m => m.content || '').join('\n');
  k = s2all.indexOf('Tags order:');
  if (k !== -1) console.log('第二步Tags order: ' + JSON.stringify(s2all.slice(k - 5, k + 90)));
  // sparkNotes intro 标签清单
  k = s2all.indexOf('thugSpawn→');
  if (k !== -1) console.log('sparkNotes intro: ' + JSON.stringify(s2all.slice(k - 15, k + 60)));
  // prompts[] FSD
  const pfsd = (root.prompts || []).find(p => p && p.id === 'finalSystemDirective');
  if (pfsd) { const c = pfsd.content || ''; const hasNtr = c.includes('{{NTRtrack}}'); console.log('promptsFSD 含NTRtrack: ' + hasNtr + ' | ' + JSON.stringify(c.slice(0, 140))); }
};
probe('Cirno_BATTLE_Turn_straight.json');
probe('Cirno_NTRS_turn_edit_straight_4.7.json');
