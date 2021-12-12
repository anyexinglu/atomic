# Atomic

参考 [tailwind](https://tailwindcss.com/) 的命名、[unocss](https://github.com/antfu/unocss) 的核心代码，仿制一个简易版（阉割版）的原子 CSS 库，用以学习和自用。

## 如何体验

- git clone git@github.com:anyexinglu/atomic.git
- cd atomic && pnpm i && pnpm dev
- 浏览器打开 http://localhost:3000/

## 项目结构

### atomic

将原子 CSS 转为 styles 的核心代码（大部分来自 [unocss](https://github.com/antfu/unocss)）

### demo

atomic 的 Playground。

技术选型采用 pnpm + vite + tailwind（使用 tailwind 是便于对比多个解决方案）。
