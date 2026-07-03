import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cream-50 via-cream to-cream-50 px-4 py-8">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-copper/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-cream/80 backdrop-blur-sm border border-ink/10 rounded-2xl shadow-premium-md px-8 py-10 animate-slide-up">
                    {children}
                </div>
            </div>
        </div>
    );
}
