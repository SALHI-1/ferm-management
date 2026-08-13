import React from 'react';

interface MediaLoaderProps {
    className?: string;
    type?: 'image' | 'video' | 'mixed';
}

export default function MediaLoader({ className = '', type = 'mixed' }: MediaLoaderProps) {
    return (
        <div 
            className={`relative overflow-hidden bg-brand-100/50 flex flex-col items-center justify-center min-h-[100px] w-full rounded-xl ${className}`}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
            </div>

            {/* Media Icon with Pulse Effect */}
            <div className="relative z-10 flex flex-col items-center gap-2 animate-pulse">
                {type === 'image' || type === 'mixed' ? (
                    <svg
                        className={`text-copper/60 ${type === 'mixed' ? 'w-6 h-6' : 'w-8 h-8'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                ) : null}
                
                {type === 'video' || type === 'mixed' ? (
                    <svg 
                        className={`text-forest/60 ${type === 'mixed' ? 'w-6 h-6' : 'w-10 h-10'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                        />
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                ) : null}
            </div>
            
            {/* Soft Overlay */}
            <div className="absolute inset-0 border border-brand-200/50 rounded-xl pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}
