"use client";

import { useState } from "react";
import IconInfo from "@/app/assets/icon/IconInfo";
import { useTranslations } from "next-intl";

type propType = {
  target: string;
  positionLeft?: string;
};

function Description({ target }: propType) {
  const t = useTranslations("Information");
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const tailwind = `cursor-pointer absolute top-10 left-[13%]`;
  const descriptionClass = `top-16 left-[2%] ml-5 absolute top-0 rounded-lg border-solid border-2 border-gray-300 p-2 text-sm font-normal not-italic shadow-xl bg-white text-xs w-48 z-30`;

  return (
    <>
      {open ? (
        <>
          <IconInfo
            tailwindCSS={tailwind}
            size="1.3rem"
            color="#0033ff"
            onClick={handleClick}
          />
          <div className={descriptionClass}>{t(target)}</div>
        </>
      ) : (
        <>
          <IconInfo
            tailwindCSS={tailwind}
            size="1.3rem"
            onClick={handleClick}
          />
        </>
      )}
    </>
  );
}

export default Description;
