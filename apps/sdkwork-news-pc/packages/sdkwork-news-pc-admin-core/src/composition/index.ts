import type { HostAdapter } from '../host';
import type { NewsPcAdminModuleRegistry } from '../modules';
import type { AdminNewsApiPort } from '../sdk';
import type { AdminSessionManager } from '../session';

export interface NewsPcAdminComposition {
  host: HostAdapter;
  modules: NewsPcAdminModuleRegistry;
  newsApi: AdminNewsApiPort;
  session: AdminSessionManager;
}

export function createNewsPcAdminComposition(
  composition: NewsPcAdminComposition,
): NewsPcAdminComposition {
  return composition;
}
