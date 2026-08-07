// Verify pass 2: match against PARSED strings (raw file has escaped \n)
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/\u9152\u9986/\u6570\u636e\u5e93/\u5267\u60c5\u63a8\u8fdb\u9884\u8bbe/Cirno_BATTLE_Turn_DEI_NTRS.json';
const n = (s) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const pairs = require('./fix_dei_ntrs.js').pairs; // [{id,old,new}]

const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); } catch (e) { console.log('PARSE FAIL', e.message); process.exit(1); }
console.log('JSON valid:', true, '| top array:', Array.isArray(j), '| first char:', JSON.stringify(raw.trim()[0]));

const strings = [];
const root = j[0];
for (const t of root.plotTasks) {
  if (typeof t.description === 'string') strings.push(t.description);
  if (typeof t.finalDirectiveTemplate === 'string') strings.push(t.finalDirectiveTemplate);
  const pg = t.promptGroup;
  const msgs = Array.isArray(pg) ? pg : Object.values(pg || {});
  for (const m of msgs) if (m && typeof m.content === 'string') strings.push(m.content);
}
if (typeof root.finalSystemDirective === 'string') strings.push(root.finalSystemDirective);
const blob = strings.join('\n@@@\n');

let clean = true;
for (const p of pairs) {
  const [id, old, neu] = p;
  const oldCnt = blob.split(old).length - 1;
  const newCnt = blob.split(neu).length - 1;
  const status = (oldCnt === 0 && newCnt >= 1) ? 'OK' : 'FAIL';
  if (status === 'FAIL') clean = false;
  console.log(`${id}: oldRemaining=${oldCnt} newCount=${newCnt} ${status}`);
}
console.log(clean ? 'ALL CLEAN' : 'ISSUES REMAIN');
