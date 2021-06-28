/** Object to UnionString[keys] */
export type KeyOf<T extends Object> = keyof T

/** Object to UnionString[values] */
export type ValueOf<T extends Object> = T[keyof T]

/** Array[string] to UnionString[items] */
export type ItemOf<T extends readonly string[]> = T[number]