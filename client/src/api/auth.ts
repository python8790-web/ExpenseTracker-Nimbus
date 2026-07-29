import api from "./axios";
import type { User } from "../types";

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<{ message: string; user: User }>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function updateMe(payload: { name?: string; email?: string }) {
  const { data } = await api.put<User>("/auth/me", payload);
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.put<{ message: string }>("/auth/me/password", {
    currentPassword,
    newPassword,
  });
  return data;
}
