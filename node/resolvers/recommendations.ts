import { resolveSKU } from '../utils'

export const queries = {
  recommendation: async (_: unknown, input: RequestInput, ctx: Context) => {
    const {
      clients: { recommendations },
      vtex: { account },
    } = ctx

    return recommendations.get(input, account)
  },
}

export const fieldResolvers = {
  brand: (product: Product) => product.brand,
  brandId: (product: Product) =>
    product.brandId ? Number(product.brandId) : -1,
  cacheId: (product: Product) => `sp-${product.id}`,
  categories: (product: Product) => product.categories,
  categoriesIds: (product: Product) => product.categoryIds,
  description: (product: Product) => product.description,
  items: (product: Product) =>
    (product.skus || []).map(sku => resolveSKU(product, sku)),
  link: (product: Product) => product.link,
  linkText: (product: Product) => product.link,
  priceRange: (product: Product) => {
    const listPrice = {
      highPrice: product.oldPrice,
      lowPrice: product.oldPrice,
    }
    const sellingPrice = { highPrice: product.price, lowPrice: product.price }
    return { listPrice, sellingPrice }
  },
  productId: (product: Product) => product.id,
  productName: (product: Product) => product.name,
  productReference: (product: Product) => product.reference || product.id,
  properties: (product: Product) => product.productSpecifications,
  specificationGroups: (product: Product) =>
    product.specificationGroups ? JSON.parse(product.specificationGroups) : {},
}
