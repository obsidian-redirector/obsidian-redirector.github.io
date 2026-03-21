const path = require('path');
const BASE = "https://github.com/org-user/repo";   // ← set your GitHub repo base (no trailing slash)
const BRANCH = "main";                           // ← change if your default branch isn't "main"

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async ({ tp, app, navigator }) => {
  const vaultRoot = app.vault.adapter.getBasePath();
  const vaultRel = tp.file.path(true);
  const absFile = path.join(vaultRoot, vaultRel).replace(/\\/g, "/");
  const dir = path.dirname(absFile);

  const toplevel = (await exec(`git -C "${dir}" rev-parse --show-toplevel`)).stdout.trim();
  const hash = (await exec(`git -C "${dir}" rev-parse HEAD`)).stdout.trim();

  const repoRel = absFile.startsWith(toplevel.replace(/\\/g, "/"))
    ? absFile.slice(toplevel.replace(/\\/g, "/").length + 1)
    : vaultRel;

  // ---- URL-encode the path for GitHub (keep slashes, escape #) ----
  const encoded = encodeURI(repoRel).replace(/#/g, "%23");

  const urlMain = `${BASE}/blob/${BRANCH}/${encoded}`;
  const urlPermalink = `${BASE}/blob/${hash}/${encoded}`;

  const vaultName = app.vault.getName();
  const encVault = encodeURIComponent(vaultName);
  const encFile = vaultRel.split("/").map(encodeURIComponent).join("%2F");
  const urlObsidian = `https://obsidian-redirector.github.io
/?vault=${encVault}&file=${encFile}`;

  const title = tp.file.title;
  const output = `${buildMarkdownLink(title, urlMain)} (${buildMarkdownLink('permalink', urlPermalink)} | ${buildMarkdownLink("🪨", urlObsidian)})`;

  const htmlOutput = `${buildHtmlLink(title, urlMain)} ${buildHtmlLink("💾", urlPermalink)} ${buildHtmlLink(" 🪨", urlObsidian)}`;


  const items = new ClipboardItem({
    "text/html": new Blob([htmlOutput], { type: "text/html" }),
    "text/plain": new Blob([output], { type: "text/plain" }),
  });
  await navigator.clipboard.write([items]);
  tR = "";
};

function buildHtmlLink(label, url) {
  const html = `<a href="${url}">${label}</a>`;
  return html
}

function buildMarkdownLink(label, url) {
  // join with _ because Github otherwise breaks on parsing links
  const plain = `[${label.replace(/\s+/g, "_")}](${url})`;
  return plain;
}
