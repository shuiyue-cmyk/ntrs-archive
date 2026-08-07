const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_DEI_revise_ALLin_4.7.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = j[0];
const blob = JSON.stringify(j);
const texts = [];
if (Array.isArray(p.plotTasks)) {
  for (const t of p.plotTasks) {
    if (t.description) texts.push({ where: t.id + ' description', s: t.description });
    if (Array.isArray(t.promptGroup)) {
      t.promptGroup.forEach((m, i) => { if (m && typeof m.content === 'string') texts.push({ where: t.id + ' promptGroup[' + i + ']', s: m.content }); });
    }
  }
}
if (typeof p.finalSystemDirective === 'string') texts.push({ where: 'FSD', s: p.finalSystemDirective });

// spec verification phrases
const residuals = [
  '为唯一基准——黄毛**本轮能否进入',            // G1 旧句式
  '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现', // G2 旧括号
  '黄毛不在 {{user}} 当前场景画面内（含同楼其他房间/隔壁/离场追踪', // G3 旧列举
  '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪', // G4 旧列举
];
for (const r of residuals) console.log('residual-spec', JSON.stringify(r), ':', blob.split(r).length - 1);

const newPhrases = [
  '公共空间宽松判定',
  '私密空间严格判定',
  '公共空间（街道/商场/学校/公司/公共场所/集会等开放式场景）宽松判定',
  '私密空间（家中/房间/密闭独处等封闭式场景）严格判定',
  '公共空间宽松：',
  '私密空间严格：',
  '门外走廊',
  '同处该公共空间',
  '须实际进入该私密空间画面',
];
for (const np of newPhrases) console.log('NEW', JSON.stringify(np), ':', blob.split(np).length - 1);

// dump the two edited regions
const t = texts.find(x => x.where.includes('promptGroup[4]'));
let i = t.s.indexOf('刷新状态两档');
console.log('\n--- S2 region after edit ---');
console.log(JSON.stringify(t.s.slice(i - 60, i + 1300)));
let g = t.s.indexOf('出场可能性判定');
console.log('\n--- HARD RULES #3 after edit ---');
console.log(JSON.stringify(t.s.slice(g - 40, g + 700)));
