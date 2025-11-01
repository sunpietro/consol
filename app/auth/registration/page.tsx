import { Registration } from "@ory/elements-react/theme";
import { getRegistrationFlow, OryPageParams } from "@ory/nextjs/app";

import config from "@/ory.config";

const RegistrationPage = async (props: OryPageParams) => {
  const flow = await getRegistrationFlow(config, props.searchParams);

  if (!flow) {
    return null;
  }

  return <Registration flow={flow} config={config} />;
};

export default RegistrationPage;
