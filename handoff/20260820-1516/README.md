# Rowan Shen Homepage Handoff

更新时间：2026-08-20 15:16（Asia/Shanghai）

## 继续目标

继续迭代并最终发布 Rowan Shen 的个人主页。当前版本已经达到可用且视觉统一的 v1/v2 个人主页状态，后续优先补充真实项目证据和联系方式，而不是继续大幅改动视觉方向。

## 项目位置与运行

- 项目根目录：`E:\ai-project\self\shen-homepage`
- 本地预览：当前对话中使用过 `http://127.0.0.1:4173/`
- 项目是原生 HTML/CSS/JavaScript，无构建框架
- 页面当前无构建依赖和测试脚本，发布时直接使用 `index.html` 与 `assets/`
- 页面依赖 GSAP 3.12.5 CDN，动画在 CDN 不可用时应保持基本内容可见

## 当前页面定位

Rowan Shen：前端开发者 / AI 产品构建者。

核心信息：5+ 年前端经验、10+ 大型项目经验，强调产品判断、清晰交互、稳定交付和 AI 辅助工作流。页面包含英文/中文切换、深浅色主题、固定网格纹理头部、GSAP 首屏和滚动动画、开发者控制台视觉、能力卡片横向循环以及联系模块。

## 主要文件

- `index.html`：页面结构、首屏、导航、语言菜单、主题按钮、各内容模块
- `assets/app.js`：中英文文案、语言切换、主题切换、View Transition、语言菜单 hover/focus/click 行为
- `assets/motion.js`：GSAP 首屏动画、ScrollTrigger、控制台扫描/轨道动画、统计数字、模块 reveal、能力卡片循环
- `assets/style.css`：CSS 入口，负责引入拆分样式
- `assets/css/tokens.css`：深浅色主题 token、页面背景、卡片、边框、阴影和金色强调色
- `assets/css/base.css`：基础排版、body 网格背景、标题样式、可访问性和 reduced-motion
- `assets/css/layout.css`：页面宽度、全宽 sticky header、首屏和各模块布局
- `assets/css/components.css`：按钮、控制台卡片、语言菜单、能力卡片、联系模块等组件样式
- `assets/css/responsive.css`：1100px、900px、720px 等断点
- `assets/ai-console.svg`：深色主题控制台图
- `assets/ai-console-light.svg`：浅色主题控制台图
- `tests/site.test.mjs`：已有轻量页面检查

## 最近完成的关键迭代

1. 头部改为全视口宽度，内容仍与页面主体 1160px 网格对齐；右侧有合理边距。
2. sticky header 使用 Element Plus 风格的 `radial-gradient` 点阵背景和轻微透明效果。页面顶部不显示明显网格，内容滚动到 header 下方时才透出点阵。
3. 首屏和第二模块的 reveal 动画已调整，模块自身先占据布局，避免刷新或切换语言时底部内容偶发不显示、错位或间隔过大。
4. 能力卡片从三张扩展为五张，序号已移除，卡片以较克制的深金色作为高级感强调，并且横向自动循环；左右边缘增加 mask 淡出，减轻硬裁切感。
5. 浅色模式已重新调低背景、卡片和联系模块的对比度，控制台使用独立的浅色 SVG，不再直接复用深色图。
6. 控制台 SVG 中的代码片段已改成与 Rowan 个人定位相关的产品构建表达。若浏览器仍看到旧文字，优先检查 SVG 缓存，必要时给图片 URL 增加版本查询参数。
7. 语言菜单选中态已去掉容易产生歧义的向下箭头，改为小圆点。菜单仍支持鼠标移入展开、移动到菜单选择、键盘 focus 和点击关闭。
8. 首屏标题最新文案已收紧，中文为 `复杂产品，我来做成清晰体验。`，中等桌面宽度的 H1 从 56px 调整为 52px，以避免中文被拆成不自然的字块。具体文案以 `assets/app.js` 翻译表为准。

## 当前工作区状态

当前分支：`main`

最近提交：`3b8159d Update handoff with repository sync status`

本轮已完成清理、提交和 HTTPS 推送：

- 删除无关测试工具：`package.json`、`tests/site.test.mjs`
- 保留页面运行所需文件：`index.html`、`assets/`、`.gitignore`
- 保留交接和实现原理文档：`handoff/`、`implementation-notes/`
- 远程：`origin` 使用 HTTPS，已同步到 `origin/main`
- 页面与清理提交：`7412e8e`
- 最终 handoff 更新提交：`3b8159d`
- 本次交接文档目录：`handoff/20260820-1516/`

当前工作区在推送后应保持 clean。下一次开始时先运行 `git status --short` 和 `git log -1 --oneline` 确认状态，再继续修改。

## 已知注意事项

- 用户明确说这是小网页，不需要复杂 TDD 测试。当前已移除测试脚本，改动后做 `node --check`、`git diff --check` 或必要的简单浏览器检查即可。
- 浅色切换到深色的 View Transition 曾有过完成瞬间闪烁问题；当前动画方向和交互逻辑已基本符合预期，除非用户再次提出，不要贸然重写主题切换机制。
- `assets/app.js` 中的页面联系方式已保留在源码中，交接文档不复制实际邮箱等敏感信息。
- 页面仍依赖 GSAP CDN；如果需要提高 GitHub Pages 离线稳定性，可考虑后续本地化依赖，但不要在普通视觉迭代中顺手引入构建复杂度。
- 移动端导航链接目前隐藏，只有品牌和图标控制；若后续重点优化移动端，需要专门决定是否加入菜单按钮。
- 当前 header 点阵效果刻意保留了滚动内容透出的视觉特征。如果用户认为点阵对比度太强，应优先调节 `tokens.css` 的 header 背景/透明度或点阵参数，不要改回普通毛玻璃。

## 下一轮推荐顺序

1. 先在本地刷新确认最新中文标题、语言选中圆点、浅色控制台和能力卡片边缘效果。
2. 补 2～3 个项目案例：项目类型、个人角色、解决的问题、交付结果。当前页面最大的提升空间是可信度，不是继续堆动效。
3. 如果用户提供，加入 GitHub、LinkedIn 或作品链接；当前联系按钮仍使用页面源码中已有的 mailto，不在此文档暴露地址。
4. 解决 SVG 浏览器缓存后，再决定是否需要微调 header 点阵强度和移动端导航。
5. 用户确认最终版本后，检查 GitHub Pages 发布状态。当前源码已经推送，但部署是否已完成仍需在 GitHub Pages 设置或 Actions 页面确认。

## 建议下一次调用的技能

- `frontend-design`：继续做页面视觉和排版打磨
- `design-taste-frontend`：进行已有页面的审美审计和细节升级
- `gsap-core`：修改基础 GSAP 动画时使用
- `gsap-scrolltrigger`：修改滚动触发、模块 reveal 或滚动联动时使用
- `gsap-performance`：出现动画卡顿、布局抖动或性能问题时使用
- `browser:control-in-app-browser`：需要验证本地页面视觉和交互时使用
- `superpowers:verification-before-completion`：准备宣称改动完成前使用

## 下一次开始建议

先阅读本文件，再查看 `git status --short` 和 `assets/app.js`、`assets/css/`、`assets/motion.js`。当前已同步到远程，不要覆盖已提交改动；优先根据用户最新反馈做小范围、可验证的修改。
