interface CommertialOfferProps {
  price: number
  oldPrice: number
  stock: number
  teasers: Teaser[]
  installment?: Installment
  tax?: number
}

interface Property {
  name: string
  originalName: string
  values: string[]
}

interface SpecificationGroup {
  name: string
  originalName: string
  specifications: Property[]
}

interface SpecificationFields {
  properties: Property[]
  specificationGroups: SpecificationGroup[]
}

const buildCommertialOffer = ({
  price,
  oldPrice,
  stock,
  teasers,
  installment,
  tax,
}: CommertialOfferProps) => {
  const installments = installment
    ? [
        {
          Value: installment.value,
          InterestRate: 0,
          TotalValuePlusInterestRate: price,
          NumberOfInstallments: installment.count,
          Name: '',
          PaymentSystemName: installment.paymentName ?? '',
          PaymentSystemGroupName: installment.paymentGroupName ?? '',
        },
      ]
    : []

  const availableQuantity = stock && stock > 0 ? 10000 : 0
  const spotPrice =
    installments.find(({ NumberOfInstallments, Value }) => {
      return NumberOfInstallments === 1 && Value < price
    })?.Value ?? price

  return {
    AvailableQuantity: availableQuantity,
    discountHighlights: [],
    Installments: installments,
    Price: price,
    ListPrice: oldPrice,
    PriceWithoutDiscount: oldPrice,
    Tax: tax ?? 0,
    taxPercentage: (tax ?? 0) / price,
    teasers,
    spotPrice,
    giftSkuIds: [],
  }
}

const baseUrlImageRegex = new RegExp(/.+ids\/(\d+)/)

const buildImages = (productImages: Image[]) => {
  const images: VTEXImage[] = []

  productImages.forEach(image => {
    const imageId = baseUrlImageRegex.test(image.value)
      ? baseUrlImageRegex.exec(image.value)?.[1]
      : undefined

    imageId
      ? images.push({
          imageId,
          imageTag: '',
          imageLabel: image.name,
          imageText: image.name,
          imageUrl: image.value,
        })
      : []
  })

  return images
}

const buildVariations = (sku: SKU) => {
  const variations = sku.attributes.map(attribute => attribute.key)
  const item: Record<string, string[]> = {}
  variations.forEach(variation => {
    const attribute = sku.attributes.find(attr => attr.key === variation)
    item[variation] = attribute != null ? [attribute.value] : []
  })
  return (variations || []).map(variationName => {
    const variationValues = item[variationName]
    return {
      name: variationName,
      values: variationValues,
    }
  })
}

const getSellers = (product: Product, sku: SKU, tradePolicy?: string) => {
  const selectedPolicy = tradePolicy
    ? sku.policies.find((policy: Policy) => policy.id === tradePolicy)
    : sku.policies[0]

  const sellers = selectedPolicy?.sellers ?? []

  return sellers.map((seller: Seller) => {
    const price = seller.price ?? sku.price ?? product.price
    const oldPrice = seller.oldPrice ?? sku.oldPrice ?? product.oldPrice
    const installment = seller.installment ?? product.installment
    const stock = seller.stock ?? product.stock
    const teasers = seller.teasers ?? []

    return {
      sellerId: seller.id,
      sellerName: seller.name,
      addToCartLink: '',
      sellerDefault: seller.default ?? false,
      commertialOffer: buildCommertialOffer({
        price,
        oldPrice,
        stock,
        teasers,
        installment,
        tax: seller.tax ?? product.tax,
      }),
    }
  })
}

const getSKUSpecifications = (product: Product): string[] => {
  const skuSpecs = product.skus
    .map(sku => sku.attributes.map(attribute => attribute.key))
    .reduce((acc, val) => acc.concat(val), [])
  const uniqueSpecifications = new Set(skuSpecs)
  return [...uniqueSpecifications]
}

