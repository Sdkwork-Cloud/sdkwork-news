export interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export interface RouteConfig {
  routes: Route[];
  basename?: string;
}

export function createRouteConfig(routes: Route[], basename?: string): RouteConfig {
  return {
    routes,
    basename,
  };
}

