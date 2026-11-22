import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./studio-base.css";
import MaddenStudioApp from "./components/MaddenStudioApp.tsx";

// Preserve the original multi-title workbench as a dev-only lazy route so production
// does not bundle legacy components or legacy CSS.
const LegacyApp = import.meta.env.DEV ? lazy(() => import("./App.tsx")) : null;
const legacy =
  Boolean(LegacyApp) &&
  new URLSearchParams(window.location.search).get("legacy") === "1";

ReactDOM.createRoot(document.getElementById("root")!).render(
  legacy && LegacyApp ? (
    <Suspense fallback={null}>
      <LegacyApp />
    </Suspense>
  ) : (
    <MaddenStudioApp />
  )
);
