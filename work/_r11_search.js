// Search anchors for items 1, 9, 15-27, 30
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));

// Map each search key to task id + msg index
function locate(needle) {
  const hits = [];
  const walk = (obj, path) => {
    if (typeof obj === 'string') {
      if (obj.includes(needle)) {
        hits.push({ path, count: (obj.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, ctx: obj.slice(0, 60) });
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, path + `[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const k of Object.keys(obj)) walk(obj[k], path + '.' + k);
    }
  };
  walk(j, 'j');
  return hits;
}

const searches = [
  ['item1', '接下来的场景中该黄毛是否有出现的可能'],
  ['item9', '👁️ **明面竞争**'],
  ['item15', '即使对象已站队'],
  ['item16', '亲情/义亲目标不豁免'],
  ['item17', '已站队的对象（已是 {{user}} 恋人/配偶）'],
  ['item18a', '线状态=[雄竞期/NTRS期/黄毛胜·终局]'],
  ['item18a2', '线状态（雄竞期/NTRS期/黄毛胜·终局）'],
  ['item18c', '三种线状态之一'],
  ['item18d', '雄竞期 / NTRS期 / 黄毛胜·终局'],
  ['item19', '首轮基线=察觉型 41%'],
  ['item20a', '推波助澜位置（仅 NTRS期）: 半明示 / 已默契'],
  ['item20b', '推波助澜姿态: 半明示/已默契'],
  ['item20c', '「半明示→默契」演进中的位置——半明示/已默契'],
  ['item20d', '当前在哪（半明示/已默契）'],
  ['item21', '当前阶段（NTRS期）'],
  ['item22', 'NTRS期→淫妻戏'],
  ['item23', '📹 事后知情仅限已入 NTRS期'],
  ['item24', '恋人/配偶/暧昧/朋友/陌生人/已站队'],
  ['item25', '对象情感倾向影响雄竞难度'],
  ['item26', '本版淫妻线从察觉型（41%）起步'],
  ['item27', '41% 起步，忠诚/动摇型不出现'],
  ['item30', '竞争者·[五型]'],
  ['item30b', '竞争者·五型'],
];

for (const [label, needle] of searches) {
  const hits = locate(needle);
  console.log(`=== ${label} :: ${JSON.stringify(needle)} ===`);
  if (hits.length === 0) console.log('  NOT FOUND');
  for (const h of hits) console.log(`  ${h.path} count=${h.count} ctx=${JSON.stringify(h.ctx)}`);
}
