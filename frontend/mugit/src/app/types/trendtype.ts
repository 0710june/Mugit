import { FlowType } from "./flowtype";

export interface TrendSearchResponseType {
  content: FlowType[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface User {
  id: number;
  nickName: string;
  profileImagePath: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}
