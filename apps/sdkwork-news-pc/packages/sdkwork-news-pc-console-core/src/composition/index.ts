import type { HostAdapter } from '../host';
import type { NewsPcConsoleModuleRegistry } from '../modules';
import type { NewsApiPort } from '../sdk';
import type { ConsoleSessionManager } from '../session';

export interface NewsPcConsoleComposition {
  host: HostAdapter;
  modules: NewsPcConsoleModuleRegistry;
  newsApi: NewsApiPort;
  session: ConsoleSessionManager;
}

export function createNewsPcConsoleComposition(
  composition: NewsPcConsoleComposition,
): NewsPcConsoleComposition {
  return composition;
}
