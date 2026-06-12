import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, Eye, Edit, AlertCircle } from 'lucide-react';

interface Props {
    stats: { total_users: number; total_vaches: number; total_investissements: number };
    users: Array<{ id: number; nom: string; prenom: string; email: string; userable_type: string }>;
}

export default function AdminDashboard({ stats, users }: Props) {
    const { auth } = usePage().props as any;

    // Variable booléenne pour isoler le Super-Admin
    const isSuperAdmin = auth.user.userable_type === 'App\\Models\\Admin' && auth.user.userable?.role === 'super_admin';

    return (
        <AppLayout title="Panneau d'Administration Générale">
            <Head title="Admin Dashboard" />

            {/* CARTES DE STATISTIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-700 rounded-md"><Users /></div>
                    <div>
                        <p className="text-sm text-gray-500">Utilisateurs enregistrés</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total_users}</p>
                    </div>
                </div>
                {/* Répète pour d'autres stats au besoin... */}
            </div>

            {/* TABLEAU DE GESTION DES UTILISATEURS */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 dark:text-white">Liste des comptes utilisateurs</h2>
                    {isSuperAdmin && (
                        <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-md transition">
                            + Créer un utilisateur
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-500 uppercase">
                                <th className="p-4">Utilisateur</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">{u.prenom} {u.nom}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                            {u.userable_type.split('\\').pop()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"><Eye className="h-4 w-4" /> Voir</button>

                                        {/* PROTECTION DESIGN : Seul le SuperAdmin voit et peut faire un Update */}
                                        {isSuperAdmin ? (
                                            <button className="text-amber-600 hover:text-amber-800 inline-flex items-center gap-1">
                                                <Edit className="h-4 w-4" /> Modifier
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic inline-flex items-center gap-1">
                                                <AlertCircle className="h-3.5 w-3.5" /> Lecture seule
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}