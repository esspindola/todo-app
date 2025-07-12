import { proxy } from "valtio";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; secure; samesite=strict`;
  }
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

function deleteCookie(name: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

export const authStore = proxy({
  user: null as null | { username: string; email: string },
  access: null as null | string,
  refresh: null as null | string,
  setUser(
    user: { username: string; email: string },
    access: string,
    refresh: string
  ) {
    authStore.user = user;
    authStore.access = access;
    authStore.refresh = refresh;
    setCookie("access_token", access);
    setCookie("refresh_token", refresh);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("token", access);
      localStorage.setItem("refresh_token", refresh);
    }
  },
  logout() {
    authStore.user = null;
    authStore.access = null;
    authStore.refresh = null;
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  },
  loadFromCookies() {
    if (typeof document === "undefined") return;
    const access = getCookie("access_token");
    const refresh = getCookie("refresh_token");
    if (access) {
      authStore.access = access;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", access);
      }
    }
    if (refresh) {
      authStore.refresh = refresh;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("refresh_token", refresh);
      }
    }
  },
});
