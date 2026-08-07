// t38 fix: Cirno_BATTLE_Turn_straight.json
// 3 fixes, each verified via split().length===2; write back original j (top-level array)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight.json';
const bakPath = path + '.bak-pre-t38';

// ---- backup ----
fs.copyFileSync(path, bakPath);
console.log('BACKUP created:', bakPath, fs.statSync(bakPath).size, 'bytes');

// ---- read ----
const rawOrig = fs.readFileSync(path, 'utf8');
const j = JSON.parse(rawOrig);
if (!Array.isArray(j) || j.length !== 1) {
  throw new Error('Expected top-level array of length 1, got isArray=' + Array.isArray(j) + ' len=' + j.length);
}
const p = j[0];
const tasks = p.plotTasks;
if (!Array.isArray(tasks) || tasks.length !== 3) {
  throw new Error('Expected 3 plotTasks, got ' + (tasks||[]).length);
}

// ---- detect indent (match original) ----
let indent = 2;
if (/^\[\n  \{/m.test(rawOrig)) indent = 2;
else if (/^\[\n    \{/m.test(rawOrig)) indent = 4;
else if (/^\[\{"/m.test(rawOrig)) indent = 0;
console.log('Detected indent:', indent, '(original head:', JSON.stringify(rawOrig.slice(0, 10)), ')');

const report = [];

// ============ FIX 1: S3 stage template (promptGroup[7]) table header NTR标记 -> 关系标记 ============
(function fix1() {
  const label = 'FIX1 (S3 promptGroup[7] 表头 NTR标记→关系标记)';
  const s3 = tasks[2]; // 导演台本
  const pg = s3.promptGroup;
  if (!Array.isArray(pg) || pg.length <= 7) {
    report.push(label + ': SKIP (promptGroup has only ' + (pg||[]).length + ' msgs, no index 7)');
    return;
  }
  const m = pg[7];
  let c = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
  const OLD = 'NTR标记';
  const NEW = '关系标记';
  const parts = c.split(OLD);
  if (parts.length === 2) {
    c = c.split(OLD).join(NEW);
    m.content = c;
    // sanity: NEW now present
    const hasNew = m.content.indexOf(NEW) !== -1;
    report.push(label + ': SUCCESS (replaced 1 occurrence; 关系标记 present=' + hasNew + ')');
  } else {
    // already clean?
    const alreadyHasNew = c.indexOf(NEW) !== -1;
    report.push(label + ': SKIP (NTR标记 occurrences=' + (parts.length - 1) + '; 关系标记 already present=' + alreadyHasNew + ')');
  }
})();

// ============ FIX 2: S2-DESC + S3-DESC worldbook category NTR/绿帽 -> 竞争/信息差旁观 ============
// Text has the run "NTR/绿帽/竞争/信息差旁观" — NTR/绿帽 is one slash-item, 竞争/信息差旁观 the next.
// Replacing the whole run with "竞争/信息差旁观" removes the NTR/绿帽 item without duplicating.
(function fix2() {
  const OLD = 'NTR/绿帽/竞争/信息差旁观';
  const NEW = '竞争/信息差旁观';
  const targets = [
    { label: 'S2-DESC (plotTaskThugTempo.description)', obj: tasks[1], key: 'description' },
    { label: 'S3-DESC (defaultPlotTask.description)', obj: tasks[2], key: 'description' },
  ];
  targets.forEach(t => {
    const label = 'FIX2 (' + t.label + ' NTR/绿帽→竞争/信息差旁观)';
    let c = t.obj[t.key];
    if (typeof c !== 'string') {
      report.push(label + ': SKIP (no ' + t.key + ' field)');
      return;
    }
    const parts = c.split(OLD);
    if (parts.length === 2) {
      c = c.split(OLD).join(NEW);
      t.obj[t.key] = c;
      const stillHasOld = c.indexOf('NTR/绿帽') !== -1;
      const hasNew = c.indexOf(NEW) !== -1;
      report.push(label + ': SUCCESS (replaced 1 run; NTR/绿帽残留=' + stillHasOld + '; 竞争/信息差旁观 present=' + hasNew + ')');
    } else {
      const hasOldBare = c.indexOf('NTR/绿帽') !== -1;
      report.push(label + ': SKIP (OLD-run occurrences=' + (parts.length - 1) + '; bare NTR/绿帽 present=' + hasOldBare + ')');
    }
  });
})();

// ============ FIX 3: S3-MSG0 (promptGroup[0]) 底色仍存 sentence ============
(function fix3() {
  const label = 'FIX3 (S3 promptGroup[0] 底色仍存整句)';
  const s3 = tasks[2];
  const pg = s3.promptGroup;
  if (!Array.isArray(pg) || pg.length === 0) {
    report.push(label + ': SKIP (no promptGroup[0])');
    return;
  }
  const m = pg[0];
  let c = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
  const OLD = '**线状态底色不受行动门影响**：雄竞期竞争张力常驻（no-act 走快速通道，但底色仍存——指 FSD 正文 AI 编排时仍保留竞争张力底色，非进度推进）。';
  const NEW = '快速通道仅省略导演分析，下一轮恢复时保持剧情连续性。';
  const parts = c.split(OLD);
  if (parts.length === 2) {
    c = c.split(OLD).join(NEW);
    m.content = c;
    const stillHas = c.indexOf('底色仍存') !== -1;
    const hasNew = c.indexOf(NEW) !== -1;
    report.push(label + ': SUCCESS (replaced 1 sentence; 底色仍存残留=' + stillHas + '; new text present=' + hasNew + ')');
  } else {
    const hasBare = c.indexOf('底色仍存') !== -1;
    report.push(label + ': SKIP (OLD-sentence occurrences=' + (parts.length - 1) + '; bare 底色仍存 present=' + hasBare + ')');
  }
})();

// ---- write back (original j, top-level array) ----
const out = JSON.stringify(j, null, indent);
fs.writeFileSync(path, out, 'utf8');
console.log('\nWROTE:', path, fs.statSync(path).size, 'bytes (indent=' + indent + ')');

console.log('\n=== FIX REPORT ===');
report.forEach(r => console.log(' - ' + r));

// ============ VERIFY (re-read) ============
console.log('\n=== VERIFY (re-read) ===');
const rawNew = fs.readFileSync(path, 'utf8');
let j2;
try { j2 = JSON.parse(rawNew); } catch (e) {
  console.log('VERIFY FAIL: JSON parse error:', e.message);
  process.exit(1);
}
console.log('JSON parses: OK');
console.log('top-level isArray:', Array.isArray(j2), 'len:', j2.length);
console.log('raw starts with [:', rawNew.trim().startsWith('['));
const blob = JSON.stringify(j2);
function cnt(needle) {
  let n = 0, i = blob.indexOf(needle);
  while (i !== -1) { n++; i = blob.indexOf(needle, i + 1); }
  return n;
}
console.log('--- target string counts (must be 0) ---');
console.log('  NTR标记      :', cnt('NTR标记'));
console.log('  NTR/绿帽     :', cnt('NTR/绿帽'));
console.log('  NTR绿帽(无斜):', cnt('NTR绿帽'));
console.log('  底色仍存      :', cnt('底色仍存'));
console.log('  雄竞底色仍存  :', cnt('雄竞底色仍存'));
console.log('--- expected-present (sanity) ---');
console.log('  关系标记      :', cnt('关系标记'));
console.log('  竞争/信息差旁观:', cnt('竞争/信息差旁观'));
console.log('  快速通道仅省略导演分析:', cnt('快速通道仅省略导演分析'));

const allCleared = cnt('NTR标记') === 0 && cnt('NTR/绿帽') === 0 && cnt('底色仍存') === 0;
const structureOk = Array.isArray(j2) && j2.length === 1 && rawNew.trim().startsWith('[');
console.log('\nACCEPTANCE: ' + (allCleared && structureOk ? 'PASS' : 'FAIL'));
console.log('  structureOk:', structureOk, ' allCleared:', allCleared);
