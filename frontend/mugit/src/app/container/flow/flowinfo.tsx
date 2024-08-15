"use client";

import { Tab } from "@headlessui/react";
import FlowDetail from "./flowdetail";
import dynamic from "next/dynamic";
import Image from "next/image";
import ButtonGroup from "./flowbutton";
import { useParams, useRouter } from "next/navigation";
import useAsync from "@/app/hooks/useAsync";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/store/atoms/user";
import { getFlowDetail } from "@/app/libs/flowReadApi";
import Loading from "@/app/components/loading";
import Error from "@/app/components/error";
import { useLocale } from "next-intl";
import { useEffect } from "react";

const Tree = dynamic(() => import("./tree"), { ssr: false });
interface PropType {
  page: string;
}

export default function FlowInfo({ page }: PropType) {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const [state, refetch] = useAsync(() => getFlowDetail(params.id), []);
  const userInfo = useAtomValue(userAtom);

  const { loading, data: flowDetail, error } = state;

  if (loading) return <Loading />;
  if (error) return <Error />;
  console.log(">>>>>>>>>>>>>>>>Flow Detail:", flowDetail); // 데이터 확인
  return (
    <>
      {flowDetail && (
        <div className="mx-auto w-2/3">
          <div className="mb-5 mt-10 flex w-full">
            <Image
              width={254}
              height={254}
              alt="cover image"
              src={flowDetail.coverPath}
              className="mr-5 h-48 w-48 rounded object-cover"
              priority
            />

            <div className="relative w-4/5">
              <div className="mb-3 flex">
                {flowDetail.hashtags.map((tag) => (
                  <a
                    href={`/${locale}/trends/${tag}`}
                    key={tag}
                    className="mr-0.5 rounded-lg border-2 border-solid border-slate-300 px-1 text-sm text-slate-700 hover:cursor-pointer hover:border-slate-700 hover:font-semibold"
                  >
                    {tag}
                  </a>
                ))}
              </div>

              <p className="text-5xl font-semibold">{flowDetail.title}</p>
              <a
                href={`/${locale}/profile/${flowDetail.user.id}`}
                className="block text-2xl hover:font-bold hover:underline"
              >
                {flowDetail.user.nickName}
              </a>
              <ButtonGroup item={flowDetail} page={page} />
            </div>
          </div>
          <hr className="border-2" />
          <p className="mt-5 text-xl">{flowDetail.message}</p>
          <div className="my-10">
            <Tab.Group>
              <Tab.List>
                <Tab
                  className={({ selected }) =>
                    (selected
                      ? "font-bold underline decoration-4 underline-offset-[7.3px] focus:outline-none "
                      : "") + "pr-5 text-2xl"
                  }
                >
                  Details
                </Tab>
                <Tab
                  className={({ selected }) =>
                    (selected
                      ? "font-bold underline decoration-4 underline-offset-[7.3px] focus:outline-none "
                      : "") + "pr-5 text-2xl"
                  }
                >
                  Tree
                </Tab>
              </Tab.List>
              <hr className="border-2" />
              <Tab.Panels>
                <Tab.Panel className="mt-5">
                  <FlowDetail item={flowDetail} />
                </Tab.Panel>
                <Tab.Panel>
                  <Tree />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      )}
    </>
  );
}
