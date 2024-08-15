"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import IconPause from "@/app/assets/icon/IconPause";

import { useAtomValue, useSetAtom } from "jotai";
import { playDuration, playTime } from "@/app/store/atoms";
import IconPlay from "@/app/assets/icon/IconPlay";

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

const parseTimeToSeconds = (timeString: string) => {
  const [minutes, seconds] = timeString.split(":").map((v) => parseInt(v, 10));
  return minutes * 60 + seconds;
};

interface WavesurferCompPropType {
  musicname: string;
  musicPath: string;
  type: string;
  onPlay: () => void;
  onStop: () => void;
}

export default function WavesurferComp2({
  musicname,
  musicPath,
  type,
  onPlay,
  onStop,
}: WavesurferCompPropType) {
  const time = useAtomValue(playTime);
  const containerRef = useRef(null);
  const [duration, setDuration] = useState("0:00");
  const setglobalDuration = useSetAtom(playDuration);
  const [ex, setEx] = useState<string>("");
  const handleInput = (e: any) => {
    setEx(e.target.value);
  };

  useEffect(() => {
    if (wavesurfer && type === "main") {
      wavesurfer.setTime(time);
    }
  }, [time]);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 75,
    waveColor: "#f1f609",
    progressColor: "#0033ff",
    url: musicPath,
    barWidth: 2,
    dragToSeek: true,
  });

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        onStop();
      } else {
        wavesurfer.play();
        onPlay();
      }
    }
  }, [wavesurfer, onPlay, onStop]);

  if (wavesurfer) {
    wavesurfer.on("decode", (duration) => {
      setDuration(formatTime(duration));
      setglobalDuration(duration);
    });
  }

  return (
    <>
      <div className="relative flex justify-between">
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
    </>
  );
}
