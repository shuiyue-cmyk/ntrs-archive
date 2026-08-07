const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const blob = JSON.stringify(j);

function dumpContext(label, pat, width) {
  console.log('\n===== ' + label + ' =====');
  let idx = -1;
  let n = 0;
  while ((idx = blob.indexOf(pat, idx + 1)) !== -1) {
    n++;
    const start = Math.max(0, idx - (width || 160));
    const end = Math.min(blob.length, idx + pat.length + (width || 160));
    console.log('--- hit #' + n + ' @ ' + idx + ' ---');
    console.log(JSON.stringify(blob.slice(start, end)));
  }
  if (n === 0) console.log('NO HIT');
}

dumpContext('B1 quicklane heading', '所有目标均 no-act', 200);
dumpContext('B1 prologue line', '跟随{{user}}输入的主线走，本轮黄毛不出手', 260);
dumpContext('B2 darkline', '属 📹 事后知情或 🌙 完全不知的暗线戏', 260);
dumpContext('B3 lockcmd', '锁定指令：锁定 [新增目标名]', 220);
dumpContext('B3 spawn tag annot', '只放刷新状态+黄毛人设', 260);
dumpContext('B4 上轮%', '上轮%', 220);
dumpContext('B5 actionable', '判断该黄毛本轮是否可行动', 220);
dumpContext('B7 nonempty', '锁定目标列表非空', 260);
dumpContext('B7 empty', '锁定目标列表为空', 260);
dumpContext('B9 userCalib', 'output ONE tag: <userCalib>', 200);
dumpContext('B9 after thugAction', '紧接在 <thugAction> 之后', 200);
dumpContext('B10 锁定状态', '锁定状态', 150);
