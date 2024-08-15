"use client";

import { Link } from "@/navigation";
import { usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import Logo from "../assets/logo";
import { navbaritems } from "../constants/navbaritems";
import GoogleButton from "../container/google/googlebutton";
import { useAtom } from "jotai";
import { userAtom, userInitialValue } from "../store/atoms/user";
import { apiUrl } from "../store/atoms";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import fireToast from "../utils/fireToast";
import Notification from "./notification";

const Navbar = () => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const [user, setUser] = useAtom(userAtom);

  const signOut = () => {
    fetch("https://mugit.site/sse/complete", {
      credentials: "include",
    });
    fetch(apiUrl + "/users/logout").then((response) => {
      switch (response.status) {
        case 200: {
          setUser(userInitialValue);
          localStorage.clear();
          // router.push(`/${locale}`);
          router.refresh();
          fireToast({
            type: "성공",
            title: "로그아웃이 되었습니다",
          });
          break;
        }
        case 401: {
          fireToast({
            type: "에러",
            title: "로그인 정보가 없습니다.",
          });
          break;
        }
      }
    });
  };

  return (
    <nav className="flex h-[10%] w-full items-center justify-between bg-pointblack p-5">
      <Link
        href="/"
        className="mr-6 flex flex-shrink-0 items-center text-white"
      >
        <Logo />
        <span className="ml-2 text-2xl font-semibold tracking-tight">
          MUGIT
        </span>
      </Link>
      {/* <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-500 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div> */}
      <div className="flex w-full items-center justify-between">
        <div className="flex text-sm">
          {navbaritems.map((item) => {
            if (user.isLogined !== "true" && item.name === "feed") {
              return null;
            }
            let activefonts;
            if (pathname.includes(item.to)) {
              activefonts = "text-white font-bold";
            } else {
              activefonts = "text-gray-500";
            }
            return (
              <Link
                key={item.id}
                href={item.to}
                className={`mr-4 block hover:text-white lg:mt-0 lg:inline-block ${activefonts}`}
              >
                {t(item.name)}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center">
          {locale === "en" ? (
            <Link
              locale="ko"
              href={pathname}
              className="mx-3 text-2xl text-white"
            >
              <Image
                width={50}
                height={50}
                alt="English"
                className="h-8 w-8"
                priority
                src="/en.png"
              />
            </Link>
          ) : (
            <Link
              locale="en"
              href={pathname}
              className="mx-3 text-2xl text-white"
            >
              <Image
                width={50}
                height={50}
                alt="Korea"
                className="h-8 w-8"
                priority
                src="/ko.png"
              />
            </Link>
          )}
          {user.isLogined == "true" ? (
            <div className="flex w-28 justify-between">
              <Link href={`/profile/${user.id}`}>
                <Image
                  src={user.profileImagePath}
                  className="h-[32px] w-[32px] rounded-full"
                  alt="Avatar"
                  width={32}
                  height={32}
                />
              </Link>
              <button
                onClick={signOut}
                className="p h-8 w-8 rounded-full border-2 border-slate-500 pl-[3px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="rgb(100 116 139)"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
              <Notification />
            </div>
          ) : (
            <div className="flex">
              <GoogleButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
