const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_DEI.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;

const olds = {
  A1: '无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）',
  A2: '线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定',
  A8: '黄毛胜·终局落实对象线闭合场景',
  A9: '黄毛胜/黄毛败则线闭合锁定',
  A10v: '线闭合',
  A11: '**正常男性则线闭合不再列出**；仅彻底离场不再列入行动判定',
  A12: '**男娘系黄毛败·友好（天意待触发）不算闭合',
  A13: '或淡出——按剧情自然，不作竞争角色登场',
  A15: '只能 📹 事后知情或 🌙 完全不知',
  A16: '标注"竞争者·[五型]·雄竞期"',
  A17: 'no-act 时下游 stage3 走快速通道',
};

for (const [k, old] of Object.entries(olds)) {
  console.log(`\n===== ${k} (${old.slice(0, 30)}...) =====`);
  for (const t of p.plotTasks || []) {
    if (t.description && t.description.includes(old)) {
      const i = t.description.indexOf(old);
      console.log(`  [desc ${t.id}] ...${JSON.stringify(t.description.slice(Math.max(0, i - 40), i + old.length + 60))}...`);
    }
    (t.promptGroup || []).forEach((m, mi) => {
      if (m.content && m.content.includes(old)) {
        let idx = -1;
        while ((idx = m.content.indexOf(old, idx + 1)) !== -1) {
          console.log(`  [${t.id} msg${mi}] ...${JSON.stringify(m.content.slice(Math.max(0, idx - 60), idx + old.length + 80))}...`);
        }
      }
    });
  }
  if (p.finalSystemDirective && p.finalSystemDirective.includes(old)) {
    console.log(`  [FSD] ...${JSON.stringify(p.finalSystemDirective.slice(0, 120))}...`);
  }
}
