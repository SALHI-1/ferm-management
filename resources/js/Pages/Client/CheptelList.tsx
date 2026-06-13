import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string; statut_vente: string }>;
}

export default function CheptelList({ vaches }: Props) {
    return (
        <AppLayout title="Mes Investissements Bovins">
            <Head title="Mes Bovins" />

            <div className="card-premium">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Mon Cheptel</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-y border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold">
                                <th className="p-4 rounded-tl-lg">Numéro Boucle</th>
                                <th className="p-4">Poids (kg)</th>
                                <th className="p-4">Statut Santé</th>
                                <th className="p-4">Vente</th>
                                <th className="p-4 text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vaches.length > 0 ? vaches.map(vache => (
                                <tr key={vache.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                    <td className="p-4 font-semibold text-slate-800">{vache.numero_ticket}</td>
                                    <td className="p-4 text-slate-600">{vache.poids || 'N/A'} kg</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                                            vache.statut_sante === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 
                                            vache.statut_sante === 'pregnancy' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {vache.statut_sante === 'healthy' ? 'En bonne santé' : 
                                             vache.statut_sante === 'pregnancy' ? 'Gestation' : 'Malade'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {vache.statut_vente === 'vendue' ? (
                                            <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Vendue</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Au cheptel</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <a 
                                            href={`/investisseur/cheptel/${vache.id}`}
                                            className="inline-flex font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors duration-200"
                                        >
                                            Voir les détails &rarr;
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                                        Vous n'avez aucun bovin dans votre cheptel pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
