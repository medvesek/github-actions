import "dotenv/config";
import createNetlifySite from "./action.js";

createNetlifySite({
  authToken: process.env.NETLIF_AUTH_TOKEN,
  dir: process.env.DEPLOY_DIR,
});
