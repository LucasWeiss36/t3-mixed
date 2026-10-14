# T3 Mixed

A separate community desktop build combining [MT Code](https://github.com/munimtechnologies/mtcode) with the task board from [T3 Kanban](https://github.com/what1f/t3kanban), built on [T3 Code](https://github.com/pingdotgg/t3code).

## Features

- MT Code's current agent workspace and providers, based on commit 63c035c5e5a0cfdcdd4dbabe798cc9efe06f9b93.
- Kanban and list views, project filtering, search, task creation, image attachments, and provider/model selection.
- Drag tasks between five columns: To do, In progress, In review, Blocked, Done. Reorder cards and edit tasks through their context menu.
- Task details alongside the chat on wide screens.
- Task metadata persisted through MT Code's V2 commands, event log, projections, and client state.

This is a port of the task workbench, not a wholesale merge of the older Kanban fork. Its custom MCP task toolkit and task notification inbox are not included. MT Code's own agent features remain available. VS Code-style draggable split chat panes are not implemented in this release.

## Windows

Download the ZIP from Releases, extract it fully, then launch **Start-T3-Mixed.ps1** with PowerShell. If launching from a terminal:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\Start-T3-Mixed.ps1
```

The launcher uses a separate server home, **%USERPROFILE%\.t3-mixed**, and a separate Electron profile, **%APPDATA%\t3mixed**. It does not import your T3 or Synara chats. Choose a project folder during onboarding and configure your agents. Automatic upstream updates are disabled; install future T3 Mixed releases manually.

The executable and native dependencies come from the pinned MT Code 0.1.28 Windows runtime. Desktop JavaScript, server, and web client are rebuilt here. Windows executable metadata/icon may still identify MT Code. This first release is portable, not a registered Windows installer. BUILD-PROVENANCE.json and SHA256SUMS.txt record the build inputs and checksum.

## Build from source

Use Node 24 and pnpm 11.10.0 on Windows x64. Clone the full repository, then:

```powershell
pnpm install --frozen-lockfile --filter @t3tools/web... --filter @t3tools/desktop... --filter t3... --filter @t3tools/scripts... --filter @t3tools/monorepo --filter @t3tools/oxlint-plugin-t3code
$env:T3CODE_DESKTOP_DISTRO = 'munim'
pnpm exec vp run build:desktop
node scripts/build-mixed-windows.mjs
```

The packaging script downloads and verifies the pinned runtime, extracts it without executing its installer, and produces release-mixed/T3-Mixed-0.1.0-win-x64.zip. A normal installer build through the upstream packaging scripts additionally requires Visual Studio C++ build tools for native dependencies.

For development, use an isolated home:

```powershell
pnpm exec node scripts/dev-runner.ts dev --home-dir C:\path\to\isolated-mixed-home
```

## Validation

```powershell
pnpm --filter @t3tools/web typecheck
pnpm --filter @t3tools/desktop typecheck
pnpm --filter @t3tools/web exec vp test run src/components/tasks --project unit
pnpm --filter t3 exec vp test run src/orchestration-v2/FoundationPersistence.test.ts -t 'persists Kanban'
```

The initial build passed 15 task UI/model unit tests, a V2 task persistence/replay test, web and desktop typechecks, and lint on changed TypeScript files (React warnings remain). The upstream server typechecker currently reports pre-existing unused Effect diagnostic directives; these warnings are documented rather than suppressed. A packaged Windows app startup was verified. Automated end-to-end browser verification was blocked by connection errors in the collaborative browser; it is not claimed complete.

## Known integration limitation

The upstream Clerk desktop bridge still registers the shared t3code:// OAuth scheme on Windows startup. T3 Mixed thread links use t3mixed://, but starting both apps may change which app receives shared OAuth/app links. Local agent chats and isolated data directories are unaffected. When keeping original T3 installed, restore its URL handler if needed; do not use shared T3 cloud sign-in links as proof of complete app isolation.

## License and credits

See LICENSE (Apache-2.0), LICENSE-MIT, NOTICE, and FORK-CREDITS.md. Original upstream notices are retained. This is an independent community build.

A Windows CI template is included at docs/workflows/mixed-windows.yml. Repository Actions are disabled initially: the publishing account token does not have the workflow scope needed to install a new workflow. A maintainer can install the template and enable Actions later.
