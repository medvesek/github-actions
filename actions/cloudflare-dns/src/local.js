import "dotenv/config";

import createCloudflareRecord from "./action.js";

const token = process.env.CLOUDFLARE_TOKEN;
const name = process.env.DNS_RECORD_NAME;
const content = process.env.DNS_RECORD_CONTENT;
const type = process.env.DNS_RECORD_TYPE;
const record = await createCloudflareRecord({
  apiToken: token,
  name,
  content,
  type,
});
console.log(record);
