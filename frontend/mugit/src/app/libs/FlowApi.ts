// https://mugit.site/api/flows/parent/1
import { apiUrl } from "../store/atoms";

export function postNewFlow(flowid: number) {
  fetch(apiUrl + `/flows/parent/${flowid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      console.log("서버 응답 오류", response);
      return;
    }
    return response.json();
  });
}
