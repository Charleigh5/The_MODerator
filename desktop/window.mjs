import fs from "node:fs/promises";
import path from "node:path";
import { app, BrowserWindow } from "electron";
import { userPath } from "./credentials.mjs";

const SMOKE_SCRIPT = `(async () => {
  const buttons = () => Array.from(document.querySelectorAll("button"));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  buttons().find(b => b.textContent?.includes("Player equipment"))?.click();
  await wait(80);
  const promptReady = Boolean(document.querySelector("#m27-prompt")?.value?.includes("Madden 27"));
  buttons().find(b => b.textContent?.includes("Analyze request"))?.click();
  await wait(160);
  buttons().find(b => b.textContent?.includes("Mod intelligence library"))?.click();
  await wait(160);
  const libraryOpen = Boolean(document.querySelector(".m27-lib"));
  const libraryCards = document.querySelectorAll(".m27-lib-card").length;
  buttons().find(b => b.textContent?.includes("Community quality audit"))?.click();
  await wait(260);
  const liveWatchItems = document.querySelectorAll(".m27-ci-live-item").length;
  const patchCards = document.querySelectorAll(".m27-ci-patch").length;
  const assessmentRows = document.querySelectorAll(".m27-ci-row").length;
  const communityPanel = Boolean(document.querySelector(".m27-ci"));
  const reviewAdapterReady = Boolean(document.querySelector(".m27-ci-review-inbox button"));
  buttons().find(b => b.getAttribute("aria-label") === "Close mod library")?.click();
  await wait(110);
  buttons().find(b => b.textContent?.includes("New design session"))?.click();
  await wait(90);
  buttons().find(b => b.textContent?.includes("Elite safety IQ"))?.click();
  await wait(90);
  buttons().find(b => b.textContent?.includes("Analyze request"))?.click();
  await wait(220);
  const grillStarted = document.querySelector(".m27-grill")?.getAttribute("data-grill-round") === "MECHANISM";
  const footballBoardReady = document.querySelector(".m27-film22")?.getAttribute("data-player-count") === "22";
  const passBoard = document.querySelector(".m27-film22")?.getAttribute("data-scenario") === "PASS_COVER3";
  Array.from(document.querySelectorAll(".m27-film22-tabs button")).find(b => b.textContent?.includes("Run / Outside zone"))?.click();
  await wait(100);
  const runBoard = document.querySelector(".m27-film22")?.getAttribute("data-scenario") === "RUN_OUTSIDE_ZONE";
  Array.from(document.querySelectorAll(".m27-film22-tabs button")).find(b => b.textContent?.includes("Pass / Cover 3"))?.click();
  await wait(100);
  for (let i = 0; i < 3; i++) {
    document.querySelector(".m27-grill-choice")?.click();
    await wait(130);
  }
  const grillReview = document.querySelector(".m27-grill")?.getAttribute("data-grill-round") === "CONFIRM";
  document.querySelector(".m27-grill-confirm")?.click();
  await wait(170);
  const modSpecV2Ready = Boolean(buttons().find(b => b.textContent?.includes("Download Mod Spec v2") && !b.disabled));
  const grillConfirmed = Boolean(document.querySelector(".m27-grill-complete"));
  document.querySelector(".m27-ci-review-inbox")?.scrollIntoView({block:"center"});
  return {
    liveWatchItems, patchCards, assessmentRows, communityPanel, reviewAdapterReady,
    grillStarted, footballBoardReady, passBoard, runBoard, grillReview, grillConfirmed, modSpecV2Ready,
    libraryOpen, libraryCards, title: document.title,
    bridge: Boolean(window.moderatorDesktop?.isDesktop),
    studio: Boolean(document.querySelector(".m27-shell")),
    promptReady,
    messageCount: document.querySelectorAll(".m27-message").length,
    planEnabled: Boolean(buttons().find(b => b.textContent?.includes("Download evidence plan") && !b.disabled))
  };
})()`;

async function runDesktopSmoke(win) {
  try {
    const result = await win.webContents.executeJavaScript(SMOKE_SCRIPT);
    console.log("MODERATOR_DESKTOP_SMOKE " + JSON.stringify(result));
    const ok =
      result.bridge &&
      result.studio &&
      result.promptReady &&
      result.messageCount >= 3 &&
      result.planEnabled &&
      result.libraryOpen &&
      result.libraryCards >= 37 &&
      result.communityPanel &&
      result.patchCards === 2 &&
      result.assessmentRows === 37 &&
      (!process.env.MODERATOR_SMOKE_EXPECT_LOCAL_WATCH || result.liveWatchItems >= 1) &&
      result.reviewAdapterReady &&
      result.grillStarted &&
      result.footballBoardReady &&
      result.passBoard &&
      result.runBoard &&
      result.grillReview &&
      result.grillConfirmed &&
      result.modSpecV2Ready;
    const code = ok ? 0 : 2;
    const png = (await win.webContents.capturePage()).toPNG();
    await fs.writeFile(userPath("desktop-nexus-review-adapter.png"), png);
    await fs.writeFile(
      userPath("desktop-smoke.json"),
      JSON.stringify({ at: new Date().toISOString(), code, result, packaged: app.isPackaged, version: app.getVersion() }, null, 2),
      "utf8"
    );
    setTimeout(() => app.exit(code), 150);
  } catch (err) {
    console.error("MODERATOR_DESKTOP_SMOKE_ERROR", err);
    await fs
      .writeFile(
        userPath("desktop-smoke.json"),
        JSON.stringify({ at: new Date().toISOString(), code: 2, error: String(err?.message ?? err), packaged: app.isPackaged, version: app.getVersion() }, null, 2),
        "utf8"
      )
      .catch(() => {});
    setTimeout(() => app.exit(2), 150);
  }
}

export function createStudioWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#001b3a",
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:") && !url.startsWith("http://127.0.0.1:3000")) {
      event.preventDefault();
    }
  });
  win.webContents.once("did-finish-load", async () => {
    if (process.env.MODERATOR_SMOKE_TEST === "1") await runDesktopSmoke(win);
  });
  const devUrl = process.env.MODERATOR_DEV_URL;
  if (devUrl) win.loadURL(devUrl);
  else win.loadFile(path.join(import.meta.dirname, "..", "dist", "index.html"));
  return win;
}
