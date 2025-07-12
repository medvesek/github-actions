import * as core from "@actions/core";
import createCloudflareRecord from "./action";

try {
  const token = core.getInput("token");
  const name = core.getInput("name");
  const content = core.getInput("content");
  const type = core.getInput("type");
  await createCloudflareRecord({ apiToken: token, name, content, type });
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
  throw error;
}
