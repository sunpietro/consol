import { Container } from "@/components/Container/Container";
import { IdentityDetails } from "@/components/IdentityDetails/IdentityDetails";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { TopNav } from "@/components/TopNav/TopNav";
import { ClientProviders } from "@/services/clientProviders";
import { SessionProvider } from "@ory/elements-react/client";
import { getServerSession } from "@ory/nextjs/app";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
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
          <IdentityDetails id={id} />
        </main>
      </ClientProviders>
    </SessionProvider>
  );
};

export default Page;
