import { Service, RecorderState, ParamsContext } from '@vtex/api'
import schema from 'vtex.recommendation-graphql/graphql'

import { Clients, clients } from './clients'
import { queries as recommendationsQueries } from './resolvers/recommendations'

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  graphql: {
    resolvers: {
      Query: {
        ...recommendationsQueries,
      },
    },
    schema,
  },
})
