import AuthService from "@services/AuthService"

export const initListeners = (): void => {
  const auth = new AuthService();
  // @ts-ignore
  console.log(window.EventBus)
  // @ts-ignore
  window.EventBus.addEventListener('logout', () => {
    auth.logout();
  })
}