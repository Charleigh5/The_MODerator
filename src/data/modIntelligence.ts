// Source-attributed research catalog. No third-party mod binaries or proprietary assets are embedded.
// This file stores discovery metadata, never a claim that code/game modifications were tested.

import type { ModCatalogEntry } from "./modIntelligence/types.js";
import { gameplayAndFranchiseMods } from "./modIntelligence/gameplayAndFranchise.js";
import { presentationAndAudioMods } from "./modIntelligence/presentationAndAudio.js";
import { saveAndDraftToolMods } from "./modIntelligence/saveAndDraftTools.js";
import { historicalRosterMods } from "./modIntelligence/historicalRosters.js";
import { cameraAndUiMods } from "./modIntelligence/cameraAndUi.js";
import { developerReferenceMods } from "./modIntelligence/developerReferences.js";

export {
  MOD_INTELLIGENCE_UPDATED,
  MOD_INTELLIGENCE_SOURCES,
  type ModCatalogEntry,
} from "./modIntelligence/types.js";

const communityMods: ModCatalogEntry[] = [
  ...gameplayAndFranchiseMods,
  ...presentationAndAudioMods,
  ...saveAndDraftToolMods,
  ...historicalRosterMods,
  ...cameraAndUiMods,
].sort((a, b) => Number(a.id.replace("mod-", "")) - Number(b.id.replace("mod-", "")));

export const modIntelligenceCatalog: ModCatalogEntry[] = [
  ...communityMods,
  ...developerReferenceMods,
];
