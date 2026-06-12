import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, ShieldAlert, LogOut, Milestone } from 'lucide-react';

export default function AppLayout({ children, title }: { children: ReactNode; title: string }) {
    const { auth } = usePage().props as any;

    // Détermination textuelle du rôle pour l'affichage
    const getRoleName = () => {
        if (auth.user.userable_type === 'App\\Models\\Admin') {
            return auth.user.userable.role === 'super_admin' ? 'Super Admin' : 'Admin';
        }
        if (auth.user.userable_type === 'App\\Models\\Manager') return 'Manager';
        return 'Client / Investisseur';
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <div className="p-5">
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <Milestone className="h-6 w-6" />
                        <span>Ferm Project</span>
                    </div>

                    <nav className="mt-8 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                        </div>
                    </nav>
                </div>

                {/* BAS DE LA SIDEBAR : PROFIL & DECONNEXION */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{auth.user.prenom} {auth.user.nom}</p>
                        <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            {getRoleName()}
                        </span>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </Link>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}