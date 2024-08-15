"use client";
import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import {
  recordIcon,
  stopIcon,
  playIcon,
  pauseIcon,
  downloadIcon,
} from "../../constants/icons";

interface LiveRecordProps {
  onFileUpload: (files: File[]) => void;
}

const LiveRecord: React.FC<LiveRecordProps> = ({ onFileUpload }) => {
  const [wavesurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [record, setRecord] = useState<any | null>(null);
  const [scrollingWaveform, setScrollingWaveform] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedFiles, setRecordedFiles] = useState<File[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const audioDevices = deviceInfos.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices(audioDevices);
    });
  }, []);

  useEffect(() => {
    createWaveSurfer();
    return () => {
      wavesurfer?.destroy();
    };
  }, [scrollingWaveform]);

  const createWaveSurfer = () => {
    if (wavesurfer) {
      wavesurfer.destroy();
    }
    const container = document.querySelector<HTMLDivElement>("#mic");
    if (container) {
      const ws = WaveSurfer.create({
        container,
        waveColor: "#d1d5da",
        progressColor: "#0366d6",
        barWidth: 2,
        barHeight: 1.5,
        cursorWidth: 1,
        normalize: true,
      });
      setWaveSurfer(ws);

      const rec = ws.registerPlugin(
        RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false })
      );
      setRecord(rec);

      rec.on("record-end", (blob: Blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        setRecordedUrl(recordedUrl);

        const wsRecorded = WaveSurfer.create({
          container: "#recordings",
          waveColor: "#d1d5da",
          progressColor: "#0366d6",
          barWidth: 2,
          barHeight: 1.5,
          cursorWidth: 1,
          normalize: true,
          url: recordedUrl,
        });

        const playButton = document.createElement("button");
        playButton.textContent = "재생";
        playButton.className = "button";
        playButton.onclick = () => wsRecorded.playPause();
        wsRecorded.on("pause", () => (playButton.textContent = "재생"));
        wsRecorded.on("play", () => (playButton.textContent = "일시정지"));

        const downloadLink = document.createElement("a");
        Object.assign(downloadLink, {
          href: recordedUrl,
          download:
            "recording." + blob.type.split(";")[0].split("/")[1] || "webm",
          textContent: "다운로드",
        });
        downloadLink.className = "link";

        const uploadButton = document.createElement("button");
        uploadButton.textContent = "편집을 위해 업로드";
        uploadButton.className = "button";
        uploadButton.onclick = () => {
          const file = new File([blob], "recording.webm", {
            type: blob.type,
          });
          onFileUpload([file]);
        };

        const recordingsContainer = document.querySelector("#recordings");
        if (recordingsContainer) {
          recordingsContainer.innerHTML = "";
          recordingsContainer.appendChild(playButton);
          recordingsContainer.appendChild(downloadLink);
          recordingsContainer.appendChild(uploadButton);
        }

        // Add to recorded files list
        const file = new File(
          [blob],
          `녹음파일_${recordedFiles.length + 1}.webm`,
          {
            type: blob.type,
          }
        );
        setRecordedFiles((prevFiles) => [...prevFiles, file]);
      });

      rec.on("record-progress", (time: number) => {
        updateProgress(time);
      });
    }
  };

  const updateProgress = (time: number) => {
    const formattedTime = [
      Math.floor((time % 3600000) / 60000),
      Math.floor((time % 60000) / 1000),
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
    const progressElement =
      document.querySelector<HTMLParagraphElement>("#progress");
    if (progressElement) {
      progressElement.textContent = formattedTime;
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // const handlePauseClick = () => {
  //   if (record?.isPaused()) {
  //     record.resumeRecording();
  //     togglePlay();
  //   } else {
  //     record.pauseRecording();
  //     togglePlay();
  //   }
  // };

  const toggleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleRecordClick = () => {
    if (record?.isRecording() || record?.isPaused()) {
      record?.stopRecording();
      toggleRecord();
    } else {
      toggleRecord();
      record?.startRecording({ deviceId: selectedDeviceId });
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrollingWaveform(e.target.value === "scrolling");
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-gray-100 p-5 shadow-md">
      <div className="mb-4 flex items-center">
        <label className="mr-4 text-gray-700">
          <input
            type="radio"
            name="waveform"
            value="scrolling"
            checked={scrollingWaveform}
            onChange={handleRadioChange}
            className="mr-2"
          />
          스크롤 웨이브폼
        </label>
        <label className="text-gray-700">
          <input
            type="radio"
            name="waveform"
            value="static"
            checked={!scrollingWaveform}
            onChange={handleRadioChange}
            className="mr-2"
          />
          고정 웨이브폼
        </label>
      </div>
      <div className="mb-4 flex items-center">
        <button
          id="record"
          className="flex h-[45px] w-[150px] items-center justify-center rounded-full bg-black text-lg font-extrabold italic text-white transition  duration-200 hover:bg-gray-300 hover:text-black"
          onClick={handleRecordClick}
        >
          {isRecording ? stopIcon : recordIcon}
          <span className="ml-2">
            {isRecording ? "녹음 중지" : "녹음 시작"}
          </span>
        </button>
        {/* <button
          id="pause"
          className="mr-4 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handlePauseClick}
        >
          {isPlaying ? pauseIcon : playIcon}
          <span className="ml-2">{isPlaying ? "재생 중지" : "재생"}</span>
        </button> */}
        <select
          id="mic-select"
          className="mx-4 rounded-md border border-gray-300 px-4 py-2"
          onChange={handleDeviceChange}
          value={selectedDeviceId}
        >
          <option value="">마이크 선택</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `마이크 ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <p id="progress" className="mb-4 text-lg text-gray-600">
        00:00
      </p>
      <div
        id="mic"
        className="mb-4 rounded-md border border-gray-300 bg-white p-4"
      ></div>
      <div
        id="recordings"
        className="mb-4 rounded-md border border-gray-300 bg-white p-4"
      ></div>
      <div className="rounded-md border border-gray-300 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          녹음 파일 목록
        </h3>
        <ul>
          {recordedFiles.map((file, index) => (
            <li key={index} className="mb-2 flex items-center justify-between">
              <span>{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="text-blue-600 hover:text-blue-800"
              >
                다운로드
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveRecord;
