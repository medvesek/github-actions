export default class CloudflareClient {
  constructor(client) {
    this.client = client;
  }

  async findZone(hostname) {
    const domain = hostname.split(".").slice(-2).join(".");
    const zones = await this.client.zones.list({ name: domain });
    return zones.result[0];
  }

  async findRecord({ zoneId, name, type }) {
    const records = await this.client.dns.records.list({
      zone_id: zoneId,
      name,
    });

    return records.result[0];
  }

  createDnsRecord({ zoneId, name, content, type }) {
    return this.client.dns.records.create({
      zone_id: zoneId,
      name,
      type,
      proxied: true,
      content,
    });
  }

  updateDnsRecord(recordId, { zoneId, name, content, type }) {
    return this.client.dns.records.update(recordId, {
      zone_id: zoneId,
      name,
      content,
      type,
      proxied: true,
    });
  }
}
