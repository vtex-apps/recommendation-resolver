import { IOContext, ExternalClient, InstanceOptions } from '@vtex/api'

class Recommendation extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.biggylabs.com.br/shelf-api/v1/', context, options)
  }

  public get = (input: RequestInput, store: string) => {
    return this.http.post<RecommendationResponse>(
      `${store}/recommendation`,
      input,
      {
        metric: 'get-recommendation',
      }
    )
  }
}

export default Recommendation
