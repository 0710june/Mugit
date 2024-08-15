"use client";

import { atom } from "jotai";

// 현재 bottomNavbar에서 play되고 있는 노래가 있는지
export const isplaying = atom(false);

export const SonginitialValue = {
  id: -1,
  user: {
    id: 0,
    nickName: "string",
    profileImagePath: "string",
  },
  title: "string",
  authority: "PUBLIC",
  musicPath: "string",
  coverPath: "string",
  createdAt: "string",
  hashtags: ["string"],
};

// 현재 bottomNavbar에서 play되고 있는 노래가 있을 때 그 노래에 대한 정보
export const nowPlaying = atom(SonginitialValue);

// 댓글에서 시간을 클릭했는지
export const playTime = atom(0);

// 현재 재생 중인 곡의 총 길이가 어떻게 되는지
export const playDuration = atom(0);

export const FlowinitialValue = {
  id: 0,
  user: {
    id: 0,
    nickName: "nickName",
    profileImagePath: "profileImage",
  },
  title: "title",
  authority: "authority",
  musicPath: "music",
  coverPath: "image",
  createdAt: "date",
  hashtags: ["hashtags"],
};

// profile에서 work탭에서 release 버튼을 누른 flow
export const releaseFlowAtom = atom(FlowinitialValue);
