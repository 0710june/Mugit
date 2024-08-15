"use client";
import AOS from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import GoogleButton from "../google/googlebutton";
import { useTranslations } from "next-intl";
import { userAtom } from "@/app/store/atoms/user";
import { useAtomValue } from "jotai";

const WavesurferComp = dynamic(() => import("@/app/components/wavesurfer"), {
  ssr: false,
});

export default function LandingHelp() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Landing");
  const user = useAtomValue(userAtom);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div className="relative flex min-h-[100%] w-full items-center justify-evenly bg-pointblack pt-10">
        <div className="flex w-[80%] items-center justify-center sm:flex-col md:flex-col lg:flex-row">
          <div
            data-aos="fade-right"
            className="flex h-full w-[50%] flex-col justify-center  p-10 text-white"
          >
            <p className="pb-4 text-4xl font-bold"> {t("trends")}</p>
            <p className=" text-xl">{t("trendsExp")}</p>
            <p className="pb-4 text-xl">{t("trendsExp1")}</p>

            <button
              className="mr-3 w-[30%] self-center rounded border-2 border-pointblue bg-pointblue px-2 py-[4px] 
          text-white transition duration-300 hover:bg-[#0831d6]"
              onClick={() => router.push(`/${locale}/trends`)}
            >
              <span className="mx-1 text-base font-semibold">
                {t("gotoTrend")}
              </span>
            </button>
          </div>
          <div
            data-aos="fade-left"
            className="flex h-full w-[50%] justify-center "
          >
            <Image
              width={600}
              height={200}
              alt="Trend"
              priority
              src="/trend.png"
            />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[100%] w-full items-center justify-evenly bg-pointblack pt-10">
        <div className="flex w-[80%] items-center justify-center sm:flex-col md:flex-col lg:flex-row">
          <div
            data-aos="fade-right"
            className="flex h-full w-[50%] flex-col justify-center  p-10 text-white"
          >
            <p className="pb-4 text-4xl font-bold"> {t("note")}</p>
            <p className=" text-xl">{t("noteExp")}</p>
            <p className=" text-xl">{t("noteExp1")}</p>
            <p className="pb-4 text-xl">{t("noteExp2")}</p>
          </div>
          <div
            data-aos="fade-left"
            className="flex h-full w-[50%] justify-center "
          >
            <Image
              width={600}
              height={200}
              alt="note"
              priority
              src="/note.png"
            />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[100%] w-full items-center justify-evenly bg-pointblack pt-10">
        <div className="flex w-[80%] items-center justify-center sm:flex-col md:flex-col lg:flex-row">
          <div
            data-aos="fade-right"
            className="flex h-full w-[50%] flex-col justify-center  p-10 text-white"
          >
            <p className="pb-4 text-4xl font-bold"> {t("record")}</p>
            <p className=" text-xl">{t("recordExp")}</p>
            <p className=" text-xl">{t("recordExp1")}</p>
            <p className="pb-4 text-xl">{t("recordExp2")}</p>
          </div>
          <div
            data-aos="fade-left"
            className="flex h-full w-[50%] justify-center "
          >
            <Image
              width={600}
              height={200}
              alt="Record"
              priority
              src="/record.png"
            />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[100%] w-full items-center justify-evenly bg-pointblack pt-10">
        <div className="flex w-[80%] items-center justify-center ">
          <div
            data-aos="fade-right"
            className="flex h-full w-[50%] flex-col justify-center  p-10 text-white"
          >
            <p className="pb-4 text-4xl font-bold"> {t("release")}</p>
            <p className=" text-xl">{t("releaseExp")}</p>
          </div>
          <div
            data-aos="fade-left"
            className="flex h-full w-[50%] justify-center "
          >
            <Image
              width={600}
              height={200}
              alt="Record"
              priority
              src="/release.png"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[40%] w-full flex-col items-center justify-center  bg-pointblack">
        <p className="mb-6 text-2xl text-white" data-aos="fade-up">
          {t("join")}
        </p>
        {user.isLogined == "true" ? (
          <button
            className="mr-3 w-[10%] self-center rounded border-2 border-pointblue bg-pointblue px-2 py-[4px] text-white 
     transition duration-300 hover:bg-[#0831d6]"
            onClick={() => router.push(`/${locale}/trends`)}
          >
            <span className="mx-1 text-base font-semibold">
              {t("gotoTrend")}
            </span>
          </button>
        ) : (
          <GoogleButton />
        )}
      </div>
    </>
  );
}
