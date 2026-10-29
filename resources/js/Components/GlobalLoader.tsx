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

        const unsubscribeBefore = router.on('before', handleStart);
        const unsubscribeStart = router.on('start', handleStart);
        const unsubscribeFinish = router.on('finish', handleFinish);
        const unsubscribeCancel = router.on('cancel', handleFinish);

        return () => {
            unsubscribeBefore();
            unsubscribeStart();
            unsubscribeFinish();
            unsubscribeCancel();
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-stone-900/15 backdrop-blur-sm flex items-center justify-center transition-all duration-300 animate-fade-in">
            {/* Circular Glassmorphism Card */}
            <div 
                className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/92 backdrop-blur-md border border-white/80 p-3 sm:p-4 transition-transform duration-300"
                style={{
                    boxShadow: '0 20px 50px rgba(45, 63, 49, 0.12), 0 10px 30px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Loader size="lg" />
            </div>
        </div>
    );
}
