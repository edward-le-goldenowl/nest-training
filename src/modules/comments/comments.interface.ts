export interface INewCommentPayload {
  postId: string;
  userId?: string;
  content: string;
}

export interface IGetCommentResponse {
  id: string;
  postId: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IUpdateCommentPayload {
  content: string;
}

export interface IGetListCommentsQuery {
  page: number;
  limit: number;
  postId: string;
}

export interface IListComments {
  comments: IGetCommentResponse[];
  pagination: {
    limit: number;
    currentPage: number;
    count: number;
    totalPages: number;
  };
}

export interface ILikeCommentPayload {
  commentId: string;
  userId?: string;
}

export interface IGetLikeCommentResponse {
  id: string;
  commentId: string;
  postId: string;
  userId: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}
