"use client";

import IconPlay from "@/app/assets/icon/IconPlay";
import { FlowType } from "@/app/types/flowtype";
import { SonginitialValue } from "@/app/store/atoms";

type PlayHoverPropsType = {
  item: FlowType;
  css?: string;
};

import { isplaying, nowPlaying } from "@/app/store/atoms";
import { useSetAtom } from "jotai";

export default function PlayHover({ item, css }: PlayHoverPropsType) {
  const setPlay = useSetAtom(isplaying);
  const setSong = useSetAtom(nowPlaying);

  const setLocalStorage = () => {
    setSong(SonginitialValue);
    setPlay(false);
    setPlay(true);
    setSong(item);
  };

  return (
    <div className="group absolute top-0 h-full w-full rounded-lg hover:bg-gray-600 hover:bg-opacity-75">
      <IconPlay
        onClick={setLocalStorage}
        tailwindCSS={
          css
            ? css
            : "absolute top-[40%] left-[40%] hidden group-hover:block z-10 cursor-pointer"
        }
      />
    </div>
  );
}
