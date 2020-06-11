// eslint-disable-next-line @typescript-eslint/no-explicit-any
const restructureField = (field: string, object: any) => {
  if (!object[field]) return

  const tmp: KeyValueArray = []

  for (const key of Object.keys(object[field])) {
    tmp.push({
      key,
      value: object[field][key],
    })
  }

  object[field] = tmp
}

export const restructure = (item: ProductRecommendation) => {
  if (item.offers) {
    for (const offer of item.offers) {
      restructureField('extraInfo', offer)
      restructureField('installment', offer)
      restructureField('imageUrlMap', offer)
    }
  }
  return item
}
