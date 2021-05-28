export const lazy = (action: Function, context: any) => {
  window.setTimeout(() => {
    action.call(context);
  }, 500);
}