export function isLoggedIn() {
  try {
    return Boolean(localStorage.getItem("token") && JSON.parse(localStorage.getItem("user") || "null"));
  } catch {
    return false;
  }
}

export function requestLogin() {
  window.dispatchEvent(new Event("open-login-modal"));
}
