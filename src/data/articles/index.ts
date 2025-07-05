import articlesData from '../culture/articles.json';
import { cacheService } from '../../services/cacheService';

// Definir la interfaz para los artículos
export interface Article {
  url: string;
  title: string;
  content: string;
  images: string[];
  label: string;
}

const CACHE_KEY = 'articles_data';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 días

export async function getArticles(): Promise<Article[]> {
  try {
    // Intentar obtener del caché primero
    const cachedArticles = await cacheService.get(CACHE_KEY);
    if (cachedArticles) {
      return cachedArticles;
    }

    // Si no hay caché, usar los datos estáticos y guardarlos
    await cacheService.set(CACHE_KEY, articlesData, CACHE_TTL);
    return articlesData;
  } catch (error) {
    console.error('Error loading articles:', error);
    return articlesData; // Fallback a datos estáticos
  }
}

export async function getArticleByTitle(title: string): Promise<Article | undefined> {
  const allArticles = await getArticles();
  return allArticles.find(article => article.title === title);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const allArticles = await getArticles();
  const searchTerm = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.label.toLowerCase().includes(searchTerm)
  );
}

export async function getArticlesByLabel(label: string): Promise<Article[]> {
  const allArticles = await getArticles();
  return allArticles.filter(article => article.label === label);
}

// Función para limpiar el caché de artículos
export async function clearArticlesCache(): Promise<void> {
  try {
    await cacheService.delete(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing articles cache:', error);
  }
} 