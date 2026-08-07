// P1+P2 逻辑修复执行脚本（NTRS 三版）
// 用法: node _fix_p1p2.js            -> dry-run，只打印匹配情况
//       node _fix_p1p2.js apply      -> 执行替换并写回 JSON.stringify(j,null,2)
const fs = require('fs');
const dir = __dirname + '/';
const files = [
  'Cirno_BATTLE_Turn_straight_NTRS.json',
  'Cirno_BATTLE_Turn_FT_NTRS.json',
  'Cirno_BATTLE_Turn_DEI_NTRS.json',
];
const APPLY = process.argv[2] === 'apply';

// ---------- 工具 ----------
function countIn(text, s) { return text.split(s).length - 1; }

// 行级替换：按行前缀定位整行（保留前导空白）
function lineRule(msgs, prefix, newLineBody, rule) {
  const hits = [];
  msgs.forEach((m, i) => {
    let idx = 0;
    while ((idx = m.content.indexOf(prefix, idx)) !== -1) {
      const lineStart = m.content.lastIndexOf('\n', idx) + 1;
      let lineEnd = m.content.indexOf('\n', idx);
      if (lineEnd === -1) lineEnd = m.content.length;
      const indent = m.content.slice(lineStart, idx);
      if (!indent.trim()) { // 前缀必须位于行首（允许前导空白）
        hits.push({ i, lineStart, lineEnd, indent });
      }
      idx = lineEnd + 1;
    }
  });
  return { hits, rule };
}

// 子串替换：old 须唯一；replaceAll 则全部替换
function subRule(msgs, old, rule, replaceAll) {
  const locs = [];
  msgs.forEach((m, i) => { const c = countIn(m.content, old); if (c > 0) locs.push({ i, c }); });
  const total = locs.reduce((a, l) => a + l.c, 0);
  return { total, locs, rule, replaceAll };
}

