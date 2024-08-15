"use client";
import React, { useState } from "react";

interface DragnDropEditProps {
  audioFiles: File[];
  setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onFileUpload: (files: File[]) => void;
}

const DragnDropEdit: React.FC<DragnDropEditProps> = ({
  audioFiles,
  setAudioFiles,
  onFileUpload,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAudioFiles((prevFiles) => [...prevFiles, ...files]);
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      setAudioFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  return (
    <div
      className={`drop-area rounded-lg border-2  p-6 text-center ${
        dragOver ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-100"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="upload-label cursor-pointer font-semibold text-black"
      >
        Drag and drop files here or click to upload
      </label>
      {audioFiles.length > 0 && (
        <div className="file-list mt-4 border-t border-gray-200 pt-4">
          {audioFiles.map((file, index) => (
            <div
              key={index}
              className="file-item mb-2 flex items-center justify-between rounded-lg border border-gray-300 bg-white p-3"
            >
              <span className="file-name text-gray-900">{file.name}</span>
              <button
                className="h-[45px] w-[150px] rounded-full bg-black text-lg font-extrabold italic text-white transition  duration-200 hover:bg-gray-300 hover:text-black"
                onClick={() => onFileUpload([file])}
              >
                Upload to Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragnDropEdit;
