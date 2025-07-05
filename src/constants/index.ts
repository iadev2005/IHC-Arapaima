// Constantes centralizadas de la aplicación

// Rutas de la aplicación
export const ROUTES = {
    HOME: '/',
    FORUM: '/forum',
    LIBRARY: '/library',
    MAP: '/map',
    RIVER: '/river',
    AQUARIUM: '/aquarium',
    CULTURE: '/culture',
    ARTICLE_DETAIL: '/article/:id',
    POST_DETAIL: '/post/:id',
} as const;

// Categorías de artículos
export const ARTICLE_CATEGORIES = {
    BIOLOGY: 'biology',
    ECOLOGY: 'ecology',
    CONSERVATION: 'conservation',
    RESEARCH: 'research',
    CULTURE: 'culture',
} as const;

// Tipos de puntos en el mapa
export const MAP_POINT_TYPES = {
    RIVER: 'river',
    AQUARIUM: 'aquarium',
    CULTURE: 'culture',
    LIBRARY: 'library',
} as const;

// Configuración del foro
export const FORUM_CONFIG = {
    POSTS_PER_PAGE: 10,
    COMMENTS_PER_PAGE: 20,
    MAX_TITLE_LENGTH: 100,
    MAX_CONTENT_LENGTH: 5000,
} as const;

// Configuración de la biblioteca
export const LIBRARY_CONFIG = {
    ARTICLES_PER_PAGE: 12,
    SEARCH_DELAY: 300, // ms
} as const;

// Colores del tema
export const COLORS = {
    PRIMARY: '#1e40af',
    SECONDARY: '#059669',
    ACCENT: '#dc2626',
    BACKGROUND: '#f8fafc',
    TEXT: '#1e293b',
    TEXT_LIGHT: '#64748b',
} as const;

// Breakpoints para responsive design
export const BREAKPOINTS = {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE: '1280px',
} as const; 