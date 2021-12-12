# Atomic

参考 [tailwind](https://tailwindcss.com/) 的命名、[unocss](https://github.com/antfu/unocss) 的核心代码，仿制一个简易版（阉割版）的原子 CSS 库，用以学习和自用。

## 如何体验

- git clone git@github.com:anyexinglu/atomic.git
- cd atomic && pnpm i && pnpm dev
- 浏览器打开 http://localhost:3000/

## 项目结构

### atomic

将原子 CSS 转为 styles 的核心代码（大部分来自 [unocss](https://github.com/antfu/unocss)）

暂未支持 transition / transform，因为是较小频情况（{ transform: rotate(-45deg) } 相对多一些）

#### TODOs

- 尝试连写：
  - [ ] spacing（padding / margin）的连写，比如 p-2-4 表示 { padding: 2px 4px }
  - [ ] border / background 的连写，，比如 b-2-solid-pink 表示 { border: 2px solid pink }

### demo

atomic 的 Playground。

技术选型采用 pnpm + vite + tailwind（使用 tailwind 是便于对比多个解决方案）。

其中 tailwind 发现一些用法的不足之处：

- 单位希望全部用 px 比较麻烦，需要[定制 theme](https://github.com/tailwindlabs/tailwindcss/issues/1232#issuecomment-754804258)，配置方法详见本项目的 `tailwind.config.js` 文件。而且最终生成的 stylesheet 实际表现是覆盖样式，更希望全局配置 px/rem。
- 不支持连写（atomic 可以支持）
- 颜色等不能用任意值，需要在 theme 里定义后才能用（如果业务偏好任意值，atomic 里支持起来很容易）
- vscode 插件，要空格后才能提示样式（不过 “warn 错误用法” 的功能很不错，且 theme 改了对应的联想也更新了很棒）
- 嵌套结构设置样式书写不便，比如 ul 的 li 要挨个设置 className，不能 ul li { ... } 的标签嵌套写法。
