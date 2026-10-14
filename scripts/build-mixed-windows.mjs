// Windows application boundary: package compiled code with pinned native binaries.
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { extractAll, createPackageWithOptions } from "@electron/asar";

const require = createRequire(import.meta.url);
const { path7za } = require("7zip-bin");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = "0.1.0";
const runtime = {
  version: "0.1.28",
  url: "https://github.com/munimtechnologies/mtcode/releases/download/munim-v0.1.28/MT-Code-0.1.28-x64.exe",
  sha256: "57001ee61dabd0ef35f4d613dd22aaee10258d0550d421b27e7a66d2209c807e",
};
if (process.platform !== "win32" || process.arch !== "x64") {
  throw new Error("This portable build requires Windows x64.");
}

const output = path.join(root, "release-mixed");
await fs.mkdir(output, { recursive: true });
const cache = path.join(root, ".mixed-build-cache");
await fs.mkdir(cache, { recursive: true });
const installer = path.join(cache, "MT-Code-0.1.28-x64.exe");
try {
  await fs.access(installer);
} catch {
  console.log("Downloading the pinned MT Code Windows runtime...");
  const response = await fetch(runtime.url);
  if (!response.ok) throw new Error(`Runtime download failed: HTTP ${response.status}`);
  await fs.writeFile(installer, Buffer.from(await response.arrayBuffer()));
}
const digest = crypto.createHash("sha256").update(await fs.readFile(installer)).digest("hex");
if (digest !== runtime.sha256) throw new Error("The runtime's SHA-256 does not match the pinned release.");

const stage = await fs.mkdtemp(path.join(cache, "stage-"));
const app = path.join(stage, `T3-Mixed-${version}-win-x64`);
await fs.mkdir(app);
execFileSync(path7za, ["x", installer, `-o${app}`, "-y"], { stdio: "ignore" });
const resources = path.join(app, "resources");

// NSIS is used only as an archive; its installer is never executed.
for (const archive of ["app", "server"]) {
  const tree = path.join(stage, `${archive}-source`);
  const archivePath = path.join(resources, `${archive}.asar`);
  extractAll(archivePath, tree);
  const built = archive === "app" ? "apps/desktop/dist-electron" : "apps/server/dist";
  const destination = path.join(tree, built);
  await fs.cp(path.join(root, built), destination, { recursive: true, force: true });
  const manifestPath = path.join(tree, "package.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.version = version;
  manifest.buildVersion = version;
  if (archive === "app") {
    manifest.name = "t3mixed";
    manifest.productName = "T3 Mixed";
    manifest.description = "MT Code with the T3 Kanban task workbench";
    manifest.t3DesktopDistro = "munim";
    manifest.t3codeCommitHash = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  }
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  await createPackageWithOptions(tree, archivePath, { unpack: "**/*.{node,dll,exe}" });
}

await fs.rename(path.join(app, "MT Code.exe"), path.join(app, "T3 Mixed.exe"));
// This distribution has manual releases; it must not download stock MT Code.
await fs.rm(path.join(resources, "app-update.yml"), { force: true });
await fs.copyFile(path.join(root, "LICENSE"), path.join(app, "LICENSE-T3-Mixed.txt"));
await fs.copyFile(path.join(root, "FORK-CREDITS.md"), path.join(app, "FORK-CREDITS.md"));
for (const file of ["NOTICE", "LICENSE-MIT"]) {
  await fs.copyFile(path.join(root, file), path.join(app, file));
}
await fs.copyFile(path.join(root, "scripts/Start-T3-Mixed.ps1"), path.join(app, "Start-T3-Mixed.ps1"));
await fs.writeFile(path.join(app, "BUILD-PROVENANCE.json"), JSON.stringify({
  product: "T3 Mixed", version, nativeRuntime: runtime,
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  code: "Desktop shell, server, and web client compiled from this repository.",
  updates: "Manual; automatic upstream updates are disabled.",
}, null, 2));

const zip = path.join(output, `T3-Mixed-${version}-win-x64.zip`);
execFileSync(path7za, ["a", "-tzip", "-mx=5", zip, path.basename(app)], { cwd: stage, stdio: "ignore" });
const zipDigest = crypto.createHash("sha256").update(await fs.readFile(zip)).digest("hex");
await fs.writeFile(path.join(output, "SHA256SUMS.txt"), `${zipDigest}  ${path.basename(zip)}\n`);
console.log(JSON.stringify({ applicationDirectory: app, zip, sha256: zipDigest }));
