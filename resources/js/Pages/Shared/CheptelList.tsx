import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string }>;
    coordonneesEspace: 'admin' | 'manager';
}

export default function CheptelList({ vaches, coordonneesEspace }: Props) {
    const { auth } = usePage().props as any;

    return (
        <AppLayout title="Gestion du Cheptel (Espace Partagé)">
            <Head title="Liste des Bovins" />

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Suivi des Animaux</h2>

                    {/* Bouton visible uniquement pour le Manager */}
                    {coordonneesEspace === 'manager' && (
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-md">
                            + Peser un animal
                        </button>
                    )}

                    {/* Bouton visible uniquement pour l'Admin */}
                    {coordonneesEspace === 'admin' && (
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-md">
                            + Exporter le registre (Légal)
                        </button>
                    )}
                </div>

                {/* Tableau de données commun */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-sm">
                            <th className="p-3">Numéro Boucle</th>
                            <th className="p-3">Poids (kg)</th>
                            <th className="p-3">Statut Santé</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vaches.map(vache => (
                            <tr key={vache.id} className="border-b">
                                <td className="p-3 font-semibold">{vache.numero_ticket}</td>
                                <td className="p-3">{vache.poids || 'N/A'} kg</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs text-white ${
                                        vache.statut_sante === 'healthy' ? 'bg-green-500' : 
                                        vache.statut_sante === 'pregnancy' ? 'bg-blue-500' : 'bg-red-500'
                                    }`}>
                                        {vache.statut_sante === 'healthy' ? 'En bonne santé' : 
                                         vache.statut_sante === 'pregnancy' ? 'Gestation' : 'Malade'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <a 
                                        href={`/${coordonneesEspace}/cheptel/${vache.id}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Voir les détails
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}