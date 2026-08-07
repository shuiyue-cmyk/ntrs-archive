// T40: NTRS12 版 $0 块 → {[db...]} 三表注入
// 策略：对 S2-MSG2 与 S3-MSG15 的 "<当前表格数据>...$0...</当前表格数据>" 整块用锚点截断替换
const fs = require('fs');
const base = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(base).filter(f => /^Cirno_NTRS_turn_edit_.*\.json$/.test(f)).sort();

// 新注入块（S2 用）
const NEW_S2 = `本轮须查询数据库表格获取已有黄毛与角色状态（黄毛表为黄毛条目权威源，重点看 锁定对象/lock_status/进度条 字段；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：

<黄毛表当前条目>
{[db.黄毛表.get()]}
</黄毛表当前条目>

<重要角色表当前条目>
{[db.重要角色表.get()]}
</重要角色表当前条目>

<NTRS备忘录当前条目>
{[db.NTRS备忘录.get()]}
</NTRS备忘录当前条目>`;

// 新注入块（S3 用）
const NEW_S3 = `本轮须查询数据库表格获取黄毛档案（黄毛表为型体设定/性器官规则/进度权威源；重要角色表为登场角色设定；NTRS备忘录为长期备忘）：

<黄毛表当前条目>
{[db.黄毛表.get()]}
</黄毛表当前条目>

<重要角色表当前条目>
{[db.重要角色表.get()]}
</重要角色表当前条目>

<NTRS备忘录当前条目>
{[db.NTRS备忘录.get()]}
</NTRS备忘录当前条目>`;

let ok = 0, fail = [];
for (const fn of files) {
  const fp = base + fn;
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const o = Array.isArray(j) ? j[0] : j;
  const t2 = o.plotTasks.find(t => t.name === '黄毛判定' || t.name === '黄毛判定·输入校准');
  const t3 = o.plotTasks.find(t => t.name === '导演台本');
  let changed = false;

  // S2-MSG2：从"本轮<当前表格数据>包含"到"</当前表格数据>"整块替换
  const m2 = t2.promptGroup[2];
  const s2Start = m2.content.indexOf('本轮<当前表格数据>包含');
  const s2End = m2.content.indexOf('</当前表格数据>', s2Start);
  if (s2Start >= 0 && s2End > s2Start) {
    const endPos = s2End + '</当前表格数据>'.length;
    m2.content = m2.content.slice(0, s2Start) + NEW_S2 + m2.content.slice(endPos);
    changed = true;
  } else {
    fail.push(fn + ':S2块未找到');
  }

  // S3-MSG15：从"本轮<当前表格数据>含"到"</当前表格数据>"整块替换
  const m15 = t3.promptGroup[15];
  const s3Start = m15.content.indexOf('本轮<当前表格数据>含');
  const s3End = m15.content.indexOf('</当前表格数据>', s3Start);
  if (s3Start >= 0 && s3End > s3Start) {
    const endPos = s3End + '</当前表格数据>'.length;
    m15.content = m15.content.slice(0, s3Start) + NEW_S3 + m15.content.slice(endPos);
    changed = true;
  } else {
    fail.push(fn + ':S3块未找到');
  }

  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
    ok++;
  }
}
console.log('成功:', ok + '/' + files.length);
if (fail.length) console.log('失败:', fail.join(' | '));
