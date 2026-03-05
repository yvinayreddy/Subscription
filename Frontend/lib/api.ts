const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ ok: boolean; token: string; user: User }>("/auths/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ ok: boolean; user: User }>("/auths/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
};

// Posts
export const postsApi = {
  getAll: (page = 1, limit = 10) =>
    request<{
      ok: boolean;
      data: Post[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/posts?page=${page}&limit=${limit}`),
  getById: (postId: string) =>
    request<{ ok: boolean; data: Post }>(`/posts/${postId}`),
  create: (formData: FormData) =>
    request<{ ok: boolean; data: Post }>("/posts", {
      method: "POST",
      body: formData,
    }),
  delete: (postId: string) =>
    request<{ ok: boolean; message: string }>(`/posts/${postId}`, {
      method: "DELETE",
    }),
};

// Plans
export const plansApi = {
  getAll: () =>
    request<{ ok: boolean; count: number; plans: Plan[] }>("/plans"),
  getById: (id: string) =>
    request<{ ok: boolean; plan: Plan }>(`/plans/${id}`),
  create: (data: { name: string; price: number; duration: number }) =>
    request<{ ok: boolean; message: string; plan: Plan }>("/plans", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Plan>) =>
    request<{ ok: boolean; message: string; plan: Plan }>(`/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ ok: boolean; message: string }>(`/plans/${id}`, {
      method: "DELETE",
    }),
};

// Subscriptions
export const subscriptionsApi = {
  create: (planId: string) =>
    request<{ ok: boolean; message: string; subscription: Subscription }>(
      "/subscriptions",
      {
        method: "POST",
        body: JSON.stringify({ planId }),
      }
    ),
  getAll: (filter?: { status?: string; userId?: string }) => {
    const params = new URLSearchParams();
    if (filter?.status) params.set("status", filter.status);
    if (filter?.userId) params.set("userId", filter.userId);
    const qs = params.toString();
    return request<{
      ok: boolean;
      count: number;
      subscriptions: Subscription[];
    }>(`/subscriptions${qs ? `?${qs}` : ""}`);
  },
  getById: (subscriptionId: string) =>
    request<{ ok: boolean; subscription: Subscription }>(
      `/subscriptions/${subscriptionId}`
    ),
  cancel: (subscriptionId: string) =>
    request<{ ok: boolean; message: string; subscription: Subscription }>(
      `/subscriptions/${subscriptionId}/cancel`,
      { method: "PUT" }
    ),
  renew: (subscriptionId: string) =>
    request<{ ok: boolean; subscription: Subscription }>(
      `/subscriptions/${subscriptionId}/renew`,
      { method: "PUT" }
    ),
};

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  image: string;
  caption: string;
  user: User | string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  user: User | string;
  plan: Plan | string;
  startDate: string;
  endDate: string;
  status: "active" | "cancelled" | "expired";
  createdAt: string;
  updatedAt: string;
}
