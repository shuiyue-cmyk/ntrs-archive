const fs = require('fs');
const raw = fs.readFileSync('C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_ALLin_4.7.json', 'utf8');
const j = JSON.parse(raw);
const p = j[0];

// G3 residual-fragment scan across ALL text-bearing fields
const parts = [];
p.plotTasks.forEach((t, i) => {
  t.promptGroup.forEach((m, k) => parts.push(['pg', i, k, m.content]));
  parts.push(['desc', i, 0, t.description || '']);
});
parts.push(['fsd', 0, 0, p.finalSystemDirective]);

const frags = {
  'G3-spec-full-start': 'spawn=本轮黄毛在 {{user}} 当前场景画面内在场',
  'G3-frag-含同楼其他房间/隔壁/离场追踪': '含同楼其他房间/隔壁/离场追踪',
  'G3-frag-=no_spawn': '=no_spawn',
  'G3-frag-在场（或本轮新刷新进入画面）': '或本轮新刷新进入画面',
  'G1-frag-为唯一基准——黄毛**本轮能否进入': '为唯一基准——黄毛**本轮能否进入',
  'G2-frag-本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现': '本轮黄毛能否进入 {{user}} 当前场景画面**（本轮当场出现',
  'G4-frag-本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪': '本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪',
  'NEW-公共空间宽松判定': '公共空间宽松判定',
  'NEW-私密空间严格判定': '私密空间严格判定',
};
for (const [name, f] of Object.entries(frags)) {
  const hits = [];
  parts.forEach((pt, idx) => {
    const s = pt[3] || '';
    const n = s.split(f).length - 1;
    if (n > 0) hits.push(pt[0] + '#' + pt[1] + '#' + pt[2] + ' x' + n);
  });
  console.log(name, '=>', hits.join(' | ') || 'NONE');
}

// where exactly does "=no_spawn" live in pg#2#2
const c22 = p.plotTasks[2].promptGroup[2].content;
let pos = 0;
while ((pos = c22.indexOf('=no_spawn', pos)) >= 0) {
  console.log('--- pg#2#2 =no_spawn @', pos);
  console.log(JSON.stringify(c22.slice(pos - 260, pos + 120)));
  pos += 9;
}
