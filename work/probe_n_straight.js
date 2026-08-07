const fs = require("fs");
const TARGET = "C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/Cirno_NTRS_turn_edit_straight_4.7.json";
const j = JSON.parse(fs.readFileSync(TARGET, "utf8"));
const strs = [];
const collect = (s) => { if (typeof s === "string") strs.push(s); };
for (const t of j[0].plotTasks) {
  collect(t.description);
  for (const m of t.promptGroup || []) collect(m.content);
}
collect(j[0].finalSystemDirective);
const all = strs.join("\n");

const olds = [
  ["N-A1", "**刷新成功判定标准 = 接下来的场景中是否会有黄毛出现的可能**"],
  ["N-A2", "3. **出场可能性判定（刷新成功标准，替代纯时空合理性）**"],
  ["N-A3", "- **no_spawn**：本轮无黄毛在场。两种情形："],
  ["N-A4", "② 分支A——黄毛表已命中该目标黄毛但本轮在场不合理"],
  ["N-A6", "② 分支A——黄毛表已命中该目标黄毛，本轮判定其在场合理，沿用已有黄毛"],
  ["N-B1", "**若黄毛与对象均在 {{user}} 当前场景之外、但两者可接触（黄毛离场前往对象所在处攻略），本轮黄毛行动发生在 {{user}} 场景外——stage 须标注「场景外场景」，prologue 不展开该场景外戏**"],
  ["N-B2", "- **场景外标注:** 仅当本轮黄毛与对象均在 {{user}} 当前场景之外、黄毛离场前往对象所在处攻略时填「场景外场景」"],
  ["N-B3", "thugSpawn 状态=no_spawn → 本轮无新黄毛登场；prologue 登场名单不列入新黄毛"],
  ["N-C1", "**黄毛行动不依赖本轮是否刷新在场**"],
  ["N-C2", "- **no-act**：本轮黄毛不出手。可能是：未真正锁定（背景板/未锁定黄毛天然 no-act）"],
];
for (const [id, old] of olds) {
  console.log(id, "hits:", all.split(old).length - 1);
}

// also show exact N-A2 block & surroundings in dump for byte-exact OLD
const i2 = all.indexOf("3. **出场可能性判定");
console.log("\n--- N-A2 context ---\n" + all.slice(i2, i2 + 420));
const i3 = all.indexOf("- **no_spawn**");
console.log("\n--- N-A3 context ---\n" + all.slice(i3, i3 + 160));
const i4 = all.indexOf("② 分支A");
console.log("\n--- N-A4 context ---\n" + all.slice(i4, i4 + 260));
const i6 = all.indexOf("沿用已有黄毛");
console.log("\n--- N-A6 context ---\n" + all.slice(i6 - 90, i6 + 40));
const ib3 = all.indexOf("thugSpawn 状态=no_spawn");
console.log("\n--- N-B3 context ---\n" + all.slice(ib3 - 30, ib3 + 130));
const ic1 = all.indexOf("**黄毛行动不依赖本轮是否刷新在场**");
console.log("\n--- N-C1 context ---\n" + all.slice(ic1, ic1 + 220));
const ic2 = all.indexOf("- **no-act**");
console.log("\n--- N-C2 context ---\n" + all.slice(ic2, ic2 + 200));
