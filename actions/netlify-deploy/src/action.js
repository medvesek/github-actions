import { NetlifyAPI } from "@netlify/api";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { createHash } from "crypto";
import { exec } from "child_process";
import path from "path";

export default async function deployToNetlify({
  authToken,
  dir,
  customDomain,
}) {
  const client = new NetlifyAPI(authToken);
  const site = await findOrCreateSite({ customDomain, client });
  await deploySite({ siteId: site.id, client, dir });
  console.log(`Site ${site.name} has been deployed`);
}

async function findOrCreateSite({ customDomain, client }) {
  let siteId = await getSiteId();
  let site;

  if (!siteId) {
    site = await client.createSite({
      body: { custom_domain: customDomain },
    });
    console.log(`Site ${site.name} created`);
    await writeSiteId(site.id);
    siteId = site.id;
  }

  if (!site) {
    site = await client.getSite({ siteId });
    console.log(`Site ${site.name} found`);
  }

  if (site.custom_domain !== customDomain) {
    await client.updateSite({
      site_id: site.id,
      body: {
        customDomain,
      },
    });
    console.log(`Site ${site.name} custom domain updated`);
  }

  console.log(`Site ${site.name} has been confiugred`);
  return site;
}

async function siteIdPath() {
  return `${await getRepoRoot()}/.github/data/netlify_site_id`;
}

async function getSiteId() {
  try {
    return await readFile(await siteIdPath(), "utf-8");
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("site_id file not found");
      return null;
    }
    throw e;
  }
}

async function writeSiteId(siteId) {
  const fullPath = await siteIdPath();
  const parentDir = fullPath.split("/").slice(0, -1).join("/");
  await mkdir(parentDir, { recursive: true });
  await writeFile(fullPath, siteId);
  await execCmd(`git add ${fullPath}`);
  await execCmd(
    `git -c user.name="Github Actions" -c user.email="github_actions@github.com" commit -m "Added site_id"`
  );
}

async function getRepoRoot() {
  return await execCmd("git rev-parse --show-toplevel");
}

function execCmd(cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return rej(error);
      }
      return res(stdout.toString().trim());
    });
  });
}

async function deploySite({ dir, client, siteId }) {
  const fileNames = await readdir(dir);

  const fileDigests = {};
  const fileContents = {};
  for (const fileName of fileNames) {
    const content = await readFile(path.join(dir, fileName), "utf-8");
    const digest = createHash("sha-1").update(content).digest("hex");
    fileContents[fileName] = content;
    fileDigests[fileName] = digest;
  }

  const deploy = await client.createSiteDeploy({
    site_id: siteId,
    body: {
      files: fileDigests,
    },
  });

  const requests = fileNames.map((fileName) =>
    client.uploadDeployFile({
      deploy_id: deploy.id,
      path: fileName,
      body: fileContents[fileName],
    })
  );

  await Promise.all(requests);
}
