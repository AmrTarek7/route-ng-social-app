export interface Notification {
  _id: string;
  recipient: Recipient;
  actor: Actor;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  entity: Entity;
}

export interface Recipient {
  _id: string;
  name: string;
  photo: string;
}

export interface Actor {
  _id: string;
  name: string;
  photo: string;
}

export interface Entity {
  _id: string;
  user?: string;
  commentsCount?: number;
  topComment?: TopComment;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  id?: string;
  body?: string;
  unavailable?: boolean;
  name?: string;
  username?: string;
  photo?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  image?: string;
}

interface TopComment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
