/** Full navigation so server layouts pick up the new session cookie after signIn. */
export function redirectAfterSignIn(callbackUrl: string) {
  const url = callbackUrl.startsWith('/') ? callbackUrl : '/'
  window.location.assign(url)
}
