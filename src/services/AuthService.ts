import {
  UserManager,
  WebStorageStateStore,
  User,
  UserManagerSettings,
} from 'oidc-client';
import scopes from '@utils/scopes';
import _ from 'lodash';
import { router } from '@router/router';
import { routes } from '@router/routes'
import { messageBroadcast } from '@/utils/broadcast';

export default class AuthService {

  private user: User | null = null;
  private userManager: UserManager;

  constructor() {
    const STS_DOMAIN = process.env.AUTH_DOMAIN;
    let scope: string[] = [];

    for (const key in scopes) {
      scope.push(..._.get(scopes, key).list);
    }

    scope = _.uniq(scope);

    const settings: UserManagerSettings = {
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: STS_DOMAIN,
      client_id: 'arm',
      redirect_uri: `${origin}${
        process.env.APP_PROJECT_PATH || ''
      }/callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${origin}${
        process.env.APP_PROJECT_PATH || ''
      }/silent-renew`,
      response_type: 'code',
      response_mode: 'query',
      scope: scope.join(' '),
      post_logout_redirect_uri: `${document.location.origin}${
        process.env.APP_PROJECT_PATH || ''
      }`,
      filterProtocolClaims: true,
      // offset for waiting before renew token by timeout (see accessTokenExpiringNotificationTime).
      silentRequestTimeout: process.env.APP_AUTH_SILENT_TIMEOUT || 0,
    };

    this.userManager = new UserManager(settings);

    // #region events OIDC-CLIENT
    this.userManager.events.addUserLoaded((user) => {
      this.user = user;
    });
    // this.userManager.events.addUserUnloaded(() => {
    //     console.info('auth UM.addUserUnloaded');
    // });
    this.userManager.events.addSilentRenewError((e) => {
      // store.dispatch('utils/error/error', e);
      this.logout().then(() => {
        this.user = null;
        this.login();
      });
    });
    this.userManager.events.addUserUnloaded(() => {
      messageBroadcast({
        oidcClient: {
          action: 'relogin',
        },
      });
    });
    // this.userManager.events.addAccessTokenExpiring((...args) => {
    //     console.info('auth UM.addAccessTokenExpiring', ...args);
    // });
    // this.userManager.events.addAccessTokenExpired((...args) => {
    //     console.info('auth UM.addAccessTokenExpired', ...args);
    // });
    // #endregion
  }

  public async checkLoginUser(): Promise<void> {
    const user = await this.getUser() ;
    if (user) {
      window.localStorage.setItem('arm_auth_user', JSON.stringify(user));
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
        this.login();
      }
    }
  }

  public getUser(): Promise<User | null> {
    if (this.user) return Promise.resolve(this.user);
    else return this.userManager.getUser();
  }

  public setUser(user: User | null): void {
    this.user = user;
  }

  public isAuthorized(): boolean {
    return !!this.user && !this.user.expired;
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  /**
   * oidc-client specific callback. {@see UserManagerSettings.redirect_uri}
   */
  public loginCallback(): void {
    this.userManager.signinRedirectCallback().then(() => {
      window.location.href = process.env.APP_PROJECT_PATH || '/';
    });
  }

  /**
   * need for silent renew token by timeout {@see UserManagerSettings.silentRequestTimeout}
   */
  public loginSilentRenew(): void {
    this.userManager
      .signinSilentCallback()
      .catch((e) => {
       // store.dispatch('utils/error/error', ['_SILENT-RENEW.catch', e])
      });
  }

  public logout(): Promise<void> {
    window.localStorage.removeItem('arm_auth_user');
    return this.userManager.signoutRedirect();
  }

  public getAccessToken(): Promise<string> {
    return this.userManager.getUser().then((data: any) => {
      return data?.access_token;
    });
  }
}

/**
 * @singleton Auth instance
 */
export const Auth = new AuthService();
