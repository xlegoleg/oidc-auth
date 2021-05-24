import AuthService from "@services/AuthService";

const auth = new AuthService();

export const routes = [
  '/callback',
  '/silent-renew'
]

const lazy = (action: Function) => {
  window.setTimeout(() => {
    action.call(auth);
  }, 500);
}

export const router = (route: string): void => {
  switch(route) {
    case '/callback':
      lazy(auth.loginCallback);
      break;
    case '/silent-renew':
      lazy(auth.loginSilentRenew);
      break;
    default:
      break;
  }
}