export interface NewsPcAdminModuleDescriptor {
  id: string;
  capability: string;
}

export type NewsPcAdminModuleRegistry = ReadonlyMap<
  string,
  NewsPcAdminModuleDescriptor
>;

export function createNewsPcAdminModuleRegistry(
  modules: readonly NewsPcAdminModuleDescriptor[] = [],
): NewsPcAdminModuleRegistry {
  return new Map(modules.map((module) => [module.id, module]));
}
