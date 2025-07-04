"use server";

import { cookies } from "next/headers";

export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const setUserDataCookie = async (userData: string) => {
  const cookieStore = await cookies();
  cookieStore.set("user-data", userData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth");
  cookieStore.delete("user-data");
};

export const getTokenFromCookie = async () => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth");
  return tokenCookie?.value;
};

export const getUserDataFromCookie = async () => {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get("user-data");
  return userDataCookie?.value ? JSON.parse(userDataCookie.value) : null;
}; 