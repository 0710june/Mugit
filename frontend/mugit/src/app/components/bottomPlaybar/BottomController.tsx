"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { formatTime } from "@/app/utils/formatTime";
import { useAtomValue } from "jotai";
import { nowPlaying } from "@/app/store/atoms";
import IconPlay from "@/app/assets/icon/IconPlay";
import IconPause from "@/app/assets/icon/IconPause";
import ReadyLine from "./readyLine";

export default function BottomController() {
  const media = useRef(null);
  const containerRef = useRef(null);
  const song = useAtomValue(nowPlaying);
  const [duration, setDuration] = useState("");
  const [_isplaying, setIsPlaying] = useState(false);

  const { wavesurfer, isPlaying, currentTime, isReady } = useWavesurfer({
    container: containerRef,
    height: 10,
    width: 600,
    normalize: false,
    waveColor: "#f1f609",
    progressColor: "#dd5e98",
    cursorColor: "#ddd5e9",
    cursorWidth: 10,
    barWidth: 30,
    barGap: 1,
    barHeight: 0.6,
    minPxPerSec: 1,
    fillParent: true,
    url: song.musicPath,
    mediaControls: false,
    interact: true,
    dragToSeek: false,
    hideScrollbar: true,
    audioRate: 1,
    autoScroll: true,
    autoCenter: true,
    sampleRate: 8000,
  });

  // const onPlayPause = useCallback(() => {
  //   wavesurfer && wavesurfer.playPause();
  // }, [wavesurfer]);

  const onPlayPause = () => {
    setIsPlaying(!_isplaying);
    wavesurfer && wavesurfer.playPause();
  };

  if (wavesurfer) {
    wavesurfer.on("decode", (duration) => setDuration(formatTime(duration)));
  }

  useEffect(() => {
    setIsPlaying(true);
    wavesurfer && wavesurfer.play();
  }, [song.id, wavesurfer]);

  return (
    <>
      <div className="flex w-[60%] items-center justify-center">
        <div
          onClick={onPlayPause}
          style={{ minWidth: "5em" }}
          className="flex w-[10%] items-center justify-center "
        >
          {_isplaying ? (
            <IconPause tailwindCSS="" color="#f1f609" size="50px" />
          ) : (
            <IconPlay tailwindCSS="" color="#f1f609" size="55px" />
          )}
        </div>
        <div className="mr-2 text-pointyellow">{formatTime(currentTime)}</div>
        <div className="">
          <div ref={containerRef} className="fadeIn" />
          {!isReady && <ReadyLine key={song.id} />}
        </div>
        <div className="text-pointyellow">{duration}</div>
      </div>
    </>
  );
}
