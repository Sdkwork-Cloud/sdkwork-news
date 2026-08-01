export type AiStoreKind = "mcp" | "product" | "skill";

export type AiStoreEntryAction =
  | "install-product"
  | "installed-skill"
  | "select-skill-artifact"
  | "uninstall-product"
  | "view-only";

export interface AiStoreEntry {
  action: AiStoreEntryAction;
  description: string;
  healthStatus?: string;
  iconUrl?: string;
  id: string;
  installCount?: string;
  kind: AiStoreKind;
  libraryItemId?: string;
  name: string;
  packageId?: string;
  pricing?: string;
  rating?: string;
  tags: readonly string[];
  transport?: string;
}

export interface AiStoreArtifact {
  id: string;
  invocationKind: string;
  publishedAt?: string;
  status: "draft" | "published" | "yanked";
  version: string;
}

export interface AiStoreListInput {
  cursor?: string;
  kind: AiStoreKind;
  pageSize?: number;
  q?: string;
}

export interface AiStorePage {
  hasMore: boolean;
  items: readonly AiStoreEntry[];
  nextCursor?: string;
}

export interface AiStorePort {
  installProduct(listingId: string): Promise<{ libraryItemId: string }>;
  installSkill(packageId: string, artifactId: string): Promise<void>;
  list(input: AiStoreListInput): Promise<AiStorePage>;
  listSkillArtifacts(packageId: string): Promise<readonly AiStoreArtifact[]>;
  uninstallProduct(libraryItemId: string): Promise<void>;
}

export interface AiStoreService {
  installProduct(listingId: string): Promise<{ libraryItemId: string }>;
  installSkill(packageId: string, artifactId: string): Promise<void>;
  list(input: AiStoreListInput): Promise<AiStorePage>;
  listSkillArtifacts(packageId: string): Promise<readonly AiStoreArtifact[]>;
  uninstallProduct(libraryItemId: string): Promise<void>;
}
