import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MaddenStudioApp from "./components/MaddenStudioApp.tsx";

// Preserve the original multi-title workbench as an explicitly requested legacy route.
const legacy = import.meta.env.DEV && new URLSearchParams(window.location.search).get("legacy") === "1";
ReactDOM.createRoot(document.getElementById("root")!).render(legacy ? <App /> : <MaddenStudioApp />);
