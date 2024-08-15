"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { userAtom } from "@/app/store/atoms/user";
import { useAtomValue, useSetAtom } from "jotai";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { apiUrl } from "@/app/store/atoms";
import { FlowType } from "@/app/types/flowtype";
import { releaseFlowAtom } from "@/app/store/atoms";

const WavesurferComp = dynamic(() => import("@/app/components/wavesurfer"), {
  ssr: false,
});

const fetchFlows = async (id: string, type: string) => {
  const response = await fetch(apiUrl + `/flows/users/${id}/${type}`, {
    credentials: "include",
  });
  return response.json();
};

export default function UserFlow() {
  const params = useParams();
  const t = useTranslations("Flow");
  const locale = useLocale();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const [flows, setFlows] = useState([]);
  const [likes, setLikes] = useState([]);
  const [works, setWorks] = useState([]);
  const [done, setDone] = useState(false);
  const setReleaseFlow = useSetAtom(releaseFlowAtom);

  useEffect(() => {
    fetchFlows(String(params.id), "released").then((data) =>
      setFlows(data.list)
    );
    fetchFlows(String(params.id), "likes").then((data) => setLikes(data.list));
  }, []);

  if (user.id && !done && params.id === user.id) {
    fetchFlows(String(params.id), "unreleased").then((data) => {
      setWorks(data.list);
      setDone(true);
    });
  }

  // const handleClickRelease = (flow: FlowType) => {
  //   setReleaseFlow(flow);
  //   router.push(`/${locale}/flow/${flow.id}/release`);
  // };

  return (
    <div className="relative mx-auto mt-10 w-2/3 pb-10">
      <Tab.Group>
        <Tab.List>
          <Tab
            className={({ selected }) =>
              (selected
                ? "font-bold underline decoration-4 underline-offset-[7.3px] focus:outline-none "
                : "") + "pr-5 text-2xl"
            }
          >
            Flows
          </Tab>
          <Tab
            className={({ selected }) =>
              (selected
                ? "font-bold underline decoration-4 underline-offset-[7.3px] focus:outline-none "
                : "") + "pr-5 text-2xl"
            }
          >
            Likes
          </Tab>
          {params.id === user.id ? (
            <Tab
              className={({ selected }) =>
                (selected
                  ? "font-bold underline decoration-4 underline-offset-[7.3px] focus:outline-none "
                  : "") + "pr-5 text-2xl"
              }
            >
              Works
            </Tab>
          ) : (
            <></>
          )}
          {params.id === user.id ? (
            <button
              className="absolute -top-1.5 right-0 rounded border-2 border-pointblue bg-pointblue px-2 
            py-[1px] text-xl text-white transition duration-300 hover:bg-[#0831d6]"
              onClick={() => router.push(`/${locale}/note`)}
            >
              {t("newNote")}
            </button>
          ) : (
            <></>
          )}
        </Tab.List>
        <hr className="border-2" />
        <Tab.Panels>
          <Tab.Panel>
            {flows &&
              flows
                .slice()
                .reverse()
                .map((flow: FlowType) => (
                  <div
                    key={flow.id}
                    className="my-5 flex w-full justify-between"
                  >
                    <div className="relative h-[150px] w-[150px]">
                      <Image
                        src={flow.coverPath}
                        alt=""
                        fill
                        className="object-cover hover:cursor-pointer hover:shadow-lg"
                        onClick={() =>
                          router.push(`/${locale}/flow/${flow.id}`)
                        }
                      />
                    </div>
                    <div className="relative ml-5 w-4/5">
                      <a
                        href={`/${locale}/flow/${flow.id}`}
                        className="block text-xl font-semibold hover:font-black hover:underline"
                      >
                        {flow.title}
                      </a>
                      <a
                        href={`/${locale}/profile/${flow.user.id}`}
                        className="block text-base hover:font-bold hover:underline"
                      >
                        {flow.user.nickName}
                      </a>
                      <div className="absolute bottom-0 w-full">
                        <WavesurferComp
                          musicPath={flow.musicPath}
                          musicname={flow.title}
                          type="source"
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </Tab.Panel>
          <Tab.Panel>
            {likes &&
              likes
                .slice()
                .reverse()
                .map((flow: FlowType) => (
                  <div
                    key={flow.id}
                    className="my-5 flex w-full justify-between"
                  >
                    <div className="relative h-[150px] w-[150px]">
                      <Image
                        src={flow.coverPath}
                        alt=""
                        fill
                        className="object-cover hover:cursor-pointer hover:shadow-lg"
                        onClick={() =>
                          router.push(`/${locale}/flow/${flow.id}`)
                        }
                      />
                    </div>
                    <div className="relative ml-5 w-4/5">
                      <a
                        href={`/${locale}/flow/${flow.id}`}
                        className="block text-xl font-semibold hover:font-black hover:underline"
                      >
                        {flow.title}
                      </a>
                      <a
                        href={`/${locale}/profile/${flow.user.id}`}
                        className="block text-base hover:font-bold hover:underline"
                      >
                        {flow.user.nickName}
                      </a>
                      <div className="absolute bottom-0 w-full">
                        <WavesurferComp
                          musicPath={flow.musicPath}
                          musicname={flow.title}
                          type="source"
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </Tab.Panel>
          {params.id === user.id ? (
            <Tab.Panel>
              {works &&
                works
                  .slice()
                  .reverse()
                  .map((flow: FlowType) => (
                    <div
                      key={flow.id}
                      className="my-5 flex w-full justify-between"
                    >
                      <div className="relative h-[150px] w-[150px]">
                        <Image
                          src={flow.coverPath}
                          alt=""
                          fill
                          className="object-cover hover:cursor-pointer hover:shadow-lg"
                          onClick={() =>
                            router.push(`/${locale}/flow/${flow.id}`)
                          }
                        />
                      </div>
                      <div className="relative ml-5 flex w-4/5 justify-between">
                        <div>
                          <a
                            href={`/${locale}/flow/${flow.id}`}
                            className="block text-xl font-semibold hover:font-black hover:underline"
                          >
                            {flow.title}
                          </a>
                          <a
                            href={`/${locale}/profile/${flow.user.id}`}
                            className="block text-base hover:font-bold hover:underline"
                          >
                            {flow.user.nickName}
                          </a>
                        </div>
                        <div>
                          <button
                            className=" mr-3 rounded border-2 border-pointblue bg-white p-1 
          text-pointblue transition duration-300 hover:bg-pointblue hover:text-white"
                            onClick={() =>
                              router.push(`/${locale}/flow/${flow.id}/record`)
                            }
                          >
                            <span className="mx-1 text-base font-semibold">
                              Edit
                            </span>
                          </button>
                          {/* <button
                        className=" mr-3 rounded border-2 border-pointblue bg-white p-1 
                    text-pointblue transition duration-300 hover:bg-pointblue hover:text-white"
                        // transition duration-300 hover:scale-105 hover:bg-[#0831d6]
                        onClick={() => handleClickRelease(flow)}
                      >
                        <span className="mx-1 text-base font-semibold">
                          Release
                        </span>
                      </button> */}
                        </div>
                        <div className="absolute bottom-0 w-full">
                          <WavesurferComp
                            musicPath={flow.musicPath}
                            musicname={flow.title}
                            type="source"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
            </Tab.Panel>
          ) : (
            <></>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
