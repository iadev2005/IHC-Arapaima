import React from 'react';
import { VoteType } from '@/types';

interface VoteButtonProps {
    type: 'up' | 'down';
    count: number;
    isVoted: boolean;
    onVote: (type: VoteType) => void;
    disabled?: boolean;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
    type,
    count,
    isVoted,
    onVote,
    disabled = false
}) => {
    const handleClick = () => {
        if (disabled) return;
        
        const newVote: VoteType = isVoted ? null : type;
        onVote(newVote);
    };

    const getIcon = () => {
        if (type === 'up') {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
                flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${isVoted 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {getIcon()}
            <span>{count}</span>
        </button>
    );
}; 