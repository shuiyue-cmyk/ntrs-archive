// Probe exact byte contexts for R9 Part B fix targets in FT_ALLin
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');

function show(label, needle) {
  let i = 0, n = 0;
  while ((i = raw.indexOf(needle, i)) !== -1) {
    n++;
    console.log(`\n=== ${label} #${n} at ${i} ===`);
    console.log(JSON.stringify(raw.slice(Math.max(0, i - 80), i + needle.length + 160)));
    i += needle.length;
  }
  console.log(`[${label}] count=${n}`);
}

// B3 - thugSpawn 锁定指令 line
show('B3_锁定指令', '锁定指令：锁定 [新增目标名]');
// B4 - 上轮% variants
show('B4_上轮阶段', '上轮阶段');
show('B4_上轮%从', '上轮% 从');
// B7 - 锁定目标列表
show('B7_锁定目标列表', '锁定目标列表');
// B7 - 真正锁定
show('B7_至少一个目标已真正锁定', '至少一个目标已真正锁定');
// B7 - 仅背景板
show('B7_所有目标均仅背景板', '所有目标均仅背景板');
// B10 - 锁定状态=真正锁定/仅背景板 判据
show('B10_锁定状态判据', '锁定状态=');
// B5 - exact context
show('B5_判断该黄毛本轮是否可行动', '判断该黄毛本轮是否可行动');
// B2 - context
show('B2_暗线戏', '属 📹 事后知情或 🌙 完全不知的暗线戏');
// B1 - context
show('B1_prologue', 'prologue：仅一行');
