// 导出六个 BATTLE 预设为可读文本 dump，供子代理审查
const fs = require('fs');
const path = require('path');

const DIR = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设';
const OUT = 'C:/Users/zouyu/Downloads/BATTLE_work/review_dump';
fs.mkdirSync(OUT, { recursive: true });

const FILES = [
  'Cirno_BATTLE_Turn_straight.json',
  'Cirno_BATTLE_Turn_FT.json',
  'Cirno_BATTLE_Turn_DEI.json',
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];

function dumpTask(t, ti) {
  const out = [];
  out.push(`\n===== TASK ${ti}: ${t.name} =====`);
  out.push(`id: ${t.id}`);
  out.push(`enabled: ${t.enabled}`);
  out.push(`stage: ${t.stage}`);
  out.push(`order: ${t.order}`);
  out.push(`extractTags: ${JSON.stringify(t.extractTags)}`);
  out.push(`extractInjectTags: ${JSON.stringify(t.extractInjectTags)}`);
  out.push(`minLength: ${t.minLength}`);
  out.push(`maxRetries: ${t.maxRetries}`);
  out.push(`mergeStrategy: ${t.mergeStrategy}`);
  out.push(`description: ${t.description}`);
  out.push(`triggerWhen: ${t.triggerWhen}`);
  if (t.agentControl) out.push(`agentControl: ${JSON.stringify(t.agentControl)}`);
  if (t.finalDirectiveTemplate) out.push(`finalDirectiveTemplate: ${t.finalDirectiveTemplate}`);
  const pg = t.promptGroup || {};
  for (const k of Object.keys(pg)) {
    const m = pg[k];
    const role = (m.role || '').toUpperCase();
    out.push(`\n--- ${ti === 2 ? 'S3' : ti === 1 ? 'S2' : 'S1'}-MSG${k} [${role}] ---`);
    out.push(m.content || '');
  }
  return out.join('\n');
}

for (const fn of FILES) {
  const raw = fs.readFileSync(path.join(DIR, fn), 'utf8');
  const j = JSON.parse(raw);
  const p = Array.isArray(j) ? j[0] : j;
  const out = [];
  out.push(`# FILE: ${fn}`);
  out.push(`topLevelIsArray: ${Array.isArray(j)}`);
  out.push(`name: ${p.name}`);
  out.push(`recallCount: ${p.recallCount}`);
  out.push(`globalRevision: ${p.globalRevision}`);
  out.push(`extractTags: ${JSON.stringify(p.extractTags)}`);
  out.push(`extractInjectTags: ${JSON.stringify(p.extractInjectTags)}`);
  out.push(`contextExcludeRules count: ${Array.isArray(p.contextExcludeRules) ? p.contextExcludeRules.length : '?'}`);
  out.push(`plotTasks count: ${Array.isArray(p.plotTasks) ? p.plotTasks.length : '?'}`);
  if (p.plotTasks && Array.isArray(p.plotTasks)) {
    p.plotTasks.forEach((t, i) => out.push(dumpTask(t, i)));
  }
  out.push(`\n===== finalSystemDirective =====`);
  out.push(p.finalSystemDirective || '(none)');
  const outFile = path.join(OUT, fn.replace('.json', '.txt'));
  fs.writeFileSync(outFile, out.join('\n'), 'utf8');
  console.log('OK', fn, '->', outFile, 'chars:', out.join('\n').length);
}
