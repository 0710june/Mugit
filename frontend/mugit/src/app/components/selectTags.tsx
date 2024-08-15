"use client";
import { useState } from "react";
import { genres } from "../constants/genres";
import { useTranslations } from "next-intl";

type SelectTagsPropsType = {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
};

function SelectTags({ selected, setSelected }: SelectTagsPropsType) {
  const t = useTranslations("Form");

  const toggleTag = (e: any) => {
    const isExist = selected.includes(e.target.value);
    if (selected && isExist) {
      const newSelected = selected.filter(
        (item: string) => item !== e.target.value
      );
      setSelected(newSelected);
    } else {
      const newSelected = [...selected, e.target.value];
      setSelected(newSelected);
    }
  };

  return (
    <>
      <h2 className="mt-4 text-lg">{t("tags")}</h2>
      <div className="flex min-h-10 w-full flex-wrap rounded-lg border-2 border-solid border-gray-300 border-b-gray-200 px-2">
        {selected &&
          selected.map((item: string) => {
            if (item)
              return (
                <button
                  className="relative my-1 ml-1 rounded-md border-2 border-solid bg-pointyellow bg-opacity-90 py-1 pl-2 pr-4 text-xs text-pointblue
									hover:bg-[#d0d302]"
                  key={item}
                  value={item}
                  onClick={toggleTag}
                >
                  {item}
                  <p className="absolute right-1 top-0 ">X</p>
                </button>
              );
          })}
      </div>
      <div className="mb-2 flex w-10/12 flex-wrap">
        {genres.map((item, idx) => {
          const isExist = selected.includes(item.name);
          return (
            <>
              {selected && isExist ? (
                <></>
              ) : (
                <button
                  key={idx}
                  value={item.name}
                  className="my-1 ml-1 rounded-md border-2 border-solid bg-gray-600 bg-opacity-50 px-2 py-1 text-xs text-white
									hover:bg-gray-500"
                  onClick={toggleTag}
                >
                  # {item.name}
                </button>
              )}
            </>
          );
        })}
      </div>
    </>
  );
}

export default SelectTags;
