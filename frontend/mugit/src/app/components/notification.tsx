import { Popover } from "@headlessui/react";
import { apiUrl } from "../store/atoms";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import fireToast from "../utils/fireToast";
import { useRouter } from "next/navigation";
import { notificationType } from "../types/notificationtype";

export default function Notification() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Notification");

  const [notifications, setNotifications] = useState([
    {
      id: 0,
      notifiedId: 0,
      notifierId: 0,
      causeEntityId: 0,
      type: t("noContent"),
      description: "",
    },
  ]);
  const [notiRemain, setNotiRemain] = useState(false);

  const getNotifications = () => {
    fetch(apiUrl + "/users/notifications", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.list) {
          setNotifications(data.list);
          setNotiRemain(true);
        } else {
          setNotifications([
            {
              id: 0,
              notifiedId: 0,
              notifierId: 0,
              causeEntityId: 0,
              type: t("noContent"),
              description: "",
            },
          ]);
          setNotiRemain(false);
        }
      });
  };

  const markRead = (id: number) => {
    fetch(apiUrl + `/users/notifications/${id}`, {
      method: "PATCH",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        getNotifications();
      }
    });
  };

  const readAll = () => {
    fetch(apiUrl + `/users/notifications`, {
      method: "PATCH",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        getNotifications();
      }
    });
  };

  useEffect(() => {
    getNotifications();

    const connectHandler = function (e: any) {
      console.log("connect : 연결됨", e);
    };
    const errorHandler = function (e: any) {
      console.log("에러", e);
    };
    const openHandler = function (e: any) {
      console.log("open : 연결", e);
    };
    const notiHandler = function (e: any) {
      setNotiRemain(true);
      const data = JSON.parse(e.data);
      fireToast({
        type: "정보",
        title: data.message.type,
        text: data.message.description,
      });
    };

    const SSE_CONNECT_API_PATH = "/sse/subscribe";

    const eventSource = new EventSource(
      "https://mugit.site" + SSE_CONNECT_API_PATH,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener("connect", connectHandler);
    eventSource.addEventListener("error", errorHandler);
    eventSource.addEventListener("open", openHandler);
    eventSource.addEventListener("follow", notiHandler);
    eventSource.addEventListener("flow_release", notiHandler);
    eventSource.addEventListener("like", notiHandler);
    eventSource.addEventListener("review", notiHandler);
  }, []);

  const handleNotificationClick = (noti: notificationType) => {
    const url =
      noti.type === "FOLLOW"
        ? `/${locale}/profile/${noti.causeEntityId}`
        : `/${locale}/flow/${noti.causeEntityId}`;
    router.push(url);
    markRead(noti.id);
  };

  const handleClickRead = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    noti: notificationType
  ) => {
    e.stopPropagation();
    markRead(noti.id);
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            onClick={open ? () => "" : getNotifications}
            className="h-8 w-8 rounded-full pl-[5.5px]"
          >
            <svg
              viewBox="0 0 24 24"
              fill={notiRemain ? "#F1F609" : "lightgrey"}
              height="1.3em"
              width="1.3em"
            >
              <path d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 012-2 2 2 0 012 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 01-2 2 2 2 0 01-2-2" />
            </svg>
          </Popover.Button>
          <Popover.Panel className="absolute right-0 top-[120%] z-10">
            <div className="h-64 w-56 overflow-auto rounded-lg border border-solid border-gray-500 bg-white">
              <div className="flex justify-between border-b-2 border-solid border-slate-400 px-3 py-2 text-xl">
                <h1 className="font-bold">{t("notice")}</h1>
                <p
                  className="text-sm hover:cursor-pointer hover:font-semibold hover:text-pointblue"
                  onClick={readAll}
                >
                  {t("readall")}
                </p>
              </div>
              {notifications.map((noti) => (
                <div
                  key={noti.id}
                  className="cursor-pointer border-b-2 border-solid border-gray-200 p-3 py-2 hover:bg-gray-200"
                  onClick={() => handleNotificationClick(noti)}
                >
                  <div className="flex justify-between">
                    <p className="mb-1 text-base font-medium">{noti.type}</p>
                    {noti.id ? (
                      <p
                        className="text-sm hover:cursor-pointer hover:font-semibold hover:text-pointblue"
                        onClick={(e) => handleClickRead(e, noti)}
                      >
                        {t("read")}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <a className="text-sm">{noti.description}</a>
                </div>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
