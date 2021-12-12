export * from './mappings'
export * from './handlers'

export function capitalize<T extends string>(str: T) {
    return str.charAt(0).toUpperCase() + str.slice(1) as Capitalize<T>
}

export function toArray<T>(value: T | T[] = []): T[] {
    return Array.isArray(value) ? value : [value]
}
