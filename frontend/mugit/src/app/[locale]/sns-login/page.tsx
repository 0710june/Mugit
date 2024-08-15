"use client";

import { useEffect } from "react";
import { apiUrl, blocalUrl } from "@/app/store/atoms";
import { useLocale } from "next-intl";
import { useSetAtom, useAtomValue } from "jotai";
import { userAtom } from "@/app/store/atoms/user";
import Cookies from "js-cookie";
import { prevpathAtom } from "@/app/store/atoms/user";
import fireToast from "@/app/utils/fireToast";
import Loading from "@/app/components/loading";

export default function Page() {
  const locale = useLocale();
  const setUser = useSetAtom(userAtom);
  const prevpath = useAtomValue(prevpathAtom);

  useEffect(() => {
    const accessToken = window.location.hash.split("=")[1].split("&")[0];
    fetch(apiUrl + "/users/login", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
      .then((response) => {
        switch (response.status) {
          case 200: {
            setUser({
              id: String(Cookies.get("userId")),
              isLogined: String(Cookies.get("isLogined")),
              nickName: String(Cookies.get("nickName")),
              profileImagePath: String(Cookies.get("profileImagePath")),
              profileText: String(Cookies.get("profileText")),
              followerCount: String(Cookies.get("followers")),
              followingCount: String(Cookies.get("followings")),
            });

            if (prevpath) {
              location.href = prevpath;
            }
            break;
          }
          case 302: {
            location.href = `/${locale}/register`;
            break;
          }
        }
      })
      .catch((error) => console.log(error));
  });
  return <Loading />;
}
