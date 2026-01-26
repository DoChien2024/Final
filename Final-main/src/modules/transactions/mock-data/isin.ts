import type { IsinHolding } from "./types";

export const mockIsins = [
  {
    isin: "ISIN1",
    securityName: "Security 1",
    currency: "EUR",
  },
  {
    isin: "ISIN2",
    securityName: "Security 2",
    currency: "USD",
  },
];

export const mockIsinHolding: Record<string, IsinHolding[]> = {
  ISIN1: [
    {
      organizationName: "Org A",
      subOrganizationName: "Sub Org A1",
      effectiveValueAmt: "100000.00",
    },
    {
      organizationName: "Org A",
      subOrganizationName: "Sub Org A2",
      effectiveValueAmt: "150000.00",
    },
    {
      organizationName: "Org A",
      subOrganizationName: "Sub Org A3",
      effectiveValueAmt: "200000.00",
    },
  ],
  ISIN2: [
    {
      organizationName: "Org B",
      subOrganizationName: "Sub Org B1",
      effectiveValueAmt: "250000.00",
    },
    {
      organizationName: "Org B",
      subOrganizationName: "Sub Org B2",
      effectiveValueAmt: "300000.00",
    },
  ],
};