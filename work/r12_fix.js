// R12：18 版加第六型舔狗型（用供）。五型→六型（保护淫妻线五型）+ 枚举加舔狗型 + 融入句 + 手段括注 + 选型示例
const fs = require('fs');
const dir = 'C:/Users/zouyu/Downloads/酒馆/数据库/剧情推进预设/';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Cirno') && !f.includes('bak'));
const PH = '@@YQWLX@@'; // 淫妻线五型 占位

// 每版选型示例句的插入特征（按实际文本）
const exampleHooks = [
  { hook: '偏好外貌吸引 → 偏魅力型/诱惑型', add: '；偏好被照顾/缺爱 → 偏舔狗型（卑微讨好/供奉式）' },   // straight 系
  { hook: '偏好中性美 → 假小子或伪娘皆可', add: '；偏好被照顾/缺爱 → 偏舔狗型（卑微讨好/供奉式）' },        // FT 系
  { hook: '偏好中性美 → 候选常为假小子或伪娘', add: '；偏好被照顾/缺爱 → 候选常为舔狗型' },                  // DEI 系
  { hook: '偏好型男 → 通常直接正常男性', add: '；偏好被照顾/缺爱 → 常为舔狗型' },                             // DEI 系 B 句
];

let fail = 0;
for (const fn of files) {
  const p = dir + fn;
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  if (!raw.trim().startsWith('[')) { console.log('[FAIL] top-level: ' + fn); fail++; continue; }
  let n = 0;
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string') { o[i] = transform(v); n++; } else walk(v); } return; }
    for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { o[k] = transform(v); n++; } else walk(v); }
  }
  function transform(s) {
    // 1. 保护 淫妻线五型
    s = s.split('淫妻线五型').join(PH);
    // 2. 五型 -> 六型（全局）
    s = s.split('五型').join('六型');
    // 3. 还原 淫妻线五型
    s = s.split(PH).join('淫妻线五型');
    // 4. 枚举加舔狗型（括号形式 / 模板 [] 形式 / 追踪 =[] 形式）
    s = s.split('六型（权力型/魅力型/隐秘型/强制型/诱惑型）').join('六型（权力型/魅力型/隐秘型/强制型/诱惑型/舔狗型）');
    s = s.split('六型：[权力型/魅力型/隐秘型/强制型/诱惑型]').join('六型：[权力型/魅力型/隐秘型/强制型/诱惑型/舔狗型]');
    s = s.split('六型=[权力型/魅力型/隐秘型/强制型/诱惑型]').join('六型=[权力型/魅力型/隐秘型/强制型/诱惑型/舔狗型]');
    // 5. 融入方式句加 舔狗型用供
    s = s.split('权力型用权、魅力型用情、隐秘型用谋、强制型用力、诱惑型用色').join('权力型用权、魅力型用情、隐秘型用谋、强制型用力、诱惑型用色、舔狗型用供');
    // 6. 手段可施展括注加舔狗型
    s = s.split('权力型要有权柄支点，隐秘型要有隐蔽时机，强制型要有接触机会，魅力型要有共处空间，诱惑型要有勾连方式').join('权力型要有权柄支点，隐秘型要有隐蔽时机，强制型要有接触机会，魅力型要有共处空间，诱惑型要有勾连方式，舔狗型要有接近/服务途径');
    // 7. 选型示例加偏好被照顾/缺爱
    for (const h of exampleHooks) {
      s = s.split(h.hook).join(h.hook + h.add);
    }
    return s;
  }
  walk(j);
  const out = JSON.stringify(j, null, 2);
  fs.writeFileSync(p, out, 'utf8');
  // 验证
  const back = fs.readFileSync(p, 'utf8');
  const blob = JSON.stringify(JSON.parse(back));
  let ok = true;
  try { JSON.parse(back); } catch (e) { ok = false; console.log('[FAIL] JSON ' + fn + ' ' + e.message); }
  if (!back.trim().startsWith('[')) { ok = false; console.log('[FAIL] array ' + fn); }
  const wuxingResid = blob.split('五型').length - 1; // 应=0（淫妻线五型已被保护）
  const yinqi = blob.split('淫妻线五型').length - 1;
  const liuxing = blob.split('六型').length - 1;
  const tiangou = blob.split('舔狗型').length - 1;
  const yonggong = blob.split('舔狗型用供').length - 1;
  const wujieduan = blob.split('五阶段').length - 1; // 保护验证
  const wuziduan = blob.split('五字段').length - 1;
  const wuguan = blob.split('五官').length - 1;
  const res = '五型残留=' + wuxingResid + '(淫妻线五型=' + yinqi + ') | 六型=' + liuxing + ' | 舔狗型=' + tiangou + ' | 用供句=' + yonggong + ' | 五阶段=' + wujieduan + ' | 五字段=' + wuziduan + ' | 五官=' + wuguan;
  const bad = wuxingResid !== 0 || liuxing === 0 || tiangou === 0 || yonggong === 0;
  console.log(fn + ' | replaced-strings=' + n + ' | ' + res + (ok && !bad ? ' OK' : ' [FAIL]'));
  if (!ok || bad) fail++;
}
console.log('==== ' + (fail === 0 ? 'ALL PASS' : fail + ' FAIL') + ' ====');
process.exit(fail === 0 ? 0 : 1);
