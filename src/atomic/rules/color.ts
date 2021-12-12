import { Rule, Theme } from '../interface'
import { handler as h } from '../utils'

/* eslint-disable no-case-declarations */
const hexRE = /^#?([\da-f]+)$/i

export function hex2rgba(hex = ''): [number, number, number, number] | [number, number, number] | undefined {
    const [, body] = hex.match(hexRE) || []

    if (!body)
        return

    switch (body.length) {
        case 3:
        case 4:
            const digits = Array.from(body, s => Number.parseInt(s, 16)).map(n => (n << 4) | n)
            if (body.length === 3)
                return digits as [number, number, number]
            digits[3] = Math.round(digits[3] / 255 * 100) / 100
            return digits as [number, number, number, number]
        case 6:
        case 8:
            const value = Number.parseInt(body, 16)
            if (body.length === 6)
                return [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF]
            return [(value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF, Math.round((value & 0xFF) / 255 * 100) / 100]
    }
}

export const parseColorUtil = (body: string, theme: Theme) => {
    const [main, opacity] = body.split(/(?:\/|:)/)
    const [name, no = 'DEFAULT'] = main
        .replace(/([a-z])([0-9])/g, '$1-$2')
        .split(/-/g)

    if (!name)
        return

    let color: string | undefined
    const bracket = h.bracket(main) || main
    if (bracket.startsWith('#'))
        color = bracket.slice(1)
    if (bracket.startsWith('hex-'))
        color = bracket.slice(4)

    if (!color) {
        const colorData = theme.colors?.[name]
        if (typeof colorData === 'string')
            color = colorData
        else if (no && colorData)
            color = colorData[no]
    }

    return {
        opacity,
        name,
        no,
        color,
        rgba: hex2rgba(color),
    }
}

export const colorResolver
    = (attribute: string, varName: string) =>
        ([, body]: string[], { theme }: any) => {
            const data = parseColorUtil(body, theme)

            if (!data)
                return

            const { opacity, color, rgba } = data

            if (!color)
                return

            if (rgba) {
                const a = opacity
                    ? opacity[0] === '[' ? h.bracket.percent(opacity)! : (parseFloat(opacity) / 100)
                    : rgba[3]
                if (a != null && !Number.isNaN(a)) {
                    // @ts-expect-error
                    rgba[3] = typeof a === 'string' && !a.includes('%')
                        ? parseFloat(a)
                        : a
                    return {
                        [attribute]: `rgba(${rgba.join(',')})`,
                    }
                }
                else {
                    return {
                        [`--un-${varName}-opacity`]: 1,
                        [attribute]: `rgba(${rgba.slice(0, 3).join(',')},var(--un-${varName}-opacity))`,
                    }
                }
            }
            else {
                return {
                    [attribute]: color,
                }
            }
        }

/**
 * @example op10 op-30 opacity-100
 */
export const opacity: Rule[] = [
    [/^op(?:acity)?-?(.+)$/, ([, d]) => ({ opacity: h.bracket.percent.cssvar(d) })],
]

/**
 * @example c-red color-red5 text-red-300
 */
export const textColors: Rule[] = [
    [/^(?:text|color|c)-(.+)$/, colorResolver('color', 'text')],
    [/^(?:text|color|c)-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-text-opacity': h.bracket.percent.cssvar(opacity) })],
]

export const textDecorationColors: Rule[] = [
    [/^underline-(.+)$/, (match, ctx) => {
        const result = colorResolver('text-decoration-color', 'line')(match, ctx)
        if (result) {
            return {
                '-webkit-text-decoration-color': result['text-decoration-color'],
                ...result,
            }
        }
    }],
    [/^underline-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-line-opacity': h.bracket.percent(opacity) })],
]

export const textStrokeColors: Rule[] = [
    [/^text-stroke-(.+)$/, colorResolver('-webkit-text-stroke-color', 'text-stroke')],
    [/^text-stroke-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-text-stroke-opacity': h.bracket.percent(opacity) })],
]

export const bgColors: Rule[] = [
    [/^bg-(.+)$/, colorResolver('background-color', 'bg')],
    [/^bg-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-bg-opacity': h.bracket.percent(opacity) })],
]

export const borderColors: Rule[] = [
    [/^(?:border|b)-(.+)$/, colorResolver('border-color', 'border')],
    [/^(?:border|b)-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-border-opacity': h.bracket.percent(opacity) })],
]

export const ringColors: Rule[] = [
    [/^ring-(.+)$/, colorResolver('--un-ring-color', 'ring')],
    [/^ring-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-ring-opacity': h.bracket.percent(opacity) })],
]

export const ringOffsetColors: Rule[] = [
    [/^ring-offset-(.+)$/, colorResolver('--un-ring-offset-color', 'ring-offset')],
    [/^ring-offset-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-ring-offset-opacity': h.bracket.percent(opacity) })],
]

export const divideColors: Rule[] = [
    [/^divide-(.+)$/, colorResolver('border-color', 'divide')],
    [/^divide-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-divide-opacity': h.bracket.percent(opacity) })],
]

export const fillColors: Rule[] = [
    ['fill-none', { fill: 'none' }],
    [/^fill-(.+)$/, colorResolver('fill', 'fill')],
    [/^fill-op(?:acity)?-?(.+)$/m, ([, opacity]) => ({ '--un-fill-opacity': h.bracket.percent(opacity) })],
]
