import { Recovery } from "@ory/elements-react/theme";
import { getRecoveryFlow, OryPageParams } from "@ory/nextjs/app";

import config from "@/ory.config";

const RecoveryPage = async (props: OryPageParams) => {
  const flow = await getRecoveryFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return (
    <Recovery
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

export default RecoveryPage;
