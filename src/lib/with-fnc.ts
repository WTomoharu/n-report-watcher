export function create(before: () => void, after: () => void): WithFnc {
  return ((value: unknown) => {
    before()
    return (value instanceof Function ? value((async () => { })()) : value)
      .finally(() => { after() })
  }) as any
}

export interface WithFnc {
  <T = unknown>(
    value: ((promise: Promise<void>) => Promise<T>) | Promise<T>
  ): Promise<T>
}

export class WithFnc {
  constructor(before: () => void, after: () => void) {
    return create(before, after)
  }
}
