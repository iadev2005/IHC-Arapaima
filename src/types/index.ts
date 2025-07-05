// Tipos centralizados para la aplicación

// Tipos para el foro
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

// Tipos para la biblioteca
export interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    createdAt: string;
}

// Tipos para el mapa
export interface MapPoint {
    id: number;
    name: string;
    description: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: 'river' | 'aquarium' | 'culture' | 'library';
}

// Tipos para el usuario
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

// Tipos para votos
export type VoteType = 'up' | 'down' | null;
export interface UserVotes {
    [postId: number]: VoteType;
} 

// Forum types
export * from './forum';

// Water types
export * from './water';

// Culture types
export * from './culture';

// Common types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface SearchParams {
    query: string;
    filters?: Record<string, any>;
} 