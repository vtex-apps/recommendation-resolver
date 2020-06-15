import { ClientsConfig, IOClients } from '@vtex/api'

import Recommendation from './recommendations'

const MEDIUM_TIMEOUT_MS = 2 * 1000

export class Clients extends IOClients {
  public get recommendations(): Recommendation {
    return this.getOrSet('recommendations', Recommendation)
  }
}

export const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: MEDIUM_TIMEOUT_MS,
    },
  },
}
