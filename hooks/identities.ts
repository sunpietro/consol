import { useQuery } from "@tanstack/react-query";
import {
  listIdentities,
  getIdentity,
  ListIdentitiesParams,
  getIdentitySessions,
} from "@/services/users";
import { Identity } from "@ory/client";

export const useIdentities = (params?: ListIdentitiesParams) => {
  return useQuery({
    queryKey: ["identities", params],
    queryFn: () => listIdentities(params),
  });
};

export const useIdentity = (id: string) => {
  return useQuery<Identity>({
    queryKey: ["identity", id],
    queryFn: () => getIdentity(id),
  });
};

export const useIdentitySessions = (id: string) => {
  return useQuery<any>({
    queryKey: ["identitySessions", id],
    queryFn: () => getIdentitySessions(id),
  });
};
