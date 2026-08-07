// 表格合法性完整审计（skill 6-point 配方）
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/NTRS适配表格.json';
let fail = 0;
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

// 1. top-level
console.log('=== 1. 顶层 ===');
const roots = Object.keys(j);
const illegal = roots.filter(k => k !== 'mate' && !k.startsWith('sheet_'));
console.log('root keys: ' + roots.length + ' 非法 root: ' + (illegal.length ? illegal.join(',') : '无'));
if (illegal.length) fail++;
if (j.mate.type !== 'chatSheets') { console.log('[FAIL] mate.type=' + j.mate.type); fail++; } else console.log('mate.type=chatSheets OK');

function parseDdlCols(ddl) {
  const cols = [];
  for (const line of ddl.split('\n')) {
    const m = line.match(/^\s*(\w+)\s+[^]*?--\s*(.+?)\s*$/);
    if (m && m[1] !== 'CREATE' && m[1] !== 'TABLE') cols.push({ name: m[1], comment: m[2].trim() });
  }
  return cols;
}
function matchesSheetHeader(sqlName, comment, header) {
  if (!header) return false;
  return header === sqlName || (sqlName === 'row_id' && header === '行号') || header === comment;
}

// orderNo 唯一性
const orderNos = [];
for (const k of Object.keys(j)) {
  if (k === 'mate') continue;
  const s = j[k];
  console.log('\n=== ' + k + ' (' + s.name + ') ===');
  // 2. per-sheet
  if (s.uid !== k) { console.log('  [FAIL] uid=' + s.uid + ' != key=' + k); fail++; }
  if (s.sourceData && s.content) {
    const sd = s.sourceData;
    const six = ['note', 'initNode', 'insertNode', 'updateNode', 'deleteNode', 'ddl'];
    for (const f of six) if (!sd[f]) { console.log('  [FAIL] sourceData.' + f + ' 空'); fail++; }
    // 3. header ↔ DDL
    const headers = s.content[0];
    if (!headers || headers[0] !== 'row_id') { console.log('  [FAIL] content[0][0] != row_id'); fail++; }
    const cols = parseDdlCols(sd.ddl);
    if (cols.length !== headers.length) {
      console.log('  [FAIL] ddl列数=' + cols.length + ' header数=' + headers.length); fail++;
    } else {
      for (let i = 0; i < headers.length; i++) {
        const c = cols[i];
        if (!matchesSheetHeader(c.name, c.comment, headers[i])) {
          console.log('  [FAIL] 列' + i + ': header=' + headers[i] + ' sql=' + c.name + ' comment=' + c.comment); fail++;
        }
      }
    }
    // DDL row_id INTEGER PRIMARY KEY
    if (!sd.ddl.includes('row_id INTEGER PRIMARY KEY')) { console.log('  [FAIL] DDL 无 row_id INTEGER PRIMARY KEY'); fail++; }
    // DDL 无全角括号
    if (/[（）]/.test(sd.ddl)) { console.log('  [FAIL] DDL 含全角括号'); fail++; }
    // INSERT ↔ DDL 列匹配
    for (const f of ['initNode', 'insertNode', 'updateNode', 'deleteNode']) {
      const sql = sd[f] || '';
      const ins = [...sql.matchAll(/INSERT INTO \w+\s*\(([^)]*)\)/g)];
      for (const m of ins) {
        const colsIn = m[1].split(',').map(x => x.trim()).filter(Boolean);
        const ddlNames = new Set(cols.map(c => c.name));
        for (const cn of colsIn) if (!ddlNames.has(cn)) { console.log('  [FAIL] ' + f + ' INSERT 列 ' + cn + ' 不在 DDL'); fail++; }
      }
    }
  }
  if (s.orderNo !== undefined) orderNos.push(s.orderNo);
  const uc = s.updateConfig || {};
  const ucFields = ['uiSentinel', 'contextDepth', 'updateFrequency', 'batchSize', 'skipFloors', 'groupId', 'maxRetries'];
  for (const f of ucFields) if (uc[f] === undefined) { console.log('  [FAIL] updateConfig.' + f + ' 缺失'); fail++; }
}
// orderNo 唯一
const dup = orderNos.filter((v, i) => orderNos.indexOf(v) !== i);
console.log('\n=== orderNo ===');
console.log(dup.length ? '[FAIL] 重复 orderNo: ' + dup.join(',') : 'orderNo 唯一 OK (' + orderNos.length + ' 个)');
if (dup.length) fail++;

// variant leak 扫描
console.log('\n=== 变体词泄漏扫描 ===');
const leakWords = ['_2ALL', 'ALLin', 'straight', 'DEI', 'FT', '4.7', '天意', '一黄毛通吃', 'stage1', '分支A'];
for (const k of Object.keys(j)) {
  if (k === 'mate') continue;
  const blob = JSON.stringify(j[k].sourceData || {});
  for (const w of leakWords) {
    if (blob.includes(w)) { console.log('  [WARN] ' + k + ' 含变体词: ' + w); }
  }
}
console.log('\n==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
