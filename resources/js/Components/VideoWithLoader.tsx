import React, { useState } from 'react';
import MediaLoader from './MediaLoader';

interface VideoWithLoaderProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    containerClassName?: string;
}

export default function VideoWithLoader({
    containerClassName = '',
    className = '',
    ...props
}: VideoWithLoaderProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-50">
                    <MediaLoader type="video" className="w-full h-full border-none rounded-none" />
                </div>
            )}
            <video
                {...props}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 w-full h-full object-cover`}
                onLoadedData={(e) => {
                    setIsLoaded(true);
                    if (props.onLoadedData) props.onLoadedData(e);
                }}
                onError={(e) => {
                    setHasError(true);
                    setIsLoaded(true);
                    if (props.onError) props.onError(e);
                }}
            />
        </div>
    );
}
