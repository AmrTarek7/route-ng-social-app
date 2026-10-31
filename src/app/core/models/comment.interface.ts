export interface CommentIF {
  _id: string;
  content?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  repliesCount: number;
  image?: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
