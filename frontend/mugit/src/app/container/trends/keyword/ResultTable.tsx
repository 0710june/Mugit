"use client";

import Image from "next/image";
import PlayHover from "../PlayHover";
import { FlowType } from "@/app/types/flowtype";
import { useRouter } from "@/navigation";

type SearchResultTableProps = {
  data: FlowType[] | undefined;
};
export default function ResultTable({ data }: SearchResultTableProps) {
  const router = useRouter();
  return (
    <>
      <div className="mt-6 w-full border-y-2 border-solid border-gray-300">
        <div className="flex">
          <div className="flex h-12 w-2/12 items-center justify-center text-gray-400">
            Cover
          </div>
          <div className="flex h-12 w-3/12 items-center justify-center text-gray-400">
            Title
          </div>
          <div className="flex h-12 w-3/12 items-center justify-center text-gray-400">
            Person
          </div>
          <div className="flex h-12 w-4/12 items-center justify-center text-gray-400">
            Tags
          </div>
        </div>
      </div>
      {data &&
        data.map((item) => {
          return (
            <div
              key={item.id}
              className="mb-4 flex  border-b-2 border-solid border-gray-100"
            >
              <div className=" flex h-32 w-2/12 items-center justify-center ">
                <div className="relative">
                  <Image
                    width={200}
                    height={200}
                    alt={item.title}
                    src={item.coverPath}
                    className="h-28 w-28 rounded border-2"
                    priority
                  />
                  <PlayHover
                    item={item}
                    css="absolute top-[15%] left-[15%] hidden group-hover:block z-10 cursor-pointer"
                  />
                </div>
              </div>
              <div
                className="flex h-32 w-3/12 cursor-pointer items-center justify-center hover:underline"
                onClick={() => router.push(`/flow/${item.id}`)}
              >
                {item.title}
              </div>
              <div
                className="flex h-32 w-3/12 cursor-pointer items-center justify-center hover:underline"
                onClick={() => router.push(`/profile/${item.user.id}`)}
              >
                {item.user.nickName}
              </div>
              <div className="flex h-32 w-4/12 items-center justify-center">
                {item.hashtags.map((item) => {
                  return (
                    <span
                      key={item}
                      className="mr-2 rounded-md bg-pointyellow p-2"
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
}

//12  2 3 3 4
