const fs = require('fs');
const bak = 'C:/Users/zouyu/Downloads/酒馆/数据库/备份/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.bak-pre-r8s.json';
const cur = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const b = fs.readFileSync(bak, 'utf8');
const c = fs.readFileSync(cur, 'utf8');
console.log('bak len', b.length, 'cur len', c.length);
console.log('bak head:', JSON.stringify(b.slice(0, 200)));
console.log('cur head:', JSON.stringify(c.slice(0, 200)));
console.log('bak has \\r\\n:', (b.match(/\r\n/g) || []).length, 'cur has \\r\\n:', (c.match(/\r\n/g) || []).length);
const bj = JSON.parse(b), cj = JSON.parse(c);
console.log('bak top array:', Array.isArray(bj), 'cur top array:', Array.isArray(cj));
// compare structural equality ignoring nothing: full deep compare
const bs = JSON.stringify(bj), cs = JSON.stringify(cj);
console.log('stringify(bak)==stringify(cur):', bs === cs, 'stringify lens', bs.length, cs.length);
// find first structural diff
let i = 0;
while (i < bs.length && bs[i] === cs[i]) i++;
console.log('first structural diff at', i);
console.log('bak around:', JSON.stringify(bs.slice(Math.max(0, i - 80), i + 120)));
console.log('cur around:', JSON.stringify(cs.slice(Math.max(0, i - 80), i + 120)));
