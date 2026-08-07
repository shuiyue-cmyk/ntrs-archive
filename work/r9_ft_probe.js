// Probe: check which spec OLD strings exist byte-for-byte in Cirno_BATTLE_Turn_FT.json
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const p = Array.isArray(j) ? j[0] : j;

const fields = [];
fields.push({ loc: 'FSD', val: p.finalSystemDirective });
for (const t of (p.plotTasks || [])) {
  fields.push({ loc: `desc:${t.id}`, val: t.description });
  (t.promptGroup || []).forEach((m, i) => fields.push({ loc: `${t.id}[${i}]:${m.role}`, val: m.content }));
}

const blob = fields.map(f => f.val || '').join('\n===MSG===\n');

const candidates = {
  A1: `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）`,
  A2_FT: ` * 线状态=黄毛胜·终局 → 线已闭合，黄毛不再行动判定（no-act）`,
  A2_merged: ` * 线状态=黄毛败·友好/黄毛胜·终局 → 线已闭合，黄毛不再行动判定`,
  A8: `黄毛胜·终局落实对象线闭合场景`,
  A10: `黄毛胜·终局：对象嫁黄毛、**线闭合**`,
  A12_partial: `男娘系黄毛败·友好（天意待触发）不算彻底闭合`,
  A12_DEI_partial: `男娘系黄毛败·友好（天意待触发）不算闭合`,
  A13: `→ 黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）或淡出——按剧情自然，不作竞争角色登场。`,
  A14_partial: `黄毛败·友好的后续轮回归 no-act（线闭合）`,
  A15: `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
  A16: `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。`,
  A17: `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
};

for (const [k, old] of Object.entries(candidates)) {
  const n = blob.split(old).length - 1;
  console.log(`[${k}] hits=${n}`);
  if (n > 0) {
    // find first location
    for (const f of fields) {
      if (f.val && f.val.includes(old)) {
        const idx = f.val.indexOf(old);
        console.log(`    @ ${f.loc} ctx=${JSON.stringify(f.val.slice(Math.max(0, idx - 40), idx + old.length + 60))}`);
        break;
      }
    }
  }
}
