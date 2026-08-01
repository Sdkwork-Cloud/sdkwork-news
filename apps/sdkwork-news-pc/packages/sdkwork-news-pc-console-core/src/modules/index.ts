export interface NewsPcConsoleModuleDescriptor {
  id: string;
  capability: string;
}

export type NewsPcConsoleModuleRegistry = ReadonlyMap<
  string,
  NewsPcConsoleModuleDescriptor
>;

export function createNewsPcConsoleModuleRegistry(
  modules: readonly NewsPcConsoleModuleDescriptor[] = [],
): NewsPcConsoleModuleRegistry {
  return new Map(modules.map((module) => [module.id, module]));
}
