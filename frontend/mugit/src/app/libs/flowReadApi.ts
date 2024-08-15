import fireToast from "../utils/fireToast";
import { apiUrl } from "../store/atoms";
import {
  FlowDetailType,
  FlowGraphType,
  FlowReviewType,
} from "../types/flowtype";

export async function getFlowDetail(id: string): Promise<FlowDetailType> {
  const response = await fetch(apiUrl + "/flows/" + id, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Flow Detail fetch failed");
  }
  return response.json();
}

export async function getFlowGraph(id: string): Promise<FlowGraphType> {
  const response = await fetch(apiUrl + "/flows/" + id + "/graph", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Flow Graph fetch failed");
  }

  return response.json();
}

export async function getFlowReview(id: string): Promise<FlowReviewType> {
  const response = await fetch(apiUrl + "/reviews/flows/" + id, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Flow Review fetch failed");
  }

  return response.json();
}

type postReviewType = {
  content: string;
  timeline: string;
};

export function postFlowReview(flowid: string, review: postReviewType) {
  fetch(apiUrl + "/reviews/flows/" + flowid, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(review),
  }).then((response) => {
    if (!response.ok) {
      console.log("서버 응답 오류", response);
      return;
    }
    return response.json();
  });
}

export function deleteFlowReview(reviewID: number) {
  fetch(apiUrl + `/reviews/${reviewID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        console.log("서버 응답 오류", response);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      fireToast({
        type: "경고",
        title: "댓글 삭제 중 문제 발생",
      });
    });
}
