const API_BASE =
  typeof import.meta.env.PUBLIC_API_URL !== "undefined"
    ? import.meta.env.PUBLIC_API_URL
    : typeof window !== "undefined" && (window as any).PUBLIC_API_URL
    ? (window as any).PUBLIC_API_URL
    : "http://localhost:8000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => {
  const token = getToken();
  const base = { "Content-Type": "application/json" };
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
};

function setCookie(name: string, value: string, days = 7) {
  if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/; secure; samesite=strict`;
  }
}

function deleteCookie(name: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok && data.access) {
      localStorage.setItem("token", data.access);
      setCookie("access_token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
        setCookie("refresh_token", data.refresh);
      }
    }

    return data;
  },

  register: async (
    email: string,
    username: string,
    password1: string,
    password2: string
  ) => {
    const res = await fetch(`${API_BASE}/auth/registration/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password1, password2 }),
    });
    const data = await res.json();

    if (res.ok && data.access) {
      localStorage.setItem("token", data.access);
      setCookie("access_token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
        setCookie("refresh_token", data.refresh);
      }
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    deleteCookie("access_token");
    deleteCookie("refresh_token");
  },

  getUser: async () => {
    const res = await fetch(`${API_BASE}/auth/user/`, {
      headers: headers(),
    });
    return res.json();
  },

  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_BASE}/tasks/?${params}`, {
      headers: headers(),
    });
    return res.json();
  },

  createTask: async (task: { title: string; description?: string }) => {
    const res = await fetch(`${API_BASE}/tasks/`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(task),
    });
    return res.json();
  },

  updateTask: async (id: number, task: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(task),
    });
    return res.json();
  },

  deleteTask: async (id: number) => {
    return fetch(`${API_BASE}/tasks/${id}/`, {
      method: "DELETE",
      headers: headers(),
    });
  },
};
