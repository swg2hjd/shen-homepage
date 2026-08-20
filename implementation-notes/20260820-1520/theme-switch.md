# 主题切换实现原理

## 目标

页面支持深色和浅色两套视觉主题：

1. 刷新页面时直接恢复上次选择，避免先显示默认主题再闪到目标主题。
2. 点击右上角按钮时，主题颜色平滑切换。
3. 深色状态显示月亮图标，浅色状态显示太阳图标。
4. 首屏控制台图片也随主题切换，浅色模式不再显示深色图。
5. 不支持 View Transition 或用户开启 reduced motion 时，仍能正常切换。

## 1. 首次加载时提前恢复状态

`index.html` 的 head 中有一段同步初始化脚本，在 CSS 和页面主体绘制前读取：

- `localStorage` key：`rowan-theme`
- 合法值：`dark` 或 `light`
- 写入位置：`document.documentElement.dataset.theme`

最终生成的根节点状态类似：

```html
<html data-theme="dark">
```

这样 CSS 首次计算时就能使用正确的 token，减少刷新时的主题闪烁。脚本还会恢复 `rowan-lang`，但语言切换不属于本篇主题机制的核心。

## 2. CSS token 统一管理颜色

`assets/css/tokens.css` 使用两组根节点变量：

```css
:root,
:root[data-theme="dark"] {
  --page-background: #081014;
  --text: #edf7f5;
  --panel: #101b22;
}

:root[data-theme="light"] {
  --page-background: #f8fbf9;
  --text: #0e1a1d;
  --panel: #ffffff;
}
```

组件不判断当前主题，也不在 JavaScript 里逐个改背景色，而是统一读取 `var(--...)`。切换时只改变根节点的 `data-theme`，整个页面会重新计算 token。

这种方式的好处是：新增模块只需要接入变量，不需要再写一套主题切换逻辑；深浅色的对比度也可以集中在 `tokens.css` 调整。

## 3. JavaScript 状态链路

核心调用链在 `assets/app.js`：

```text
点击主题按钮
  -> setTheme(nextTheme, { animate: true, source: button })
  -> transitionTheme(nextTheme, button)
  -> document.startViewTransition(updateTheme)
  -> applyTheme(theme)
  -> root.dataset.theme = theme
  -> localStorage 写入 rowan-theme
  -> updateControls()
```

`applyTheme()` 只做三件事：

- 设置 `document.documentElement.dataset.theme`
- 保存主题到 localStorage
- 更新按钮状态和图标

当页面不支持 `document.startViewTransition`，或者 `prefers-reduced-motion: reduce` 生效时，`transitionTheme()` 会直接调用 `applyTheme()`，所以功能不会依赖动画 API。

## 4. 圆形扩散动画

动画使用 View Transition API 创建新旧页面快照，然后使用 `document.documentElement.animate()` 对快照伪元素做圆形裁剪：

1. 读取主题按钮的 `getBoundingClientRect()`。
2. 以按钮中心作为圆心。
3. 使用 `Math.hypot()` 计算覆盖整个视口所需的最大半径。
4. 通过 `clip-path: circle(...)` 从 `0px` 扩散到最大半径。

两种方向有意区分：

- 切换到浅色：让 `::view-transition-new(root)` 从按钮中心向外扩散。
- 切换到深色：反向裁剪 `::view-transition-old(root)`，形成从按钮处收回/覆盖的效果。

`assets/css/base.css` 中对 View Transition 的默认动画和新旧快照层级做了重置，否则浏览器默认淡入淡出可能与自定义圆形动画叠加，导致闪烁或层级错误。

## 5. 图标与控制台图片

主题按钮在 `index.html` 中同时放置太阳和月亮两个 SVG。`assets/app.js` 的 `updateControls()` 设置按钮的：

```html
<button data-theme-toggle data-state="dark">
```

`assets/css/components.css` 根据 `data-state` 控制图标：

- `data-state="dark"`：显示月亮
- `data-state="light"`：显示太阳

控制台区域同时加载：

- `assets/ai-console.svg`
- `assets/ai-console-light.svg`

CSS 根据根节点主题隐藏其中一张，避免浅色页面出现过重的深色控制台图。

## 6. 修改时的注意事项

- 不要只改 `data-state` 而忘记 `data-theme`，前者只影响按钮，后者才是主题根状态。
- 不要把主题颜色写死到组件 CSS；优先修改 `tokens.css`。
- 如果调整扩散起点，应继续使用按钮中心，不要使用视口固定角落，否则主题按钮移动后动画会失去关联。
- 修改 View Transition 层级后要重点观察切换完成瞬间是否闪烁；当前旧/新快照的 z-index 是为深色和浅色方向分别调过的。
- SVG 修改后若浏览器仍显示旧内容，先排查缓存；可给图片地址增加版本查询参数，例如 `ai-console.svg?v=2`。
