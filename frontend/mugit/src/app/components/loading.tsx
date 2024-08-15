"use client";

import TextAnimation from "./text-animation";

export default function Loading() {
  return (
    <div
      className="flex  h-full w-full items-center  justify-center  text-[5rem]
font-extrabold italic text-pointyellow sm:text-[5rem] md:text-[10rem] lg:text-[14rem]"
    >
      <TextAnimation inputText="MUGIT" />
    </div>
  );
}
