const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

function show(label, needle) {
  let i = 0, n = 0;
  while ((i = raw.indexOf(needle, i)) !== -1) {
    n++;
    console.log(`\n=== ${label} #${n} at ${i} ===`);
    console.log(JSON.stringify(raw.slice(Math.max(0, i - 120), i + needle.length + 220)));
    i += needle.length;
  }
  console.log(`[${label}] count=${n}`);
}

show('FSD_给花火正文', '会经 FSD');
show('FSD_进FSD', '进 FSD');
show('S2_标签内只放刷新状态', '标签内只放刷新状态');
show('thugSpawn 状态=no_spawn', 'thugSpawn 状态=no_spawn');
show('真正锁定', '真正锁定');
show('仅背景板字段', '锁定状态字段');
show('FSD_正文', '正文 AI');
