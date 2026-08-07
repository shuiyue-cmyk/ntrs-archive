// _fix_t43.js — 8 个剧情推进预设 JSON 漏改项修复
// A: 去数值化残留 (2)  B: 未spawn可行动缺失 (3)  C: 场景外标注缺失 (3)
// 写回用原始 j（顶层数组, JSON.stringify(j,null,2)），每替换 split length===2 验证，不匹配报告跳过
const fs = require('fs');
const d = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';

const files = {
  A: ['Cirno_BATTLE_Turn_FT.json', 'Cirno_BATTLE_Turn_DEI.json'],
  B: ['Cirno_NTRS_turn_edit_straight_revise_4.7.json', 'Cirno_NTRS_turn_edit_FT_revise_4.7.json', 'Cirno_NTRS_turn_edit_DEI_revise_4.7.json'],
  C: ['Cirno_BATTLE_Turn_straight_NTRS.json', 'Cirno_BATTLE_Turn_FT_NTRS.json', 'Cirno_BATTLE_Turn_DEI_NTRS.json'],
};

// ---- A 项：去数值化残留 ----
const A_old1 = '对象有没有明确且长期的拒绝黄毛（≥2次/长期态度/明确选择 {{user}}）→ 黄毛败，线闭合（对象与黄毛变好朋友）；男娘系黄毛随后触发天意·后宫线（爱上 {{user}}、被收后宫）？';
const A_new1 = '女主的行为有没有表现出已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}——主动亲近/依赖/维护、对黄毛保持距离/冷淡/婉拒、关键抉择倾向 {{user}}）→ 黄毛败，线闭合（对象与黄毛变好朋友）？';
const A_old2 = '对象有没有明确且长期的拒绝黄毛（≥2次/长期态度/明确选择 {{user}}）→ 黄毛败，转 NTRS期（淫妻线从察觉型 41% 起）？';
const A_new2 = '女主的行为有没有表现出已选择 {{user}}（对两人的态度/行为/话语倾向 {{user}}——主动亲近/依赖/维护、对黄毛保持距离/冷淡/婉拒、关键抉择倾向 {{user}}）→ 黄毛败，转 NTRS期（淫妻线从察觉型 41% 起）？';

// ---- B 项：未spawn可行动缺失 ----
const B_old = '本轮在场是否合理（合理→spawn，不合理→no_spawn 走快速通道）';
const B_new = '本轮是否可行动（合理→spawn，不合理→no_spawn；**黄毛行动不依赖本轮是否刷新在场**——只要黄毛离场攻略目标（尾随/赶赴/在 {{user}} 场景外接近目标）在剧情上合理，即使本轮 no_spawn、目标与黄毛均不在 {{user}} 当前场景，也可判 act，该行动发生在 {{user}} 场景外）';

// ---- C 项：场景外标注缺失 ----
const C_old = '目标离场时黄毛尾随/赶赴行动也照此编排）';
const C_new = '目标离场时黄毛尾随/赶赴行动也照此编排；**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**）';

function count(s, sub) { return s.split(sub).length - 1; }

// 单文件内做替换；返回 { applied: [{name,ok,n}], skipped: [{name,reason}] }
function applyRepl(message, repls) {
  const out = { applied: [], skipped: [] };
  for (const r of repls) {
    const n = count(message.content, r.old);
    if (n === 1) {
      message.content = message.content.split(r.old).join(r.new);
      out.applied.push({ name: r.name, n });
    } else {
      out.skipped.push({ name: r.name, n, reason: n === 0 ? '目标串不存在（count=0）' : '目标串出现多次（count=' + n + '），跳过' });
    }
  }
  return out;
}

