const dummymessage = [
  {
    id: 1,
    title: "Added band session recordings",
    data: "2024-02-25",
  },
  {
    id: 2,
    title: "Added Chorus",
    data: "2024-03-24",
  },
  {
    id: 3,
    title: "Added Keyboard Session",
    data: "2024-04-11",
  },
  { id: 4, title: "Added Guitar", data: "2024-04-14" },
  { id: 5, title: "Added Rap", data: "2024-05-25" },
  { id: 6, title: "Added Rap", data: "2024-05-25" },
  { id: 7, title: "Added Rap", data: "2024-05-25" },
  { id: 8, title: "Added Rap", data: "2024-05-25" },
  { id: 9, title: "Added Rap", data: "2024-05-25" },
  { id: 10, title: "Added Rap", data: "2024-05-25" },
];

import IconRecord from "@/app/assets/icon/IconRecord";

export default function RecordMessage() {
  return (
    <div className="my-2 flex max-h-60 w-full flex-col gap-2 overflow-y-scroll rounded-lg border-2 border-solid border-gray-300 p-4">
      {dummymessage.map((item) => {
        return (
          <div
            key={item.id}
            className="flex flex-col rounded-lg bg-gray-100 p-3"
          >
            <div className="flex gap-4">
              <IconRecord />
              <div>
                <p className="mb-1"> {item.title}</p>
                <p className="te text-xs text-gray-500">{item.data}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
