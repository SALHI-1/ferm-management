import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface Client {
    id: number;
    user: {
        nom: string;
        prenom: string;
    };
}

interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string; statut_vente: string }>;
    coordonneesEspace: 'admin' | 'manager';
    canEdit?: boolean;
    clientsDisponibles: Client[];
}

export default function CheptelList({ vaches, coordonneesEspace, canEdit, clientsDisponibles }: Props) {
    const { auth } = usePage().props as any;
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        numero_ticket: '',
        sexe: 'female',
        origine: 'achete',
        date_naissance: '',
        date_entree: new Date().toISOString().split('T')[0],
        mother_id: '',
        type_investissement: 'complet',
        client_1_id: '',
        client_2_id: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${coordonneesEspace}/cheptel`, {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    return (
        <AppLayout title="Gestion du Cheptel (Espace Partagé)">
            <Head title="Liste des Bovins" />

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Suivi des Animaux</h2>

                    <div className="flex space-x-2">
                        {canEdit && (
                            <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                + Ajouter une bête
                            </button>
                        )}
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
                </div>

                {/* Tableau de données commun */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-sm">
                            <th className="p-3">Numéro Boucle</th>
                            <th className="p-3">Poids (kg)</th>
                            <th className="p-3">Statut Santé</th>
                            <th className="p-3">Vente</th>
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
                                    {vache.statut_vente === 'vendue' ? (
                                        <span className="text-red-600 font-bold text-xs uppercase">Vendue</span>
                                    ) : (
                                        <span className="text-gray-500 text-xs">Au cheptel</span>
                                    )}
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

            {/* Modal d'ajout de bête */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Ajouter une nouvelle bête</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Numéro de boucle (Ticket)</label>
                                <input type="text" value={data.numero_ticket} onChange={e => setData('numero_ticket', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                {errors.numero_ticket && <p className="text-red-500 text-xs mt-1">{errors.numero_ticket}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sexe</label>
                                    <select value={data.sexe} onChange={e => setData('sexe', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="female">Femelle</option>
                                        <option value="male">Mâle</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Origine</label>
                                    <select value={data.origine} onChange={e => setData('origine', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="achete">Acheté</option>
                                        <option value="ne_sur_ferme">Né sur la ferme</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                    <input type="date" value={data.date_naissance} onChange={e => setData('date_naissance', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                    {errors.date_naissance && <p className="text-red-500 text-xs mt-1">{errors.date_naissance}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date d'entrée</label>
                                    <input type="date" value={data.date_entree} onChange={e => setData('date_entree', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                    {errors.date_entree && <p className="text-red-500 text-xs mt-1">{errors.date_entree}</p>}
                                </div>
                            </div>

                            <hr />

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type de Propriété</label>
                                <select value={data.type_investissement} onChange={e => setData('type_investissement', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="complet">Investissement Complet (1)</option>
                                    <option value="demi">Investissement Demi (0.5)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sélectionner Propriétaire 1</label>
                                <select value={data.client_1_id} onChange={e => setData('client_1_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                    <option value="">-- Choisir un client --</option>
                                    {clientsDisponibles?.map(client => (
                                        <option key={client.id} value={client.id}>{client.user?.nom} {client.user?.prenom}</option>
                                    ))}
                                </select>
                                {errors.client_1_id && <p className="text-red-500 text-xs mt-1">{errors.client_1_id}</p>}
                            </div>

                            {data.type_investissement === 'demi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sélectionner Propriétaire 2</label>
                                    <select value={data.client_2_id} onChange={e => setData('client_2_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                        <option value="">-- Choisir un client --</option>
                                        {clientsDisponibles?.map(client => (
                                            <option key={client.id} value={client.id}>{client.user?.nom} {client.user?.prenom}</option>
                                        ))}
                                    </select>
                                    {errors.client_2_id && <p className="text-red-500 text-xs mt-1">{errors.client_2_id}</p>}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}