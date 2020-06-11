import { restructure } from '../utils/index'

export const queries = {
  recommendation: async (
    _: unknown,
    input: RecommendationInput,
    ctx: Context
  ) => {
    const {
      clients: { recommendations },
    } = ctx

    const result = await recommendations.get(input)

    for (const recommendation of result) {
      if (recommendation.baseItems) {
        recommendation.baseItems.map(item => restructure(item))
      }

      if (recommendation.recommendationItems) {
        recommendation.recommendationItems.map(item => restructure(item))
      }
    }
    return result
  },
}
