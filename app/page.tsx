import { Container } from "@/components/Container/Container";
import { Identities } from "@/components/Identities/Identities";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import { TopNav } from "@/components/TopNav/TopNav";
import { ClientProviders } from "@/services/clientProviders";
import { SessionProvider } from "@ory/elements-react/client";
import { getServerSession } from "@ory/nextjs/app";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SessionProvider session={session}>
      <ClientProviders>
        <main className="flex flex-col gap-8">
          <Container>
            <TopNav />
          </Container>
          <PageHeader>
            <Container>
              <h1>Identities</h1>
            </Container>
          </PageHeader>
          <SectionHeader>
            <Container className="flex flex-nowrap justify-between">
              <h2 className="flex-1">Identity Data</h2>
              <p className="text-body-secondary flex-1 text-small">
                Identities are sets of data that describe humans that sign up on
                a website or an application, for example online store customers,
                file sharing service users, or company contractors signing up to
                use internal systems.
              </p>
            </Container>
          </SectionHeader>
          <Container>
            <Identities />
          </Container>
        </main>
      </ClientProviders>
    </SessionProvider>
  );
};

export default Home;
