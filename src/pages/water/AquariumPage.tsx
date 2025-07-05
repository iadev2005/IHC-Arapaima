import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileMenu } from '@/components/shared/MobileMenu';
import { BackButton } from '@/components/shared/BackButton';
import { pageTransitions, elementAnimations, hoverAnimations } from '@/utils/animations';
import { fishesData } from '@/data';

// Generar las letras del alfabeto que tienen peces asociados
const getAvailableLetters = (fishes: any[]) => {
    const letters = new Set(fishes.map(fish => fish.name.charAt(0).toUpperCase()));
    return ['Todos', ...Array.from(letters).sort()];
};

export function Aquarium() {
    const navigate = useNavigate();
    const [currentFishIndex, setCurrentFishIndex] = useState(0);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState('Todos');

    // Obtener letras disponibles
    const availableLetters = useMemo(() => getAvailableLetters(fishesData), []);

    // Filtrado de peces por letra inicial
    const filteredFishes = useMemo(() => {
        if (selectedLetter === 'Todos') return fishesData;
        return fishesData.filter((fish) => 
            fish.name.toUpperCase().startsWith(selectedLetter)
        );
    }, [selectedLetter]);

    const currentFish = filteredFishes[currentFishIndex];

    useEffect(() => {
        setIsFirstRender(false);
        setCurrentFishIndex(0); // Resetear el índice cuando cambia el filtro
    }, [selectedLetter]);

    const handlePreviousFish = useCallback(() => {
        setCurrentFishIndex((prevIndex) =>
            prevIndex === 0 ? filteredFishes.length - 1 : prevIndex - 1
        );
    }, [filteredFishes.length]);

    const handleNextFish = useCallback(() => {
        setCurrentFishIndex((prevIndex) =>
            prevIndex === filteredFishes.length - 1 ? 0 : prevIndex + 1
        );
    }, [filteredFishes.length]);

    const handleNavigateBack = useCallback(() => {
        navigate('/aqua', { state: { from: 'aquarium' } });
    }, [navigate]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                handlePreviousFish();
            } else if (event.key === 'ArrowRight') {
                handleNextFish();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handlePreviousFish, handleNextFish]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0"
                variants={pageTransitions.slideLeft}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                    backgroundImage: "url('/assets/background/background-aquarium.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <motion.div
                    className="relative w-full h-full flex flex-col text-white"
                    variants={elementAnimations.fadeIn}
                >
                    {/* Header */}
                    <div className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-sm z-50 py-2 md:py-5">
                        <div className="flex items-center px-4 md:px-8">
                            <div className="flex items-center gap-2 md:gap-3 flex-1">
                                <motion.div 
                                    className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center"
                                    variants={elementAnimations.rotateIn}
                                >
                                    <img 
                                        src="/assets/icons/fish.png"
                                        alt="Fish Icon"
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                                <motion.h1 
                                    className="text-xl md:text-2xl font-bold text-white"
                                    variants={elementAnimations.slideUp}
                                >
                                    Acuario
                                </motion.h1>
                            </div>

                            {/* Logo central */}
                            <motion.div
                                className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:block"
                                onClick={() => navigate('/')}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <img
                                    src="/assets/logo/logo.svg"
                                    alt="Logo"
                                    className="w-40 md:w-60 h-auto"
                                />
                            </motion.div>

                            {/* Botón de volver */}
                            <div className="flex-1 justify-end hidden md:flex">
                                <BackButton to="/aqua" />
                            </div>

                            {/* Menú móvil */}
                            <div className="md:hidden">
                                <MobileMenu onNavigateBack={() => navigate('/aqua')} />
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <motion.div
                        className="absolute left-[45%] md:left-1/2 top-32 md:top-36 z-40 -translate-x-1/2 flex flex-wrap justify-center items-center gap-2 md:gap-3 bg-black/30 backdrop-blur-md rounded-full px-4 md:px-8 py-3 md:py-4 shadow-lg mx-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-[320px] md:w-[500px] lg:w-auto">
                            {availableLetters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(letter)}
                                    className={`px-3 md:px-5 py-1 md:py-2 text-sm md:text-base rounded-full font-semibold transition-all duration-200 border-2 cursor-pointer whitespace-nowrap ${
                                        selectedLetter === letter
                                            ? 'bg-white text-black border-white shadow-lg'
                                            : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                    }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contenedor centralizado */}
                    <div className="absolute inset-0 flex items-center justify-center pt-20 md:pt-32">
                        <div className="w-[90%] md:w-[80%] lg:w-[60%] flex flex-col items-center justify-center text-center">
                            <div className="relative w-full min-h-[400px] md:min-h-[600px]">
                                <AnimatePresence mode="wait">
                                    {filteredFishes.length > 0 ? (
                                        <motion.div 
                                            key={`${selectedLetter}-${currentFishIndex}`}
                                            variants={elementAnimations.scaleIn}
                                            initial={isFirstRender ? false : "initial"}
                                            animate="animate"
                                            exit="exit"
                                            transition={{ duration: 0.4 }}
                                            className="flex flex-col items-center bg-black/20 backdrop-blur-sm p-4 md:p-8 rounded-xl w-full absolute top-0 left-0 max-h-[70vh] overflow-y-auto scrollbar-custom"
                                        >
                                            {/* Imagen del pez */}
                                            <div className="mb-6">
                                                <motion.img
                                                    src={currentFish.image}
                                                    alt={currentFish.name}
                                                    className="w-full h-48 md:h-64 object-cover rounded-xl shadow-lg"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>

                                            {/* Información del pez */}
                                            <div className="space-y-6">
                                                {/* Título */}
                                                <motion.h2 
                                                    className="text-2xl md:text-3xl font-bold text-center text-white"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.1 }}
                                                >
                                                    {currentFish.name}
                                                </motion.h2>

                                                {/* Descripción */}
                                                <motion.p 
                                                    className="text-base md:text-lg leading-relaxed text-center text-white/90"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                >
                                                    {currentFish.data}
                                                </motion.p>

                                                {/* Características */}
                                                <motion.div 
                                                    className="flex flex-wrap justify-center gap-3"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.3 }}
                                                >
                                                    {Object.entries(currentFish.characteristics).map(([key, value], index) => (
                                                        <motion.div 
                                                            key={key}
                                                            className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md"
                                                            whileHover={{
                                                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                                                scale: 1.05,
                                                                y: -2
                                                            }}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                                        >
                                                            <span className="text-sm font-semibold text-white/80">{key}:</span>
                                                            <span className="text-sm text-white ml-1">{value}</span>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 text-center absolute top-0 left-0 w-full"
                                        >
                                            <h2 className="text-2xl font-bold text-white mb-4">
                                                No hay peces que empiecen con "{selectedLetter}"
                                            </h2>
                                            <p className="text-white/80">
                                                Intenta seleccionar otra letra o "Todos" para ver todos los peces disponibles.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Flechas de navegación */}
                    {filteredFishes.length > 1 && (
                        <>
                            <motion.div
                                className="absolute left-4 md:left-32 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 bg-black/30 p-2 md:p-4 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all"
                                onClick={handlePreviousFish}
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <motion.img
                                    src="/assets/icons/arrow-left.svg"
                                    alt="Flecha izquierda"
                                    className="w-8 h-8 md:w-12 md:h-12"
                                    whileHover={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.img
                                    src="/assets/icons/arrow-left-hover.svg"
                                    alt="Flecha izquierda hover"
                                    className="w-8 h-8 md:w-12 md:h-12 absolute top-2 md:top-4 left-2 md:left-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>

                            <motion.div
                                className="absolute right-4 md:right-32 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 bg-black/30 p-2 md:p-4 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all"
                                onClick={handleNextFish}
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <motion.img
                                    src="/assets/icons/arrow-right.svg"
                                    alt="Flecha derecha"
                                    className="w-8 h-8 md:w-12 md:h-12"
                                    whileHover={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.img
                                    src="/assets/icons/arrow-right-hover.svg"
                                    alt="Flecha derecha hover"
                                    className="w-8 h-8 md:w-12 md:h-12 absolute top-2 md:top-4 left-2 md:left-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}