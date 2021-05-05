import { Service, RecorderState, ParamsContext } from '@vtex/api'
import schema from 'vtex.recommendation-graphql/graphql'

import { schemaDirectives } from './directives'
import { Clients, clients } from './clients'
import {
  queries as recommendationsQueries,
  recommendationResolver as RecommendationResolver,
} from './resolvers/recommendations'

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  graphql: {
    resolvers: {
      Query: {
        ...recommendationsQueries,
      },
      Recommendation: RecommendationResolver,
    },
    schema,
    schemaDirectives,
  },
})
