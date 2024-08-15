import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { minusCircleIcon, plusCircleIcon } from "../../constants/icons";
import WaveSurferComp from "../../../WaveSurferComp";
import { useAtom } from "jotai";
import { fileToAdd } from "@/app/store/atoms/editfile";

interface AudioFile {
  file: File;
  id: string;
  url: string;
}

interface DragnDropProps {
  audioFiles: AudioFile[];
  setAudioFiles: (files: AudioFile[]) => void;
}

export default function DragnDrop({
  audioFiles,
  setAudioFiles,
}: DragnDropProps) {
  useEffect(() => {
    document.body.ondrop = (e) => e.preventDefault();
  }, []);

  const [addFile, setAddFile] = useAtom(fileToAdd);

  const handleAddFile = (id: string) => {
    const audio = audioFiles.find((audioFile) => audioFile.id === id);
    if (audio) {
      const prev = addFile;
      setAddFile({ source: [...prev.source, audio] });
    }
    console.log("어케됨", audio, addFile);
  };

  // const handleFilesDrop = (files: FileList) => {
  //   const newFiles = Array.from(files).map((file) => {
  //     const url = URL.createObjectURL(file);
  //     return { file, id: uuidv4(), url };
  //   });
  //   setAudioFiles([...audioFiles, ...newFiles]);
  // };

  const handleFilesDrop = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      const newFile = new File([file], file.name, { type: file.type });
      return { file: newFile, id: uuidv4(), url };
    });
    setAudioFiles([...audioFiles, ...newFiles]);
  };

  // const handlePlayPause = (id: string) => {
  //   const audio = audioFiles.find((audioFile) => audioFile.id === id);
  //   if (audio) {
  //     // Implement play/pause functionality here if needed
  //   }
  // };

  return (
    <>
      <div
        id="drop"
        className="drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesDrop(e.dataTransfer.files);
        }}
      >
        새로운 영감을 끌어당겨보세요 !
      </div>
      {audioFiles.map(({ file, id, url }) => (
        <div key={id} className="file-container relative mb-5 flex flex-col">
          <div className="flex justify-between">
            {/* <button
              onClick={() => handlePlayPause(id)}
              className="border-zz h-fit border-solid border-black bg-pointyellow text-black"
            >
              {playIcon}
            </button> */}
            <div>
              <button
                onClick={() => {
                  setAudioFiles(audioFiles.filter((x) => x.id !== id));
                  URL.revokeObjectURL(url); // Clean up the object URL
                }}
                className="h-fit"
              >
                {minusCircleIcon}
              </button>
              <button
                onClick={() => {
                  handleAddFile(id);
                }}
                className="h-fit"
              >
                {plusCircleIcon}
              </button>
            </div>
            <p className="file-info">{file.name}</p>
          </div>
          <WaveSurferComp
            key={id}
            musicname={file.name}
            musicPath={url}
            type="source"
          />
        </div>
      ))}
      <style jsx>{`
        .drop-area {
          height: 128px;
          border: 2px dashed lightgray;
          border-radius: 4px;
          margin: 2em 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 18px;
        }
        .file-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