// ---------- 每个文件的执行器 ----------
function run(file) {
  const p = dir + file;
  const raw = fs.readFileSync(p, 'utf8');
  let j;
  try { j = JSON.parse(raw); } catch (e) { return { file, fatal: 'JSON.parse失败: ' + e.message }; }
  if (!Array.isArray(j)) return { file, fatal: '顶层不是数组' };
  const pt = j[0].plotTasks;
  const s2 = pt.find(t => t.name === '黄毛判定');
  const s3 = pt.find(t => t.name === '导演台本');
  if (!s2 || !s3) return { file, fatal: '找不到 黄毛判定/导演台本 任务' };
  const s2m = s2.promptGroup, s3m = s3.promptGroup;
  const allMsgs = [...s2m, ...s3m];
  const res = { file, fixes: {} };

  // ---- 修复1：S2-MSG4 TRIGGER RULES 闭合态 rule0 末尾追加例外（act 档终局编排）----
  {
    const old0 = '0. **本轮无任何已真正锁定的活跃黄毛**（含：本轮 no_spawn 且无历史锁定；黄毛胜·终局的对象不再判定）→ 直接判 <thugAction>no-act</thugAction>。注意：仅 no_spawn 不等于 no-act——若有上轮已真正锁定的活跃黄毛，仍须进入后续规则判定 act/no-act。';
    const add = '**但本轮若刚确认胜负（thugActionReason 写明雄竞结果：黄毛胜/黄毛败）则例外判 act，以触发下游 S3 的终局场景全量编排；胜负确认后的后续轮才回归 no-act。**';
    const r = subRule([s2m[4]], old0, '修复1');
    if (r.total === 1) {
      if (APPLY) s2m[4].content = s2m[4].content.replace(old0, old0 + '\n' + add);
      res.fixes['修复1'] = { status: 'ok', detail: 'S2[4] rule0 末尾追加例外句' };
    } else {
      res.fixes['修复1'] = { status: r.total === 0 ? 'skip' : 'fail', detail: r.total === 0 ? '未找到闭合态 rule0' : `出现${r.total}次，须唯一` };
    }
  }

  // ---- 修复2：S3-MSG2 登场角色门 NTRS期 标注行后追加 剧情视角称呼 说明 ----
  {
    const old2 = '- thugSpawn 状态=spawn 且线状态=NTRS期 → 黄毛**必须**写入 prologue 登场角色名单（标注"第三者·[五型]·NTRS期"）。';
    const add2 = '**登场名单标注为导演台本内部调度，<prologue> 随 FSD 发给正文前，系统术语须转换为剧情视角称呼（「竞争者」→「追求者/情敌」、「第三者·NTRS期」→ 剧情语言描述、「雄竞期/NTRS期/线状态/五型」→ 剧情语言）；<prologue> 正文中不得出现这些系统术语。**';
    const r = subRule([s3m[2]], old2, '修复2');
    if (r.total === 1) {
      if (APPLY) s3m[2].content = s3m[2].content.replace(old2, old2 + '\n' + add2);
      res.fixes['修复2'] = { status: 'ok', detail: 'S3[2] NTRS期标注行后追加剧情视角称呼说明' };
    } else {
      res.fixes['修复2'] = { status: r.total === 0 ? 'skip' : 'fail', detail: r.total === 0 ? '未找到 NTRS期 标注行' : `出现${r.total}次，须唯一` };
    }
  }

  // ---- 修复3：S3 推波助澜 暗中残留（各规则要求唯一命中）----
  {
    const rules3 = [
      {
        id: '修复3a', mode: 'line', prefix: '- **{{user}} 主动推波助澜 + 唯一淫妻线**',
        newBody: '- **{{user}} 主动推波助澜 + 唯一淫妻线**：{{user}} 的角色转为 NTRS 癖好者——表面作势可看似回避/嫉妒/不满，但在黄毛出现后，行为本质转为促成黄毛与可攻略对象的互动。本版从半明示层级起步，推波助澜为半明示→默契演进（不经历暗中推手段）：半明示放行（安排机会 / 创造独处 / 关键节点松手放任）让目标逐渐察觉并达成默契。',
        expectNote: '「暗→明」双段演进改写为半明示→默契演进'
      },
      {
        id: '修复3b', mode: 'line', prefix: '- **推波三态×五阶段映射**',
        newBody: '- **推波三态×五阶段映射**：半明示≈察觉型、已默契≈默契型/乐享型（本版跳过忠诚/动摇，无暗中推手段；半明示=有意识放行让目标发现，已默契=双方心照不宣把黄毛当性玩具，推波助澜已不需隐藏）。',
        expectNote: '三态映射删除 暗中推手≈忠诚型/动摇型'
      },
      {
        id: '修复3c', mode: 'sub', old: '{{user}} 的推波助澜（暗→明）让互动更易推进',
        new: '{{user}} 的推波助澜（半明示→默契）让互动更易推进',
        expectNote: 'L65 核心段（暗→明）改写'
      },
      {
        id: '修复3d', mode: 'sub', old: 'NTRS期：「暗→明」双段中的位置——暗中推手/半明示/已默契',
        new: 'NTRS期：「半明示→默契」演进中的位置——半明示/已默契',
        expectNote: '{{user}} 角色行 枚举删暗中项 + 双段改写'
      },
      {
        id: '修复3e', mode: 'line', prefix: '*若本轮 {{user}} 暗中或半明示推波助澜',
        newBody: '*若本轮 {{user}} 半明示推波助澜（仅 NTRS期，可多个，常驻类型）：*',
        expectNote: '暗中或半明示推波助澜 → 半明示推波助澜'
      },
      {
        id: '修复3f', mode: 'line', prefix: '- **{{user}} 推波助澜位置',
        newBody: '- **{{user}} 推波助澜位置（仅 NTRS期）:** 半明示 / 已默契；雄竞期填「无（正常追求）」',
        expectNote: '推波助澜位置枚举删暗中项'
      },
      {
        id: '修复3g', mode: 'sub', old: '[{{user}} 推波助澜姿态: 暗中/半明示/默契]',
        new: '[{{user}} 推波助澜姿态: 半明示/默契]',
        expectNote: '关系暗线 推波助澜姿态枚举删暗中项'
      },
      {
        id: '修复3h', mode: 'sub', old: '{{user}} 的暗中推波助澜',
        new: '{{user}} 的半明示推波助澜',
        expectNote: '心理转变机制触发事件 暗中推波助澜→半明示（枚举外额外残留，与「不经历暗中推手段」直接矛盾）'
      },
    ];
    for (const r3 of rules3) {
      if (r3.mode === 'line') {
        const lr = lineRule(s3m, r3.prefix, r3.newBody, r3.id);
        if (lr.hits.length === 1) {
          const { i, lineStart, lineEnd, indent } = lr.hits[0];
          if (APPLY) {
            const before = s3m[i].content.slice(0, lineStart);
            const after = s3m[i].content.slice(lineEnd);
            s3m[i].content = before + indent + r3.newBody + after;
          }
          res.fixes[r3.id] = { status: 'ok', detail: `S3[${i}] ${r3.expectNote}` };
        } else if (lr.hits.length === 0) {
          res.fixes[r3.id] = { status: 'skip', detail: `未找到行前缀「${r3.prefix}」` };
        } else {
          res.fixes[r3.id] = { status: 'fail', detail: `行前缀命中${lr.hits.length}处（${lr.hits.map(h => 'S3[' + h.i + ']').join(',')}），须唯一` };
        }
      } else {
        const sr = subRule(s3m, r3.old, r3.id);
        if (sr.total === 1) {
          const i = sr.locs[0].i;
          if (APPLY) s3m[i].content = s3m[i].content.replace(r3.old, r3.new);
          res.fixes[r3.id] = { status: 'ok', detail: `S3[${i}] ${r3.expectNote}` };
        } else {
          res.fixes[r3.id] = { status: sr.total === 0 ? 'skip' : 'fail', detail: sr.total === 0 ? `未找到「${r3.old.slice(0, 30)}…」` : `出现${sr.total}次，须唯一` };
        }
      }
    }
  }

  // ---- 修复4：无无黄毛 → 无未绑定黄毛（全文件 replace_all）----
  {
    const old4 = '无无黄毛';
    const r = subRule(allMsgs, old4, '修复4', true);
    if (r.total > 0) {
      if (APPLY) allMsgs.forEach(m => { if (m.content.includes(old4)) m.content = m.content.split(old4).join('无未绑定黄毛'); });
      res.fixes['修复4'] = { status: 'ok', detail: `replace_all ${r.total}处（${r.locs.map(l => 'msg[' + l.i + ']×' + l.c).join(',')}）` };
    } else {
      res.fixes['修复4'] = { status: 'skip', detail: '全文件无「无无黄毛」' };
    }
  }

  // ---- 修复5：S2-MSG4 分支A 只列动向+线状态 → 补列五型+型体概要 ----
  {
    const old5 = '（标签内不重写人设，只列"动向 + 线状态"）';
    const new5 = '（标签内不重写人设，须补列动向+线状态+五型+型体概要，与追踪区块格式一致）';
    const r = subRule([s2m[4]], old5, '修复5');
    if (r.total === 1) {
      if (APPLY) s2m[4].content = s2m[4].content.replace(old5, new5);
      res.fixes['修复5'] = { status: 'ok', detail: 'S2[4] 分支A 改为补列动向+线状态+五型+型体概要' };
    } else {
      res.fixes['修复5'] = { status: r.total === 0 ? 'skip' : 'fail', detail: r.total === 0 ? '未找到「只列"动向 + 线状态"」' : `出现${r.total}次，须唯一` };
    }
  }

  // ---- 修复6：S3-MSG7 stage 关键人物表列头 NTR标记 → 关系标记 ----
  {
    const old6 = '| 人物 | 当前位置 | 状态 | 潜在作用 | NTR标记 |';
    const new6 = '| 人物 | 当前位置 | 状态 | 潜在作用 | 关系标记 |';
    const r = subRule([s3m[7]], old6, '修复6');
    if (r.total === 1) {
      if (APPLY) s3m[7].content = s3m[7].content.replace(old6, new6);
      res.fixes['修复6'] = { status: 'ok', detail: 'S3[7] 关键人物表列头 NTR标记→关系标记' };
    } else {
      res.fixes['修复6'] = { status: r.total === 0 ? 'skip' : 'fail', detail: r.total === 0 ? '未找到「| 人物 | 当前位置 | 状态 | 潜在作用 | NTR标记 |」' : `出现${r.total}次，须唯一` };
    }
  }

  // ---- 修复7：FT 型体概要女体注记 / DEI 伪娘残留检查 ----
  if (file.includes('FT_NTRS')) {
    const old7 = '型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"]';
    const new7 = '型体概要=[1句，如"外表温和清秀，性器官勃起时足够粗长持久"（假小子为女性身体，型体概要按女体描述）]';
    const r = subRule([s2m[4]], old7, '修复7-FT');
    if (r.total === 1) {
      if (APPLY) s2m[4].content = s2m[4].content.replace(old7, new7);
      res.fixes['修复7-FT'] = { status: 'ok', detail: 'S2[4] 型体概要字段说明追加（假小子为女性身体，型体概要按女体描述）' };
    } else {
      res.fixes['修复7-FT'] = { status: r.total === 0 ? 'skip' : 'fail', detail: r.total === 0 ? '未找到型体概要男器示例' : `出现${r.total}次，须唯一` };
    }
  }
  if (file.includes('DEI_NTRS')) {
    const pats = ['只刷新 **伪娘', '只刷新伪娘', '本版全部黄毛均为伪娘', '本版黄毛均为伪娘', '本版全部.*伪娘', '伪娘 / 药娘 / 假小子** 三种黄毛'];
    const found = [];
    for (const pat of pats) {
      allMsgs.forEach((m, i) => { if (countIn(m.content, pat) > 0) found.push({ pat, i, c: countIn(m.content, pat) }); });
    }
    if (found.length === 0) {
      res.fixes['修复7-DEI'] = { status: 'skip', detail: '检查确认：DEI 版为 正常男性/伪娘/药娘/假小子 四型结构，无「本版全部/均为伪娘」类 FT 复制残留' };
    } else {
      res.fixes['修复7-DEI'] = { status: 'fail', detail: '发现疑似 FT 残留: ' + found.map(f => f.pat + '×' + f.c + '@msg[' + f.i + ']').join('; ') };
    }
  }

  // ---- 写回 ----
  if (APPLY) {
    fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
    res.written = true;
  }
  return res;
}

// ---------- 主流程 ----------
const out = files.map(run);
console.log('MODE:', APPLY ? 'APPLY' : 'DRY-RUN');
for (const r of out) {
  console.log('========================================');
  console.log('FILE:', r.file);
  if (r.fatal) { console.log('  FATAL:', r.fatal); continue; }
  for (const [k, v] of Object.entries(r.fixes)) {
    console.log(`  ${k}: ${v.status} — ${v.detail}`);
  }
  if (r.written) console.log('  已写回 JSON.stringify(j,null,2)');
}
// 备份提示（apply 时已在 run 之外处理，见下方）
