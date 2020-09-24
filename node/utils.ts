const buildCommertialOffer = (
  price: number,
  oldPrice: number,
  installment?: Installment,
  tax?: number
  // eslint-disable-next-line max-params
) => {
  const installments = installment
    ? [
        {
          Value: installment.value,
          InterestRate: 0,
          TotalValuePlusInterestRate: price,
          NumberOfInstallments: installment.count,
          Name: '',
        },
      ]
    : []

  return {
    AvailableQuantity: 10000,
    discountHighlights: [],
    teasers: [],
    Installments: installments,
    Price: price,
    ListPrice: oldPrice,
    PriceWithoutDiscount: price,
    Tax: tax ?? 0,
    taxPercentage: (tax ?? 0) / price,
  }
}

const baseUrlImageRegex = new RegExp(/.+ids\/(\d+)/)

const buildImages = (productImages: Image[]) => {
  const images: VTEXImage[] = []

  productImages.forEach(image => {
    const imageId = baseUrlImageRegex.test(image.value)
      ? baseUrlImageRegex.exec(image.value)![1]
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

  return sellers.map((seller: any) => {
    const price = seller.price ?? product.price
    const oldPrice = seller.oldPrice ?? product.oldPrice
    const installment = seller.installment ?? product.installment

    return {
      sellerId: seller.id,
      sellerName: '',
      commertialOffer: buildCommertialOffer(
        price,
        oldPrice,
        installment,
        product.tax
      ),
      addToCartLink: '',
      sellerDefault: false,
    }
  })
}

export const resolveSKU = (
  product: Product,
  sku: SKU,
  tradePolicy?: string
) => {
  const sellers = getSellers(product, sku, tradePolicy)

  const item = {
    name: product.name,
    nameComplete: product.name,
    complementName: product.name,
    ean: '',
    images: buildImages(product.images),
    itemId: sku.id,
    measurementUnit: product.measurementUnit,
    referenceId: [{ Key: 'RefId', Value: sku.reference }],
    sellers,
    unitMultiplier: product.unitMultiplier,
    variations: buildVariations(sku),
  }
  return item
}

const getSKUSpecifications = (product: Product): string[] => {
  const skuSpecs = product.skus
    .map(sku => sku.attributes.map(attribute => attribute.key))
    .reduce((acc, val) => acc.concat(val), [])
  const uniqueSpecifications = new Set(skuSpecs)
  return [...uniqueSpecifications]
}

export const resolveSpecificationGroups = (product: Product) => {
  const specifications = product.specificationGroups
    ? JSON.parse(product.specificationGroups)
    : {}
  const allSpecifications = (product.productSpecifications ?? []).concat(
    getSKUSpecifications(product)
  )

  const specificationGroups: Record<string, string[]> = {
    allSpecifications,
  }

  let allSpecificationsGroups = Object.keys(specifications)

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

  return allSpecificationsGroups.map((groupName: string) => ({
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
  }))
}
