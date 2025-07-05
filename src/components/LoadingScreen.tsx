import { motion } from 'framer-motion';
import { useLoading } from '../hooks/useLoading';
import React from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const { isLoading, progress, hasCachedData, loadingMessage } = useLoading({
    minLoadingTime: 2000,
    checkCache: true
  });

  // Llamar callback cuando termine la carga
  React.useEffect(() => {
    if (!isLoading && onLoadingComplete) {
      onLoadingComplete();
    }
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/assets/logo/logo.svg"
            alt="Arapaima Logo"
            className="w-80 h-80 mx-auto"
          />
        </motion.div>

        {/* Título */}
        <motion.h1
          className="text-3xl font-bold text-white mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Arapaima
        </motion.h1>

        {/* Mensaje de carga dinámico */}
        <motion.p
          className="text-lg text-gray-300 mb-8 min-h-[1.5rem]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loadingMessage}
        </motion.p>

        {/* Barra de progreso */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Porcentaje */}
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </div>

        {/* Indicador de caché */}
        {hasCachedData && (
          <motion.div
            className="mt-4 text-xs text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ✓ Datos en caché encontrados
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 