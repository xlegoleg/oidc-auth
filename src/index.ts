import { routes, router } from './router/router';
import initAppConfig from "@utils/app-config";
import AuthService, { auth } from "@services/AuthService";
import { initListeners } from './bus';

const authInitialization = () => {
  initAppConfig().then(async (config: any) => {
    initListeners();
    window.localStorage.setItem('arm_auth_config', JSON.stringify(config));
    const auth = new AuthService();
    const user = await auth.getUser();
    if (user) {
      if (location.pathname === '/') {
        const prevUrl = window.localStorage.getItem('prev_url');

        if (prevUrl) {
          window.localStorage.removeItem('prev_url');
          location.replace(`${location.origin}${prevUrl}`)
        }

      }
    } else {
      const pathname = location.pathname.replace('/microws', '');
      const search = location.search;
      if (routes.includes(pathname)) {
        router(pathname)
      } else if (pathname !== '/' && pathname !== '/callback') {
        window.localStorage.setItem('prev_url', `${pathname}${search}`);
      } else {
        auth.login();
      }
    }
  })
}

// authInitialization();

export default authInitialization;