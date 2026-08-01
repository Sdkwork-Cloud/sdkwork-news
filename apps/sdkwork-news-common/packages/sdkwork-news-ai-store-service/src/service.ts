import type {
  AiStoreListInput,
  AiStorePort,
  AiStoreService,
} from "./contracts.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function createAiStoreService(port: AiStorePort): AiStoreService {
  return {
    installProduct: (listingId) => port.installProduct(requireId(listingId, "listing")),
    installSkill: (packageId, artifactId) => port.installSkill(
      requireId(packageId, "skill package"),
      requireId(artifactId, "skill artifact"),
    ),
    list: (input) => port.list(normalizeListInput(input)),
    listSkillArtifacts: (packageId) => port.listSkillArtifacts(
      requireId(packageId, "skill package"),
    ),
    uninstallProduct: (libraryItemId) => port.uninstallProduct(
      requireId(libraryItemId, "library item"),
    ),
  };
}

function normalizeListInput(input: AiStoreListInput): AiStoreListInput {
  const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new Error(`AI Store pageSize must be between 1 and ${MAX_PAGE_SIZE}.`);
  }
  return {
    ...(input.cursor?.trim() ? { cursor: input.cursor.trim() } : {}),
    kind: input.kind,
    pageSize,
    ...(input.q?.trim() ? { q: input.q.trim() } : {}),
  };
}

function requireId(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`A ${label} id is required.`);
  }
  return normalized;
}
