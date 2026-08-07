const fs = require('fs');
const p = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI_NTRS.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const blob = JSON.stringify(j);

console.log('G8 spawn+终局 行已插入:', blob.includes('\u9ec4\u6bdb\u53ef\u5199\u5165\u767b\u573a\u540d\u5355\uff08\u6807\u6ce8"\u5bf9\u8c61\u7684\u60c5\u4eba/\u4e08\u592b\u00b7[\u4e94\u578b]\u00b7\u7ec8\u5c40"\uff09'));

// real single-brace leak: {user} that is NOT immediately preceded by another {
let cnt = 0;
const re = /\{user\}/g;
let m;
while ((m = re.exec(blob)) !== null) {
  const prev = blob[m.index - 1];
  const next = blob[m.index + 6];
  if (prev !== '{' || next !== '}') {
    cnt++;
    console.log('LEAK at', m.index, JSON.stringify(blob.slice(m.index - 30, m.index + 12)));
  }
}
console.log('real single-brace {user} leaks:', cnt);
