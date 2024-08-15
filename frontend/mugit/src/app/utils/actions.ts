"use server";

import { cookies } from "next/headers";

export async function deleteCookie(data: any) {
  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("name", "value", { expires: Date.now() - oneDay });
}

export async function createCookie(data: any) {
  cookies().set("name", "lee");
  // // or
  // cookies().set("name", "lee", { secure: true });
  // // or
  // cookies().set({
  //   name: "name",
  //   value: "lee",
  //   httpOnly: true,
  //   path: "/",
  // });
}
