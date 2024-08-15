"use client";
// import { useRouter } from "next/navigation";
import { useRouter } from "@/navigation";
import { FlowDetailType } from "@/app/types/flowtype";
import { IconPlus } from "@/app/assets/icon/flow/IconPlus";
import LikeButton from "./likebutton";
import { userAtom } from "@/app/store/atoms/user";
import { useAtomValue } from "jotai";
import { postNewFlow } from "@/app/libs/FlowApi";
import { useTranslations } from "next-intl";
interface PropType {
  item: FlowDetailType;
  page: string;
}

export default function ButtonGroup({ item, page }: PropType) {
  const t = useTranslations("Flow");
  const router = useRouter();
  const userInfo = useAtomValue(userAtom);

  const handleClickNewFlow = () => {
    console.log(userInfo.id);
    router.push(`/profile/${userInfo.id}`);
    postNewFlow(item.id);
  };

  if (userInfo.isLogined === "false") return <></>;

  return (
    <div className="absolute bottom-0 right-0 flex">
      {page === "detail" ? (
        <>
          <button
            className=" mr-3 rounded border-2 border-pointblue bg-pointblue px-1 py-[3px] 
          text-white transition duration-300 hover:bg-[#0831d6]"
            onClick={handleClickNewFlow}
          >
            <IconPlus />
            <span className="mx-1 text-base font-semibold">{t("newFlow")}</span>
          </button>
          <LikeButton item={item} isLogined={userInfo.isLogined} />
        </>
      ) : (
        <button
          className=" mr-3 rounded border-2 border-pointblue bg-pointblue p-1 
          text-white transition duration-300 hover:bg-[#0831d6]"
          // transition duration-300 hover:scale-105 hover:bg-[#0831d6]
        >
          <span className="mx-1 text-base font-semibold">{t("edit")}</span>
        </button>
      )}
    </div>
  );
}
