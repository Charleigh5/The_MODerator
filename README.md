# The MODerator

Evidence-gated Madden + College Football PC mod intelligence workbench.

## MODerator Desktop v0.1

The Windows desktop build adds a local **Continue with ChatGPT** bridge for eligible ChatGPT plan usage. Each installation signs in with the ChatGPT account that will use the app; MODerator does not require a copied API key.

### Weekend tester flow

1. Download either `MODerator-Desktop-Setup-0.1.0.exe` or the portable EXE from the Windows build artifact.
2. Launch MODerator Desktop.
3. Click **CHATGPT** in the stadium header.
4. Choose **Continue with ChatGPT**. Authorization opens in the system browser.
5. Approve the requested app access with the tester's own eligible ChatGPT account.
6. MODerator loads the model catalog visible to that account; choose a model.
7. Optionally select a copied save/mod/source file. The app hashes the file and treats the original as read-only.
8. Describe the desired football change in plain English.

### Intelligence architecture

Natural-language requests still pass through the deterministic `MOD_INTENT_V1` compiler first:

`intent → title/parity → capability bindings → evidence gate → compatibility → build/experiment recipe → proof receipt`

When ChatGPT-plan access is connected, CODEWRIGHT receives those compiler facts as constraints and uses the selected model for reasoning. It cannot silently promote `TARGET`, `UNKNOWN`, `CANDIDATE`, or `NEEDS_VERIFICATION` into game-proven behavior.

### Local privacy/security

- OAuth uses PKCE and a loopback `127.0.0.1` callback.
- OAuth tokens are encrypted locally with Electron `safeStorage` / Windows DPAPI.
- Tokens are never exposed to the renderer.
- Renderer uses sandboxing, context isolation, no Node integration, a narrow preload bridge, and a CSP.
- Responses requests use `store:false` and streaming.
- Binary save/mod files are not sent to the model by the current v0.1 bridge. For selected text sources, MODerator can send an explicit bounded text preview along with file name, size, and SHA-256.
- Original game/save inputs are never mutated by the AI chat layer.

### What v0.1 does not claim

A successful model conversation does not mean a game artifact was built or tested. MODerator preserves `GAME_ARTIFACT_NOT_BUILT` / `RUNTIME_NOT_RUN` until an authorized local build adapter and game verification actually run.

CFB27 and Madden 27 save/schema parity remain separate evidence domains.

## Development

```powershell
npm ci
npm run typecheck
npm run gauntlet
npm run build
npm run desktop
```

Build Windows installer + portable EXE:

```powershell
npm run desktop:pack
```

The build outputs are written to `release/`.

## License

MIT. See [LICENSE](LICENSE).
