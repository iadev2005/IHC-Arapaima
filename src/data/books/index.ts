import booksData from '../culture/books.json';
import { cacheService } from '../../services/cacheService';

// Definir la interfaz para los libros
export interface Book {
  url: string;
  title: string;
  content: string;
  autor: string;
  images: string[];
  label: string;
}

const CACHE_KEY = 'books_data';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 días

export async function getBooks(): Promise<Book[]> {
  try {
    // Intentar obtener del caché primero
    const cachedBooks = await cacheService.get(CACHE_KEY);
    if (cachedBooks) {
      return cachedBooks;
    }

    // Si no hay caché, usar los datos estáticos y guardarlos
    await cacheService.set(CACHE_KEY, booksData, CACHE_TTL);
    return booksData;
  } catch (error) {
    console.error('Error loading books:', error);
    return booksData; // Fallback a datos estáticos
  }
}

export async function getBookByTitle(title: string): Promise<Book | undefined> {
  const allBooks = await getBooks();
  return allBooks.find(book => book.title === title);
}

export async function searchBooks(query: string): Promise<Book[]> {
  const allBooks = await getBooks();
  const searchTerm = query.toLowerCase();
  
  return allBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.autor.toLowerCase().includes(searchTerm) ||
    book.content.toLowerCase().includes(searchTerm)
  );
}

export async function getBooksByLabel(label: string): Promise<Book[]> {
  const allBooks = await getBooks();
  return allBooks.filter(book => book.label === label);
}

// Función para limpiar el caché de libros
export async function clearBooksCache(): Promise<void> {
  try {
    await cacheService.delete(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing books cache:', error);
  }
} 