import type { SubOrganization } from "./types";

export const mockOrgs = [
  {
    id: "org1",
    name: "Organization 1",
    shortName: "Org 1",
    countryCode: "US",
  },
  {
    id: "org2",
    name: "Organization 2",
    shortName: "Org 2",
    countryCode: "UK",
  },
  {
    id: "org3",
    name: "Organization 3",
    shortName: "Org 3",
    countryCode: "CA",
  },
];

export const mockSubOrgs: Record<string, SubOrganization[]> = {
  org1: [
    {
      name: "Sub Organization 1-1",
      orgId: "org1",
      subOrgId: "suborg1",
      description: "Description for Sub Organization 1-1",
    },
    {
      name: "Sub Organization 1-2",
      orgId: "org1",
      subOrgId: "suborg2",
      description: "Description for Sub Organization 1-2",
    },
  ],
  org2: [
    {
      name: "Sub Organization 2-1",
      orgId: "org2",
      subOrgId: "suborg1",
      description: "Description for Sub Organization 2-1",
    },
  ],
  org3: [
    {
      name: "Sub Organization 3-1",
      orgId: "org3",
      subOrgId: "suborg1",
      description: "Description for Sub Organization 3-1",
    },
    {
      name: "Sub Organization 3-2",
      orgId: "org3",
      subOrgId: "suborg2",
      description: "Description for Sub Organization 3-2",
    },
    {
      name: "Sub Organization 3-3",
      orgId: "org3",
      subOrgId: "suborg3",
      description: "Description for Sub Organization 3-3",
    },
  ],
};