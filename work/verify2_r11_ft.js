// Refined verify for prefix-overlap items + role provenance check
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const o = j[0];
const blobs = [];
o.plotTasks.forEach((t, ti) => t.promptGroup.forEach((m, mi) => blobs.push(String(m.content))));
blobs.push(String(o.finalSystemDirective));
const blob = blobs.join('\n---\n');

// 7note: every occurrence of old must be immediately followed by the appended suffix
const c7old = (blob.match(/黄毛败·友好线闭合不再判定/g) || []).length;
const c7new = (blob.match(/黄毛败·友好线闭合不再判定（男娘系除外，判 act 推进投怀戏）/g) || []).length;
console.log('item 7note: old-occurrences =', c7old, '| new-with-suffix =', c7new, '=>', c7old === c7new ? 'OK (no residual)' : 'FAIL');

// 11: same pattern
const c11old = (blob.match(/- Log：仅一行「no-act，快速通道输出」/g) || []).length;
const c11new = (blob.match(/- Log：仅一行「no-act，快速通道输出」（本版无进度标签，不涉及进度省略）/g) || []).length;
console.log('item 11: old-occurrences =', c11old, '| new-with-suffix =', c11new, '=>', c11old === c11new ? 'OK (no residual)' : 'FAIL');

// roles provenance: dump role sets per field
console.log('\nroles plotTasks promptGroup:', JSON.stringify([...new Set(o.plotTasks.flatMap((t) => t.promptGroup.map((m) => m.role)))]));
console.log('roles top-level prompts:', JSON.stringify(o.prompts.map((m) => m.role)));
console.log('plotTasks promptGroup all valid:', o.plotTasks.every((t) => t.promptGroup.every((m) => ['USER', 'SYSTEM', 'assistant'].includes(m.role))));
