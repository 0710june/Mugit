import { atomWithStorage } from "jotai/utils";

export const userInitialValue = {
  id: "",
  isLogined: "false",
  nickName: "",
  profileImagePath:
    "https://mugit.site/files/008494eb-b272-4c83-919b-677378107fd2.jpg",
  profileText: "",
  followerCount: "",
  followingCount: "",
};

export const userAtom = atomWithStorage("user", userInitialValue);

export const SessionID = atomWithStorage("sessionID", "sessionID");

export const prevpathAtom = atomWithStorage("prevpath", "");
