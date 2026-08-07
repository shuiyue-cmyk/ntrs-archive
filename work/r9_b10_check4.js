const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const noteAt = raw.indexOf('（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）');
console.log('note found at', noteAt);
const before = raw.slice(noteAt - 80, noteAt);
console.log('BEFORE note:', JSON.stringify(before));
// Expected NEW from the fix script
const newStr = 'thugSpawn 状态=spawn 且锁定状态=真正锁定 → 黄毛作为本轮正式登场角色，**必须**写入 prologue 登场角色名单（标注"第三者·[五型]"）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）';
const searchStart = noteAt - (newStr.length - 34); // approx start of newStr
const window = raw.slice(searchStart, noteAt + 34);
console.log('newStr present:', window === newStr ? 'YES' : 'NO');
if (window !== newStr) {
  for (let i = 0; i < Math.min(window.length, newStr.length); i++) {
    if (window[i] !== newStr[i]) {
      console.log('first diff at', i, 'window:', JSON.stringify(window[i]), 'expected:', JSON.stringify(newStr[i]));
      console.log('window ctx:', JSON.stringify(window.slice(Math.max(0, i - 10), i + 15)));
      console.log('expect ctx:', JSON.stringify(newStr.slice(Math.max(0, i - 10), i + 15)));
      break;
    }
  }
}
