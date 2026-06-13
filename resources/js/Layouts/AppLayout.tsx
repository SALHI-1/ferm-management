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
        <div className="flex h-screen bg-background overflow-hidden font-sans text-slate-700">
            {/* SIDEBAR */}
            <aside className="w-72 bg-surface border-r border-slate-100 shadow-premium z-10 flex flex-col justify-between">
                <div className="p-8">
                    <div className="text-2xl font-bold text-brand-600 flex items-center gap-3">
                        <Milestone className="h-8 w-8 text-brand-500" />
                        <span className="font-display tracking-tight">Ferm Project</span>
                    </div>

                    <nav className="mt-12 space-y-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</div>
                        <div className="flex items-center gap-4 px-4 py-3 text-sm font-semibold text-brand-700 bg-brand-50 rounded-xl transition-all duration-300">
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </div>
                    </nav>
                </div>

                {/* BAS DE LA SIDEBAR : PROFIL & DECONNEXION */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="mb-6">
                        <p className="text-base font-bold text-slate-800">{auth.user.prenom} {auth.user.nom}</p>
                        <span className="inline-block mt-1 text-xs bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-semibold tracking-wide">
                            {getRoleName()}
                        </span>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 group"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Déconnexion</span>
                    </Link>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 z-0">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}