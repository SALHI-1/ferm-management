import { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, ShieldAlert, LogOut, Milestone, ClipboardList, ChevronLeft, Menu, PawPrint, Calendar } from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    show: boolean;
}

export default function AppLayout({ children, title }: { children: ReactNode; title: string }) {
    const { auth } = usePage().props as any;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = window.location.pathname;

    const isAdmin = auth.user.userable_type === 'App\\Models\\Admin';
    const isManager = auth.user.userable_type === 'App\\Models\\Manager';
    const isSuperAdmin = isAdmin && auth.user.userable?.role === 'super_admin';

    const getRoleName = () => {
        if (isAdmin) return isSuperAdmin ? 'Super Admin' : 'Admin';
        if (isManager) return 'Manager';
        return 'Client / Investisseur';
    };

    const getBaseRoute = () => {
        if (isAdmin) return '/admin';
        if (isManager) return '/manager';
        return '/investisseur';
    };

    const navItems: NavItem[] = [
        {
            href: `${getBaseRoute()}/dashboard`,
            label: 'Dashboard',
            icon: LayoutDashboard,
            show: true,
        },
        {
            href: `${getBaseRoute()}/cheptel`,
            label: 'Cheptel',
            icon: PawPrint,
            show: true,
        },
        {
            href: '/admin/clients',
            label: 'Clients',
            icon: Users,
            show: isAdmin,
        },
        {
            href: '/admin/staff',
            label: 'Personnel',
            icon: ShieldAlert,
            show: isSuperAdmin,
        },
        {
            href: '/admin/traceabilite',
            label: 'Traçabilité',
            icon: ClipboardList,
            show: isSuperAdmin,
        },
        {
            href: '/admin/visites',
            label: 'Demandes de visites',
            icon: Calendar,
            show: isSuperAdmin,
        },
        {
            href: '/investisseur/visites',
            label: 'Visites',
            icon: Calendar,
            show: !isAdmin && !isManager,
        },
    ];

    const isActive = (href: string) => currentPath.startsWith(href);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-700">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col justify-between bg-white border-r border-slate-100 shadow-sm transition-all duration-300 ease-in-out ${
                    collapsed ? 'w-20' : 'w-72'
                } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className={`${collapsed ? 'p-4' : 'p-6 pt-8'}`}>
                    {/* Logo */}
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-10`}>
                        <Link href={`${getBaseRoute()}/dashboard`} className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl shadow-sm flex-shrink-0">
                                <Milestone className="h-5 w-5 text-white" />
                            </div>
                            {!collapsed && (
                                <span className="font-display text-xl font-bold text-slate-800 tracking-tight">
                                    Ferm Project
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                        >
                            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5">
                        {!collapsed && (
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">
                                Menu
                            </div>
                        )}
                        {navItems.filter(item => item.show).map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                        active
                                            ? 'text-brand-700 bg-brand-50 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    } ${collapsed ? 'justify-center px-0' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-200 ${
                                        active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                                    }`} />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile & Logout */}
                <div className={`border-t border-slate-100 bg-slate-50/50 ${collapsed ? 'p-3' : 'p-5'}`}>
                    {!collapsed && (
                        <div className="mb-4">
                            <p className="text-sm font-bold text-slate-800 truncate">
                                {auth.user.prenom} {auth.user.nom}
                            </p>
                            <span className="inline-block mt-1.5 text-[11px] font-bold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full tracking-wide ring-1 ring-brand-200/60">
                                {getRoleName()}
                            </span>
                        </div>
                    )}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group ${
                            collapsed ? 'justify-center' : ''
                        }`}
                        title={collapsed ? 'Déconnexion' : undefined}
                    >
                        <LogOut className="h-[18px] w-[18px] group-hover:-translate-x-0.5 transition-transform duration-200" />
                        {!collapsed && <span>Déconnexion</span>}
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight font-display">
                            {title}
                        </h1>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}