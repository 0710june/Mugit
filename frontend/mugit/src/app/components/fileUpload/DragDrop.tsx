"use client";
import { useState } from "react";
import fireToast from "@/app/utils/fireToast";
import { useTranslations } from "next-intl";

interface DragDropProps {
  onChangeFile: (file: File | null) => void;
  description?: string;
  validExtensions?: string[]; // 확장자 정보를 받아온다.
}

const DragDrop = ({
  onChangeFile,
  description = "파일 첨부",
  validExtensions = ["*"],
}: DragDropProps) => {
  // 사용자가 파일을 드래드 중임을 상태로 관리 UI 변경을 위해 사용
  const [dragOver, setDragOver] = useState<boolean>(false);

  // 드래그 중인 요소가 목표 지점 진입할때
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  // 드래그 중인 요소가 목표 지점을 벗어날때
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  // 드래그 중인 요소가 목표 지점에 위치할때
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const isValidExtension = (file: File) => {
    const fileName = file.name;
    const fileNameSplit = fileName.split(".");
    const fileExtension = fileNameSplit[fileNameSplit.length - 1];
    console.log("valid", validExtensions, fileExtension);
    return validExtensions.includes(fileExtension);
  };

  // 드래그 중인 요소가 목표 지점에서 드롭될때
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    // 드래그되는 데이터 정보와 메서드를 제공하는 dataTransfer 객체 사용
    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];
      if (isValidExtension(file)) {
        onChangeFile(file);
      } else {
        fireToast({
          type: "경고",
          title: "잘못된 파일 형식",
          text: "mp3, wav, flac 형식의 파일들을 올려주세요",
        });
      }
    }
  };

  // Drag & Drop이 아닌 클릭 이벤트로 업로드되는 기능도 추가
  // 허용된 확장자라면 업로드, 아니라면 사용자에게 알림
  const handleChange = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file && isValidExtension(file)) {
      onChangeFile(file);
    } else {
      fireToast({
        type: "경고",
        title: "잘못된 파일 형식",
        text: "mp3, wav, flac 형식의 파일들을 올려주세요",
      });
      e.target.value = "";
      onChangeFile(null);
    }

    // input 요소의 값 초기화
    e.target.value = "";
  };

  // 허용된 확장자라면 업로드, 아니라면 사용자에게 알림
  // const handleFileChange = (file: File | null) => {
  //   if (file && isValidExtension(file)) {
  //     onChangeFile(file);
  //   } else {
  //     window.alert("잘못된 파일 형식");

  //     // toast({
  //     //   title: "잘못된 파일 형식",
  //     //   description: `지원하지 않는 파일 형식입니다. (${validExtensions.join(
  //     //     ", "
  //     //   )})로 등록해주세요.`,
  //     //   className: "bg-red-500 text-white",
  //     // });
  //     onChangeFile(null);
  //   }
  // };
  const t = useTranslations("Note");

  return (
    <>
      <label
        className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-solid py-8 text-lg ${
          dragOver
            ? "border-blue-500 bg-blue-100 font-semibold text-blue-500"
            : "border-gray-300 bg-pointyellow bg-opacity-25"
        } flex cursor-pointer items-center justify-center rounded-md`}
        htmlFor="fileUpload"
        // Label에 드래그 앤 드랍 이벤트 추가
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {description}
        <div className="pointer-events-none mt-2 rounded-lg bg-pointblue  px-3 py-2 text-sm text-white hover:bg-[#052cc6] hover:shadow">
          {t("chooseFile")}
        </div>
      </label>
      <input
        id="fileUpload"
        type="file"
        className="hidden"
        onChange={handleChange}
      ></input>
    </>
  );
};

export default DragDrop;
