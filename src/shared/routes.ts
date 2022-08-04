import { buildPath, createRoute, RouteInstance, RouteParams, RouteQuery } from 'atomic-router';
import { useRouter } from 'atomic-router-react';
import { Route } from 'react-router';

export const routes = {
  home: createRoute(),
  card: {
    view: createRoute<{ cardId: string }>(),
    edit: createRoute<{ cardId: string }>(),
    create: createRoute(),
  },
  accesso: {
    done: createRoute(),
  },
  user: {
    view: createRoute<{ username: string }>(),
  },
  search: {
    results: createRoute(),
  },
  test: {
    comments: createRoute(),
  },
};

export function usePath<T extends RouteParams>(
  route: RouteInstance<T>,
): (params: T, query?: RouteQuery) => string {
  const router = useRouter();
  const routeObj = router.routes.find((routeObj) => routeObj.route === route);

  if (!routeObj) {
    throw new Error('[RouteLink] Route not found');
  }

  return (params, query = {}) =>
    buildPath({
      pathCreator: routeObj.path,
      params: params || {},
      query: query || {},
    });
}

export function useLink<T extends RouteParams>(
  route: RouteInstance<T>,
  params: T,
  query: RouteQuery = {},
) {
  const builder = usePath(route);

  return builder(params, query);
}
