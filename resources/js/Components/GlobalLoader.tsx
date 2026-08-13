import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import Loader from './Loader';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setLoading(true);
        };

        const handleFinish = () => {
            setLoading(false);
        };

        const unsubscribeStart = router.on('start', handleStart);
        const unsubscribeFinish = router.on('finish', handleFinish);

        return () => {
            unsubscribeStart();
            unsubscribeFinish();
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300">
            <Loader size="lg" />
        </div>
    );
}
