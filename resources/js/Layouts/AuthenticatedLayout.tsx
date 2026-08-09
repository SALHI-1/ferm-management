import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { Menu, X } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }: any) {
    const { auth, locale } = usePage().props as any;
    const user = auth.user;
    const { t } = useTrans();

    const toggleLocale = locale === 'en' ? 'fr' : 'en';
    const toggleLabel = locale === 'en' ? 'FR' : 'EN';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-ink/10 bg-cream/80 backdrop-blur-md sticky top-0 z-30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={!!(route as any)().current('dashboard')}
                                >
                                    {t('nav.dashboard')}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="mr-3">
                                <a href={route('language.switch', { locale: toggleLocale })}
                                   className="rounded-full px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80 border bg-cream-50"
                                   style={{ borderColor: '#bc6b43', color: '#bc6b43' }}>
                                    {toggleLabel}
                                </a>
                            </div>
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-xl">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-ink/10 bg-cream px-3.5 py-2 text-sm font-medium text-ink/70 transition-all duration-200 hover:text-ink-900 hover:border-ink/20 hover:shadow-sm focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4 text-ink/50"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            {t('layout.profile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            {t('layout.logout')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <div className="mr-3">
                                <a href={route('language.switch', { locale: toggleLocale })}
                                   className="rounded-full px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80 border bg-cream-50"
                                   style={{ borderColor: '#bc6b43', color: '#bc6b43' }}>
                                    {toggleLabel}
                                </a>
                            </div>
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-ink/50 transition-all duration-200 hover:bg-cream-50/50 hover:text-ink/70 focus:bg-cream-50/50 focus:text-ink/70 focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block animate-slide-down' : 'hidden') +
                        ' sm:hidden border-t border-ink/10'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={!!(route as any)().current('dashboard')}
                        >
                            {t('nav.dashboard')}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-ink/10 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-semibold text-ink-900">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-ink/60">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                {t('layout.profile')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                {t('layout.logout')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-cream border-b border-ink/10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="animate-fade-in">{children}</main>
        </div>
    );
}
