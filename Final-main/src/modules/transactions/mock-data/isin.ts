import type { IsinHolding } from "../types";

export const mockIsins = [
  {
    isin: "ISIN19012026",
    securityName: "Vietnam Government Bond 2026",
    currency: "VND",
  },
  {
    isin: "ISIN20031025",
    securityName: "Corporate Bond Series A",
    currency: "USD",
  },
];

export const mockIsinHolding: Record<string, IsinHolding[]> = {
  ISIN19012026: [
    {
      clientName: "VIETNAM Official 9999 sos VNVC",
      organizationName: "VIETNAM Official",
      organizationNum: "PFL-0JSKBG438987V",
      subOrganizationName: "VIETNAM Official sub-org 9999",
      subOrganizationNum: "PFL-0JF2RAR548R1Y",
      subAccountNum: null,
      effectiveValueAmt: 100000.00,
      currency: "VND",
    },
    {
      clientName: "ABC Corporation",
      organizationName: "ABC Corp",
      organizationNum: "PFL-ABC123456789",
      subOrganizationName: "ABC Sub Org 1",
      subOrganizationNum: "PFL-SUB001",
      subAccountNum: "ACC-001",
      effectiveValueAmt: 150000.00,
      currency: "VND",
    },
    {
      clientName: "XYZ Holdings Ltd",
      organizationName: "XYZ Holdings",
      organizationNum: "PFL-XYZ987654321",
      subOrganizationName: "XYZ Sub Org A",
      subOrganizationNum: "PFL-SUBA",
      subAccountNum: null,
      effectiveValueAmt: 200000.00,
      currency: "VND",
    },
  ],
  ISIN20031025: [
    {
      clientName: "Global Investment Fund",
      organizationName: "Global Invest",
      organizationNum: "PFL-GLB111222333",
      subOrganizationName: "Global Sub 1",
      subOrganizationNum: "PFL-GLBSUB1",
      subAccountNum: "GIF-001",
      effectiveValueAmt: 250000.00,
      currency: "USD",
    },
    {
      clientName: "Pacific Trust Co",
      organizationName: "Pacific Trust",
      organizationNum: "PFL-PAC444555666",
      subOrganizationName: "Pacific Sub 2",
      subOrganizationNum: "PFL-PACSUB2",
      subAccountNum: null,
      effectiveValueAmt: 300000.00,
      currency: "USD",
    },
  ],
};