import { createOryMiddleware } from "@ory/nextjs/middleware";
import oryConfig from "@/ory.config";

const middleware = createOryMiddleware(oryConfig);

export default middleware;
