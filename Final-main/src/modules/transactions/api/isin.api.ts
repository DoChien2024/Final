import type { Isin, IsinHolding } from '../types'
import { mockIsins, mockIsinHolding } from '../mock-data/isin'

export const fetchListIsin = async () => {
  return new Promise<{ data: Isin[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: mockIsins,
        }),
      500
    )
  )
}

export const fetchIsinHolding = async (isin?: string) => {
  return new Promise<{ data: IsinHolding[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: mockIsinHolding[isin as string] || [],
        }),
      500
    )
  )
}
