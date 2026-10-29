import React, { useId } from 'react';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    label?: string;
}

/**
 * Minimalist Flat Cow Icon (matching the Lucide icon family in the sidebar)
 */
const FlatCowIcon = ({ className = '' }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Left & Right Horns */}
        <path d="M7.8 7 C6 4.5 4 3.5 2.5 4 C2.5 6 4 7.5 7 8" />
        <path d="M16.2 7 C18 4.5 20 3.5 21.5 4 C21.5 6 20 7.5 17 8" />
        {/* Left & Right Ears */}
        <path d="M6.5 9.5 C3.5 9.5 2 11.5 3.5 12.5 C5 13 6.5 11.5 7 10" />
        <path d="M17.5 9.5 C20.5 9.5 22 11.5 20.5 12.5 C19 13 17.5 11.5 17 10" />
        {/* Crown (Top of Head) */}
        <path d="M7.8 7 C9.5 6.5 14.5 6.5 16.2 7" />
        {/* Cheeks */}
        <path d="M7 10 L7.5 14 C7.5 15 8 15.5 8.5 16" />
        <path d="M17 10 L16.5 14 C16.5 15 16 15.5 15.5 16" />
        {/* Forehead Tuft */}
        <path d="M11 7 L12 8.5 L13 7" />
        {/* Eyes */}
        <circle cx="9.5" cy="11.5" r="0.85" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="11.5" r="0.85" fill="currentColor" stroke="none" />
        {/* Muzzle / Snout */}
        <rect x="7" y="14.5" width="10" height="5.5" rx="2.75" />
        {/* Nostrils */}
        <circle cx="10" cy="17.25" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="14" cy="17.25" r="0.75" fill="currentColor" stroke="none" />
    </svg>
);

export default function Loader({ className = '', size = 'md', label }: LoaderProps) {
    const rawId = useId();
    const gradId = `cow-loader-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    const sizeConfig = {
        sm: {
            container: 'w-6 h-6',
            iconSize: 'w-3.5 h-3.5',
            strokeWidth: 5.5,
            textSize: 'text-[10px]',
            dotSize: 'w-1 h-1',
        },
        md: {
            container: 'w-12 h-12',
            iconSize: 'w-6 h-6',
            strokeWidth: 4.5,
            textSize: 'text-xs',
            dotSize: 'w-1.5 h-1.5',
        },
        lg: {
            container: 'w-20 h-20',
            iconSize: 'w-10 h-10',
            strokeWidth: 4.5,
            textSize: 'text-xs',
            dotSize: 'w-1.5 h-1.5',
        },
        xl: {
            container: 'w-28 h-28',
            iconSize: 'w-14 h-14',
            strokeWidth: 4.5,
            textSize: 'text-sm',
            dotSize: 'w-2 h-2',
        },
    }[size];

    return (
        <div className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}>
            <style>
                {`
                @keyframes cow-spin-smooth {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes cow-subtle-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                @keyframes dot-pulse {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1.15); }
                }
                .animate-spin-smooth {
                    animation: cow-spin-smooth 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                }
                .animate-cow-pulse {
                    animation: cow-subtle-pulse 1.5s ease-in-out infinite;
                }
                .animate-dot-1 { animation: dot-pulse 1.2s infinite ease-in-out; }
                .animate-dot-2 { animation: dot-pulse 1.2s infinite ease-in-out 0.2s; }
                .animate-dot-3 { animation: dot-pulse 1.2s infinite ease-in-out 0.4s; }
                `}
            </style>

            <div className={`relative flex items-center justify-center ${sizeConfig.container}`}>
                {/* SVG Rotating Ring with Gradient & Fluid Easing */}
                <svg
                    className="absolute inset-0 w-full h-full animate-spin-smooth select-none pointer-events-none"
                    viewBox="0 0 100 100"
                >
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2d3f31" stopOpacity="1" />
                            <stop offset="45%" stopColor="#2d3f31" stopOpacity="0.5" />
                            <stop offset="80%" stopColor="#2d3f31" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#2d3f31" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Subtle Guide Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#2d3f31"
                        strokeOpacity="0.08"
                        strokeWidth={sizeConfig.strokeWidth}
                    />
                    {/* Active Gradient Arc with Smooth Thickness */}
                    <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth={sizeConfig.strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray="210"
                        strokeDashoffset="55"
                    />
                </svg>

                {/* Flat Vector Cow Icon with Smooth 2-3% Breathing Pulse */}
                <div
                    className={`relative z-10 flex items-center justify-center text-forest ${sizeConfig.iconSize} animate-cow-pulse`}
                >
                    <FlatCowIcon className="w-full h-full object-contain" />
                </div>
            </div>

            {label && (
                <div className="flex items-center gap-1.5 mt-1">
                    <span className={`${sizeConfig.textSize} font-bold text-stone-600 tracking-wider uppercase`}>
                        {label}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className={`${sizeConfig.dotSize} rounded-full bg-forest animate-dot-1`} />
                        <span className={`${sizeConfig.dotSize} rounded-full bg-forest animate-dot-2`} />
                        <span className={`${sizeConfig.dotSize} rounded-full bg-forest animate-dot-3`} />
                    </span>
                </div>
            )}
        </div>
    );
}
