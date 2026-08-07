// R10 审查 dump：六版全文审计 txt（含每 task 元数据 + promptGroup 全部 msg + FSD，不截断）
const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const outDir = 'C:/Users/zouyu/Downloads/BATTLE_work/r10_review_dump/';
fs.mkdirSync(outDir, { recursive: true });
const files = [
  'Cirno_BATTLE_Turn_straight.json',
  'Cirno_BATTLE_Turn_FT.json',
  'Cirno_BATTLE_Turn_DEI.json',
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const j = JSON.parse(raw);
  const root = Array.isArray(j) ? j[0] : j;
  const L = [];
  L.push('FILE: ' + fn);
  L.push('top-level-array: ' + Array.isArray(j));
  L.push('name: ' + root.name);
  L.push('plotTasks: ' + (root.plotTasks ? root.plotTasks.map(t => t.id + ':' + t.stage + ':' + t.order).join(',') : 'NONE (single defaultPlotTask)'));
  L.push('');
  const tasks = root.plotTasks || [{ id: 'defaultPlotTask', name: root.name, stage: 1, order: 0, extractTags: root.extractTags, extractInjectTags: root.extractInjectTags, description: root.description, agentControl: root.agentControl, promptGroup: root.promptGroup }];
  for (const t of tasks) {
    L.push('===== TASK id=' + t.id + ' | name=' + (t.name || '') + ' | stage=' + t.stage + ' | order=' + t.order);
    L.push('extractTags: ' + (t.extractTags || ''));
    L.push('extractInjectTags: ' + (t.extractInjectTags || ''));
    L.push('description: ' + (t.description || ''));
    L.push('agentControl: ' + JSON.stringify(t.agentControl || null));
    L.push('promptGroup msgs: ' + (t.promptGroup ? t.promptGroup.length : 0));
    L.push('');
    if (t.promptGroup) {
      for (let i = 0; i < t.promptGroup.length; i++) {
        const m = t.promptGroup[i];
        L.push('----- MSG[' + i + '] role=' + m.role + ' | contentLen=' + (m.content ? m.content.length : 0));
        L.push(m.content || '');
        L.push('');
      }
    }
  }
  L.push('===== finalSystemDirective =====');
  L.push(root.finalSystemDirective || '');
  L.push('');
  const out = outDir + fn.replace('.json', '.audit.txt');
  fs.writeFileSync(out, L.join('\n'), 'utf8');
  console.log(fn + ' -> ' + out + ' (' + L.join('\n').length + ' chars)');
}
console.log('DONE');
