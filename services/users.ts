import { Identity, Session } from "@ory/client";

export interface ListIdentitiesParams {
  pageSize?: number;
  pageToken?: string;
  credentialsIdentifier?: string;
}

export type IdentityWithSessions = Identity & { sessions?: Session[] };

export interface ListIdentitiesResponse {
  identities: IdentityWithSessions[];
  nextPageToken?: string;
}

/**
 * Parses the Link header to extract the page token for the next page
 * Format: </path?params>; rel="first", </path?params>; rel="next"
 */
const parseNextPageToken = (linkHeader: string | null): string | undefined => {
  if (!linkHeader) return undefined;

  const links = linkHeader.split(",").map((link) => link.trim());
  const nextLink = links.find((link) => link.includes('rel="next"'));

  if (!nextLink) return undefined;

  // Extract URL from <URL>; rel="next"
  const urlMatch = nextLink.match(/<([^>]+)>/);
  if (!urlMatch) return undefined;

  const url = urlMatch[1];
  const urlParams = new URLSearchParams(url.split("?")[1]);
  return urlParams.get("page_token") || undefined;
};

export const listIdentities = async (
  params?: ListIdentitiesParams
): Promise<ListIdentitiesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.pageToken) {
    searchParams.append("pageToken", params.pageToken);
  }
  if (params?.credentialsIdentifier) {
    searchParams.append("credentialsIdentifier", params.credentialsIdentifier);
  }

  const url = `/api/users${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch identities");
  }

  const linkHeader = response.headers.get("Link");
  const nextPageToken = parseNextPageToken(linkHeader);
  const identities: Identity[] = await response.json();

  const identitiesWithSessions: IdentityWithSessions[] = await Promise.all(
    identities.map(async (identity) => {
      const sessions = await getIdentitySessions(identity.id);
      return { ...identity, sessions };
    })
  );

  return {
    identities: identitiesWithSessions,
    nextPageToken,
  };
};

export const getIdentity = async (id: string): Promise<Identity> => {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch identity");
  }

  return response.json();
};

export const getIdentitySessions = async (id: string): Promise<Session[]> => {
  const response = await fetch(`/api/users/${id}/sessions`);

  if (!response.ok) {
    throw new Error("Failed to fetch identity sessions");
  }

  return response.json();
};
