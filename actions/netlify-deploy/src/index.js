import * as core from "@actions/core";
import createNetlifySite from "./action.js";
import { appendFile } from "fs/promises";

try {
  const authToken = core.getInput("token");
  const dir = core.getInput("dir");
  const customDomain = core.getInput("custom_domain");
  const site = await createNetlifySite({ authToken, dir, customDomain });
  await appendFile(process.env.GITHUB_STEP_SUMMARY, site.url);
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
  throw error;
}
