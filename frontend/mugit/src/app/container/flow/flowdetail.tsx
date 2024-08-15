import WavesurferComp from "@/app/components/wavesurfer";
import { Disclosure } from "@headlessui/react";
import { FlowDetailType } from "@/app/types/flowtype";
import { sources } from "next/dist/compiled/webpack/webpack";
import { useEffect } from "react";
import WaveSurferComp from "@/app/[locale]/flow/[id]/record/WaveSurferComp";
// import Image from "next/image";

export default function FlowDetail({ item }: { item: FlowDetailType }) {
  if (item === undefined) {
    return <div>loading</div>;
  }

  return (
    <div className="">
      <div className="mb-5">
        <p className="mb-2 text-xl font-medium">{item.title}</p>
        <WavesurferComp
          musicname={item.title}
          musicPath={item.musicPath}
          type="main"
        />
      </div>
      {item.record.sources.length > 0 && (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="mx-auto flex justify-between">
                <span className="mr-1 pt-[2.5px] font-medium">Sources</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      open
                        ? "m4.5 15.75 7.5-7.5 7.5 7.5"
                        : "m19.5 8.25-7.5 7.5-7.5-7.5"
                    }
                  />
                </svg>
              </Disclosure.Button>
              <Disclosure.Panel>
                {item.record.sources.map((source) => (
                  <div key={source.name} className="mb-5">
                    <p className="mb-2 text-xl font-medium">{source.name}</p>
                    <WaveSurferComp
                      musicname={source.name}
                      musicPath={source.path}
                      type="source"
                    />
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </div>
  );
}
