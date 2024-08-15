import { apiUrl } from "../store/atoms";
import { FeedType } from "../types/feedtype";

export async function getFeed(page: number): Promise<FeedType> {
  const response = await fetch(apiUrl + `/feeds?page=${page}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Feed fetch failed");
  }
  return response.json();
}
