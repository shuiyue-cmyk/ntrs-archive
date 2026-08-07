const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_FT_revise_4.7.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
const t = j[0];
const texts = [];
texts.push({ tag: 'FSD', s: t.finalSystemDirective });
if (Array.isArray(t.promptGroup)) t.promptGroup.forEach((m, i) => texts.push({ tag: `pg[${i}]`, s: m.content }));
t.plotTasks.forEach((p, ti) => {
  if (p.description !== undefined && p.description !== null && p.description !== '')
    texts.push({ tag: `T${ti}.desc`, s: p.description });
  (p.promptGroup || []).forEach((m, i) => texts.push({ tag: `T${ti}.pg[${i}]`, s: m.content }));
});
const needles = [
  '刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能',
  '出场可能性判定（刷新成功标准，替代纯时空合理性）',
  '**no_spawn**：本轮无黄毛在场。两种情形：',
  '黄毛表已命中该目标黄毛，本轮判定其在场合理',
  '黄毛表已命中该目标黄毛但本轮在场不合理',
  '若黄毛与对象均在 {{user}} 当前场景之外',
  '**场景外标注:**',
  'thugSpawn 状态=no_spawn',
  '黄毛行动不依赖本轮是否刷新在场',
  '**no-act**：本轮黄毛不出手',
];
for (const needle of needles) {
  console.log('================ needle:', needle);
  for (const { tag, s } of texts) {
    if (s.includes(needle)) {
      const i = s.indexOf(needle);
      const start = Math.max(0, i - 400);
      const end = Math.min(s.length, i + needle.length + 600);
      console.log('--- in', tag, 'ofs', i);
      console.log(JSON.stringify(s.slice(start, end)));
    }
  }
}
