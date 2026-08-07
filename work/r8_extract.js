// Print exact unescaped target strings from the JSON (byte-exact OLD extraction)
const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT_NTRS.json';
const s = fs.readFileSync(p, 'utf8');

function show(label, fromFrag, toFrag) {
  const a = s.indexOf(fromFrag);
  if (a < 0) { console.log('### ' + label + ': FROM NOT FOUND ###'); return; }
  const b = toFrag ? s.indexOf(toFrag, a) + toFrag.length : a + 20;
  const raw = s.slice(a, b);
  // raw is a slice of a JSON string; unescape the two common escapes for readability.
  const unesc = raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\r/g, '');
  console.log('### ' + label + ' ###');
  console.log(unesc);
  console.log('--- end ---');
  console.log();
}

show('A1', '3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：', '判 **spawn**');
show('A2', '**刷新成功判定标准 =', '不空刷新**');
show('A3', '**spawn=本轮黄毛', '=no_spawn**');
show('A4', '- **no_spawn**：本轮无黄毛', '。两种情形：');
show('A5', '② 分支A——已有追踪黄毛：黄毛不在当前场景', '走快速通道。');
show('A6', '动向=[在场·[位置] / 离场·[去向/尾随目标/潜伏接近]', '暗中布局]');
show('B1', '**若黄毛与对象均在 {{user}} 当前场景之外', '该场景外戏**');
show('B2', '- **场景外标注:**', 'prologue 不展开');
show('B3', ' - thugSpawn 状态=no_spawn', '不列入登场名单。');
show('C1', '**目标离场时黄毛仍可 act**', '硬伤门全过）。');
show('C2', ' - 近身契机：黄毛本轮与目标在同一空间', '途径与动机合理）');
