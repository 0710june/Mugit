"use client";

import IconSearch from "@/app/assets/icon/IconSearch";
import { genres } from "@/app/constants/genres";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export default function Searchbar() {
  const t = useTranslations("Trends");
  const router = useRouter();
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (e.target.value.length > 0) {
      setShowIcon(false);
    } else {
      setShowIcon(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      router.push(`/trends/${searchInput}`);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="relative h-12 w-full rounded-full border-2 border-solid bg-white p-0">
        <input
          type="text"
          placeholder={t("searchSound")}
          className=" h-full w-[85%] rounded-full p-0 pl-4 outline-none"
          onChange={(event) => handleInput(event)}
          onKeyUp={(event) => handleKeyUp(event)}
          value={searchInput}
        />
        <button
          onClick={() => router.push(`/trends/${searchInput}`)}
          className="h-full w-[15%] rounded-full border-2 border-solid bg-pointblue px-4 py-2 text-white"
        >
          {t("search")}
        </button>

        {showIcon ? (
          <IconSearch tailwindCSS="pointer-events-none absolute top-4 left-2 mr-2 w-10" />
        ) : (
          <></>
        )}
      </div>

      <div className="my-6 flex w-full flex-col">
        <p className="mb-3 text-xl font-bold"> {t("browseGenres")}</p>
        <div className="flex w-full flex-wrap">
          {genres.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => router.push(`/trends/${item.name}`)}
                className="my-1 mr-3 cursor-pointer rounded-lg border-2 border-solid p-2 text-gray-500
								transition duration-300 hover:bg-pointblack hover:text-white"
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
