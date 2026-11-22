import { app, BrowserWindow, ipcMain } from "electron";
import { clearCredentials, publicStatus, readCredentials } from "./credentials.mjs";
import { signIn } from "./auth.mjs";
import { listModels, runResponse } from "./openai.mjs";
import {
  importNexusReviewPack,
  importStudioPlan,
  pickLocalFile,
  readModWatchSnapshot,
  reviewInbox,
} from "./files.mjs";
import { createStudioWindow } from "./window.mjs";

let mainWindow = null;
const getMainWindow = () => mainWindow;

function registerIpcHandlers() {
  ipcMain.handle("moderator:auth-status", async () => publicStatus(await readCredentials()));
  ipcMain.handle("moderator:auth-sign-in", signIn);
  ipcMain.handle("moderator:auth-disconnect", async () => {
    await clearCredentials();
    return publicStatus(null);
  });
  ipcMain.handle("moderator:list-models", listModels);
  ipcMain.handle("moderator:chat", runResponse);
  ipcMain.handle("moderator:pick-file", () => pickLocalFile(getMainWindow));
  ipcMain.handle("moderator:import-studio-plan", () => importStudioPlan(getMainWindow));
  ipcMain.handle("moderator:nexus-review-snapshot", reviewInbox);
  ipcMain.handle("moderator:nexus-review-import", () => importNexusReviewPack(getMainWindow));
  ipcMain.handle("moderator:mod-watch-snapshot", readModWatchSnapshot);
}

app.whenReady().then(() => {
  registerIpcHandlers();
  mainWindow = createStudioWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createStudioWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
