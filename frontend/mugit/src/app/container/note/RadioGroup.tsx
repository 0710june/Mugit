"use client";

// import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useTranslations } from "next-intl";

type PrivacyRadioPropType = {
  privacy: string;
  setPrivacy: React.Dispatch<React.SetStateAction<string>>;
};

function MyRadioGroup({ privacy, setPrivacy }: PrivacyRadioPropType) {
  const t = useTranslations("Form");

  return (
    <>
      <RadioGroup value={privacy} onChange={setPrivacy}>
        <RadioGroup.Label className="mt-4 text-lg">
          {t("privacy")}
        </RadioGroup.Label>
        <div className="my-4 flex gap-x-6">
          <RadioGroup.Option value="PUBLIC">
            {({ checked }) => (
              <div className="flex cursor-pointer justify-center gap-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-solid border-gray-600">
                  {checked && (
                    <div className="fadeIn h-4 w-4 rounded-full bg-pointblue transition-opacity duration-500"></div>
                  )}
                </div>
                <p className="flex items-center">Public</p>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="PRIVATE">
            {({ checked }) => (
              <div className="flex cursor-pointer justify-center gap-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-solid border-gray-600">
                  {checked && (
                    <div className="fadeIn h-4 w-4 rounded-full bg-pointblue transition-opacity duration-500"></div>
                  )}
                </div>
                <p className="flex items-center">Private</p>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="PROTECTED">
            {({ checked }) => (
              <div className="flex cursor-pointer justify-center gap-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-solid border-gray-600">
                  {checked && (
                    <div className="fadeIn h-4 w-4 rounded-full bg-pointblue transition-opacity duration-500"></div>
                  )}
                </div>
                <p className="flex items-center">Protected</p>
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </>
  );
}

export default MyRadioGroup;
