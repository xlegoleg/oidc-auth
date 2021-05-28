import { Auth } from "@services/AuthService";
import { lazy } from "@utils/async";

export const router = (route: string): void => {
  switch(route) {
    case '/callback':
      lazy(Auth.loginCallback, Auth);
      break;
    case '/silent-renew':
      lazy(Auth.loginSilentRenew, Auth);
      break;
    default:
      break;
  }
}