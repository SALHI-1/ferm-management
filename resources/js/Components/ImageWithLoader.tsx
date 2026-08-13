import React, { useState } from 'react';
import MediaLoader from './MediaLoader';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackIcon?: 'image' | 'video' | 'mixed';
    containerClassName?: string;
}

export default function ImageWithLoader({
    fallbackIcon = 'image',
    containerClassName = '',
    className = '',
    ...props
}: ImageWithLoaderProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-50">
                    <MediaLoader type={fallbackIcon} className="w-full h-full border-none rounded-none" />
                </div>
            )}
            <img
                {...props}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover`}
                onLoad={(e) => {
                    setIsLoaded(true);
                    if (props.onLoad) props.onLoad(e);
                }}
                onError={(e) => {
                    setHasError(true);
                    setIsLoaded(true); // Stop showing loader on error
                    if (props.onError) props.onError(e);
                }}
            />
        </div>
    );
}
