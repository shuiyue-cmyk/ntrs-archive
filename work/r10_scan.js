// R10 审查残扫：FSD wiring / 单大括号 / role / 旧概念词 / 跨体系泄漏
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const pure = ['Cirno_BATTLE_Turn_straight.json', 'Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'];
const hybrid = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const all = [...pure, ...hybrid];
let fail = 0;
const cnt = (s, re) => (s.match(re) || []).length;
for (const fn of all) {
  const isPure = pure.includes(fn);
  const raw = fs.readFileSync(dir + fn, 'utf8');
  const j = JSON.parse(raw);
  const root = Array.isArray(j) ? j[0] : j;
  const tasks = root.plotTasks || [{ id: 'defaultPlotTask', extractTags: root.extractTags, extractInjectTags: root.extractInjectTags, promptGroup: root.promptGroup }];
  const blob = JSON.stringify(root);
  const L = [];
  L.push('==== ' + fn + ' (' + (isPure ? '纯雄竞' : 'NTRS·雄竞') + ') ====');
  // 1. extractTags -> FSD wiring
  const fsd = root.finalSystemDirective || '';
  const produced = new Set();
  for (const t of tasks) { (t.extractTags || '').split(',').map(x => x.trim()).filter(Boolean).forEach(x => produced.add(x)); (t.extractInjectTags || '').split(',').map(x => x.trim()).filter(Boolean).forEach(x => produced.add(x)); }
  const fsdRefs = [...fsd.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
  const missingInFsd = [...produced].filter(x => !fsd.includes('{{' + x + '}}') && !fsd.includes(x));
  const dangling = fsdRefs.filter(x => !produced.has(x));
  L.push('extractTags+Inject: ' + [...produced].join(','));
  L.push('FSD {{refs}}: ' + fsdRefs.join(','));
  L.push(missingInFsd.length ? '  [FAIL] tags not in FSD: ' + missingInFsd.join(',') : '  FSD wiring: OK (all produced tags referenced)');
  L.push(dangling.length ? '  [FAIL] dangling FSD refs (not produced): ' + dangling.join(',') : '  FSD dangling refs: OK');
  if (missingInFsd.length || dangling.length) fail++;
  // 2. single brace leaks
  const singleUser = cnt(blob, /(?<!\{)\{user\}(?!\})/g) + cnt(blob, /(?<!\{)\{char\}(?!\})/g);
  L.push(singleUser ? '  [FAIL] single-brace {user}/{char}: ' + singleUser : '  single-brace: OK');
  if (singleUser) fail++;
  // 3. role case
  let badRole = 0;
  for (const t of tasks) for (const m of (t.promptGroup || [])) if (!['USER', 'SYSTEM', 'assistant'].includes(m.role)) badRole++;
  L.push(badRole ? '  [FAIL] bad role values: ' + badRole : '  role case: OK');
  if (badRole) fail++;
  // 4. residual words
  const checks = [];
  if (isPure) {
    checks.push(['41%', '纯雄竞禁 41%']);
    checks.push(['察觉型', '纯雄竞禁 察觉型']);
    checks.push(['ntrsProgress', '纯雄竞禁 ntrsProgress']);
    checks.push(['推波助澜', '纯雄竞禁 推波助澜']);
    checks.push(['淫妻线', '纯雄竞禁 淫妻线']);
    checks.push(['身体接受度', '纯雄竞禁 门槛表']);
  } else {
    checks.push(['黄毛败·友好', 'NTRS·雄竞禁 黄毛败·友好']);
    checks.push(['见 B2', 'NTRS·雄竞禁 见 B2']);
  }
  checks.push(['接下来的场景中有出现的可能', '禁旧 spawn 措辞']);
  for (const [w, label] of checks) {
    const c = cnt(blob, new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    L.push(c ? '  [FAIL] ' + label + ': ' + c + 'x「' + w + '」' : '  ' + label + ': OK (0)');
    if (c) fail++;
  }
  // 5. 对象已站队不豁免 status
  const zw = cnt(blob, /对象已站队不豁免/g);
  if (isPure) { L.push('  对象已站队不豁免 保留: ' + zw + (zw > 0 ? ' OK' : ' [FAIL]')); if (!zw) fail++; }
  else { L.push('  对象已站队不豁免 应=0: ' + zw + (zw === 0 ? ' OK' : ' [FAIL]')); if (zw) fail++; }
  // 6. attention check intro
  const eight = cnt(blob, /以下八题/g), nine = cnt(blob, /以下九题/g);
  if (isPure) { L.push('  注意力自检引言: 八题=' + eight + ' 九题=' + nine + (nine >= 1 && eight === 0 ? ' OK' : ' [FAIL]')); if (nine < 1 || eight > 0) fail++; }
  else { L.push('  注意力自检引言: 八题=' + eight + ' 九题=' + nine + ' (NTRS·雄竞 B6 不改题数, 八题合法)'); }
  console.log(L.join('\n'));
}
console.log('\n==== 总结: ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
