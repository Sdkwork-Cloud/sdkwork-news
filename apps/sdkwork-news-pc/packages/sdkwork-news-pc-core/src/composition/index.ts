import type { HostAdapter } from '../host';
import type { NewsPcModuleRegistry } from '../modules';
import type { NewsApiPort } from '../sdk';
import type { SessionManager } from '../session';

export interface NewsPcComposition {
  host: HostAdapter;
  modules: NewsPcModuleRegistry;
  newsApi: NewsApiPort;
  session: SessionManager;
}

export function createNewsPcComposition(
  composition: NewsPcComposition,
): NewsPcComposition {
  return composition;
}
