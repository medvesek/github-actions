import * as core from "@actions/core";
import createCloudflareRecord from "./actions";

try {
  const apiToken = core.getInput("CLOUDFLARE_API_TOKEN");
  const hostname = core.getInput("hostname");
  const targetIp = core.getInput("targetIp");
  await createCloudflareRecord({ apiToken, hostname, targetIp });
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
