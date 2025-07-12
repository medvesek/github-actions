import Cloudflare from "cloudflare";
import CloudflareClient from "./cloudflare.js";

export default async function createCloudflareRecord({
  name,
  apiToken,
  content,
  type,
}) {
  const client = new CloudflareClient(new Cloudflare({ apiToken }));

  const zone = await client.findZone(name);
  if (!zone) {
    throw new Error(`Zone for ${name} not found`);
  }
  const zoneId = zone.id;
  let record = await client.findRecord({ zoneId, name });

  if (!record) {
    record = await client.createDnsRecord({
      zoneId,
      name,
      content,
      type,
    });
    console.log(`Record for ${name} created!`);
  } else if (record.content !== content || record.type !== type) {
    record = await client.updateDnsRecord(record.id, {
      zoneId,
      name,
      content,
      type,
    });
    console.log(`Record for ${name} updated!`);
  } else {
    console.log(
      `Record for ${name} already exists and is configured correctly!`
    );
  }
  return record;
}
