"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { playTime } from "@/app/store/atoms";
import { userAtom } from "@/app/store/atoms/user";
import useAsync from "@/app/hooks/useAsync";
import { useParams } from "next/navigation";
import {
  getFlowReview,
  postFlowReview,
  deleteFlowReview,
} from "@/app/libs/flowReadApi";
import Loading from "@/app/components/loading";
import Error from "@/app/components/error";
import { ReviewType } from "@/app/types/flowtype";
import fireToast from "@/app/utils/fireToast";
import { playDuration } from "@/app/store/atoms";
import { useTranslations } from "next-intl";

const parseTimeToSeconds = (timeString: string) => {
  const [minutes, seconds] = timeString.split(":").map((v) => parseInt(v, 10));
  return minutes * 60 + seconds;
};

const isValidTimeFormat = (time: string, totalTime: number): boolean => {
  const numberTime = parseTimeToSeconds(time);
  console.log(time, numberTime, totalTime);
  if (numberTime < 0 || numberTime > totalTime) {
    return false;
  }
  const regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

export default function ReviewList() {
  const t = useTranslations("Flow");
  const globalDuration = useAtomValue(playDuration);
  const params = useParams<{ id: string }>();
  const [state, refetch] = useAsync(() => getFlowReview(params.id), []);
  const { loading, data: flowReview, error } = state;
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const userInfo = useAtomValue(userAtom);
  const [timeline, setTimeline] = useState<string>("00:00");
  const [content, setContent] = useState<string>("");
  const setplayTime = useSetAtom(playTime);

  useEffect(() => {
    if (flowReview?.list) {
      setReviews(flowReview.list);
    }
  }, [flowReview]);

  if (loading) return <p> loading.. </p>;
  if (error) return <Error />;

  const setReviewID = (): number => {
    if (reviews.length) {
      return reviews[reviews.length - 1].id + 1;
    } else {
      return 0;
    }
  };

  const addReviewOptimistically = () => {
    const newReviewOBJ: ReviewType = {
      id: setReviewID(),
      user: {
        id: Number(userInfo.id),
        nickName: userInfo.nickName,
        profileImagePath: userInfo.profileImagePath,
      },
      content: content,
      timeline: timeline,
    };

    setReviews((prevReviews) => [...prevReviews, newReviewOBJ]);
  };

  const deleteReviewOptimistically = (reviewID: number) => {
    const newReviews = reviews.filter((review) => review.id !== reviewID);
    setReviews(newReviews);
  };

  const handlePostReview = async () => {
    if (userInfo.id == "") {
      fireToast({
        type: "경고",
        title: "로그인이 필요합니다.",
      });
      setContent("");
      return;
    }
    if (!isValidTimeFormat(timeline, globalDuration)) {
      fireToast({
        type: "경고",
        title: "올바른 형식이 아닙니다",
      });
      setTimeline("00:00");
      return;
    }
    if (content.length === 0) {
      // fireToast({
      //   type: "경고",
      //   title: "한 글자 이상을 적어주세요",
      // });
      return;
    }
    addReviewOptimistically();
    await postFlowReview(params.id, { content: content, timeline: timeline });
    setTimeline("00:00");
    setContent("");
  };

  const handleClickTime = (time: string | null) => {
    if (time == null) return;
    const numberTime = parseTimeToSeconds(time);
    setplayTime(numberTime);
  };

  const handleDeleteReview = (reviewID: number) => {
    deleteReviewOptimistically(reviewID);
    deleteFlowReview(reviewID);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handlePostReview();
    }
  };
  return (
    <div>
      <div className="my-5 flex justify-evenly">
        <Image
          src={userInfo.profileImagePath}
          alt="profile image"
          width={50}
          height={50}
          className="h-12 w-12 rounded-full"
        />
        <div className="relative flex w-5/6">
          <input
            type="text"
            value={timeline}
            className="h-6 w-14 self-center px-1 text-pointblue"
            onChange={(event) => setTimeline(event.target.value)}
          />
          <input
            type="text"
            placeholder={t("writeComments")}
            className="mr-2 w-full rounded-full border-4 border-gray-200 pl-5 focus:outline-none"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button onClick={handlePostReview}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      {reviews &&
        reviews
          .slice()
          .reverse()
          .map((review: ReviewType) => (
            <div key={review.id} className="relative my-5 flex justify-evenly">
              <Image
                src={review.user.profileImagePath}
                alt="profile image"
                width={50}
                height={50}
                className="h-12 w-12 rounded-full"
              />
              <div className="relative w-5/6">
                <span className="mr-3 font-semibold">
                  {review.user.nickName}
                </span>
                <span
                  className="cursor-pointer text-pointblue"
                  onClick={() => handleClickTime(review.timeline)}
                >
                  {review.timeline || "0:00"}
                </span>
                <p className="absolute top-1/2">{review.content}</p>
              </div>
              {String(review.user.id) == userInfo.id && (
                <svg
                  className="absolute right-0 top-2 cursor-pointer"
                  onClick={() => handleDeleteReview(review.id)}
                  viewBox="0 0 1024 1024"
                  fill="red"
                  height="1.1em"
                  width="1.1em"
                >
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
                </svg>
              )}
            </div>
          ))}
    </div>
  );
}
