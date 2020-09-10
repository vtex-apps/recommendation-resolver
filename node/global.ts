import { ServiceContext } from '@vtex/api'

import { Clients } from './clients/index'

declare global {
  type Context = ServiceContext<Clients>

  interface SortOption {
    field: string
    desc: boolean
  }

  interface Filter {
    name: string
    mode: string
    value: string
  }

  enum RequestInputType {
    USER = 'USER',
    CATEGORY = 'CATEGORY',
    PRODUCT = 'PRODUCT',
    TAG_GROUP = 'TAG_GROUP',
    CAMPAIGN = 'CAMPAIGN',
    GROUP = 'GROUP',
    ANONYMOUS_USER = 'ANONYMOUS_USER',
    BRAND = 'BRAND',
    STORE = 'STORE',
  }

  enum StrategyType {
    BEST_SELLERS = 'BEST_SELLERS',
    MOST_POPULAR = 'MOST_POPULAR',
    PRICE_REDUCTION = 'PRICE_REDUCTION',
    NEW_RELEASES = 'NEW_RELEASES',
    NAVIGATION_HISTORY = 'NAVIGATION_HISTORY',
    RECOMMENDATION_HISTORY = 'RECOMMENDATION_HISTORY',
    SIMILAR_PRODUCTS = 'SIMILAR_PRODUCTS',
    BEST_CHOICE = 'BEST_CHOICE',
    BOUGHT_TOGETHER = 'BOUGHT_TOGETHER',
    CART_HISTORY = 'CART_HISTORY',
    ORDER_HISTORY = 'ORDER_HISTORY',
  }

  interface RequestInput {
    sessionId: string
    strategy: StrategyType
    input: {
      type: {
        primary: RequestInputType
      }
      values: string[]
    }
    recommendation: {
      count: {
        minimum: number
        recommendations: number
      }
    }
    sort: SortOption[]
    filter: Filter[]
  }

  interface Seller {
    name: string
    tax: number
    id: string
  }

  interface Policy {
    id: string
    sellers: Seller[]
  }

  interface Attribute {
    key: string
    value: string
  }

  interface SKU {
    reference: string
    policies: Policy[]
    attributes: Attribute[]
    id: string
    sellers: Seller[]
  }

  interface ExtraData {
    value: string
    key: string
  }

  interface Image {
    name: string
    value: string
  }

  interface Installment {
    interest: boolean
    count: number
    value: number
  }

  interface Boost {
    newness: number
    image: number
    revenue: number
    discount: number
    click: number
    availableSpecsCount: number
    promotion: number
    order: number
  }

  interface Product {
    name: string
    id: string
    product: string
    url: string
    link: string
    description: string
    reference: string
    price: number
    oldPrice: number
    skus: SKU[]
    year: number
    brand: string
    brandId: string
    extraData: ExtraData[]
    installment: Installment
    measurementUnit: string
    unitMultiplier: number
    tax: number
    categories: string[]
    stock: number
    images: Image[]
    productSpecifications: string[]
    categoryIds: string[]
    boost: Boost
    specificationGroups: string
  }

  interface Recommendation {
    base: Product[]
    recommended: Product[]
  }

  interface RecommendationResponse {
    variantId: string
    response: {
      recommendations: Recommendation[]
    }
  }

  interface VTEXImage {
    imageId: string
    imageLabel: string
    imageTag: string
    imageUrl: string
    imageText: string
  }
}
