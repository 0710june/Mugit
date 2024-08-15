interface User {
  id: number;
  nickName: string;
  profileImagePath: string;
}

export type FlowType = {
  id: number;
  user: User;
  title: string;
  authority: string;
  musicPath: string;
  coverPath: string;
  createdAt: string;
  hashtags: string[];
};

export type FlowDetailType = {
  id: number;
  user: User;
  title: string;
  message: string;
  authority: string;
  musicPath: string;
  coverPath: string;
  likes: number;
  likePressed: boolean;
  record: {
    id: number;
    message: string;
    isOpen: boolean;
    sources: [
      {
        id: number;
        name: string;
        path: string;
        // name: string | null;
        // path: string | null;
      }
    ];
  };
  hashtags: string[];
  createdAt: string;
};

type FlowNode = {
  id: number;
  name: string;
  image: string;
};

export type FlowGraphType = {
  id: number;
  name: string;
  image: string;
  childFlows: FlowNode[];
};

export type ReviewType = {
  id: number;
  user: {
    id: number;
    nickName: string;
    profileImagePath: string;
  };
  content: string;
  timeline: string | null;
};

export type FlowReviewType = {
  list: ReviewType[];
};
