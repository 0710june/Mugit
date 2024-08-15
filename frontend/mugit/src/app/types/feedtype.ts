export interface FeedType {
  pageable: Pageable;
  size: number;
  content: FeedContentType[];
  number: number;
  sort: Sort[];
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  totalPages: number;
  totalElements: number;
}

export interface FeedContentType {
  id: number;
  user: User;
  title: string;
  authority: string;
  musicPath: string;
  coverPath: string;
  createdAt: string;
  hashtags: string[];
}

interface User {
  id: number;
  nickName: string;
  profileImagePath: string;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort[];
  paged: boolean;
  unpaged: boolean;
}

interface Sort {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}
