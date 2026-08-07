const fs = require("fs");
const TARGET = "C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json";
const raw = fs.readFileSync(TARGET, "utf8");
const j = JSON.parse(raw); // throws if invalid
console.log("JSON.parse OK");
console.log("top-level array:", Array.isArray(j), "| raw starts with [:", raw.trimStart().startsWith("["));
console.log("byte length:", Buffer.byteLength(raw));

const strs = [];
for (const t of j[0].plotTasks) {
  strs.push(t.description);
  for (const m of t.promptGroup || []) strs.push(m.content);
}
strs.push(j[0].finalSystemDirective);
const all = strs.join("\n");

// OLD residual phrases (spec verification list + all 10 full OLDs)
const residual = [
  "接下来的场景中是否会有黄毛出现的可能",
  "后续剧情是否有黄毛实际出场的契机",
  "prologue 不展开该场景外戏",
  "本轮无黄毛在场。两种情形",
  "但本轮在场不合理",
  "本轮判定其在场合理",
  "若有上一轮已锁定的活跃黄毛则仍按",
  "或已锁定但本轮该留白等待时空/人设/动机成熟、或在两条硬约束下当前不可出手。no-act",
];
console.log("\n=== residual OLD scan (expect 0) ===");
let bad = 0;
for (const r of residual) {
  const n = all.split(r).length - 1;
  if (n > 0) bad++;
  console.log(n, "<-", r.slice(0, 40));
}

// NEW presence check
const news = {
  "N-A1": "**刷新成功判定标准 = 本轮黄毛能否进入 {{user}} 当前场景画面**",
  "N-A2": "3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**：以 **{{user}} 本轮当前场景画面** 为唯一基准",
  "N-A3": "- **no_spawn**：本轮无黄毛在 {{user}} 当前场景画面内（同楼其他房间/隔壁/离场追踪/场景外行动",
  "N-A4": "② 分支A——黄毛表已命中该目标黄毛但黄毛不在 {{user}} 当前场景画面内",
  "N-A6": "本轮判定其在 {{user}} 当前场景画面内合理",
  "N-B1": "正文 content 完整编排该场景外戏（读者可见黄毛与对象的互动全貌",
  "N-B2": "**stage 记录 + 正文 content 完整编排该场景外戏（读者可见全貌）**",
  "N-B3": "若该黄毛本轮 act 为场景外行动（黄毛与对象均在 {{user}} 当前场景之外），该戏写入 stage（标注「场景外场景」）+ 正文 content 编排",
  "N-C1": "**目标与 {{user}} 同处当前场景时（黄毛已真正锁定）**",
  "N-C1b": "**未锁定（背景板）黄毛仍一律 no-act，不适用本条**",
  "N-C2": "锁定前可 spawn 但不得 act",
  "N-C2b": "含目标与 {{user}} 同场且黄毛无合理制造离场契机的手段",
};
console.log("\n=== NEW presence (expect 1 each) ===");
for (const [id, nw] of Object.entries(news)) {
  console.log(id, "hits:", all.split(nw).length - 1);
}
console.log("\nresidual problems:", bad);
