import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Inject Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<{ token: string; username: string; nome: string; expiresIn: number }>(
      "/auth/login",
      data
    ),
};

// Clientes endpoints
export const clientesApi = {
  listar: (params?: { search?: string; status?: string; page?: number; size?: number }) =>
    api.get("/clientes", { params }),
  buscarPorId: (id: number) => api.get(`/clientes/${id}`),
  criar: (data: unknown) => api.post("/clientes", data),
  atualizar: (id: number, data: unknown) => api.put(`/clientes/${id}`, data),
  deletar: (id: number) => api.delete(`/clientes/${id}`),
};
