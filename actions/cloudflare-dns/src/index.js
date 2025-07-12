import * as core from "@actions/core";
import createCloudflareRecord from "./action";

try {
  const apiToken = core.getInput("token");
  const hostname = core.getInput("hostname");
  const targetIp = core.getInput("ip");
  await createCloudflareRecord({ apiToken, hostname, targetIp });
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
