export const queries = {
  recommendation: async (_: unknown, input: RequestInput, ctx: Context) => {
    const {
      clients: { recommendations },
      vtex: { account },
    } = ctx

    return recommendations.get(input, account)
  },
}
