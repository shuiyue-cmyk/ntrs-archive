// Verify R9 FT fix
const fs = require('fs');
const path = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_BATTLE_Turn_FT.json';
const raw = fs.readFileSync(path, 'utf8');

let parsed = null, arrOk = false;
try { parsed = JSON.parse(raw); arrOk = Array.isArray(parsed); } catch (e) { console.log('JSON.parse FAIL:', e.message); process.exit(1); }
console.log('JSON valid:', true);
console.log('top-level array:', arrOk);

const p = parsed[0];
const fields = [];
fields.push(p.finalSystemDirective || '');
for (const t of (p.plotTasks || [])) {
  fields.push(t.description || '');
  (t.promptGroup || []).forEach(m => fields.push(m.content || ''));
}
const blob = fields.join('\n===MSG===\n');

const olds = {
  A1: `无追踪黄毛 → 走分支B：按雄竞刷新逻辑判定是否刷新新黄毛（**刷新成功 = 接下来的场景中有出现的可能**，不空刷新）`,
  A2_FT: ` * 线状态=黄毛胜·终局 → 线已闭合，黄毛不再行动判定（no-act）`,
  A8: `黄毛胜·终局落实对象线闭合场景`,
  A12: `不算闭合——黄毛仍在场以朋友身份与对象相处并酝酿对 {{user}} 的爱意，按在场处理（spawn）并供 S3 推进投怀戏`,
  A13: `黄毛以朋友身份可写入登场名单（标注"朋友·[五型]·黄毛败友好"）按剧情自然，不作竞争角色登场（男娘系黄毛须留在名单中供投怀戏编排）。`,
  A14: `黄毛败·友好的后续轮回归 no-act（线闭合）；黄毛胜·终局的后续轮不回归 no-act——黄毛仍按追踪判定互动。`,
  A15: `（场景外行动 {{user}} 必不在场，{{user}} 知情度不得为👁️，只能 📹 事后知情或 🌙 完全不知）`,
  A16: `黄毛作为本轮正式登场角色（竞争者），**必须**写入 prologue 登场角色名单（标注"竞争者·[五型]·雄竞期"）。`,
  A17: `no-act 时下游 stage3 走快速通道（跳过导演分析，prologue 仅一行主线推进）。`,
  A10: `黄毛胜·终局：对象嫁黄毛、**线闭合**`,
};
const news = {
  A1: `刷新成功 = 本轮黄毛能否进入 {{user}} 当前场景画面，私密空间须实际进入画面，同楼其他房间/走廊=no_spawn`,
  A2_FT: ` * 线状态=黄毛胜·终局 → 线锁定非闭合，黄毛仍按追踪判定互动（夫妻级亲密戏可持续，no-act 仅逻辑门不过时）`,
  A8: `黄毛胜·终局落实线锁定场景（黄毛仍在追踪、夫妻级亲密戏可持续）`,
  A12: `**男娘系黄毛败·友好（天意待触发）单列**`,
  A13: `**男娘系（天意待触发）必须写入名单供投怀戏编排，禁止淡出**`,
  A14: `**黄毛败·友好（男娘系天意待触发）后续轮继续判 act 推投怀戏**`,
  A15: `📹 事后知情=事后得知，🌙=事后也不知情`,
  A16: `名单标注为内部调度，以剧情语言写"追求者/情敌·[外貌气质]"`,
  A17: `若场上存在已闭合（黄毛败·友好）对象，快速通道 prologue 附一行该对象的日常互动（朋友级）；若场上存在后宫线对象则附一行后宫互动`,
};

let allOk = true;
console.log('\n-- OLD residual scan (must be 0) --');
for (const [k, o] of Object.entries(olds)) {
  const n = blob.split(o).length - 1;
  const ok = n === 0;
  if (!ok) allOk = false;
  console.log(`${k}: residual=${n} ${ok ? 'GONE' : 'RESIDUAL!'}`);
}
console.log('\n-- NEW presence scan (must be >=1) --');
for (const [k, o] of Object.entries(news)) {
  const n = blob.split(o).length - 1;
  const ok = n >= 1;
  if (!ok) allOk = false;
  console.log(`${k}: present=${n} ${ok ? 'OK' : 'MISSING!'}`);
}
console.log('\nALL CHECKS PASS:', allOk);
