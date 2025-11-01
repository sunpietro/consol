import { getServerSession } from "@ory/nextjs/app";
import { Configuration, IdentityApi } from "@ory/client-fetch";
import { NextRequest, NextResponse } from "next/server";

const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
  accessToken: process.env.ORY_PROJECT_API_TOKEN,
});

const identityApi = new IdentityApi(configuration);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const response = await identityApi.getIdentity({ id });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching identity:", error);
    return NextResponse.json(
      { error: "Failed to fetch identity" },
      { status: 500 }
    );
  }
}
