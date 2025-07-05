# Sistema de Caché - Arapaima

## 📋 Descripción General

El sistema de caché implementado en Arapaima utiliza **IndexedDB** y **localStorage** para mejorar significativamente los tiempos de carga y la experiencia del usuario. Los datos se almacenan localmente y se cargan instantáneamente en visitas posteriores.

## 🏗️ Arquitectura

### **IndexedDB (Datos Grandes)**
- **Libros**: `books_data` - TTL: 7 días
- **Artículos**: `articles_data` - TTL: 7 días
- **Capacidad**: Sin límite práctico
- **Uso**: Datos que no cambian frecuentemente

### **localStorage (Datos Pequeños)**
- **Preferencias**: `user_preferences` - TTL: 30 días
- **Capacidad**: ~5-10MB
- **Uso**: Configuraciones y datos de sesión

## 🛠️ Servicios Principales

### **cacheService.ts**
```typescript
// Servicio principal para IndexedDB
const cacheService = new CacheService();

// Métodos disponibles
await cacheService.set(key, data, ttl);
const data = await cacheService.get(key);
await cacheService.delete(key);
await cacheService.clear();
await cacheService.cleanup(); // Limpia datos expirados
```

### **localStorageService**
```typescript
// Servicio para localStorage
localStorageService.set(key, data, ttl);
const data = localStorageService.get(key);
localStorageService.delete(key);
localStorageService.clear();
```

## 🎣 Hooks Disponibles

### **useCache**
```typescript
const { data, loading, error, updateData, clearCache, reload } = useCache({
  key: 'my_data',
  ttl: 24 * 60 * 60 * 1000, // 24 horas
  useLocalStorage: false // true para localStorage
});
```

### **useCachedData**
```typescript
const { data, loading, error, reload, clearCache } = useCachedData(
  'books_data',
  () => fetchBooks(), // Función que obtiene datos frescos
  { ttl: 7 * 24 * 60 * 60 * 1000 }
);
```

### **useUserPreferences**
```typescript
const {
  preferences,
  loading,
  setTheme,
  setLanguage,
  toggleNotifications,
  toggleAutoSave,
  toggleCache,
  resetPreferences
} = useUserPreferences();
```

## 📊 Datos Cacheados

### **Libros (`books_data`)**
```typescript
interface Book {
  url: string;
  title: string;
  content: string;
  autor: string;
  images: string[];
  label: string;
}

// Funciones disponibles
await getBooks(); // Obtener todos los libros
await getBookByTitle(title); // Buscar por título
await searchBooks(query); // Búsqueda en texto
await getBooksByLabel(label); // Filtrar por etiqueta
await clearBooksCache(); // Limpiar caché
```

### **Artículos (`articles_data`)**
```typescript
interface Article {
  url: string;
  title: string;
  content: string;
  images: string[];
  label: string;
}

// Funciones disponibles
await getArticles(); // Obtener todos los artículos
await getArticleByTitle(title); // Buscar por título
await searchArticles(query); // Búsqueda en texto
await getArticlesByLabel(label); // Filtrar por etiqueta
await clearArticlesCache(); // Limpiar caché
```

### **Preferencias (`user_preferences`)**
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: boolean;
  autoSave: boolean;
  cacheEnabled: boolean;
  lastVisit: string;
}
```

## 🎨 Componentes de UI

### **LoadingScreen**
```typescript
<LoadingScreen onLoadingComplete={() => setShowLoading(false)} />
```

**Características:**
- Detección automática de datos en caché
- Progreso visual con porcentaje
- Indicador de carga desde caché
- Tiempo mínimo configurable

### **CacheStats** (Solo desarrollo)
```typescript
<CacheStats className="mt-4" />
```

**Muestra:**
- Estado de cada tipo de datos
- Total de elementos cacheados
- Botón para limpiar caché
- Solo visible en modo desarrollo

## ⚡ Optimizaciones de Rendimiento

### **Carga Inteligente**
1. **Primera visita**: Carga normal + guarda en caché
2. **Visitas posteriores**: Carga instantánea desde caché
3. **Verificación**: Comprueba datos expirados automáticamente

### **Limpieza Automática**
- **TTL**: Tiempo de vida configurable por tipo de dato
- **Cleanup**: Eliminación automática de datos expirados
- **Fallback**: Recarga datos si el caché falla

### **Compresión**
- **Gzip**: Para archivos estáticos
- **Brotli**: Compresión adicional para navegadores modernos
- **Optimización**: Reducción significativa del tamaño de archivos

## 🔧 Configuración

### **TTL (Time To Live)**
```typescript
// Configuración por defecto
const CACHE_TTL = {
  books: 7 * 24 * 60 * 60 * 1000,    // 7 días
  articles: 7 * 24 * 60 * 60 * 1000,  // 7 días
  preferences: 30 * 24 * 60 * 60 * 1000 // 30 días
};
```

### **Prefijos**
```typescript
// localStorage
const PREFIX = 'arapaima_';

// IndexedDB
const DB_NAME = 'ArapaimaCache';
const DB_VERSION = 1;
```

## 🐛 Debugging

### **Modo Desarrollo**
```typescript
// Verificar estado del caché
const booksCache = await cacheService.get('books_data');
const articlesCache = await cacheService.get('articles_data');
const userPrefs = localStorageService.get('user_preferences');

// Limpiar caché manualmente
await cacheService.clear();
localStorageService.clear();
```

### **Herramientas del Navegador**
1. **DevTools > Application > Storage**
2. **IndexedDB**: Ver datos de libros y artículos
3. **localStorage**: Ver preferencias del usuario
4. **Console**: Logs de errores y estado

## 📈 Métricas de Rendimiento

### **Antes del Caché**
- Tiempo de carga: 2-3 segundos
- Datos se cargan desde servidor cada vez
- Experiencia inconsistente

### **Después del Caché**
- **Primera visita**: 2-3 segundos (normal)
- **Visitas posteriores**: <500ms (instantáneo)
- **Búsquedas**: Instantáneas
- **Experiencia**: Consistente y fluida

## 🚀 Beneficios

1. **Velocidad**: Carga instantánea en visitas posteriores
2. **Offline**: Funciona sin conexión con datos cacheados
3. **Experiencia**: Sin tiempos de espera
4. **Escalabilidad**: Maneja grandes cantidades de datos
5. **Robustez**: Fallback a datos estáticos si falla
6. **Mantenimiento**: Limpieza automática de datos expirados

## 🔮 Futuras Mejoras

- [ ] **Service Worker**: Para caché offline completo
- [ ] **Sincronización**: Sincronizar datos cuando hay conexión
- [ ] **Compresión**: Comprimir datos en IndexedDB
- [ ] **Métricas**: Tracking de uso del caché
- [ ] **PWA**: Convertir en Progressive Web App 