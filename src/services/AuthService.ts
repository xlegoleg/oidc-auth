import {
  UserManager,
  WebStorageStateStore,
  User,
  UserManagerSettings,
} from 'oidc-client';
import scopes from '@utils/scopes';
import _ from 'lodash';
//import store from '@state/store';
import { messageBroadcast } from '@/utils/broadcast';

export default class AuthService {
  private user: User | null = null;
  private userManager: UserManager;

  constructor() {
    const config: any = window.localStorage.getItem('arm_auth_config');
    const STS_DOMAIN = config ? JSON.parse(config).authority : '';
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
    return this.userManager.signoutRedirect();
  }

  public getAccessToken(): Promise<string> {
    return this.userManager.getUser().then((data: any) => {
      return data?.access_token;
    });
  }
}

export const auth = new AuthService()
