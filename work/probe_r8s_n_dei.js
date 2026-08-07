const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_4.7.json';
const raw = fs.readFileSync(p, 'utf8');

function dump(label, from, to) {
  const i = raw.indexOf(from);
  if (i === -1) { console.log(label, 'FROM-NOT-FOUND'); return; }
  const j = raw.indexOf(to, i + from.length);
  if (j === -1) { console.log(label, 'TO-NOT-FOUND'); return; }
  const seg = raw.slice(i, j + to.length);
  console.log('### ' + label + ' (len=' + seg.length + ')');
  console.log(JSON.stringify(seg));
  console.log();
}

dump('G1', '以 **{{user}} 本轮当前场景画面** 为唯一基准', '与 spawn 判定无关。');
dump('G2', '**刷新成功判定标准 = 本轮黄毛能否进入', '不空刷新**');
dump('G3', '本轮黄毛在 {{user}} 当前场景画面内在场', '=no_spawn**');
dump('G4', '- **no_spawn**：本轮无黄毛在', '。两种情形：');

// also search for spawn= variants
const idx = raw.indexOf('spawn=');
console.log('first "spawn=" at', idx);
if (idx !== -1) console.log(JSON.stringify(raw.slice(idx - 100, idx + 300)));
