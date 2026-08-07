const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const at = raw.indexOf('为同义调度行');
const actual = raw.slice(at - 58, at + 30); // the NEW tail around the note start
const expectedTail = '）。（thugSpawn 内「锁定指令：锁定/维持背景板」为同义调度行，与「锁定状态」一致）';
console.log('actual   :', JSON.stringify(actual));
console.log('expected :', JSON.stringify(expectedTail));
let a = actual.indexOf('）。（');
console.log('tail segment match:', actual.slice(a) === expectedTail);
// find first char mismatch if any
for (let i = 0; i < Math.min(actual.length, expectedTail.length); i++) {
  if (actual[i] !== expectedTail[i]) {
    console.log('first diff at', i, 'actual', JSON.stringify(actual[i]), 'expected', JSON.stringify(expectedTail[i]));
    break;
  }
}
