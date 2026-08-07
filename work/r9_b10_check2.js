const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const at = raw.indexOf('为同义调度行');
const seg = raw.slice(at - 120, at + 60);
console.log(JSON.stringify(seg));
// compare char by char against expected prefix
const expectedPrefix = 'thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）';
const actualStart = raw.slice(at - 120, at - 120 + expectedPrefix.length);
console.log('prefix match:', actualStart === expectedPrefix);
if (actualStart !== expectedPrefix) {
  for (let i = 0; i < expectedPrefix.length; i++) {
    if (actualStart[i] !== expectedPrefix[i]) {
      console.log('first diff at', i, 'expected', JSON.stringify(expectedPrefix[i]), 'actual', JSON.stringify(actualStart[i]));
      break;
    }
  }
}
