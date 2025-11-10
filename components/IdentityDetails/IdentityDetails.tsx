"use client";

import { Container } from "@/components/Container/Container";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { formatDate } from "@/helpers/date";
import { useIdentity, useIdentitySessions } from "@/hooks/identities";

export const IdentityDetails = ({ id }: { id: string }) => {
  const { data: identity } = useIdentity(id);
  const { data: sessions } = useIdentitySessions(id);

  if (!identity || !sessions) {
    return <Container>Loading...</Container>;
  }

  console.log({ identity, sessions });

  return (
    <>
      <PageHeader>
        <Container>
          <h1>{identity.traits["email"]}</h1>
          <h2 className="text-link font-normal! text-small">
            Identity data / {id}
          </h2>
        </Container>
      </PageHeader>
      <Container className="flex flex-col gap-8">
        <SectionHeader>
          <h2>Profile</h2>
        </SectionHeader>
        <div className="flex flex-col gap-8">
          <div className="flex gap-4">
            <div className="flex-1/3 rounded border border-accent px-6 py-4 text-small flex flex-col gap-2">
              <span className="text-body-secondary">Created at</span>
              <span>{formatDate(identity?.created_at || "")}</span>
            </div>
            <div className="flex-1/3 rounded border border-accent px-6 py-4 text-small flex flex-col gap-2">
              <span className="text-body-secondary">Last login</span>
              <span>{formatDate(sessions[0]?.authenticated_at || "")}</span>
            </div>
            <div className="flex-1/3 rounded border border-accent px-6 py-4 text-small flex flex-col gap-2">
              <span className="text-body-secondary">Sessions</span>
              <span>{sessions ? sessions.length : 0}</span>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
