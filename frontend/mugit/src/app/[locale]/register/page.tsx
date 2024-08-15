"use client";

import Image from "next/image";
import { useState } from "react";
import { apiUrl, blocalUrl } from "@/app/store/atoms";
import { useLocale } from "next-intl";

export default function Page() {
  const locale = useLocale();
  const [nickname, setNickname] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  function register() {
    fetch(apiUrl + "/users/regist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nickName: nickname,
        profileText: description,
        profileImagePath: "",
      }),
    })
      .then((response) => {
        switch (response.status) {
          case 201: {
            location.href = `/${locale}`;
            break;
          }
          case 400: {
            alert("400에러");
            break;
          }
          case 409: {
            alert("중복되는 닉네임입니다. 다른 이름을 입력하세요.");
            break;
          }
        }
      })
      .catch((error) => console.log(error));
  }
  return (
    <div className="mx-auto mt-[4%] flex w-[80%] rounded-lg border-2 border-solid border-[#33CECC]">
      <Image
        src="/register2.webp"
        alt="register image"
        className="w-[70%] rounded-l-md"
        width={1920}
        height={1200}
      />
      <div className="relative m-auto h-[350px]">
        <p className="mb-3 text-xl font-semibold">Nickname</p>
        <input
          type="text"
          className="mb-3 w-full rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none focus:ring focus:ring-slate-300"
          onChange={(event) => setNickname(event.target.value)}
        />
        <p className="mb-3 text-xl font-semibold">Description</p>
        <textarea
          className="mb-3 h-32 w-full rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none focus:ring focus:ring-slate-300"
          onChange={(event) => setDescription(event.target.value)}
        />
        <button
          className="absolute bottom-0 right-0 mb-5 rounded border-2 border-pointblue bg-pointblue px-2 py-1 text-lg font-semibold text-white"
          onClick={register}
        >
          Sign Up
        </button>
      </div>
    </div>
    // <div className="absolute left-[33.33%] top-1/4 w-1/3 rounded bg-white/75 pl-[5%] pt-5">
    //   <p className="mb-3 text-xl font-semibold">Nickname</p>
    //   <input
    //     type="text"
    //     className="mb-3 w-5/6 rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none focus:ring focus:ring-slate-300"
    //   />
    //   <p className="mb-3 text-xl font-semibold">Description</p>
    //   <textarea className="mb-3 h-32 w-5/6 rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none focus:ring focus:ring-slate-300" />
    //   <button className="mb-5 rounded border-2 border-pointblue bg-pointblue px-2 py-1 text-lg font-semibold text-white">
    //     Sign Up
    //   </button>
    // </div>
  );
}
