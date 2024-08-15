"use client";

import { useCallback, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { formatTime } from "@/app/utils/formatTime";
import IconPlay from "@/app/assets/icon/IconPlay";
import IconPause from "@/app/assets/icon/IconPause";

export default function AudioSprites({ mymedia }: { mymedia: File }) {
  const containerRef = useRef(null);
  const [duration, setDuration] = useState("0:00");
  const [audiorurl, setaudiourl] = useState("");

  const reader = new FileReader();
  reader.readAsDataURL(mymedia); // mymedia를 Data URL로 읽기
  reader.onload = (event) => {
    if (event.target) {
      const myurl = event.target.result as string;
      setaudiourl(myurl);
    }
  };

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 75,
    waveColor: "#f1f609",
    progressColor: "#0033ff",
    barWidth: 2,
    url: audiorurl,
    dragToSeek: true,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  if (wavesurfer) {
    wavesurfer.on("decode", (duration) => setDuration(formatTime(duration)));
  }

  return (
    <div className="relative my-2 flex justify-between">
      <button
        onClick={onPlayPause}
        className="h-[75px] w-[75px] rounded-full bg-pointyellow"
      >
        {isPlaying ? (
          <IconPause
            color="#0033ff"
            size="3rem"
            tailwindCSS="absolute top-4 left-3.5"
          />
        ) : (
          <IconPlay
            color="#0033ff"
            size="3.2rem"
            tailwindCSS="absolute top-4 left-3.5"
          />
        )}
      </button>
      <div className="relative z-0 inline-block w-[88%]">
        <div ref={containerRef} />
        <div className="absolute bottom-0 left-0 z-10 -mt-[1px] bg-pointblack p-0.5 text-[11px] text-white">
          {formatTime(currentTime)}
        </div>
        <div className="absolute bottom-0 right-0 z-10 -mt-[1px] bg-pointblack p-0.5 text-[11px] text-white">
          {duration}
        </div>
      </div>
    </div>
  );
}
