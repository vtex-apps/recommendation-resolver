const DEFAULT_SELLER = '1'
const DEFAULT_QUANTITY = 1

export const getBenefits = async (
  itemId: string,
  { clients: { checkout } }: Context
) => {
  const requestBody = {
    items: [
      {
        id: itemId,
        quantity: DEFAULT_QUANTITY,
        seller: DEFAULT_SELLER,
      },
    ],
  }
  const benefitsData = await checkout.simulation(requestBody)
  return benefitsData?.ratesAndBenefitsData?.teaser || []
}

export const getRateAndBenefitsIdentifiers = async (
  itemId: string,
  { clients: { checkout } }: Context,
  sellerId?: string,
) => {
  const requestBody = {
    items: [
      {
        id: itemId,
        quantity: DEFAULT_QUANTITY,
        seller: sellerId || DEFAULT_SELLER,
      },
    ],
  }
  const benefitsData = await checkout.simulation(requestBody)
  return benefitsData?.ratesAndBenefitsData?.rateAndBenefitsIdentifiers || []
}