export interface INewPostPayload {
  title: string;
  content: string;
  authorId: string;
  previewImage?: string;
}

export interface IGetPostResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  previewImage?: string;
}

export interface IUpdatePostStatusPayload {
  status: string;
}

export type TStatus = 'pending' | 'approved' | 'rejected';

export interface IListPosts {
  posts: IGetPostResponse[];
  limit: number;
  currentPage: number;
  count: number;
  totalPages: number;
}

export interface IGetListPostsQuery {
  page: number;
  limit: number;
  status: string;
}
