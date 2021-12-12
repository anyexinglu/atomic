import { rules } from './rules'
import { variants, normalizeVariant } from './variants'
import {
    ResolvedConfig, Rule, StaticRule, Theme, ParsedUtil, StringifiedUtil, RuleContext, VariantMatchedResult,
    Variant, VariantHandler, CSSObject, CSSEntries
} from './interface'

export * from './interface'

console.log('...rules', rules)

function isStaticRule(rule: Rule): rule is StaticRule {
    return typeof rule[0] === 'string'
}

function normalizeEntries(obj: CSSObject | CSSEntries) {
    return !Array.isArray(obj) ? Object.entries(obj) : obj
}

function entriesToCss(arr?: CSSEntries) {
    if (arr == null)
        return ''
    return arr
        .map(([key, value]) => value != null ? `${key}:${value};` : undefined)
        .filter(Boolean)
        .join('')
}

const nl = '\n'

export class AtomicGenerator {
    _cache = new Map()
    tokens = new Set<string>()
    config: ResolvedConfig

    constructor(options?: {
        theme?: Theme
    }) {
        const { theme } = options || {}
        const rulesStaticMap: ResolvedConfig['rulesStaticMap'] = {}
        const rulesSize = rules.length
        const rulesCopy = [...rules]
        rulesCopy.forEach((rule, i) => {
            if (isStaticRule(rule)) {
                rulesStaticMap[rule[0]] = [i, rule[1]]
                // delete static rules so we can't skip them in matching
                // but keep the order
                delete rulesCopy[i]
            }
        })
        this.config = {
            theme: theme || {},
            rulesSize,
            variants: variants.map(normalizeVariant),
            rulesStaticMap,
            rulesDynamic: rulesCopy as ResolvedConfig['rulesDynamic'],
        }
        console.log('...options', options, this.config)
    }

    matchVariants(raw: string, current?: string): VariantMatchedResult {
        // process variants
        const usedVariants = new Set<Variant>()
        const handlers: VariantHandler[] = []
        let processed = current || raw
        let applied = false
        while (true) {
            applied = false
            for (const v of this.config.variants) {
                if (!v.multiPass && usedVariants.has(v))
                    continue
                let handler = v.match(processed, raw, this.config.theme)
                if (!handler)
                    continue
                if (typeof handler === 'string')
                    handler = { matcher: handler }
                if (handler) {
                    processed = handler.matcher
                    handlers.push(handler)
                    usedVariants.add(v)
                    applied = true
                    break
                }
            }
            if (!applied)
                break

            if (handlers.length > 500)
                throw new Error(`Too many variants applied to "${raw}"`)
        }

        return [processed, handlers]
    }

    async parseUtil(input: string): Promise<ParsedUtil | undefined> {
        const { rulesStaticMap, rulesDynamic, rulesSize, theme } = this.config
        const [processed, variantHandlers] = this.matchVariants(input)

        // use map to for static rules
        const staticMatch = rulesStaticMap[processed]
        if (staticMatch?.[1]) {
            return [staticMatch[0], input, normalizeEntries(staticMatch[1]), variantHandlers]
        }
        // match rules, from last to first
        for (let i = rulesSize; i >= 0; i--) {
            const rule = rulesDynamic[i]

            // static rules are omitted as undefined
            if (!rule)
                continue

            // dynamic rules
            const [matcher, handler] = rule
            const match = processed.match(matcher)
            if (!match)
                continue

            // pa-1 对应 ['padding', '1px']
            const result = await handler(match, {
                theme
            } as RuleContext<{}>)

            if (!result)
                continue

            // b-op-1 对应 {--un-border-opacity: "0.01"}，需要处理成数组
            const entries = normalizeEntries(result)
            if (entries.length) {
                return [i, input, entries, variantHandlers]
            }
        }
    }

    applyVariants(parsed: ParsedUtil) {
        const variantHandlers = parsed[3]
        const raw = parsed[1]
        return [
            // selector
            variantHandlers.reduce((p, v) => v.selector?.(p) || p, `.${raw}`),
            // entries
            variantHandlers.reduce((p, v) => v.body?.(p) || p, parsed[2])
        ] as const
    }

    async generate() {
        const tokens = this.tokens
        // const layerSet = new Set(['default'])
        const matched = new Set()
        const sheet: StringifiedUtil[] = []

        const hit = (raw: string, item: StringifiedUtil) => {
            this._cache.set(raw, item)
            matched.add(raw)
            sheet.push(item)
        }

        await Promise.all(Array.from(tokens).map(async (raw) => {
            const util = await this.parseUtil(raw);
            if (util) {
                const [selector, entries] = this.applyVariants(util)
                const body = entriesToCss(entries)
                const payload: StringifiedUtil = [util[0], selector, body, raw]
                return hit(raw, payload)
            }
            this._cache.set(raw, null)
        }))

        const getLayer = () => {
            let css = sheet
                .map(([, selector, body]) => {
                    return selector
                        ? `${selector}{${body}}`
                        : body
                })
                .filter(Boolean)
                .join(nl)
            return css
        }
        return { sheet, css: getLayer() }
    }
}
