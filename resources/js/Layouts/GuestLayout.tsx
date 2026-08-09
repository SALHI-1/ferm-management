import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Globe, Check } from 'lucide-react';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { locale } = usePage().props as any;
    const toggleLocale = locale === 'en' ? 'fr' : 'en';
    const toggleLabel = locale === 'en' ? 'FR' : 'EN';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cream-50 via-cream to-cream-50 px-4 py-8">
            <div className="absolute top-6 right-6 z-50">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full p-2 text-ink-900 bg-cream/80 hover:bg-cream border border-ink/10 shadow-sm transition-all duration-200"
                        >
                            <Globe className="h-5 w-5" />
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content 
                        align="right" 
                        width="32"
                        containerClasses="rounded-2xl border border-white/40 shadow-[0_24px_40px_-12px_rgba(0,0,0,0.15)] bg-white/50 backdrop-blur-2xl"
                        contentClasses="p-1.5 space-y-1"
                    >
                        <a
                            href={route('language.switch', { locale: 'fr' })}
                            className={`group relative flex items-center justify-between w-full px-3 py-2 text-sm font-bold tracking-widest transition-all duration-300 rounded-xl ${
                                locale === 'fr' 
                                    ? 'bg-forest/10 text-forest shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                                    : 'text-ink/60 hover:bg-white/60 hover:text-ink'
                            }`}
                        >
                            <span>FR</span>
                            {locale === 'fr' && <Check className="h-4 w-4 text-forest drop-shadow-sm" />}
                        </a>
                        <a
                            href={route('language.switch', { locale: 'en' })}
                            className={`group relative flex items-center justify-between w-full px-3 py-2 text-sm font-bold tracking-widest transition-all duration-300 rounded-xl ${
                                locale === 'en' 
                                    ? 'bg-forest/10 text-forest shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                                    : 'text-ink/60 hover:bg-white/60 hover:text-ink'
                            }`}
                        >
                            <span>EN</span>
                            {locale === 'en' && <Check className="h-4 w-4 text-forest drop-shadow-sm" />}
                        </a>
                    </Dropdown.Content>
                </Dropdown>
            </div>
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
