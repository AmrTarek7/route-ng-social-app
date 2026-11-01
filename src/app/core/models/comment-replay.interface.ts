export interface CommentReplyIF {
  _id: string;
  content?: string;
  image?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
