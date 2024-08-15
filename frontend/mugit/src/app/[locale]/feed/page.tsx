"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { FeedContentType } from "@/app/types/feedtype";
import useRefFocusEffect from "@/app/hooks/useRefFocusEffect";
import { useState, useEffect } from "react";
import { Audio } from "react-loader-spinner";
import useAsync from "@/app/hooks/useAsync";
import { getFeed } from "@/app/libs/feedApi";
import PlayHover from "@/app/container/trends/PlayHover";
import dynamic from "next/dynamic";

const WavesurferComp = dynamic(() => import("@/app/components/wavesurfer"), {
  ssr: false,
});

export default function SupportPage() {
  const t = useTranslations("Feed");
  const locale = useLocale();
  const [page, setPage] = useState<number>(0);
  const [feedList, setFeedList] = useState<FeedContentType[]>([]);
  const [state, refetch] = useAsync(() => getFeed(page), [page]);
  const { data: feedlistresponse } = state;

  const [isloading, setIsLoading] = useState(false);

  const examplefetch = async () => {
    if (!feedlistresponse) return;
    if (feedlistresponse && feedlistresponse.totalPages - 1 > page) {
      setIsLoading(true);
      setPage((prev) => prev + 1);
      const response = await getFeed(page + 1);
      setFeedList((prev) => [...prev, ...response.content]);
      setIsLoading(false);
    }
  };

  const { elementRef } = useRefFocusEffect<HTMLDivElement>(examplefetch, [
    feedlistresponse,
  ]);

  useEffect(() => {
    if (feedlistresponse && feedlistresponse.content && page === 0) {
      setFeedList(feedlistresponse.content);
    }
  }, [feedlistresponse]);

  return (
    <>
      <div className="flex min-h-[90%] w-full  flex-col items-center bg-pointyellow p-10">
        <div className="mx-auto flex min-h-[60%] w-[65%] flex-col rounded-md bg-white p-8">
          <h2 className="text-2xl font-bold text-gray-700">{t("feedtitle")}</h2>
          <p className="text-xl text-gray-700">{t("feedExp")}</p>
          <p className="text-md mb-9 pt-4 text-gray-400">{t("feedExp1")}</p>

          {feedList.map((item) => {
            return (
              <div
                key={item.id}
                className="mb-4 flex w-full flex-col gap-2 border-b-2 border-solid border-gray-300 pb-4"
              >
                <div>
                  <div className="flex">
                    <div className="relative h-32 w-32 rounded-md">
                      <Image
                        className="h-32 w-32 rounded-md"
                        src={item.coverPath}
                        alt={item.title}
                        priority
                        style={{ objectFit: "cover" }}
                        width={50}
                        height={50}
                      />
                      <PlayHover
                        item={item}
                        css="absolute top-[20%] left-[20%] hidden group-hover:block z-10 cursor-pointer"
                      />
                    </div>
                    <div className="relative ml-5 w-4/5">
                      <a
                        href={`/${locale}/flow/${item.id}`}
                        className="block text-xl font-semibold hover:font-black hover:underline"
                      >
                        {item.title}
                      </a>
                      <a
                        href={`/${locale}/profile/${item.user.id}`}
                        className="block text-base hover:font-bold hover:underline"
                      >
                        {item.user.nickName}
                      </a>
                      <div className="absolute bottom-0 w-full">
                        <WavesurferComp
                          musicPath={item.musicPath}
                          musicname={item.title}
                          type="source"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isloading && (
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          )}

          <div ref={elementRef} className="mt-20"></div>
        </div>
      </div>
    </>
  );
}
