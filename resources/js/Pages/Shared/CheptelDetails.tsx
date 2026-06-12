import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface Client {
    id: number;
    user: {
        nom: string;
        prenom: string;
    };
    pivot: {
        part_possedee: number;
    };
}

interface Cost {
    id: number;
    type: string;
    price: number;
    date_facture: string;
}

interface Production {
    id: number;
    quantite_litres: number;
    periode_mois: string;
}

interface HealthStatus {
    id: number;
    type: string;
    date_debut: string;
    date_fin: string | null;
}

interface Vache {
    id: number;
    numero_ticket: string;
    image: string | null;
    statut_sante: string;
    date_naissance: string | null;
    age: number | null;
    clients: Client[];
    costs: Cost[];
    productions: Production[];
    health_statuses: HealthStatus[];
    enfants: Vache[];
}

interface Props {
    vache: Vache;
    canEdit: boolean;
    coordonneesEspace: 'admin' | 'manager';
}

export default function CheptelDetails({ vache, canEdit, coordonneesEspace }: Props) {
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showFinancialModal, setShowFinancialModal] = useState(false);

    const { data: finData, setData: setFinData, post: postFin, processing: finProcessing, reset: resetFin, errors: finErrors } = useForm({
        annee: new Date().getFullYear(),
        mois: new Date().getMonth() + 1,
        price: '',
        type: 'food'
    });

    const { data: healthData, setData: setHealthData, post: postHealth, processing: healthProcessing, reset: resetHealth, errors: healthErrors } = useForm({
        type: 'checkup',
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: ''
    });

    const handleFinancialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postFin(`/${coordonneesEspace}/cheptel/${vache.id}/financial`, {
            onSuccess: () => resetFin('price')
        });
    };

    const handleHealthSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postHealth(`/${coordonneesEspace}/cheptel/${vache.id}/health`, {
            onSuccess: () => resetHealth('date_fin')
        });
    };

    return (




        <AppLayout title={`Détails du bovin ${vache.numero_ticket}`}>
            <Head title={`Bovin ${vache.numero_ticket}`} />

            <div className="space-y-6">
                {/* Header Section */}

                <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vache.image ? (
                            <img src={vache.image} alt={vache.numero_ticket} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400">Pas de photo</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">Ticket: {vache.numero_ticket}</h1>
                        <div className="mb-2 space-y-1">
                            <div>
                                <span className={`px-2 py-1 rounded text-sm text-white inline-block ${vache.statut_sante === 'healthy' ? 'bg-green-500' :
                                        vache.statut_sante === 'pregnancy' ? 'bg-blue-500' : 'bg-red-500'
                                    }`}>
                                    {vache.statut_sante === 'healthy' ? 'En bonne santé' :
                                        vache.statut_sante === 'pregnancy' ? 'Gestation' : 'Malade'}
                                </span>
                            </div>
                            {vache.date_naissance && (
                                <div className="text-gray-600 text-sm">
                                    <strong>Date de naissance:</strong> {new Date(vache.date_naissance).toLocaleDateString('fr-FR')} 
                                    {vache.age !== null ? ` (${vache.age} ans)` : ''}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Propriétaire(s) :</h3>
                            {vache.clients.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {vache.clients.map(client => (
                                        <li key={client.id}>{client.user?.nom} {client.user?.prenom} ({(client.pivot.part_possedee * 100).toFixed(0)}%)</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Appartient à la ferme</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Financial Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Données Financières</h2>
                            <button onClick={() => setShowFinancialModal(true)} className="text-indigo-600 hover:underline text-sm">Voir l'archive</button>
                        </div>

                        {canEdit ? (
                            <form onSubmit={handleFinancialSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Année</label>
                                        <input type="number" value={finData.annee} onChange={e => setFinData('annee', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                        {finErrors.annee && <p className="text-red-500 text-xs mt-1">{finErrors.annee}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mois</label>
                                        <input type="number" min="1" max="12" value={finData.mois} onChange={e => setFinData('mois', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                        {finErrors.mois && <p className="text-red-500 text-xs mt-1">{finErrors.mois}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select value={finData.type} onChange={e => setFinData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="food">Coût: Nourriture</option>
                                        <option value="veterinaire">Coût: Vétérinaire</option>
                                        <option value="autre">Coût: Autre</option>
                                        <option value="gain">Gain: Production lait (L)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{finData.type === 'gain' ? 'Quantité (Litres)' : 'Montant (€)'}</label>
                                    <input type="number" step="0.01" value={finData.price} onChange={e => setFinData('price', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                    {finErrors.price && <p className="text-red-500 text-xs mt-1">{finErrors.price}</p>}
                                </div>
                                <button type="submit" disabled={finProcessing} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                    Enregistrer
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Vous n'avez pas les droits pour ajouter des données financières.</p>
                        )}
                    </div>

                    {/* Health Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Suivi Santé</h2>
                            <button onClick={() => setShowHealthModal(true)} className="text-indigo-600 hover:underline text-sm">Voir l'archive</button>
                        </div>

                        {canEdit ? (
                            <form onSubmit={handleHealthSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                                    <select value={healthData.type} onChange={e => setHealthData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="checkup">Visite de routine</option>
                                        <option value="sickness">Maladie</option>
                                        <option value="pregnancy">Gestation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                                    <input type="date" value={healthData.date_debut} onChange={e => setHealthData('date_debut', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                    {healthErrors.date_debut && <p className="text-red-500 text-xs mt-1">{healthErrors.date_debut}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de fin (optionnel)</label>
                                    <input type="date" value={healthData.date_fin} onChange={e => setHealthData('date_fin', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <button type="submit" disabled={healthProcessing} className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                    Enregistrer
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Vous n'avez pas les droits pour ajouter des données de santé.</p>
                        )}
                    </div>
                </div>

                {/* Lineage Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Descendance ({vache.enfants.length})</h2>
                    {vache.enfants.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Ticket Enfant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vache.enfants.map(enfant => (
                                    <tr key={enfant.id}>
                                        <td className="p-2 border">
                                            <a href={`/${coordonneesEspace}/cheptel/${enfant.id}`} className="text-indigo-600 hover:underline">
                                                {enfant.numero_ticket}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 italic">Aucune descendance enregistrée.</p>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showFinancialModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Archive Financière</h3>
                            <button onClick={() => setShowFinancialModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Coûts</h4>
                            <table className="w-full text-sm text-left border">
                                <thead><tr className="bg-gray-100"><th className="p-2 border">Date</th><th className="p-2 border">Type</th><th className="p-2 border">Montant</th></tr></thead>
                                <tbody>
                                    {vache.costs.map(c => (
                                        <tr key={c.id}><td className="p-2 border">{c.date_facture}</td><td className="p-2 border">{c.type}</td><td className="p-2 border">{c.price} €</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Productions (Lait)</h4>
                            <table className="w-full text-sm text-left border">
                                <thead><tr className="bg-gray-100"><th className="p-2 border">Période</th><th className="p-2 border">Quantité</th></tr></thead>
                                <tbody>
                                    {vache.productions.map(p => (
                                        <tr key={p.id}><td className="p-2 border">{p.periode_mois}</td><td className="p-2 border">{p.quantite_litres} L</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showHealthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Archive Santé</h3>
                            <button onClick={() => setShowHealthModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>
                        <table className="w-full text-sm text-left border">
                            <thead><tr className="bg-gray-100"><th className="p-2 border">Statut</th><th className="p-2 border">Date Début</th><th className="p-2 border">Date Fin</th></tr></thead>
                            <tbody>
                                {vache.health_statuses.map(h => (
                                    <tr key={h.id}>
                                        <td className="p-2 border">{h.type === 'sickness' ? 'Maladie' : h.type === 'pregnancy' ? 'Gestation' : 'Visite de routine'}</td>
                                        <td className="p-2 border">{h.date_debut}</td>
                                        <td className="p-2 border">{h.date_fin || 'En cours'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
