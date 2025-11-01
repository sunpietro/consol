import Link from "next/link";
import { getLogoutFlow, getServerSession } from "@ory/nextjs/app";
// import { useSession } from "@ory/elements-react/client";

export const TopNav = async () => {
  const session = await getServerSession();
  const logoutFlow = await getLogoutFlow({});
  const traits = session?.identity?.traits as {
    email: string;
    username: string;
    phone: string;
  };

  console.log({ traits, session });

  return (
    <header className="py-6">
      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        {session ? <Link href={logoutFlow.logout_url}>Log out</Link> : null}
        {!session ? (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/registration">Register</Link>
          </>
        ) : null}
      </nav>
    </header>
  );
};
