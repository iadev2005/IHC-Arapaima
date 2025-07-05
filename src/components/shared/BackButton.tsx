import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    to?: string;
    className?: string;
}

export function BackButton({ to = '/', className = '' }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return (
        <motion.div
            className={`flex items-center gap-4 cursor-pointer ${className}`}
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <img
                src="/assets/icons/back.png"
                alt="Volver"
                className="w-12 h-12"
            />
            <span className="text-white text-xl">Volver</span>
        </motion.div>
    );
} 