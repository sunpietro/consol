import { Verification } from "@ory/elements-react/theme";
import { getVerificationFlow, OryPageParams } from "@ory/nextjs/app";

import config from "@/ory.config";

const VerificationPage = async (props: OryPageParams) => {
  const flow = await getVerificationFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return (
    <Verification
      flow={flow}
      config={config}
      components={{
        Card: {
          Header: () => <div>Header</div>,
        },
      }}
    />
  );
};

export default VerificationPage;
