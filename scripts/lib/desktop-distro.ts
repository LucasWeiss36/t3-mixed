/**
 * Public Munim distribution identity for personal-fork desktop builds.
 *
 * Set T3CODE_DESKTOP_DISTRO=munim when packaging installers for munimtech.com.
 * Default (unset) keeps the official T3 Code identity for the private SSH fleet.
 */

export type DesktopDistroId = "default" | "munim";

export interface DesktopDistroIdentity {
  readonly id: DesktopDistroId;
  readonly appId: string;
  readonly productName: string;
  readonly packageName: string;
  readonly artifactName: string;
  readonly description: string;
  readonly author: string;
  readonly updateRepository: string | undefined;
  readonly protocolSchemes: readonly string[];
  readonly protocolName: string;
  readonly linuxExecutableName: string;
  readonly linuxStartupWmClass: string;
  /** .deb control-file Maintainer. */
  readonly linuxMaintainer: string;
  readonly nsisShortcutName: string;
  readonly nsisInstallDirectoryName: string;
}

const OFFICIAL: DesktopDistroIdentity = {
  id: "default",
  appId: "com.t3tools.t3code",
  productName: "T3 Code",
  packageName: "t3code",
  artifactName: "T3-Code-${version}-${arch}.${ext}",
  description: "T3 Code desktop build",
  author: "T3 Tools",
  updateRepository: undefined,
  protocolSchemes: ["t3code", "t3code-dev"],
  protocolName: "T3 Code",
  linuxExecutableName: "t3code",
  linuxStartupWmClass: "t3code",
  linuxMaintainer: "T3 Tools <hello@t3.codes>",
  nsisShortcutName: "T3 Code",
  nsisInstallDirectoryName: "t3code",
};

const MUNIM: DesktopDistroIdentity = {
  id: "munim",
  appId: "com.lucas.t3mixed",
  productName: "T3 Mixed",
  packageName: "t3mixed",
  artifactName: "T3-Mixed-${version}-${arch}.${ext}",
  description: "T3 Mixed — MT Code with T3 Kanban tasks",
  author: "Munim, Inc.",
  updateRepository: undefined,
  protocolSchemes: ["t3mixed", "t3mixed-dev"],
  protocolName: "T3 Mixed",
  linuxExecutableName: "mtcode",
  linuxStartupWmClass: "mtcode",
  linuxMaintainer: "Munim Technologies <support@munimtech.com>",
  nsisShortcutName: "T3 Mixed",
  nsisInstallDirectoryName: "t3mixed",
};

export function resolveDesktopDistroId(
  raw: string | undefined | null = process.env.T3CODE_DESKTOP_DISTRO,
): DesktopDistroId {
  return raw?.trim() === "munim" ? "munim" : "default";
}

export function resolveDesktopDistroIdentity(
  raw: string | undefined | null = process.env.T3CODE_DESKTOP_DISTRO,
): DesktopDistroIdentity {
  return resolveDesktopDistroId(raw) === "munim" ? MUNIM : OFFICIAL;
}
