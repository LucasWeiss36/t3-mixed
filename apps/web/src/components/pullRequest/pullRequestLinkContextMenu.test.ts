import { SourceControlProviderKind } from "@t3tools/contracts";
import { sourceControlClients } from "@t3tools/client-runtime/source-control-clients";
import { describe, expect, it } from "vite-plus/test";

import { openOnHostLabel } from "./pullRequestLinkContextMenu";

describe("pull request link context menu", () => {
  it("names every host it knows, and says nothing false about one it does not", () => {
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("github"))),
    ).toBe("Open on GitHub");
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("gitlab"))),
    ).toBe("Open on GitLab");
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("bitbucket"))),
    ).toBe("Open on Bitbucket");
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("azure-devops"))),
    ).toBe("Open on Azure DevOps");
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("forgejo"))),
    ).toBe("Open on Forgejo");
    expect(
      openOnHostLabel(sourceControlClients.get(SourceControlProviderKind.make("something-else"))),
    ).toBe("Open on host");
  });
});
