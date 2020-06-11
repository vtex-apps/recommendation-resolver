import { ServiceContext } from '@vtex/api'

import { Clients } from './clients/index'

declare global {
  type Context = ServiceContext<Clients>

  interface PaidNavigationFilter {
    filterBingAds: boolean
    filterGoogleAds: boolean
    categories: string[]
  }

  interface UserNavigationInfo {
    google: boolean
    bing: boolean
  }

  interface StoreFrontSettings {
    minProducts?: number
    maxProducts?: number
    paidNavigationFilter?: PaidNavigationFilter
  }

  interface RecommendationInput {
    store: string
    strategy: string
    secondaryStrategy?: string
    user?: string
    anonymousUser?: string
    products?: string[]
    categories?: string[]
    userNavigationInfo?: UserNavigationInfo
    settings?: StoreFrontSettings
  }

  interface Category {
    name: string
    parent: string
    originalId: string
    ancestors: string[]
  }

  type KeyValueDict = { [key: string]: string }
  type KeyValueArray = Array<{ key: string; value: string }>
  type KeyValuePair = KeyValueArray | KeyValueDict

  interface ProductSpec {
    id: string
    label: string
    type: string
    offerId: string
    subSpecs: ProductSpec[]
    images: KeyValuePair
  }

  interface ProductRecommendationOffer {
    offerId: string
    originalProductId: string
    sku: string
    distributionCenter: string
    name: string
    description: string
    url: string
    imageUrl: string
    secondaryImageUrl: string
    price: string
    oldPrice: string
    currencySymbol: string
    hasDiscount: boolean
    discountPercentage: number
    brand: string
    score: number
    specs: ProductSpec[]
    categories: Category[]
    extraInfo: KeyValuePair
    installment: KeyValuePair
    imageUrlMap: KeyValuePair
  }

  interface ProductRecommendation {
    productId: string
    score: number
    offers: ProductRecommendationOffer[]
    specs: ProductSpec[]
  }

  interface APIBasedRecommendation {
    baseIds: string[]
    baseItems: ProductRecommendation[]
    recommendationIds: string[]
    recommendationItems: ProductRecommendation[]
  }
}
