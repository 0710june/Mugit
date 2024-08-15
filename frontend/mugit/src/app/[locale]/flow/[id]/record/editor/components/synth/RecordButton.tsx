import React, { useState, useRef } from "react";

interface RecordButtonProps {
  onSave: (file: File) => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });
      onSave(audioFile);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="rounded bg-red-500 px-4 py-2 text-white"
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default RecordButton;