export const resolveSKU = (
  product: Product,
  sku: SKU,
  tradePolicy?: string
) => {
  const sellers = getSellers(product, sku, tradePolicy)

  const item = {
    itemId: sku.id,
    name: sku.name ?? product.name,
    nameComplete: sku.nameComplete ?? product.name,
    complementName: product.name,
    ean: sku.ean,
    measurementUnit: product.measurementUnit,
    unitMultiplier: product.unitMultiplier,
    referenceId: [{ Key: 'RefId', Value: sku.reference }],
    images: buildImages(sku.images ?? product.images),
    videos: sku.videos,
    sellers,
    variations: buildVariations(sku),
  }
  return item
}

export const resolveSpecificationFields = (() => {
  let memo: [Product, SpecificationFields] | null = null
  return (product: Product) => {
    if (memo !== null && memo[0] === product) {
      return memo[1]
    }

    const specifications = product.specificationGroups
      ? JSON.parse(product.specificationGroups)
      : {}

    let allSpecificationsGroups = Object.keys(specifications)

    const allSpecifications = (product.productSpecifications ?? []).concat(
      getSKUSpecifications(product)
    )

    const specificationGroups: Record<string, string[]> = {
      allSpecifications,
    }

    if (product.textAttributes) {
      allSpecifications.forEach(specification => {
        const attributes =
          product.textAttributes?.filter(
            attribute => attribute.labelKey === specification
          ) ?? []
        specificationGroups[specification] = attributes.map(
          attribute => attribute.labelValue
        )
      })
    }

    allSpecificationsGroups.forEach(
      specification =>
        (specificationGroups[specification] = specifications[specification])
    )

    allSpecificationsGroups = allSpecificationsGroups.concat([
      'allSpecifications',
    ])

    const allSpecificationGroups = allSpecificationsGroups.map(
      (groupName: string) => ({
        originalName: groupName,
        name: groupName,
        specifications: (specificationGroups[groupName] ?? []).map(
          (name: string) => {
            const values = specificationGroups[name] ?? []
            return {
              originalName: name,
              name,
              values,
            }
          }
        ),
      })
    )

    const properties = allSpecifications.map((name: string) => {
      const values = specificationGroups[name]
      return {
        name,
        originalName: name,
        values,
      }
    })

    memo = [
      product,
      {
        specificationGroups: allSpecificationGroups,
        properties,
      },
    ]

    return memo[1]
  }
})()

const getSpecificationsByAttributes = (attributes: TextAttribute[]) => {
  const specificationsByKey = attributes.reduce(
    (specsByKey: { [key: string]: TextAttribute[] }, spec) => {
      // the joinedKey has the format text@@@key@@@labelKey@@@originalKey@@@originalLabelKey
      const value = spec.joinedKey?.split('@@@')[3] ?? spec.labelKey
      specsByKey[value] = (specsByKey[value] || []).concat(spec)

      return specsByKey
    },
    {}
  )

  const specKeys = Object.keys(specificationsByKey)

  const specifications = specKeys.map(key => {
    const originalFieldName =
      specificationsByKey[key][0].joinedKey?.split('@@@')[4] ??
      specificationsByKey[key][0].labelKey

    return {
      field: {
        name: specificationsByKey[key][0].labelKey,
        originalName: originalFieldName,
      },
      values: specificationsByKey[key].map(specification => {
        return {
          name: specification.labelValue ?? specification.value,
          originalName:
            specification.joinedValue?.split('@@@')[1] ?? specification.value,
        }
      }),
    }
  })

  return specifications
}

export const resolveSkuSpecifications = (product: Product) => {
  const specificationAttributes = product.textAttributes?.filter(
    attribute => attribute.isSku
  )
  const textSpecifications = getSpecificationsByAttributes(
    specificationAttributes ?? []
  )

  const numberAttributes = (product.numberAttributes ?? []).filter(
    attribute => attribute.key !== 'price'
  )
  const numberSpecifications = getSpecificationsByAttributes(numberAttributes)

  return textSpecifications.concat(numberSpecifications)
}

export const objToNameValue = (
  keyName: string,
  valueName: string,
  record: Record<string, string> | null | undefined
) => {
  if (!record) {
    return []
  }
  return Object.keys(record).reduce((acc, key) => {
    const value = record[key]
    acc.push({ [keyName]: key, [valueName]: value })
    return acc
  }, [] as Array<Record<string, string>>)
}
