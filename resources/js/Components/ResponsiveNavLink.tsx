import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children, ...props }: any) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2.5 pe-4 ps-3 ${
                active
                    ? 'border-brand-500 bg-brand-50 text-brand-700 focus:border-brand-600 focus:bg-brand-100 focus:text-brand-800'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:border-slate-300 focus:bg-slate-50 focus:text-slate-800'
            } text-base font-medium transition-all duration-200 focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
