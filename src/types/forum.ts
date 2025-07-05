export interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    replies?: Comment[];
}

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    comments: Comment[];
    label: string;
}

export interface ForumData {
    posts: Post[];
}

export interface UserVotes {
    [postId: number]: 'up' | 'down' | null;
} 