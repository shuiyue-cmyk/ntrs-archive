// Independent post-write verification of Cirno_BATTLE_Turn_FT.json
const fs = require('fs');
const FILE = 'C:\\Users\\zouyu\\Downloads\\酒馆\\数据库\\剧情推进预设\\Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(FILE, 'utf8');

console.log('startsWith[ :', raw.trim().startsWith('['));
console.log('indent check :', raw.slice(0, 8) === '[\n  {' ? '2-space' : 'OTHER:' + JSON.stringify(raw.slice(0, 8)));
console.log('trailing NL  :', raw.endsWith('\n'));
console.log('BOM?        :', raw.charCodeAt(0) === 0xFEFF ? 'yes (would be bad)' : 'no');

const j = JSON.parse(raw);
console.log('top array    :', Array.isArray(j), 'len=', j.length);
const p = j[0];
console.log('preset name  :', p.name);
console.log('plotTasks    :', p.plotTasks.map(t => t.id + '/' + t.stage + '.' + t.order).join(', '));
const tasks = {}; for (const t of p.plotTasks) tasks[t.id] = t;
const thug = tasks.plotTaskThugTempo, dir = tasks.defaultPlotTask;

const blob = JSON.stringify(j);

// ---- per-item checks ----
function show(label, s, idx, len) {
  console.log(`\n---- ${label} @${idx} ----`);
  console.log(JSON.stringify(s.slice(Math.max(0, idx - 30), idx + len)));
}

// A1
let idx = thug.promptGroup[0].content.indexOf('- **已站队对象胜负判定（亲密开局专用）**');
show('A1 inserted bullet (S2-MSG0)', thug.promptGroup[0].content, idx, 260);

// A2
idx = thug.description.indexOf('已站队对象（出场即恋人/配偶/已明确站队）');
show('A2 inserted desc (S2 desc)', thug.description, idx - 40, 260);

// A3
idx = dir.promptGroup[2].content.indexOf('- **已站队对象（亲密开局）编排**');
show('A3 inserted sub-section (S3-MSG2)', dir.promptGroup[2].content, idx - 40, 300);

// A4
idx = dir.description.indexOf('雄竞期落实 {{user}} 正常追求与竞争张力');
show('A4 replaced sentence (S3 desc)', dir.description, idx, 180);

// A5
idx = dir.promptGroup[17].content.indexOf('6. **亲密开局核验**');
show('A5 new Q6 (注意力自检)', dir.promptGroup[17].content, idx - 60, 220);
// renumber check
for (const q of ['6. **召回自洽**', '7. **召回自洽**', '8. **线状态 + 黄毛登场核验**', '9. **无进度标签核验**']) {
  console.log('renum', q, '->', (dir.promptGroup[17].content.match(new RegExp(q.replace(/[.+*?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length);
}
console.log('intro says 八题? ->', dir.promptGroup[17].content.includes('以下八题'));

// ---- global scans ----
console.log('\nA1 NEW count in blob :', (blob.match(/已站队对象胜负判定（亲密开局专用）/g) || []).length);
console.log('A2 NEW count in blob :', (blob.match(/已站队对象（出场即恋人\/配偶\/已明确站队）雄竞期内既有倾向不计黄毛败/g) || []).length);
console.log('A3 NEW count in blob :', (blob.match(/已站队对象（亲密开局）编排/g) || []).length);
console.log('A4 NEW count in blob :', (blob.match(/对象已站队\/亲密开局时 {{user}} 为守成方/g) || []).length);
console.log('A4 OLD count in blob :', (blob.match(/胜负靠剧情无数值）/g) || []).length);
console.log('A5 NEW count in blob :', (blob.match(/6\. \*\*亲密开局核验\*\*/g) || []).length);
console.log('A5 old6 residual     :', (blob.match(/6\. \*\*召回自洽\*\*/g) || []).length);

// single-brace macro leak scan (whole blob, excluding legitimate {zhaohui} / {user} inside {{...}})
const single = blob.replace(/\{\{user\}\}/g, '').replace(/\{\{char\}\}/g, '');
const leaks = (single.match(/\{user\}/g) || []).length + (single.match(/\{char\}/g) || []).length;
console.log('single-brace {user}/{char} leaks (after stripping double-brace) :', leaks);

// role case check
const roles = new Set();
for (const t of p.plotTasks) for (const m of t.promptGroup) roles.add(m.role);
console.log('role values :', [...roles].join(','));
