import _ from 'lodash';
import { createAsyncAction } from 'utils/redux';


export const ROUTE_ENTER = 'ROUTES/ROUTE_ENTER';

const enterRoute = createAsyncAction(ROUTE_ENTER);

export const connectRoutes = (store) => {
  const loadAsync = (getComponent) => (prevState, callback) => {
    getComponent()
      .then(module => callback(null, module.default))
      .catch(callback);
  };

  const createRoutes = (routes) => {
    if (Array.isArray(routes)) return routes.map(route => createRoutes(route));

    const result = Object.assign({}, routes, {
      onEnter: (nextState, replace, callback) => {
        store.dispatch(enterRoute(nextState))
          .then(() => {
            if (routes.onEnter) {
              routes.onEnter(nextState, replace, callback);
            } else {
              callback();
            }
          })
          .catch(callback);
      }
    });

    if (_.has(routes, 'getComponent')) {
      Object.assign(result, {
        getComponent: loadAsync(routes.getComponent)
      })
    }

    if (_.has(routes, 'indexRoute')) {
      Object.assign(result, {
        indexRoute: createRoutes(routes.indexRoute)
      });
    }

    if (_.has(routes, 'childRoutes')) {
      Object.assign(result, {
        childRoutes: routes.childRoutes.map(route => createRoutes(route))
      });
    }

    return result;
  };

  return createRoutes;
}
