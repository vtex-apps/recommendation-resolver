import {
  convertISProduct,
  mergeProductWithItems,
} from 'vtexis-compatibility-layer'

import { Store } from '../clients/store'
import { buildFilter } from '../utils'

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

    const filter = await buildFilter(ctx)

    input.recommendation.filter = filter

    return recommendations.get(input, account)
  },
}

const fillProductWithSimulation = async (product: any, store: Store) => {
  const payload = {
    items: product.items.map((item: any) => ({
      itemId: item.itemId,
      sellers: item.sellers.map((seller: any) => ({
        sellerId: seller.sellerId,
      })),
    })),
  }

  const itemsWithSimulation = await store.itemsWithSimulation(payload)

  return mergeProductWithItems(
    product,
    itemsWithSimulation.data.itemsWithSimulation
  )
}

const convertProducts = (products: Product[], ctx: Context) => {
  const {
    vtex: { segment },
    clients: { store },
  } = ctx
  const tradePolicy = segment?.channel?.toString()

  return products
    .map(product => convertISProduct(product, tradePolicy))
    .map(product => fillProductWithSimulation(product, store))
}

export const recommendationResolver = {
  recommended: async (
    recommendation: Recommendation,
    _: unknown,
    ctx: Context
  ) => convertProducts(recommendation.recommended, ctx),
  base: async (recommendation: Recommendation, _: unknown, ctx: Context) =>
    convertProducts(recommendation.base, ctx),
}
