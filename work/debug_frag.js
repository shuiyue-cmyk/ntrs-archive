const fs = require('fs');
const all = JSON.stringify(JSON.parse(fs.readFileSync('C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_straight_NTRS.json', 'utf8')));
const frag = ' - thugSpawn \u72b6\u6001=spawn \u4e14\u7ebf\u72b6\u6001=\u9ec4\u6bdb\u80dc\u00b7\u7ec8\u5c40 \u2192 \u9ec4\u6bdb\u53ef\u5199\u5165\u767b\u573a\u540d\u5355\uff08\u6807\u6ce8"\u5bf9\u8c61\u7684\u60c5\u4eba/\u4e08\u592b\u00b7[\u4e94\u578b]\u00b7\u7ec8\u5c40"\uff09';
console.log('g8frag includes:', all.includes(frag));
const i = all.indexOf('\u9ec4\u6bdb\u53ef\u5199\u5165\u767b\u573a\u540d\u5355');
console.log('idx of 黄毛可写入登场名单:', i);
if (i >= 0) {
  const seg = all.slice(i - 50, i + 60);
  for (let k = 0; k < seg.length; k++) console.log(k, JSON.stringify(seg[k]), seg.codePointAt ? seg.codePointAt(k).toString(16) : '');
}
// also test the S4c fragment
const frag2 = '\uff08\u573a\u666f\u5916 act \u4e14 {{user}} \u5b8c\u5168\u4e0d\u77e5\ud83c\udf19 \u2192 \u8be5\u8282\u4e0d\u8f93\u51fa\uff0c\u4ec5 stage \u8bb0\u5f55\uff09';
console.log('s4c frag includes:', all.includes(frag2));
console.log('该节整块省略 followed by 场景外act:', all.split('\u8be5\u8282\u6574\u5757\u7701\u7565').length - 1, 'occurrences of 该节整块省略');
