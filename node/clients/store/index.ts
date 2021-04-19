import { AppGraphQLClient, IOContext, InstanceOptions } from '@vtex/api'

import { itemsWithSimulation } from './queries'

export class Store extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.store-graphql@2.x', context, {
      ...options,
      headers: {
        ...options?.headers,
      },
    })
  }

  public itemsWithSimulation = (variables: any) => {
    return this.graphql.query<any, any>(
      {
        query: itemsWithSimulation,
        variables,
      },
      {
        metric: 'intelligent-search-items-with-simulation',
      }
    )
  }
}
