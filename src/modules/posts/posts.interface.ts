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
