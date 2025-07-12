import * as core from "@actions/core";
import createNetlifySite from "./action.js";

try {
  const authToken = core.getInput("token");
  const dir = core.getInput("dir");
  const customDomain = core.getInput("custom_domain");
  await createNetlifySite({ authToken, dir, customDomain });
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
