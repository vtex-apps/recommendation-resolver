import { ClientsConfig, IOClients } from '@vtex/api'

import Recommendation from './recommendations'
import Checkout from './checkout'
import { Store } from './store'

const MEDIUM_TIMEOUT_MS = 2 * 1000

export class Clients extends IOClients {
  public get recommendations(): Recommendation {
    return this.getOrSet('recommendations', Recommendation)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get store() {
    return this.getOrSet('stoer', Store)
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
