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

The packaging script downloads and verifies the pinned runtime, extracts it without executing its installer, and produces release-mixed/T3-Mixed-0.1.1-win-x64.zip. A normal installer build through the upstream packaging scripts additionally requires Visual Studio C++ build tools for native dependencies.

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
pnpm --filter t3 exec vp test run src/orchestration-v2/ThreadLaunchService.test.ts -t 'Kanban|shared intake preserves durable attachment'
```

The task UI/model tests, V2 persistence/replay test, and assigned-task/attachment regressions passed. An integrated browser pass against the built server/client exercised creation, editing, search, board/list views, column changes, Codex execution, chat opening, task details, image upload/editing, archive/unarchive, deletion, and persistence after server restarts. Drag handlers were exercised with browser DOM drag events; physical mouse dragging was not separately verified. File selection used a generated 4×4 PNG fixture. Web and desktop typechecks passed; the server typechecker reports pre-existing unused Effect diagnostic directives (warning exit code), with no TypeScript errors in the changed code. Changed-file lint passed with existing warnings. Other providers, worktree tasks, cloud OAuth, and every inherited MT Code feature are not covered by this pass.

## Upgrade from 0.1.0

Version 0.1.1 fixes assigned tasks disappearing from the board and task images retaining temporary upload references. Images created with 0.1.0 may need to be reattached if their temporary uploads have already been deleted or expired. Existing task titles, content, statuses, and chat history remain compatible.

## Known integration limitation

The upstream Clerk desktop bridge still registers the shared t3code:// OAuth scheme on Windows startup. T3 Mixed thread links use t3mixed://, but starting both apps may change which app receives shared OAuth/app links. Local agent chats and isolated data directories are unaffected. When keeping original T3 installed, restore its URL handler if needed; do not use shared T3 cloud sign-in links as proof of complete app isolation.

## License and credits

See LICENSE (Apache-2.0), LICENSE-MIT, NOTICE, and FORK-CREDITS.md. Original upstream notices are retained. This is an independent community build.

A Windows CI template is included at docs/workflows/mixed-windows.yml. Repository Actions are disabled initially: the publishing account token does not have the workflow scope needed to install a new workflow. A maintainer can install the template and enable Actions later.
