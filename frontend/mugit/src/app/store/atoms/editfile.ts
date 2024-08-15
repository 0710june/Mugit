import { atom } from "jotai";

// 편집기로 보낼 파일

interface AudioFile {
  file: File;
  id: string;
  url: string;
}

export const fileInitialValue2: {
  preSources: AudioFile[];
  newSources: AudioFile[];
} = {
  preSources: [
    {
      file: new File([], "소스1.mp3"),
      id: "소스1",
      url: URL.createObjectURL(new File([], "소스1.mp3")),
    },
  ],
  newSources: [
    {
      file: new File([], "소스4.mp3"),
      id: "소스4",
      url: URL.createObjectURL(new File([], "소스4.mp3")),
    },
  ],
};

export const fileToEdit = atom(fileInitialValue2);

// 최종적으로 릴리즈할 플로우

export const flowInitialValue2 = {
  flow: "말도안되는플로우",
  source: [
    {
      file: new File([], "어디.mp3"),
      name: "good life",
      url: URL.createObjectURL(new File([], "good life.mp3")),
    },
    {
      file: new File([], "보자.mp3"),
      name: "good life",
      url: URL.createObjectURL(new File([], "good life.mp3")),
    },
    {
      file: new File([], "되나.mp3"),
      name: "good life",
      url: URL.createObjectURL(new File([], "good life.mp3")),
    },
    {
      file: new File([], "안되나.mp3"),
      name: "good life",
      url: URL.createObjectURL(new File([], "good life.mp3")),
    },
  ],
};

export const flowInitialValue3 = {
  flow: "",
  source: [] as AudioFile[],
};

export const fileToRelease = atom(flowInitialValue3);

// 잠깐 더할 파일

export const addInitialValue = {
  source: [] as AudioFile[],
};
export const fileToAdd = atom(addInitialValue);

// 두는 파일

export const putInitialValue = {
  source: [] as AudioFile[],
};
export const fileToPut = atom(putInitialValue);

export const mergedList = atom([]);
