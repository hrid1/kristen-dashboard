"use server"

import { cookies } from "next/headers";

export default async function SetCookies(token: string, role?: string) {
  (await cookies()).set("accessToken", token);
  if (role) {
    (await cookies()).set("userRole", role);
  }
}

export const getToken = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  return accessToken;
};

export async function removeToken() {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("userRole");
}
 