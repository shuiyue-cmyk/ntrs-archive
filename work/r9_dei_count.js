const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;
const blob = JSON.stringify(j);

const pairs = {
  A1: '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
  A2: '线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定',
  A8: '黄毛胜·终局落实对象线闭合场景',
  A9: '黄毛胜/黄毛败则线闭合锁定',
  A10: '黄毛胜·终局：对象嫁黄毛、**线闭合**',
  A11: '**正常男性则线闭合不再列出**；仅彻底离场不再列入行动判定',
  A12: '**男娘系黄毛败·友好（天意待触发）不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏**',
  A13: '→ 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）或淡出——按剧情自然，不作竞争角色登场。',
  A15: '（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）',
  A16: '黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。',
  A17: 'no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。',
};

for (const [k, old] of Object.entries(pairs)) {
  const inBlob = blob.split(old).length - 1;
  // count in fields only (promptGroup content + description + FSD)
  let inFields = 0;
  for (const t of p.plotTasks || []) {
    if (t.description && typeof t.description === 'string') inFields += t.description.split(old).length - 1;
    for (const m of t.promptGroup || []) {
      if (m.content && typeof m.content === 'string') inFields += m.content.split(old).length - 1;
    }
  }
  if (p.finalSystemDirective) inFields += p.finalSystemDirective.split(old).length - 1;
  console.log(`${k}: blob=${inBlob} fields=${inFields}${inFields ? '' : '  <-- 0 HIT'}`);
}
