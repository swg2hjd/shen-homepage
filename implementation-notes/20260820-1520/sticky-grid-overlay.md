# 顶部覆盖内容时的点阵效果

## 目标

页面顶部 header 固定在视口上方。页面刚打开时，header 看起来接近纯色；当下面的文字和模块向上滚动并进入 header 区域时，header 上会出现类似 Element Plus 官网的细密点阵，内容从点阵的透明孔洞中透出来。

关键点：这不是普通的毛玻璃，也不是一个滚动后才添加的网格元素。它是一个始终存在的 sticky 元素背景，只是背景本身由“透明小孔 + 实色底”构成。

## 1. sticky header 占据固定层

`assets/css/layout.css` 的 `.topbar`：

```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100vw;
  margin-left: calc((100% - 100vw) / 2);
}
```

它会在页面滚动时停留在视口顶部，并覆盖滚动内容。header 做成 `100vw` 是为了在 1920px 等宽屏上铺满整个页面；内部 padding 使用主体 1160px 的计算值，让品牌和右侧控制仍与页面内容对齐。

桌面高度为 84px，移动端在 `assets/css/responsive.css` 中调整为 76px。

## 2. 透明孔洞是效果核心

header 的背景定义在 `assets/css/layout.css`：

```css
background-image: radial-gradient(
  transparent 1px,
  var(--topbar-bg) 1px
);
background-size: 4px 4px;
```

这个渐变不是通常意义上的颜色渐变：

- 半径 1px 内是 `transparent`，相当于一个透明小孔。
- 超过 1px 的区域是 `var(--topbar-bg)`，相当于实色遮罩。
- 每 4px 重复一次，所以形成密集点阵。

当没有内容位于 header 后方时，透明小孔下面也是相同的页面背景色，视觉上就像没有点阵。滚动内容进入 header 后，透明小孔会露出文字或图形，于是用户只在覆盖区域看到点阵状的内容。

这就是“底部有内容时才看得到格子”的原因：格子本身没有动态出现，变化的是透明孔洞后面的内容。

## 3. 为什么不能只用 backdrop-filter

当前仍保留：

```css
backdrop-filter: saturate(50%) blur(4px);
-webkit-backdrop-filter: saturate(50%) blur(4px);
```

它只负责轻微降低后方内容的饱和度并柔化细节，不是主要视觉来源。单独使用毛玻璃会让内容在 header 下方连续可见，得到的是模糊层，而不是 Element Plus 风格的点阵遮罩。

## 4. 页面背景必须与 header 底色协调

`assets/css/tokens.css` 中深浅主题分别设置：

- `--page-background`
- `--topbar-bg`
- `--topbar-bg-mobile`

当前同一主题下这几种底色被刻意设为相同或非常接近。这样在页面顶部没有内容穿过时，header 的透明孔洞不会产生明显噪点；只有当内容滚动到后方时，点阵效果才有足够对比度。

如果把 header 背景改成明显不同于页面的半透明颜色，点阵会一直显眼，失去“覆盖内容时才出现”的层次感。

## 5. 页面自己的大网格是另一层

`assets/css/base.css` 的 `body::before` 是页面背景网格，不是 header 点阵：

```css
body::before {
  position: fixed;
  inset: 84px 0 0;
  z-index: -1;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}
```

它从 header 底部开始，显示较稀疏的大方格，并向页面下方淡出。移动端的 `inset` 顶部在 `responsive.css` 中调整为 76px。

两层的职责不同：

- header：4px 小点阵，用于覆盖内容时透出。
- body 背景：48px 大网格，用于页面整体空间感。

混淆这两层会导致 header 上方出现一整块大网格，或出现“多了一层背景”的问题。

## 6. 常见误区与调参顺序

### 点阵一直很明显

先检查 `--page-background` 和 `--topbar-bg` 是否一致，再检查 `radial-gradient` 的透明半径和 `background-size`。不要先加新的遮罩层。

### 滚动内容没有透出来

检查：

1. `.topbar` 是否仍是 `position: sticky`。
2. `.topbar` 是否有更高层的实色伪元素覆盖背景。
3. `background-image` 是否被 `background` 简写覆盖。
4. `z-index` 是否低于滚动内容。

### 点阵太粗或太亮

优先调整 `background-size: 4px 4px` 和 `transparent 1px`，然后再调 `--topbar-bg`。保持透明孔洞逻辑，不要改成普通线性渐变。

### 手机端位置错位

header 高度和 `body::before` 的 `inset-top` 必须同步：桌面是 84px，移动端是 76px。
