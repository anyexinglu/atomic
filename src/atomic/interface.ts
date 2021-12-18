
export interface RuleMeta {
  layer?: string
}

export type Awaitable<T> = T | Promise<T>

export type CSSObject = Record<string, string | number | undefined>
export type CSSEntries = [string, string | number | undefined][]

export interface RuleContext<Theme extends {} = {}> {
  /**
   * Unprocessed selector from user input.
   * Useful for generating CSS rule.
  //  */
  // rawSelector: string
  // /**
  //  * Current selector for rule matching
  //  */
  // currentSelector: string
  // /**
  //  * UnoCSS generator instance
  //  */
  // generator: any // UnoGenerator
  /**
   * The theme object
   */
  theme: Theme
  /**
   * Matched variants handlers for this rule.
   */
  // variantHandlers: VariantHandler[]
  // /**
  //  * Constrcut a custom CSS rule.
  //  * Variants and selector escaping will be handled automatically.
  //  */
  // constructCSS: (body: CSSEntries | CSSObject, overrideSelector?: string) => string
}

export type DynamicMatcher<Theme extends {} = {}> = ((match: string[], context: Readonly<RuleContext<Theme>>) => Awaitable<CSSObject | CSSEntries | undefined>)
export type DynamicRule<Theme extends {} = {}> = [RegExp, DynamicMatcher<Theme>] | [RegExp, DynamicMatcher<Theme>]
export type StaticRule = [string, CSSObject | CSSEntries] | [string, CSSObject | CSSEntries]
export type Rule<Theme extends {} = {}> = DynamicRule<Theme> | StaticRule

export interface Theme {
  width?: Record<string, string>
  height?: Record<string, string>
  maxWidth?: Record<string, string>
  maxHeight?: Record<string, string>
  minWidth?: Record<string, string>
  minHeight?: Record<string, string>
  borderRadius?: Record<string, string>
  breakpoints?: Record<string, string>
  colors?: Record<string, string | Record<string, string>>
  fontFamily?: Record<string, string>
  fontSize?: Record<string, string | number>
  lineHeight?: Record<string, string>
  letterSpacing?: Record<string, string>
  boxShadow?: Record<string, string>
  textIndent?: Record<string, string>
  textShadow?: Record<string, string>
  textStrokeWidth?: Record<string, string>
  // filters
  blur?: Record<string, string>
  dropShadow?: Record<string, string | string[]>
}

export interface VariantHandler {
  /**
   * The result rewritten selector for the next round of matching
   */
  matcher: string
  /**
   * Rewrite the output selector. Often be used to append pesudo classes or parents.
   */
  selector?: (input: string) => string | undefined
  /**
   * Rewrite the output css body. The input come in [key,value][] pairs.
   */
  body?: (body: CSSEntries) => CSSEntries | undefined
  /**
   * Provide a parent selector(e.g. media query) to the output css.
   */
  parent?: string | [string, number] | undefined
}

export type VariantFunction<Theme extends {} = {}> = (matcher: string, raw: string, theme: Theme) => string | VariantHandler | undefined

export type VariantObject<Theme extends {} = {}> = {
  /**
   * The entry function to match and rewrite the selector for futher processing.
   */
  match: VariantFunction<Theme>

  /**
   * Allows this variant to be used more than once in matching a single rule
   *
   * @default false
   */
  multiPass?: boolean
}

export type Variant<Theme extends {} = {}> = VariantFunction<Theme> | VariantObject<Theme>

export interface ResolvedConfig {
  theme: {
    colors?: Record<string, string | Record<string, string>>
  }
  variants: VariantObject[]
  rulesSize: number
  rulesDynamic: (DynamicRule | undefined)[]
  rulesStaticMap: Record<string, [number, CSSObject | CSSEntries] | undefined>
}

export type ParsedUtil = readonly [
  index: number,
  raw: string,
  entries: CSSEntries,
  // meta: RuleMeta | undefined,
  variants: VariantHandler[]
]

export type StringifiedUtil = readonly [
  index: number,
  selector: string | undefined,
  body: string,
  // parent: string | undefined,
  meta: string
]

export type VariantMatchedResult = readonly [
  // raw: string,
  current: string,
  variants: VariantHandler[]
]
