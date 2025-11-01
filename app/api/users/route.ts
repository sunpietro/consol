import { getServerSession } from "@ory/nextjs/app";
import { Configuration, IdentityApi } from "@ory/client-fetch";
import { NextRequest, NextResponse } from "next/server";

const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
  accessToken: process.env.ORY_PROJECT_API_TOKEN,
});

const identityApi = new IdentityApi(configuration);

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;
    const pageToken = searchParams.get("pageToken") || undefined;
    const credentialsIdentifier =
      searchParams.get("credentialsIdentifier") || undefined;

    const response = await identityApi.listIdentities({
      pageSize,
      pageToken,
      credentialsIdentifier,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching identities:", error);
    return NextResponse.json(
      { error: "Failed to fetch identities" },
      { status: 500 }
    );
  }
}
