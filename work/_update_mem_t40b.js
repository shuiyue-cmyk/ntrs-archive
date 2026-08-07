// 更新记忆 T40（避开模板字符串反引号 + $0 解析问题）
const fs = require('fs');
const p = 'C:/Users/zouyu/.local/share/mimocode/memory/projects/global/MEMORY.md';
let old = fs.readFileSync(p, 'utf8');
const D = '{[db.';
const note = [
  '',
  '- **✅ (2026-08-05) T40 表格注入改造（$0 死占位符 → {[db...]} 三表注入）**：核查确认 $0 是填表 AI 的占位符、推进提示词里的 $0 不被插件替换（保持字面输出，8.8.js performReplacements 只处理 $1/$9 等）；表格数据真正注入机制 = SQLite 模板语法 ' + D + '表名.查询().get()]}（renderPlotTaskContentWithIsolatedVariables → replaceDbSqlVariables → replaceDbExpressions → createDbProxy → TableQueryBuilder），表名映射来自 NameMapper.fromDDLs 从各表 sourceData.ddl 第一行 "-- 中文名" 注释解析（黄毛表→thug_characters / 重要角色表→important_characters / NTRS备忘录→ntrs_memo，已端到端实测可跑通）。改造范围：原 NTRS 12 版 + BATTLE NTRS 后缀三版（用户明确纯雄竞无后缀三版不配表格），15 文件全部完成——S2-MSG2/S3-MSG15 的 <当前表格数据>$0</当前表格数据> 块替换为三表注入块（' + D + '黄毛表.get()]} + ' + D + '重要角色表.get()]} + ' + D + 'NTRS备忘录.get()]}，含 <黄毛表当前条目>/<重要角色表当前条目>/<NTRS备忘录当前条目> 包裹），其余 5 处 "$0 黄毛表"/<当前表格数据> 引用性表述全部改指向上方注入块；BATTLE NTRS 三版由"不读取任何表格"改为"表格为权威源+追踪互补"。验证：15/15 含三表注入、$0/当前表格数据零残留、$1/$5/$6/$7/$8/$U/$C 占位符完整、顶层数组完好。跨会话准则：NTRS 系预设的表格访问统一用 ' + D + '中文表名...]} 语法（勿再用 $0）；表名需在表格 sourceData.ddl 第一行注释声明中文名才能映射。',
  '',
].join('\n');
const anchor = '## DB 适配维护约定（Crino 接手后）';
if (!old.includes('T40 表格注入改造')) {
  old = old.replace(anchor, note + '\n' + anchor);
}
fs.writeFileSync(p, old, 'utf8');
console.log('MEMORY updated');
