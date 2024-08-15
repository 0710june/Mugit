"use client";

import UploadPicture from "@/app/components/fileUpload/UploadPicture";
import MyRadioGroup from "@/app/container/note/RadioGroup";
import Description from "@/app/components/Description";
import UploadContainer from "@/app/components/fileUpload/UploadContainer";
import SelectTags from "@/app/components/selectTags";
import { useInput } from "@/app/hooks/useInput";
import { useState } from "react";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useLocale, useTranslations } from "next-intl";
import fireToast from "@/app/utils/fireToast";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/store/atoms/user";

export default function NotePage() {
  const router = useRouter();
  const locale = useLocale();

  const userInfo = useAtomValue(userAtom);
  const t = useTranslations("Form");
  const [name, handleChangeName] = useInput("");
  const [description, handleChangeDescription] = useInput("");
  const [privacy, setPrivacy] = useState<string>("PUBLIC");
  const [tags, setTags] = useState<string[]>([]);
  const [imageSrc, setImageSrc] = useState<string>(
    "https://mugit.site/files/default/flow.png"
  );
  const [imagefile, setImageFile] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  async function handleSave() {
    if (!file || !imagefile || name.length == 0 || description.length == 0) {
      fireToast({
        type: "경고",
        title: "빈 항목이 있습니다",
      });
      return;
    }

    let imageFormData = new FormData();
    imageFormData.append("image", imagefile);

    let audioFormData = new FormData();
    console.log("file", file);
    audioFormData.append("source", file);

    const [userPic, audioFile] = await Promise.all([
      fetch("https://mugit.site/files", {
        method: "POST",
        credentials: "include",
        body: imageFormData,
      }).then((response) => response.json()),
      fetch("https://mugit.site/files", {
        method: "POST",
        credentials: "include",
        body: audioFormData,
      }).then((response) => response.json()),
    ]);

    console.log("audioFile", audioFile);

    router.push(`/${locale}/profile/${userInfo.id}`);

    fetch("https://mugit.site/api/flows/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: name,
        message: description,
        authority: privacy,
        files: [userPic.list[0], audioFile.list[0]],
        hashtags: tags,
      }),
    }).then((res) => {
      console.log(res);
    });
  }

  return (
    <main className="relative flex min-h-[90%] w-full flex-col px-52 py-10">
      <h1 className="border-b-2 border-solid border-gray-300 pl-5 text-5xl font-bold italic">
        New Note
      </h1>
      <Description target="note" />

      <div className="mt-4 flex w-full sm:flex-col md:flex-col lg:flex-row">
        {/* 사진 올리는 부분임 */}
        <UploadPicture
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          imagefile={imagefile}
          setImageFile={setImageFile}
        />

        {/* 파일 가져오는 부분임 */}
        <div className="flex w-9/12 flex-col  md:mt-4 md:w-full lg:w-9/12">
          <UploadContainer file={file} setFile={setFile} />

          <h2 className="mt-4 text-lg">{t("note")}</h2>
          <input
            value={name}
            onChange={handleChangeName}
            type="text"
            className="h-8 w-full rounded-lg border-2 border-solid border-gray-300 border-b-gray-200 px-4"
          />

          <SelectTags selected={tags} setSelected={setTags} />

          <div className="mt-4 flex w-full">
            <MyRadioGroup privacy={privacy} setPrivacy={setPrivacy} />
          </div>

          <h2 className="mt-4 text-lg">{t("description")}</h2>
          <textarea
            value={description}
            onChange={handleChangeDescription}
            placeholder={t("descriptionPlaceholder")}
            className="h-52 w-full rounded-lg border-2 border-solid border-gray-300 border-b-gray-200 p-4"
          />

          <div className="mt-5 flex w-full justify-end gap-x-3">
            <button className="rounded-lg border-2 border-solid bg-gray-100 px-10 py-3 text-gray-600">
              {t("cancel")}
            </button>
            <button
              className="rounded-lg bg-pointblue px-10 py-3 text-white"
              onClick={handleSave}
            >
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