const report = [];
for (const grp of ['A', 'B', 'C']) {
  for (const f of files[grp]) {
    const path = d + f;
    const raw = fs.readFileSync(path, 'utf8');
    const j = JSON.parse(raw);
    const isArray = Array.isArray(j);
    const p = isArray ? j[0] : j;
    const entry = { grp, file: f, isArray, topName: p && p.name, items: [], skipped: [], written: false, verify: [] };

    // 备份（仅首次创建，避免覆盖既有 .bak-pre-t43）
    const bak = path + '.bak-pre-t43';
    if (fs.existsSync(bak)) entry.skipped.push({ name: '备份', n: -1, reason: bak + ' 已存在，保留既有备份' });
    else { fs.copyFileSync(path, bak); entry.skipped.push({ name: '备份', n: 1, reason: '已创建 ' + bak }); }

    let repls = [], taskName = null, pgIdx = null;
    if (grp === 'A') { taskName = '黄毛判定'; pgIdx = 4; repls = [{ name: 'A-胜负判定段', old: A_old1, new: A_new1, required: true }, { name: 'A-sparkNotes段(NTRS后缀)', old: A_old2, new: A_new2, required: false }]; }
    if (grp === 'B') { taskName = '黄毛判定·输入校准'; pgIdx = 0; repls = [{ name: 'B-职责段', old: B_old, new: B_new, required: true }]; }
    if (grp === 'C') { taskName = '导演台本'; pgIdx = 0; repls = [{ name: 'C-act编排段', old: C_old, new: C_new, required: true }]; }

    const task = p && (p.plotTasks || []).find(t => t.name === taskName || t.id === taskName);
    if (!task) { entry.skipped.push({ name: '定位任务', n: -1, reason: '未找到任务 ' + taskName + '，整文件跳过' }); report.push(entry); continue; }
    const msg = task.promptGroup[pgIdx];
    if (!msg) { entry.skipped.push({ name: '定位消息', n: -1, reason: '任务 ' + taskName + ' 无 promptGroup[' + pgIdx + ']，整文件跳过' }); report.push(entry); continue; }

    const wholePreset = JSON.stringify(j);
    const res = applyRepl(msg, repls);
    for (const a of res.applied) entry.items.push(a.name + ': 成功(count=1)');
    for (const s of res.skipped) entry.skipped.push(s);

    // 全局残留计数（报告用）
    for (const r of repls) {
      const gn = count(wholePreset, r.old);
      if (gn > 0 && gn !== (count(msg.content, r.old) + (res.applied.some(a => a.name === r.name) ? 0 : 0))) {
        entry.skipped.push({ name: r.name + '(全局)', n: gn, reason: '提示：全文件残留 ' + gn + ' 处（目标消息内已处理），注意扩散检查' });
      }
    }

    // 必替换项是否全部成功
    const allRequired = repls.filter(r => r.required).every(r => res.applied.some(a => a.name === r.name));
    if (allRequired) {
      fs.writeFileSync(path, JSON.stringify(j, null, 2), 'utf8');
      entry.written = true;
      // 写回后重读验证
      const j2 = JSON.parse(fs.readFileSync(path, 'utf8'));
      const blob = JSON.stringify(j2);
      entry.verify.push('JSON可解析=' + true + ' 顶层数组=' + Array.isArray(j2) + ' tasks=' + (j2[0].plotTasks || []).length);
      if (grp === 'A') entry.verify.push('≥2次残留=' + count(blob, '≥2次') + ' 女主行为句=' + count(blob, '女主的行为有没有表现出已选择') + '处');
      if (grp === 'B') entry.verify.push('「黄毛行动不依赖本轮是否刷新在场」=' + count(blob, '黄毛行动不依赖本轮是否刷新在场') + '处');
      if (grp === 'C') entry.verify.push('「场景外场景」=' + count(blob, '场景外场景') + '处');
    } else {
      entry.skipped.push({ name: '落盘', n: -1, reason: '必替换项未全部成功，整文件未写回' });
    }
    report.push(entry);
  }
}

for (const e of report) {
  console.log('===== [' + e.grp + '] ' + e.file + ' 顶层数组=' + e.isArray + ' name=' + e.topName);
  for (const i of e.items) console.log('  [成功] ' + i);
  for (const s of e.skipped) console.log('  [跳过] ' + s.name + (s.n >= 0 ? ' (n=' + s.n + ')' : '') + ' — ' + s.reason);
  console.log('  [写回] ' + (e.written ? '已写回 JSON.stringify(j,null,2)' : '未写回'));
  for (const v of e.verify) console.log('  [验证] ' + v);
}
