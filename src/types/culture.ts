export interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    publishedAt: string;
    image?: string;
}

export interface CultureData {
    articles: Article[];
    categories: string[];
} 