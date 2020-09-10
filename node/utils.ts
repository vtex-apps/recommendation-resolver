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
    const id = baseUrlImageRegex.test(image.value)
      ? baseUrlImageRegex.exec(image.value)![1]
      : undefined
    id
      ? images.push({
          imageId: id,
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

export const resolveSKU = (product: Product, sku: SKU) => {
  const commertialOffer = buildCommertialOffer(
    product.price,
    product.oldPrice,
    product.installment,
    product.tax
  )
  const sellers = [
    {
      sellerId: '1',
      sellerName: '',
      addToCartLink: '',
      sellerDefault: false,
      commertialOffer,
    },
  ]
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
