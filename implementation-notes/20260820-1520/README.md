# 页面实现原理记录

更新时间：2026-08-20 15:20（Asia/Shanghai）

本目录记录当前主页中比较值得复用和维护的实现原理。当前先整理两部分：主题切换，以及顶部 sticky header 覆盖内容时呈现点阵网格的效果。

## 文档

- [主题切换实现原理](./theme-switch.md)
- [顶部覆盖内容时的点阵效果](./sticky-grid-overlay.md)

## 相关源码

- `index.html`：首屏初始化脚本、主题按钮、深浅色控制台图片
- `assets/app.js`：主题状态、持久化、View Transition 和控件更新
- `assets/css/tokens.css`：深色/浅色主题变量
- `assets/css/base.css`：页面背景和 View Transition 基础层级
- `assets/css/layout.css`：全宽 sticky header 与点阵背景
- `assets/css/responsive.css`：移动端 header 高度和点阵位置

## 维护原则

这两个效果都依赖“状态层”和“视觉层”分离：JavaScript 只切换根节点状态或控制动画，具体颜色、层级和背景由 CSS 负责。后续改动时优先沿用现有 token 和 `data-*` 状态，不要在组件里重复写主题颜色或直接操作大量 inline style。
