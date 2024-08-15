import { apiUrl } from "../store/atoms";

export async function patchLike(id: number) {
  fetch(apiUrl + `/likes/flows/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log("좋아요 실패", err);
    });
}
