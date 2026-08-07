// R13：生成 15 个 _2ALL 变体（NTRS 12 版×12 + NTRS·雄竞×3）——复制 + 乐享型人尽可夫设定插入 + name 后缀
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const ntrs12 = fs.readdirSync(dir).filter(f => /^Cirno_NTRS_turn_edit_.+_4\.7\.json$/.test(f));
const hybrid = ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'];
const sources = [...ntrs12, ...hybrid];

const SETTING = [
  '**【乐享型·人尽可夫（_2ALL 专属设定）】**（对象淫妻线进入乐享型（86-100%）后激活）',
  '敏感对象进入乐享型后不再挑对象——**人尽可夫**：对任何人的性骚扰都不拒绝，且主动配合发生关系；主动程度随乐享深化（默许 → 回应 → 主动勾引 → 主动要求发生关系），进度 100% 时无差别接受。',
  '- **临时骚扰者体系（区别于锁定黄毛）**：锁定黄毛保持主第三者（专属/有名字/有感情线/仍为主互动对象，判定体系不变）；临时骚扰者为额外角色——乐享型对象所在**公共场景**（公园/公交地铁/街角巷尾/工地附近/集市菜场/乡村小路/车站/酒吧等）中自然存在的背景板身份升级刷新，**刷新门槛低**（场景合理即可，不强制走画面判定+锁定流程），每轮 0-N 个、短暂出场（本轮或数轮）、不入黄毛追踪/锁定体系、无长期线。',
  '- **骚扰者人设谱系（下限→上限）**：下限——乞丐/流浪汉（脏污褴褛、体味明显）、大爷（年老、秃顶白发、行动迟缓）、工地工人/农民工（粗粝、汗味、劳动服）、乡村老汉（乡土、粗犷、质朴）；中段——普通路人/小贩/司机/店员等；上限——花花公子（年轻帅气、衣着讲究、风流多金），在酒吧/高档社交场合自然出现。身份贴合所在公共场景，按场景合理刷新。',
  '- **对象行为**：不拒绝任何性骚扰（言语/肢体/纠缠一律接受），主动与骚扰者发生关系（配合、引导、主动邀请）；与锁定黄毛的互动不受影响（黄毛仍为主伴侣线）。',
  '- **兴奋源/知情度**：延续乐享型「主动展示」——对象事后向 {{user}} 口述/展示与骚扰者的互动细节（含录像）；「被卑微者玷污」的堕落感是 _2ALL 专属兴奋源。{{user}} 知情度按既有档位（👁️在场见证 / 📹事后知情 / 🌙完全不知）。',
  '- **进度**：乐享型内进度可继续推进（86-100%），骚扰者互动作为触发事件计入 +0~5%/轮（同淫妻线推进规则）；100%=完全人尽可夫（无差别接受）。',
  '- **性别适配**：敏感角色为女/男/男娘时同理适用（骚扰者身份按角色性别与所在场景适配；男对象/男娘对象遭遇性骚扰同理编排）。',
].join('\n');

const ANCHOR = '**渐进跨越规则**';

let fail = 0;
for (const src of sources) {
  const raw = fs.readFileSync(dir + src, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level ' + src); fail++; continue; }
  const root = Array.isArray(j) ? j[0] : j;
  // 1. 定位插入点（S3 编排 content 中 ANCHOR 前）并插入
  let inserted = false;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string' && v.includes(ANCHOR) && !inserted) { o[i] = v.split(ANCHOR).join(SETTING + '\n\n' + ANCHOR); inserted = true; } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string' && v.includes(ANCHOR) && !inserted) { o[k] = v.split(ANCHOR).join(SETTING + '\n\n' + ANCHOR); inserted = true; } else walk(v); }
  }
  walk(root);
  // 2. name 字段加 _2ALL 后缀
  const baseName = src.replace('.json', '');
  root.name = baseName + '_2ALL';
  // 3. 写新文件
  const outFn = baseName + '_2ALL.json';
  fs.writeFileSync(dir + outFn, JSON.stringify(j, null, 2), 'utf8');
  // 4. 验证
  const back = fs.readFileSync(dir + outFn, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; console.log('[FAIL] JSON ' + outFn); }
  if (!back.trim().startsWith('[')) { ok = false; console.log('[FAIL] array ' + outFn); }
  const hasSet = blob.includes('乐享型·人尽可夫');
  const hasAnchor = blob.includes(ANCHOR);
  const nameOk = blob.includes('"name":"' + baseName + '_2ALL"') || blob.includes('"name": "' + baseName + '_2ALL"');
  const insertOk = inserted && hasSet && hasAnchor && nameOk;
  console.log(outFn + ' | inserted=' + inserted + ' 设定段=' + hasSet + ' 锚点保留=' + hasAnchor + ' name=' + nameOk + ' ' + (ok && insertOk ? 'OK' : '[FAIL]'));
  if (!ok || !insertOk) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
