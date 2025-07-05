// Funciones utilitarias centralizadas

import { VoteType } from '@/types';

// Re-exportar funciones de otros archivos
export { cn } from './cn';
export * from './validation';
export * from './animations';

/**
 * Formatea una fecha a un formato legible
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Calcula el tiempo transcurrido desde una fecha
 */
export function getTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
}

/**
 * Genera un ID único
 */
export function generateId(): number {
    return Date.now() + Math.random();
}

/**
 * Valida un email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Filtra y ordena posts por diferentes criterios
 */
export function sortPosts(posts: any[], sortBy: 'newest' | 'oldest' | 'popular' | 'title') {
    const sorted = [...posts];
    
    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'popular':
            return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sorted;
    }
}

/**
 * Calcula el score de un post (upvotes - downvotes)
 */
export function calculateScore(upvotes: number, downvotes: number): number {
    return upvotes - downvotes;
}

/**
 * Valida el contenido de un post
 */
export function validatePostContent(content: string, maxLength: number = 5000): boolean {
    return content.trim().length > 0 && content.length <= maxLength;
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
} 