import React from 'react';
import { ROUTES } from '@/constants';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    title = 'Arapaima', 
    showBackButton = false, 
    onBackClick 
}) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        {showBackButton && (
                            <button
                                onClick={onBackClick}
                                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    </div>
                    
                    <nav className="flex space-x-8">
                        <a href={ROUTES.FORUM} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Foro
                        </a>
                        <a href={ROUTES.LIBRARY} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Biblioteca
                        </a>
                        <a href={ROUTES.MAP} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Mapa
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
}; 