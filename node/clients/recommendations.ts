import { IOContext, ExternalClient, InstanceOptions } from '@vtex/api'

class Recommendation extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.biggylabs.com.br/rec-api/v1/', context, options)
  }

  public get = (input: RecommendationInput) => {
    const {
      store,
      strategy,
      user,
      anonymousUser,
      products,
      categories,
      userNavigationInfo,
      secondaryStrategy,
      settings,
    } = input

    return this.http.post<APIBasedRecommendation[]>(
      `${store}/io/ondemand/${strategy}`,
      {
        user,
        anonymousUser,
        products,
        categories,
        userNavigationInfo,
        secondaryStrategy,
        ...settings,
      },
      {
        metric: 'get-recommendation',
      }
    )
  }
}

export default Recommendation
