import {
    VariantHandler, Variant,
    VariantObject
} from '../interface'

export const variantMatcher = (name: string, selector?: (input: string) => string | undefined) => {
    const length = name.length + 1
    const re = new RegExp(`^${name}[:-]`)
    return (input: string): VariantHandler | undefined => {
        return input.match(re)
            ? {
                matcher: input.slice(length),
                selector,
            }
            : undefined
    }
}

export function normalizeVariant(variant: Variant): VariantObject {
    return typeof variant === 'function'
        ? { match: variant }
        : variant
}
