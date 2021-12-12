import { CSSEntries, Rule, RuleContext, Theme } from '../interface'
// import { Theme } from '../theme'
import { cornerMap, directionMap, handler as h } from '../utils'
import { borderColors } from './color'

export const borderSizes: Rule[] = [
  [/^border$/, handlerBorder],
  [/^(?:border|b)(?:-([^-]+))?$/, handlerBorder],
  [/^(?:border|b)(?:-([^-]+))?(?:-([^-]+))?$/, handlerBorder],
]

// 去掉了 (?:border-)? ，支持 rounded-x 和 rd-x 两种形式
export const borderRadius: Rule[] = [
  [/^(?:rounded|rd)$/, handlerRounded],
  [/^(?:rounded|rd)(?:-([^-]+))?$/, handlerRounded],
  [/^(?:rounded|rd)(?:-([^-]+))?(?:-([^-]+))?$/, handlerRounded],
]

export const borderStyles: Rule[] = [
  ['border-solid', { 'border-style': 'solid' }],
  ['border-dashed', { 'border-style': 'dashed' }],
  ['border-dotted', { 'border-style': 'dotted' }],
  ['border-double', { 'border-style': 'double' }],
  ['border-none', { 'border-style': 'none' }],
]

export const borders = [
  borderSizes,
  borderColors,
  borderStyles,
  borderRadius,
].flat(1)

function handlerBorder([, a, b]: string[]): CSSEntries | undefined {
  const [d, s = '1'] = directionMap[a] ? [a, b] : ['', a]
  const v = h.bracket.px(s)
  if (v != null) {
    return [
      ...directionMap[d].map((i): [string, string] => [`border${i}-width`, v]),
      ['border-style', 'solid'],
    ]
  }
}

function handlerRounded([, a, b]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const [d, s = 'DEFAULT'] = cornerMap[a] ? [a, b] : ['', a]
  const v = theme.borderRadius?.[s] || h.bracket.fraction.px(s)
  if (v != null)
    return cornerMap[d].map((i: string) => [`border${i}-radius`, v])
}
