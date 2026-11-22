import { createStudioPlan, type StudioSource } from "../../lib/maddenStudio";
import type { ModIntentSpec } from "../../lib/modIntentCompiler";
import type { GridironSpecV2 } from "../../lib/grillMeFlow";

function triggerJsonDownload(filename: string, data: unknown) {
  const payload = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const href = URL.createObjectURL(payload);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 2000);
}

export function downloadPlanFile(spec: ModIntentSpec, source: StudioSource | null) {
  triggerJsonDownload("moderator-madden27-plan.json", createStudioPlan(spec, source));
}

export function downloadModSpecV2File(gridSpec: GridironSpecV2) {
  triggerJsonDownload(`moderator-${gridSpec.id.toLowerCase()}-grillme-modspec-v2.json`, gridSpec);
}
