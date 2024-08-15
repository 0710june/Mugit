"use client";

import Image from "next/image";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconCamera from "@/app/assets/icon/IconCamera";
import { apiUrl } from "@/app/store/atoms";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { userAtom } from "@/app/store/atoms/user";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import fireToast from "@/app/utils/fireToast";
import FollowPopover from "./followpopover";

const fetchUser = async (id: string | string[]) => {
  const response = await fetch(apiUrl + `/users/${id}/profiles/detail`, {
    credentials: "include",
  });
  return response.json();
};

export default function UserInfo() {
  const params = useParams();
  const t = useTranslations("Profile");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [userInfo, setUserInfo] = useState({
    isMyProfile: "false",
    nickName: "Loading",
    profileImagePath:
      "https://mugit.site/files/008494eb-b272-4c83-919b-677378107fd2.jpg",
    profileText: "Loading",
    isFollower: false,
    isFollowing: false,
    followerCount: "0",
    followingCount: "0",
  });

  useEffect(() => {
    fetchUser(params.id).then((data) => {
      setUserInfo(data);
      setNewImage(data.profileImagePath);
      setNewNickName(data.nickName);
      setNewProfileText(data.profileText);
    });
  }, []);

  function clickModal() {
    setIsOpen(!isOpen);
    setNewImage(userInfo.profileImagePath);
  }

  const [newFile, setNewFile] = useState<any>(null);
  const [newImage, setNewImage] = useState(userInfo.profileImagePath);
  const [newNickName, setNewNickName] = useState(userInfo.nickName);
  const [newProfileText, setNewProfileText] = useState(userInfo.profileText);

  const onUpload = (e: any) => {
    const file = e.target.files[0];
    setNewFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise<void>((resolve) => {
      reader.onload = () => {
        const file = reader.result as string;
        setNewImage(file); // 파일의 컨텐츠
        resolve();
      };
    });
  };

  async function onClick() {
    let formdata = new FormData();
    formdata.append("image", newFile);
    const response = await fetch("https://mugit.site/files", {
      method: "post",
      credentials: "include",
      body: formdata,
    }).then((response) => {
      return response.json();
    });
    fetch(apiUrl + "/users/profiles", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        nickName: newNickName,
        profileText: newProfileText,
        profileImagePath: response.list.length
          ? response.list[0].path
          : userInfo.profileImagePath,
      }),
    })
      .then(() => {
        setUser({
          id: String(Cookies.get("userId")),
          isLogined: String(Cookies.get("isLogined")),
          nickName: String(Cookies.get("nickName")),
          profileImagePath: String(Cookies.get("profileImagePath")),
          profileText: String(Cookies.get("profileText")),
          followerCount: String(Cookies.get("followers")),
          followingCount: String(Cookies.get("followings")),
        });
      })
      .then(() => {
        fetchUser(params.id).then((data) => {
          setUserInfo(data);
          setNewImage(data.profileImagePath);
          setNewNickName(data.nickName);
          setNewProfileText(data.profileText);
        });
        setIsOpen(!isOpen);
      });
  }

  function follow() {
    if (user.isLogined === "true") {
      fetch(apiUrl + `/users/${params.id}/follows`, {
        method: userInfo.isFollower ? "DELETE" : "POST",
      }).then(() => {
        fetchUser(params.id).then((data) => {
          setUserInfo(data);
        });
      });
    } else {
      fireToast({
        type: "경고",
        title: "로그인이 필요합니다.",
      });
    }
  }
  return (
    <div className="flex h-80 flex-wrap content-center justify-center bg-[#f1f609]">
      <div className="flex w-2/3 justify-evenly">
        <Image
          width={170}
          height={170}
          alt="profile image"
          src={userInfo.profileImagePath}
          className="h-56 w-56 rounded-full"
          priority
        />
        <div className="flex flex-col justify-evenly">
          <p className="pb-3 text-4xl font-bold">{userInfo.nickName}</p>
          <p className="pb-3 text-xl">{userInfo.profileText}</p>
          <div className="flex divide-x-2 divide-solid divide-black pb-3">
            <div className="pr-5 text-center">
              <p>{t("followers")}</p>
              <p className="text-2xl">{userInfo.followerCount}</p>
              {/* <FollowPopover number={userInfo.followerCount} type="followers" /> */}
            </div>
            <div className="pl-5 text-center">
              <p>{t("followings")}</p>
              <p className="text-2xl">{userInfo.followingCount}</p>
              {/* <FollowPopover
                number={userInfo.followingCount}
                type="followings"
              /> */}
            </div>
          </div>
          <div>
            {userInfo.isMyProfile ? (
              <button
                className="rounded border-2 border-black px-2 py-1 transition duration-300 hover:bg-black hover:text-pointyellow"
                onClick={clickModal}
              >
                {t("edit")}
              </button>
            ) : (
              <button
                className="mr-3 rounded border-2 border-black px-2 py-1 transition duration-300 hover:bg-black hover:text-pointyellow"
                onClick={follow}
              >
                {userInfo.isFollower ? t("unfollow") : t("follow")}
              </button>
            )}
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={clickModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[40rem] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-4xl font-bold italic leading-6">
                    Edit Profile
                  </Dialog.Title>
                  <div className="mt-10 flex justify-around">
                    <div>
                      <Image
                        width={150}
                        height={150}
                        alt="profile image"
                        src={newImage}
                        className="h-48 w-48 rounded-full"
                        priority
                      />
                      <label
                        htmlFor="uploadimg"
                        className="mt-2 flex h-8 items-center justify-center gap-2 rounded-md bg-gray-300 text-sm hover:bg-[#c8cace] hover:shadow"
                      >
                        <IconCamera />
                        Upload Image
                      </label>
                      <input
                        id="uploadimg"
                        className="hidden"
                        accept="image/*"
                        type="file"
                        onChange={(event) => onUpload(event)}
                      />
                    </div>
                    <div>
                      <p className="mb-3">Nickname</p>
                      <input
                        type="text"
                        className="mb-3 w-48 rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none"
                        defaultValue={userInfo.nickName}
                        onChange={(event) => setNewNickName(event.target.value)}
                      />
                      <p className="pb-3">Description</p>
                      <textarea
                        className="h-32 rounded border-2 border-solid border-slate-500 p-1 text-lg focus:outline-none"
                        defaultValue={userInfo.profileText}
                        onChange={(event) =>
                          setNewProfileText(event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-10 text-center">
                    <button
                      className="mx-3 rounded border-2 border-slate-500 px-2 py-1"
                      onClick={clickModal}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      className="rounded border-2 border-pointblue bg-pointblue px-2 py-1 text-white"
                      onClick={onClick}
                    >
                      {t("save")}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
