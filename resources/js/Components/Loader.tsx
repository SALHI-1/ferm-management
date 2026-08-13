import React from 'react';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
}

const HoofPrint = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        {/* Left claw - anatomically correct shape, soft and rounded */}
        <path d="M48 15 C36 18 24 35 26 65 C28 85 40 90 47 82 C50 78 48 55 47 45 C46 35 48 20 48 15 Z" />
        {/* Right claw */}
        <path d="M52 15 C64 18 76 35 74 65 C72 85 60 90 53 82 C50 78 52 55 53 45 C54 35 52 20 52 15 Z" />
    </svg>
);

export default function Loader({ className = '', size = 'md', label }: LoaderProps) {
    // We use a wrapper to scale the entire walking container
    const scaleMap = {
        sm: 'scale-[0.4]',
        md: 'scale-75',
        lg: 'scale-100',
        xl: 'scale-125',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <style>
                {`
                @keyframes hoof-1 {
                    0% { opacity: 0.2; transform: scale(1); }
                    10%, 90% { opacity: 1; transform: scale(0.95) translateY(2px); }
                    100% { opacity: 0.2; transform: scale(1); }
                }
                @keyframes hoof-2 {
                    0%, 30% { opacity: 0.2; transform: scale(1); }
                    40%, 90% { opacity: 1; transform: scale(0.95) translateY(2px); }
                    100% { opacity: 0.2; transform: scale(1); }
                }
                @keyframes hoof-3 {
                    0%, 60% { opacity: 0.2; transform: scale(1); }
                    70%, 90% { opacity: 1; transform: scale(0.95) translateY(2px); }
                    100% { opacity: 0.2; transform: scale(1); }
                }
                .animate-step-1 { animation: hoof-1 1.5s infinite; }
                .animate-step-2 { animation: hoof-2 1.5s infinite; }
                .animate-step-3 { animation: hoof-3 1.5s infinite; }
                `}
            </style>
            
            <div className={`relative w-28 h-16 ${scaleMap[size]} transition-transform duration-300`}>
                {/* Step 1: Left */}
                <div className="absolute left-0 bottom-1 rotate-[75deg]">
                    <div className="animate-step-1 text-copper/60 drop-shadow-sm">
                        <HoofPrint className="w-8 h-8" />
                    </div>
                </div>

                {/* Step 2: Middle */}
                <div className="absolute left-10 top-0 rotate-[105deg]">
                    <div className="animate-step-2 text-copper/60 drop-shadow-sm">
                        <HoofPrint className="w-8 h-8" />
                    </div>
                </div>

                {/* Step 3: Right */}
                <div className="absolute left-20 bottom-2 rotate-[82deg]">
                    <div className="animate-step-3 text-copper/60 drop-shadow-sm">
                        <HoofPrint className="w-8 h-8" />
                    </div>
                </div>
            </div>
            
            {label && (
                <span className="text-xs font-bold text-copper/50 tracking-widest uppercase -mt-2">
                    {label}
                </span>
            )}
        </div>
    );
}
