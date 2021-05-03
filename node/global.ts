import {
  IOContext,
  ParamsContext,
  RecorderState,
  ServiceContext,
  SegmentData,
} from '@vtex/api'

import { Clients } from './clients/index'

declare global {
  type Context = ServiceContext<Clients, RecorderState, CustomContext>

  interface CustomContext extends ParamsContext {
    vtex: CustomIOContext
  }
  interface CustomIOContext extends IOContext {
    segment?: SegmentData
  }

  interface SortOption {
    field: string
    desc: boolean
  }

  interface Filter {
    field: string
    condition: string
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
      filter: Filter[]
      sort: SortOption[]
    }
  }

  interface Seller {
    name: string
    tax: number
    id: string
    sellerId: string
    installment?: Installment
    teasers: Teaser[]
    price?: number
    oldPrice?: number
    stock?: number
    default?: boolean
  }

  interface Teaser {
    name: string
    conditions: TeaserCondition
    effects: TeaserEffects
  }

  interface TeaserCondition {
    minimumQuantity: number
    parameters: [TeaserValue]
  }

  interface TeaserEffects {
    parameters: [TeaserValue]
  }

  interface TeaserValue {
    name: string
    value: string
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
    ean: string
    images: Image[]
    videos: any[]
    name?: string
    nameComplete?: string
    complementName: string
    price?: number
    oldPrice?: number
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
    paymentName?: string
    paymentGroupName?: string
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

  interface TextAttribute {
    labelKey: string
    labelValue: string
    key: string
    value: string
    valueId?: string
    isSku: boolean
    joinedKey?: string
    joinedValue?: string
  }

  interface Product {
    name: string
    id: string
    product?: string
    url: string
    link: string
    description: string
    reference?: string
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
    textAttributes?: TextAttribute[]
    numberAttributes?: TextAttribute[]
    clusterHighlights: Record<string, string>
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

  interface Region {
    id: string
    sellers: Array<{
      id: string
      name: string
    }>
  }

  interface SearchImage {
    imageId: string
    imageLabel: string | null
    imageTag: string
    imageUrl: string
    imageText: string
  }

  interface SearchItem {
    itemId: string
    name: string
    nameComplete: string
    complementName: string
    ean: string
    referenceId: Array<{ Key: string; Value: string }>
    measurementUnit: string
    unitMultiplier: number
    modalType: any | null
    images: SearchImage[]
    Videos: string[]
    variations: string[]
    sellers: Seller[]
    attachments: Array<{
      id: number
      name: string
      required: boolean
      domainValues: string
    }>
    isKit: boolean
    kitItems?: Array<{
      itemId: string
      amount: number
    }>
  }

  interface SearchProduct {
    productId: string
    productName: string
    brand: string
    brandId: number
    linkText: string
    productReference: string
    categoryId: string
    productTitle: string
    metaTagDescription: string
    clusterHighlights: Record<string, string>
    productClusters: Record<string, string>
    searchableClusters: Record<string, string>
    categories: string[]
    categoriesIds: string[]
    link: string
    description: string
    items: SearchItem[]
    itemMetadata: {
      items: SearchMetadataItem[]
    }
    titleTag: string
    Specifications?: string[]
    allSpecifications?: string[]
    allSpecificationsGroups?: string[]
    completeSpecifications?: CompleteSpecification[]
    skuSpecifications?: SkuSpecification[]
  }

  interface SearchMetadataItem {
    Name: string
    NameComplete: string
    MainImage: string
    BrandName: string
    CategoryId: number
    ProductId: number
    id: string
    seller: string
    assemblyOptions: AssemblyOption[]
  }

  interface AssemblyOption {
    id: string
    name: string
    composition: Composition | null
    inputValues: InputValues
  }

  interface Composition {
    minQuantity: number
    maxQuantity: number
    items: CompositionItem[]
  }

  interface CompositionItem {
    id: string
    minQuantity: number
    maxQuantity: number
    initialQuantity: number
    priceTable: string
    seller: string
  }

  interface InputValues {
    [key: string]: RawInputValue
  }

  interface RawInputValue {
    maximumNumberOfCharacters: number
    domain: string[]
  }

  interface CompleteSpecification {
    Values: Array<{
      Id: string
      Position: number
      Value: string
    }>
    Name: string
    Position: number
    IsOnProductDetails: boolean
    FieldId: string
  }

  interface SkuSpecification {
    field: SKUSpecificationField
    values: SKUSpecificationValue[]
  }

  interface SKUSpecificationField {
    name: string
    originalName?: string
    id?: string
  }

  interface SKUSpecificationValue {
    name: string
    id?: string
    fieldId?: string
    originalName?: string
  }
}
