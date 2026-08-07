// R16 修复独立验证
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
let fail = 0;
for (const fn of files) {
  const raw = fs.readFileSync(dir + fn, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.log('[FAIL] JSON ' + fn); fail++; continue; }
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] array ' + fn); fail++; continue; }
  const blob = JSON.stringify(j);
  const isB = fn.startsWith('Cirno_BATTLE_Turn');
  const isHyb = isB && fn.includes('_NTRS');
  const isN = fn.startsWith('Cirno_NTRS_turn_edit');
  const p0a = isB ? blob.includes('追踪区块每轮输出（按判定状态分级）') : true;
  const p0b = isN ? blob.includes('按判定状态分级——无判定（no-act）轮极简') : true;
  const p1c = isHyb ? blob.includes('编排参考传统 NTR：user=苦主') : true;
  const p1e = isHyb ? blob.split('本版淫妻线从察觉型（41%，即第三阶段）起步').length - 1 : 0;
  const p1eOk = isHyb ? p1e >= 2 : true;
  const p2 = isN ? blob.includes('察觉 {{user}} 的淫妻癖好并开始迎合') : true;
  const oldGone = !blob.includes('即使动向/线状态与上轮相同也须完整列出');
  const ok = p0a && p0b && p1c && p1eOk && p2 && oldGone;
  console.log(fn + ': P0A=' + p0a + ' P0B=' + p0b + ' P1C=' + p1c + ' P1E=' + p1e + ' P2=' + p2 + ' 旧文残留=' + (!oldGone) + ' ' + (ok ? 'OK' : '[FAIL]'));
  if (!ok) fail++;
}
console.log(fail === 0 ? 'ALL PASS' : fail + ' FAIL');
process.exit(fail === 0 ? 0 : 1);
