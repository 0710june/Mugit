import { genres } from "../constants/genres";
import { apiUrl } from "../store/atoms";
import { TrendSearchResponseType } from "../types/trendtype";

interface elementType {
  id: number;
  name: string;
}

export async function getFlowList(
  page: number
): Promise<TrendSearchResponseType> {
  const response = await fetch(apiUrl + `/flows?page=${page}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Flow Review fetch failed");
  }
  return response.json();
}

export async function getSearchResult(
  page: number = 0,
  keyword: string
): Promise<TrendSearchResponseType> {
  let requestURL = `${apiUrl}/flows/`;

  const include = (element: elementType) =>
    element.name === decodeURIComponent(keyword);

  if (genres.some(include)) {
    requestURL += `genre?page=${page}&hashtag=${keyword}`;
  } else {
    requestURL += `search?page=${page}&keyword=${keyword}`;
  }

  const response = await fetch(requestURL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Flow Review fetch failed");
  }

  return response.json();
}
