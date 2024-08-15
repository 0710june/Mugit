"use client";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import ReactStudio from "react-studio-js";
import EventEmitter from "event-emitter";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from "uuid";
import { Box, Paper } from "@mui/material";
import CustomAudioBar from "./components/CUSTOM/audioBar/CustomAudioBar";
import { dark } from "./theme/theme";
import { useThemeSettings } from "./hooks";
import EditorButtons from "./components/editorButtons/EditorButtons";

import * as Tone from "tone";
import { useAtomValue, useAtom } from "jotai";
import {
  fileToEdit,
  fileToRelease,
  flowInitialValue3,
} from "@/app/store/atoms/editfile";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

// Edit 컴포넌트 정의
const Edit = ({ uploadedFiles }) => {
  const router = useRouter();
  // 테마 설정을 위한 커스텀 훅 사용
  const { theme, setEventEmitter, podcast, showAnnotations, setDialogBox } =
    useThemeSettings();
  const { backgroundColor, textColor } = theme;

  // 리듀서 액션 타입 정의
  const SETBUTTONS = "SETBUTTONS";
  const SETENABLECUT = "SETENABLECUT";
  const SETENEABLESPLIT = "SETENEABLESPLIT";
  const PLAYLIST = "PLAYLIST";

  // 리듀서 초기 상태 정의
  const initialState = {
    ee: new EventEmitter(),
    toneCtx: Tone.getContext(),
    setUpChain: useRef(),
    uploadRef: useRef(null),
    uploadAnnRef: useRef(null),
    allbuttons: true,
    enableCut: true,
    enableSplit: true,
    playlist: () => {},
  };

  // 리듀서 함수 정의
  function reducer(state, action) {
    const { type, payload } = action;
    switch (type) {
      case SETBUTTONS:
        return { ...state, allbuttons: payload };
      case SETENABLECUT:
        return { ...state, enableCut: payload };
      case SETENEABLESPLIT:
        return { ...state, enableSplit: payload };
      case PLAYLIST:
        return { ...state, playlist: payload };
      default:
        return state;
    }
  }

  // 리듀서 및 상태 초기화
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tracks, setTracks] = useState([]);
  const { ee, toneCtx, setUpChain, uploadRef } = state;
  const sendFile = useAtomValue(fileToEdit);
  const [myMusicArray, setMyMusicArray] = useAtom(fileToEdit);
  const locale = useLocale();
  const params = useParams();
  const audioFiles = useAtomValue(fileToEdit);
  const [toReleaseFile, setToReleaseFile] = useAtom(fileToRelease);

  // 오디오 편집기 초기화
  const container = useCallback(
    (node) => {
      if (node !== null && toneCtx !== null) {
        const playlist = ReactStudio(
          {
            ac: toneCtx.rawContext,
            container: node,
            state: "cursor",
            mono: true,
            samplesPerPixel: 500,
            waveHeight: 100,
            isAutomaticScroll: true,
            timescale: false,
            barGap: 1,
            colors: {
              waveOutlineColor: "#222B36",
              timeColor: "grey",
              fadeColor: "black",
            },
            controls: {
              show: true,
              width: 175,
              widgets: {
                collapse: false,
              },
              customClass: "custom-controls",
            },
            zoomLevels: [500, 1000, 2000],
            seekStyle: "fill",
          },
          ee
        );
        dispatch({
          type: PLAYLIST,
          payload: playlist,
        });

        // 이벤트 리스너 설정
        ee.on("audiorenderingstarting", function (offlineCtx, a) {
          const offlineContext = new Tone.OfflineContext(offlineCtx);
          Tone.setContext(offlineContext);
          setUpChain.current = a;
        });

        ee.on("audiorenderingfinished", function (type, data) {
          Tone.setContext(toneCtx);
          if (type === "wav") {
            saveAs(data, `${podcast}.wav`);
          }
        });

        ee.on("audiosources_rendering", () => setDialogBox(true));
        ee.on("audiosourcesrendered", () => {
          setDialogBox(false);
        });

        ee.on("tracksUpdated", (e) =>
          dispatch({
            type: SETBUTTONS,
            payload: e,
          })
        );

        ee.on(
          "tracksLeft",
          (tracks) =>
            tracks === 0 &&
            dispatch({
              type: SETBUTTONS,
              payload: true,
            })
        );

        ee.on("audiosourceserror", (e) => alert(e.message));
        ee.on("enableCut", (fact) =>
          dispatch({
            type: SETENABLECUT,
            payload: fact,
          })
        );

        ee.on("enableSplit", (fact) =>
          dispatch({
            type: SETENEABLESPLIT,
            payload: fact,
          })
        );
        ee.on("rendertrack", async (file, callback) => {
          try {
            console.log(`렌더트랙 이벤트 시작: ${file.name}`);
            const data = await renderTrack(file);
            callback(data);
          } catch (error) {
            console.error(`트랙 렌더링 오류: ${error.message}`);
            callback(null);
          }
        });
        playlist.initExporter();
        setEventEmitter(ee);
      }
    },
    [ee, toneCtx]
  );

  // 파일 업로드 핸들러
  function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const newTrack = {
      file: file,
      name: file.name,
      id: uuidv4(),
    };
    ee.emit("newtrack", newTrack);
    setTracks((prevTracks) => [...prevTracks, newTrack]);
    uploadRef.current.value = "";
  }

  // 버튼 클릭 핸들러
  function handleClick(event) {
    const { name } = event.target;

    switch (name) {
      case "play":
        return ee.emit("play");
      case "pause":
        return ee.emit("pause");
      case "cursor":
        return ee.emit("statechange", "cursor");
      case "region":
        return ee.emit("statechange", "select");
      case "shift":
        return ee.emit("statechange", "shift");
      case "trim":
        return ee.emit("trim");
      case "cut":
        ee.emit("cut");
        return dispatch({
          type: SETENABLECUT,
          payload: true,
        });
      case "split":
        return ee.emit("split");
      case "fadein":
        return ee.emit("statechange", "fadein");
      case "fadeout":
        return ee.emit("statechange", "fadeout");
      case "zoomin":
        return ee.emit("zoomin");
      case "zoomout":
        return ee.emit("zoomout");
      case "upload":
        return uploadRef.current.click();
      case "download":
        return ee.emit("startaudiorendering", "wav");
      case "downloadTracks":
        return handleDownloadTracks();

      default:
        break;
    }
  }

  // 트랙 다운로드 핸들러
  const handleDownloadTracks = () => {
    tracks.forEach((track, index) => {
      const { file, name } = track;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;

          let audioContext;

          try {
            audioContext = new (window.AudioContext || window.AudioContext)();
            console.log("AudioContext successfully initialized.");
          } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
          }

          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          const offlineContext = new OfflineAudioContext(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate
          );
          const source = offlineContext.createBufferSource();
          source.buffer = buffer;
          source.connect(offlineContext.destination);
          source.start(0);
          const renderedBuffer = await offlineContext.startRendering();
          const wavBlob = bufferToWave(renderedBuffer);
          saveAs(wavBlob, `${name || "track"}_${index}.wav`);
        } catch (error) {
          console.error("Error decoding audio data:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // AudioBuffer를 WAV 파일로 변환하는 함수
  const bufferToWave = (buffer) => {
    let numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArray = new ArrayBuffer(length),
      view = new DataView(bufferArray),
      channels = [],
      i,
      sample,
      offset = 0,
      pos = 0;

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // 파일 길이 - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " 청크
    setUint32(16); // 길이 = 16
    setUint16(1); // PCM (압축되지 않음)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // avg. 바이트/초
    setUint16(numOfChan * 2); // 블록 정렬
    setUint16(16); // 16비트 (하드코딩)

    setUint32(0x61746164); // "data" - 청크
    setUint32(length - pos - 4); // 청크 길이

    for (i = 0; i < buffer.numberOfChannels; i++)
      channels.push(buffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // 클램프
        sample = (0.5 + sample * 0.5) * 65535.0; // 16비트 부호 없는 정수로 스케일링
        view.setInt16(pos, sample, true); // 16비트 샘플 쓰기
        pos += 2;
      }
      offset++; // 다음 소스 샘플
    }

    return new Blob([bufferArray], { type: "audio/wav" });

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  };

  useEffect(() => {
    // 전역 변수에서 가져온 파일 정보 로드
    if (ee) {
      const allTracks = [...audioFiles.preSources, ...audioFiles.newSources];

      const newTracks = allTracks.map((item) => ({
        file: item.url,
        name: item.name,
        id: uuidv4(),
      }));

      setTracks(newTracks);

      allTracks.forEach((item) => {
        if (item.url !== flowInitialValue3.flow) {
          console.log("전역 변수에서 가져온 편집할 소스 목록 :", item.url);
          ee.emit("newtrack", {
            file: item.url,
            name: item.name,
            id: uuidv4(),
          });
        }
      });
    }
  }, [ee, audioFiles]);

  // downloadTracks, Upload to Edit 위해 필요
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        const newTrack = {
          file: file,
          name: file.name,
          id: uuidv4(),
        };
        ee.emit("newtrack", newTrack);
        setTracks((prevTracks) => [...prevTracks, newTrack]);
      });
    }
  }, [uploadedFiles]);

  // 릴리즈 전 파일 수정 과정

  // Function to render an individual track by its ID
  const renderTrack = (file) => {
    return new Promise((resolve, reject) => {
      console.log(`파일 렌더링 시작: ${file.name}`);
      const reader = new FileReader();
      reader.onload = () => {
        console.log(`파일 읽기 완료: ${file.name}`);
        resolve(new Blob([reader.result], { type: file.type }));
      };
      reader.onerror = (error) => {
        console.error(`파일 읽기 오류: ${error}`);
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const triggerRenderTrack = (trackId, file) => {
    return new Promise((resolve, reject) => {
      ee.emit("rendertrack", file, (data) => {
        if (file) {
          console.log(`렌더링되었습니다: ${file}`);
          resolve({ trackId, data });
        } else {
          console.error("렌더링에 실패했습니다.");
          reject("렌더링 실패");
        }
      });
    });
  };
  const submit = async () => {
    console.log("클릭했음");

    // 제출 위해 렌더링
    console.log("렌더링시작");
    ee.emit("startaudiorendering", "wav");

    // 최종 트랙 렌더링
    const finalTrackUrl = await new Promise((resolve) => {
      ee.on("audiorenderingfinished", (type, data) => {
        console.log("최종트랙 렌더링");
        if (type === "wav") {
          // 파이널 트랙 저장
          const finalTrack = new Blob([data], { type: "audio/wav" });
          const url = URL.createObjectURL(finalTrack);
          console.log("최종 트랙:", url);
          resolve(url);
        } else {
          console.log("타입문제:", type);
        }
      });
    });

    // // 각 트랙 url을 전역변수에 저장
    let individualTrackBlobs = [];
    console.log("트랙 렌더링 시작");
    for (const track of tracks) {
      console.log(`추가할 트랙: ${track.name} ${track.id}${track.file}`);
      try {
        const { trackId, data } = await triggerRenderTrack(
          track.id,
          track.file
        );
        const trackBlob = new Blob([data], { type: "audio/wav" });
        individualTrackBlobs.push({
          file: new File([trackBlob], track.name),
          name: track.name,
          url: URL.createObjectURL(new File([], track.name)),
          // blob: trackBlob,
        });
        console.log("각 트랙 Blob 저장됨:", individualTrackBlobs);
      } catch (error) {
        console.error(`트랙 렌더링 오류: ${error}`);
      }
    }

    // console.log("각 트랙 url 생성됨:", individualTrackUrls);

    // 전역변수에 합친 트랙과 개별 트랙을 저장
    setToReleaseFile({
      flow: finalTrackUrl,
      source: individualTrackBlobs,
    });
    console.log("$$$$$$$$$$$$$4저장된 toReleaseFile : ", toReleaseFile);
    console.log("$$$$$$$$전역변수 값", fileToRelease);

    // 페이지 이동
    console.log("드디어 레코드 페이지로");
    router.push(`/${locale}/flow/${params.id}/record`);
  };
  useEffect(() => {
    console.log("저장된 toReleaseFile : ", toReleaseFile);
  }, [toReleaseFile]);

  // JSX 반환
  return (
    <>
      <Box
        sx={{
          p: 2,
          backgroundColor,
          color: textColor,
          paddingTop: 10,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box>
          <EditorButtons
            handleClick={handleClick}
            cutButton={state.enableCut}
            disabled={state.allbuttons}
            splitButton={state.enableSplit}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <input
              ref={uploadRef}
              type="file"
              accept=".mp3, .wav"
              multiple={false}
              onChange={handleUpload}
              style={{
                display: "none",
              }}
            />
            <Paper
              elevation={16}
              ref={container}
              onDragOver={() => console.log("ure dragging")}
              id={"editor"}
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                mb: 8,
                input: {
                  backgroundColor: "transparent",
                },
                "#remove": {
                  borderRadius: "6px",
                  position: "relative",
                  ":after": {
                    position: "absolute",
                    content: `""`,
                    width: "3px",
                    height: "65%",
                    backgroundColor: "white",
                    borderRadius: "1px",
                    left: "45%",
                    translate: "-50%",
                    transform: "rotate(45deg)",
                  },
                  ":before": {
                    position: "absolute",
                    content: `""`,
                    width: "3px",
                    height: "65%",
                    backgroundColor: "white",
                    borderRadius: "1px",
                    left: "45%",
                    translate: "-50%",
                    transform: "rotate(-45deg)",
                  },
                },
                ".annotations": {
                  height: showAnnotations ? 215 : 0,
                  overflow: "hidden",
                  transition: "0.35s",
                  ".current": {
                    transition: "0.65s",
                  },
                  span: {
                    color: dark,
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </Box>
        </Box>
        <div className="flex w-full">
          <button
            className="h-[45px] w-[150px] rounded-full bg-pointblue text-2xl font-extrabold italic text-white transition duration-200 hover:bg-pointyellow hover:text-pointblue"
            onClick={submit}
          >
            Submit
          </button>
        </div>
        <CustomAudioBar bottom={!state.allbuttons ? 0 : -100} ee={ee} />
      </Box>
      <style jsx>{`
        .file-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
        .drop-area {
          height: 128px;
          border: 4px dashed #999;
          margin: 2em 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 18px;
        }
        .waveform {
          height: 100px;
          margin-top: 10px;
          width: 100%;
        }
        .controls {
          display: flex;
        }
      `}</style>
    </>
  );
};

export default Edit;
