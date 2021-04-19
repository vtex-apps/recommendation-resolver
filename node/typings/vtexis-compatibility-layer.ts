declare module 'vtexis-compatibility-layer' {
  export const convertISProduct: (
    product: Product,
    tradePolicy?: string | null
  ) => unknown

  export const mergeProductWithItems: (
    product: unknown,
    items: unknown[]
  ) => unknown
}
