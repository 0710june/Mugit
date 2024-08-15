"use client";

import { useAtom } from "jotai";
import BottomController from "./BottomController";
// import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { isplaying, nowPlaying, SonginitialValue } from "@/app/store/atoms";
import { useState } from "react";

const BottomPlaybar = () => {
  const [playing, setPlaying] = useAtom(isplaying);
  const [song, setSong] = useAtom(nowPlaying);

  const handleClose = () => {
    localStorage.clear();
    setPlaying(false);
    setSong(SonginitialValue);
  };

  return (
    <>
      {playing === true ? (
        <>
          <div className="fadeIn z-40 pt-4"></div>
          <div className="fixed bottom-0 left-0 flex h-24 w-full items-center bg-pointblue px-20">
            <div className="flex w-[30%]">
              <Image
                width={50}
                height={50}
                alt={song.title}
                className="h-16 w-16 rounded-md"
                priority
                src={song.coverPath}
              />
              <div className="mx-4 flex flex-col">
                <span className="mb-2 text-2xl font-bold text-pointyellow">
                  {song?.title}
                </span>
                <span className="text-pointyellow">{song?.user.nickName}</span>
              </div>
            </div>
            <BottomController />
            <div
              className="fixed bottom-16 right-5 text-white"
              onClick={() => handleClose()}
            >
              X
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default BottomPlaybar;
