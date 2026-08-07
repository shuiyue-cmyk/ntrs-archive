// 更新记忆：T43 综合改动
const fs = require('fs');
const p = 'C:/Users/zouyu/.local/share/mimocode/memory/projects/global/MEMORY.md';
let old = fs.readFileSync(p, 'utf8');
const note = [
  '',
  '- **✅ (2026-08-05) T43 综合改动（18 文件，用户需求）**：①**黄毛败判定去数值化**（BATTLE 六版 S2）——删「明确拒绝≥2次/长期态度」数值条件，改 AI 综合判断女主行为是否选择 user（对两人态度/行为/话语：主动亲近/依赖/维护、对黄毛保持距离/冷淡/婉拒、关键抉择倾向 user）；②**黄毛与对象离场也可活动（18 文件全覆盖）**——黄毛行动不依赖本轮是否刷新在场：黄毛离场前往对象所在处攻略（在 user 场景外接近目标）剧情合理即可判 act；③**快速通道不废止**（用户澄清：判断条件就是 no-act，no-act 才走快速通道——之前误改为废止，已从 .bak-pre-noq 恢复原始）；④**场景外标注**（S3 act 编排段 + stage 模板「场景外标注」字段）：黄毛与对象均在 user 场景外但可接触时，stage 标注「场景外场景」、prologue 不展开；⑤≥2 残留清零（BATTLE 六版 S3 pg17 胜负判定段）。验证 18/18（BATTLE 六版 + NTRS 12 版）：JSON 合法/顶层数组/快速通道原始/未spawn可行动/场景外标注/≥2清零 全部通过。子代理分工：T41 主改动自己 + general-72 验证（发现 8 处分支对称性漏改）+ general-73 补齐（revise 非 ALLin 3 版未spawn、BATTLE _NTRS 3 版场景外、FT/DEI ≥2）+ 自己清 ≥2。⚠️教训：批量改动 ALLin/NTRS 后缀/revise 分支易漏，验证须逐文件列全；{zhaohui} 是插件模板变量非预设字段不改。备份：18×bak-pre-noq + 8×bak-pre-t43 已归档。',
  '',
].join('\n');
const anchor = '## DB 适配维护约定（Crino 接手后）';
if (!old.includes('T43 综合改动')) {
  old = old.replace(anchor, note + '\n' + anchor);
}
fs.writeFileSync(p, old, 'utf8');
console.log('MEMORY updated');
