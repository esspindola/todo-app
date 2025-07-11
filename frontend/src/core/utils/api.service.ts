const API_BASE = import.meta.env.PUBLIC_API_URL;

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) localStorage.setItem("token", data.access);
    return data;
  },

  register: async (email: string, password1: string, password2: string) => {
    const res = await fetch(`${API_BASE}/auth/registration/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password1, password2 }),
    });
    return res.json();
  },

  logout: () => localStorage.removeItem("token"),

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
