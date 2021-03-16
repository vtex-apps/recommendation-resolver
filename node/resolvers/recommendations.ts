import {
  resolveSkuSpecifications,
  resolveSpecificationFields,
  resolveSKU,
  objToNameValue,
} from '../utils'
import { getBenefits } from './benefits'

export const queries = {
  recommendation: async (
    _: unknown,
    { input }: { input: RequestInput },
    ctx: Context
  ) => {
    const {
      clients: { recommendations },
      vtex: { account },
    } = ctx

    return recommendations.get(input, account)
  },
}

export const fieldResolvers = {
  brand: ({ brand }: Product) => brand,
  brandId: ({ brandId }: Product) => (brandId ? Number(brandId) : -1),
  benefits: ({ id }: Product, _: unknown, ctx: Context) => getBenefits(id, ctx),
  cacheId: ({ id }: Product) => `sp-${id}`,
  categories: ({ categories }: Product) => categories,
  categoriesIds: ({ categoryIds }: Product) => categoryIds,
  clusterHighlights: ({ clusterHighlights = {} }: Product) =>
    objToNameValue('id', 'name', clusterHighlights),
  description: ({ description }: Product) => description,
  items: async (product: Product, _: unknown, ctx: Context) => {
    const {
      vtex: { segment },
    } = ctx
    const tradePolicy = segment?.channel?.toString()

    return (product.skus || []).map(sku =>
      resolveSKU(product, sku, tradePolicy)
    )
  },
  link: ({ url }: Product) => url,
  linkText: ({ link }: Product) => link,
  metaTagDescription: () => '',
  priceRange: (product: Product) => {
    const listPrice = {
      highPrice: product.oldPrice,
      lowPrice: product.oldPrice,
    }
    const sellingPrice = { highPrice: product.price, lowPrice: product.price }
    return { listPrice, sellingPrice }
  },
  productClusters: ({ textAttributes }: Product) => {
    const productClusters: Array<Record<string, string>> = []
    textAttributes
      ?.filter(attribute => attribute.labelKey === 'productClusterNames')
      .forEach(attribute => {
        if (attribute.valueId) {
          productClusters.push({
            id: attribute.valueId,
            name: attribute.labelValue,
          })
        }
      })
    return productClusters
  },
  productId: ({ id }: Product) => id,
  productName: ({ name }: Product) => name,
  productReference: (product: Product) =>
    product.reference ?? product.product ?? product.id,
  properties: (product: Product) => {
    const { properties } = resolveSpecificationFields(product)
    return properties
  },
  skuSpecifications: (product: Product) => resolveSkuSpecifications(product),
  specificationGroups: (product: Product) => {
    const { specificationGroups } = resolveSpecificationFields(product)
    return specificationGroups
  },
  titleTag: ({ name }: Product) => name ?? '',
}
