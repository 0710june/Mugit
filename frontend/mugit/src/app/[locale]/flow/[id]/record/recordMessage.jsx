import IconRecord from "@/app/assets/icon/IconRecord";
import React from "react";

// Props 타입 적용
const RecordMessage = ({ records }) => {
  const recordList = records.list || [];
  return (
    <div>
      <div className="my-2 flex max-h-60 w-full flex-col gap-2 overflow-y-scroll rounded-lg border-2 border-solid border-gray-300 p-4">
        {recordList
          .slice(1)
          .reverse()
          .map((item, index) => {
            return (
              <div
                key={item.id}
                className="flex flex-col rounded-lg bg-gray-100 p-3"
              >
                <div className="flex gap-4">
                  <div className="justify-items-center">
                    <IconRecord />
                  </div>
                  <div>
                    <div className="flex">
                      <p className="mb-1"> {item.message}</p>
                      {/* <p className="ml-2 text-xs text-gray-500">v.{index + 1}</p> */}
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.sources.length} tracks
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RecordMessage;
