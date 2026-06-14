import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children, ...props }: any) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none ' +
                (active
                    ? 'border-brand-500 text-slate-800 focus:border-brand-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 focus:border-slate-300 focus:text-slate-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
