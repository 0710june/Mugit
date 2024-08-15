"use client";
import Image from "next/image";
import PlayHover from "./PlayHover";
import TrendsItem from "./trendsitem";
import { useTranslations } from "next-intl";
import { FlowType } from "@/app/types/flowtype";
import { useState, useEffect } from "react";
import { TrendSearchResponseType } from "@/app/types/trendtype";
import useAsync from "@/app/hooks/useAsync";
import { getFlowList } from "@/app/libs/trendApi";
import useRefFocusEffect from "@/app/hooks/useRefFocusEffect";
import { Audio } from "react-loader-spinner";
interface PropType {
  flows: TrendSearchResponseType;
}

export default function Trendslist({ flows }: PropType) {
  const t = useTranslations("Trends");
  const [page, setPage] = useState<number>(0);
  const [flowsList, setFlowsList] = useState<FlowType[]>([]);
  const [state, refetch] = useAsync(() => getFlowList(page), [page]);
  const { data: flowlistresponse } = state;

  const [isloading, setIsLoading] = useState(false);

  const examplefetch = async () => {
    if (!flowlistresponse) return;
    if (flowlistresponse && flowlistresponse.totalPages - 1 > page) {
      setIsLoading(true);
      setPage((prev) => prev + 1);
      const response = await getFlowList(page + 1);
      setFlowsList((prev) => [...prev, ...response.content]);
      setIsLoading(false);
    }
  };

  const { elementRef } = useRefFocusEffect<HTMLDivElement>(examplefetch, [
    flowlistresponse,
  ]);

  useEffect(() => {
    if (flowlistresponse && flowlistresponse.content && page === 0) {
      setFlowsList(flowlistresponse.content);
    }
  }, [flowlistresponse]);

  return (
    <>
      {flowsList ? (
        <>
          <div className="flex h-full w-full flex-col">
            <p className="text-4xl font-bold">{t("title")}</p>
            <div className="grid w-full grid-cols-3 gap-x-6">
              {flowsList.map((item) => {
                return (
                  <div key={item.id}>
                    <div className="relative aspect-square w-full rounded-lg">
                      <Image
                        className="rounded-lg "
                        src={item.coverPath}
                        alt={item.title}
                        fill
                        priority
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <PlayHover item={item} />
                    </div>
                    <TrendsItem item={item} />
                  </div>
                );
              })}
            </div>
          </div>
          {isloading && (
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          )}
          <div ref={elementRef} className="mt-20">
            {" "}
          </div>
        </>
      ) : (
        <div>No trends</div>
      )}
    </>
  );
}
