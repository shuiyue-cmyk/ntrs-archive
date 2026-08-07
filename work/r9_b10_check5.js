const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const chunks = [
  'thugSpawn 状态=spawn 且锁定状态=真正锁定',
  '真正锁定 → 黄毛作为本轮正式登场角色',
  '黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单',
  '登场角色名单（标注"第三者·[五型]"）',
  '（标注"第三者·[五型]"）。（thugSpawn 内',
  '（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）',
  '锁定指令：锁定/维持背景板',
  '锁定/维持背景板',
];
for (const c of chunks) console.log(raw.split(c).length - 1, JSON.stringify(c));
// Also test with different quote char (fullwidth “ ”)
console.log('--- fullwidth quotes test ---');
console.log(raw.split('（标注“第三者·[五型]”）').length - 1);
console.log(raw.split('（标注"第三者·[五型]"）').length - 1);
