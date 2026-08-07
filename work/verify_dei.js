// Verify Cirno_BATTLE_Turn_DEI.json after A1-A5
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
let j;
try { j = JSON.parse(raw); console.log('JSON_PARSE: OK'); }
catch (e) { console.log('JSON_PARSE: FAIL ' + e.message); process.exit(1); }
console.log('RAW_STARTS_WITH_[: ' + raw.startsWith('['));
console.log('TOP_LEVEL_IS_ARRAY: ' + Array.isArray(j));
const p = j[0];
const tasks = {};
for (const t of p.plotTasks) tasks[t.id] = t;

const A1 = '- **已站队对象胜负判定（亲密开局专用）**：';
const A2 = ' 已站队对象（出场即恋人/配偶/已明确站队）雄竞期内既有倾向不计黄毛败，黄毛败须黄毛实质进展后对象仍明确选择{{user}}才可判；';
const A3 = '- **已站队对象（亲密开局）编排**：';
const A4 = '胜负靠剧情无数值；对象已站队/亲密开局时 {{user}} 为守成方——守护/不安/查岗/吃醋提防，对象动摇合理化，黄毛须多轮积累才可能撬动）';
const A5 = '6. **亲密开局核验**：若本轮涉及已站队对象（与 {{user}} 已是恋人/配偶），是否按守成方编排（{{user}} 守护/不安/查岗而非追求加码、对象动摇合理化、黄毛未凭单轮行动被判胜）？';

const c0 = tasks['plotTaskThugTempo'].promptGroup[0].content;
const c2 = tasks['plotTaskThugTempo'].description;
const c3 = tasks['defaultPlotTask'].promptGroup[2].content;
const c4 = tasks['defaultPlotTask'].description;
const c5 = tasks['defaultPlotTask'].promptGroup[17].content;

console.log('A1 new present: ' + (c0.includes(A1)));
console.log('A2 new present: ' + (c2.includes(A2)));
console.log('A3 new present: ' + (c3.includes(A3)));
console.log('A4 new present: ' + (c4.includes(A4)));
console.log('A4 old gone: ' + !c4.includes('雄竞期落实 {{user}} 正常追求与竞争张力（黄毛与{{user}}争夺可攻略对象，胜负靠剧情无数值）'));
console.log('A5 new present: ' + (c5.includes(A5)));
console.log('A5 renumber 7 召回自洽: ' + (c5.split('7. **召回自洽**').length - 1 === 1));
console.log('A5 renumber 8 线状态: ' + (c5.split('8. **线状态 + 黄毛登场核验**').length - 1 === 1));
console.log('A5 renumber 9 无进度标签: ' + (c5.split('9. **无进度标签核验**').length - 1 === 1));
console.log('A5 old 6-8 gone: ' + !c5.includes('\n6. **召回自洽**') && !c5.includes('\n7. **线状态 + 黄毛登场核验**') && !c5.includes('\n8. **无进度标签核验**'));

// residual checks (spec verification list)
const blob = JSON.stringify(j);
console.log('\nResidual / cross-checks:');
console.log(' 纯雄竞 对象已站队不豁免 retained (should be TRUE): ' + blob.includes('对象已站队不豁免'));
console.log(' 男娘系后宫线 mentions: ' + blob.split('男娘系').length);
// check A3 insertion position: between anchor and 黄毛败·友好 section
const i = c3.indexOf('- 雄竞期黄毛可以真正赢得对象的心——黄毛胜即该对象线终局锁定。');
const seg = c3.slice(i, i + 400);
console.log('\nA3 context check (anchor -> new -> 后宫 section):');
console.log(seg.split('\n').slice(0, 3).map(l => l.slice(0, 60)).join('\n'));

// A2 context check
const i2 = c2.indexOf('黄毛败=综合判断女主行为已选择{{user}}');
console.log('\nA2 context: ' + JSON.stringify(c2.slice(i2, i2 + 220)));

// A5 context
const i5 = c5.indexOf('5. **竞争张力核验**');
console.log('\nA5 context: ' + JSON.stringify(c5.slice(i5, i5 + 260)));
