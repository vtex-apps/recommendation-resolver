import {
  InstanceOptions,
  IOContext,
  JanusClient,
  RequestConfig,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from '@vtex/api'
import { AxiosError } from 'axios'

class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
      },
    })
  }

  private getChannelQueryString = (tradePolicy?: string) => {
    const { segment } = this.context as CustomIOContext
    const channel = segment?.channel
    const selectedTradePolicy = tradePolicy ?? channel ?? ''
    return selectedTradePolicy ? `?sc=${selectedTradePolicy}` : ''
  }

  public simulation = (simulation: SimulationPayload, tradePolicy?: string) =>
    this.post<OrderForm>(
      `/api/checkout/pub/orderForms/simulation${this.getChannelQueryString(
        tradePolicy
      )}`,
      simulation,
      {
        metric: 'checkout-simulation',
      }
    )

  protected post = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    return this.http.post<T>(url, data, config).catch(statusToError) as Promise<
      T
    >
  }
}

function statusToError(e: any) {
  if (!e.response) {
    throw e
  }

  const { response } = e as AxiosError
  const { status } = response!

  if (status === 401) {
    throw new AuthenticationError(e)
  }
  if (status === 403) {
    throw new ForbiddenError(e)
  }
  if (status === 400) {
    throw new UserInputError(e)
  }

  throw e
}

export default Checkout
