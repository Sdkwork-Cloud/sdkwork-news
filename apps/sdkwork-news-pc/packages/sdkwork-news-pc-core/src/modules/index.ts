export interface NewsPcModuleDescriptor {
  id: string;
  capability: string;
}

export type NewsPcModuleRegistry = ReadonlyMap<string, NewsPcModuleDescriptor>;

export function createNewsPcModuleRegistry(
  modules: readonly NewsPcModuleDescriptor[] = [],
): NewsPcModuleRegistry {
  return new Map(modules.map((module) => [module.id, module]));
}
