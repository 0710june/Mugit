"use client";
import IconCamera from "@/app/assets/icon/IconCamera";
import Image from "next/image";

type UpoladPicturePropsType = {
  imageSrc: string;
  setImageSrc: React.Dispatch<React.SetStateAction<string>>;
  imagefile: any;
  setImageFile: React.Dispatch<React.SetStateAction<any>>;
};

function UploadPicture({
  imageSrc,
  setImageSrc,
  imagefile,
  setImageFile,
}: UpoladPicturePropsType) {
  const onUpload = (e: any) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise<void>((resolve) => {
      reader.onload = () => {
        const file = reader.result as string;
        setImageSrc(file); // 파일의 컨텐츠
        resolve();
      };
    });
  };

  return (
    <>
      <div className="mt-4 flex w-3/12 flex-col items-center md:w-full lg:w-3/12">
        <Image
          width={254}
          height={254}
          alt="cover image"
          className="h-56 w-56"
          priority
          src={imageSrc}
        />
        <label
          htmlFor="uploadimg"
          className=" mt-2 flex h-8 w-56 items-center justify-center gap-2 rounded-md bg-gray-300 text-sm hover:bg-[#c8cace] hover:shadow"
        >
          <IconCamera />
          Upload Image
        </label>
        <input
          id="uploadimg"
          className="hidden"
          accept="image/*"
          type="file"
          onChange={(e) => onUpload(e)}
        />
      </div>
    </>
  );
}

export default UploadPicture;
