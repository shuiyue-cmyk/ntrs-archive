// Dump context around each anchor to see exact bytes
const fs = require('fs');
const target = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_straight_NTRS.json';
const j = JSON.parse(fs.readFileSync(target, 'utf8'));

function ctxAt(path, needle, pad = 300) {
  const parts = path.replace('j[0].', '').split('.');
  let obj = Array.isArray(j) ? j[0] : j;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const m = part.match(/^(\w+)\[(\d+)\]$/);
    if (m) obj = obj[m[1]][+m[2]];
    else obj = obj[part];
  }
  const idx = obj.indexOf(needle);
  const start = Math.max(0, idx - pad);
  const end = Math.min(obj.length, idx + needle.length + pad);
  return obj.slice(start, end);
}

const jobs = [
  ['item1 @ S2MSG4', 'j[0].plotTasks[1].promptGroup[4].content', '接下来的场景中该黄毛是否有出现的可能', 500],
  ['item9 @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '👁️ **明面竞争**', 200],
  ['item15 @ S2MSG0', 'j[0].plotTasks[1].promptGroup[0].content', '即使对象已站队', 800],
  ['item16 @ S2MSG0', 'j[0].plotTasks[1].promptGroup[0].content', '亲情/义亲目标不豁免', 600],
  ['item17 @ S3MSG17', 'j[0].plotTasks[2].promptGroup[17].content', '已站队的对象（已是 {{user}} 恋人/配偶）', 300],
  ['item18a @ S2MSG4', 'j[0].plotTasks[1].promptGroup[4].content', '线状态=[雄竞期/NTRS期/黄毛胜·终局]', 200],
  ['item18a2 @ S2MSG2', 'j[0].plotTasks[1].promptGroup[2].content', '线状态（雄竞期/NTRS期/黄毛胜·终局）', 250],
  ['item18a2 @ S3MSG0', 'j[0].plotTasks[2].promptGroup[0].content', '线状态（雄竞期/NTRS期/黄毛胜·终局）', 250],
  ['item18a2 @ S3MSG2 #1', 'j[0].plotTasks[2].promptGroup[2].content', '线状态（雄竞期/NTRS期/黄毛胜·终局）', 300],
  ['item18a2 @ description', 'j[0].plotTasks[2].description', '线状态（雄竞期/NTRS期/黄毛胜·终局）', 200],
  ['item18c @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '三种线状态之一', 150],
  ['item18d @ stage tmpl', 'j[0].plotTasks[2].promptGroup[7].content', '雄竞期 / NTRS期 / 黄毛胜·终局', 300],
  ['item18d @ S3MSG17 #1', 'j[0].plotTasks[2].promptGroup[17].content', '雄竞期 / NTRS期 / 黄毛胜·终局', 300],
  ['item19 @ S3MSG17', 'j[0].plotTasks[2].promptGroup[17].content', '首轮基线=察觉型 41%', 250],
  ['item20b @ S3MSG9', 'j[0].plotTasks[2].promptGroup[9].content', '推波助澜姿态: 半明示/已默契', 200],
  ['item20c @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '「半明示→默契」演进中的位置——半明示/已默契', 200],
  ['item20d @ S3MSG17', 'j[0].plotTasks[2].promptGroup[17].content', '当前在哪（半明示/已默契）', 200],
  ['item21 @ stage tmpl', 'j[0].plotTasks[2].promptGroup[7].content', '当前阶段（NTRS期）', 300],
  ['item22 @ S3MSG0', 'j[0].plotTasks[2].promptGroup[0].content', 'NTRS期→淫妻戏', 700],
  ['item23 @ S3MSG0', 'j[0].plotTasks[2].promptGroup[0].content', '📹 事后知情仅限已入 NTRS期', 300],
  ['item23 @ stage tmpl', 'j[0].plotTasks[2].promptGroup[7].content', '📹 事后知情仅限已入 NTRS期', 300],
  ['item24 @ S2MSG4', 'j[0].plotTasks[1].promptGroup[4].content', '恋人/配偶/暧昧/朋友/陌生人/已站队', 300],
  ['item25 @ S2MSG0', 'j[0].plotTasks[1].promptGroup[0].content', '对象情感倾向影响雄竞难度', 400],
  ['item26 @ S2MSG0', 'j[0].plotTasks[1].promptGroup[0].content', '本版淫妻线从察觉型（41%）起步', 250],
  ['item26 @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '本版淫妻线从察觉型（41%）起步', 250],
  ['item27 @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '41% 起步，忠诚/动摇型不出现', 250],
  ['item27 @ stage tmpl', 'j[0].plotTasks[2].promptGroup[7].content', '41% 起步，忠诚/动摇型不出现', 250],
  ['item30 @ S3MSG2', 'j[0].plotTasks[2].promptGroup[2].content', '竞争者·[五型]', 400],
  ['item30 @ S3MSG17', 'j[0].plotTasks[2].promptGroup[17].content', '竞争者·[五型]', 400],
];

for (const [label, path, needle, pad] of jobs) {
  console.log(`\n########## ${label} ##########`);
  console.log(ctxAt(path, needle, pad));
}
