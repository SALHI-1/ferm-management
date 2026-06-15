import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { Users, Plus, Edit2, Trash2, X } from 'lucide-react';

interface ClientUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    userable: {
        id: number;
        date_inscription: string;
    };
}

interface Props {
    clients: ClientUser[];
}

export default function ClientIndex({ clients }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientUser | null>(null);

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_inscription: new Date().toISOString().split('T')[0],
        password: '',
        password_confirmation: ''
    });

    const openModal = (client: ClientUser | null = null) => {
        clearErrors();
        if (client) {
            setEditingClient(client);
            setData({
                nom: client.nom,
                prenom: client.prenom,
                email: client.email,
                telephone: client.telephone || '',
                date_inscription: client.userable.date_inscription,
                password: '',
                password_confirmation: ''
            });
        } else {
            setEditingClient(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            put(route('admin.clients.update', editingClient.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.clients.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir archiver ce client ? Il n\'aura plus accès à la plateforme.')) {
            router.delete(route('admin.clients.destroy', id));
        }
    };

    return (
        <AppLayout title="Gestion des Clients">
            <Head title="Clients" />

            <div className="space-y-8">
                <div className="card-premium">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-brand-100 p-2 rounded-lg">
                                <Users className="h-6 w-6 text-brand-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Liste des Clients</h2>
                        </div>
                        <button onClick={() => openModal()} className="btn-premium flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Nouveau Client
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-y border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold">
                                    <th className="p-4 rounded-tl-lg">Nom Complet</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Téléphone</th>
                                    <th className="p-4">Date d'inscription</th>
                                    <th className="p-4 text-right rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.length > 0 ? clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                        <td className="p-4 font-semibold text-slate-800">{client.prenom} {client.nom}</td>
                                        <td className="p-4 text-slate-600">{client.email}</td>
                                        <td className="p-4 text-slate-600">{client.telephone || '-'}</td>
                                        <td className="p-4 text-slate-600">{new Date(client.userable.date_inscription).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button onClick={() => openModal(client)} className="text-brand-600 hover:text-brand-800 transition-colors">
                                                <Edit2 className="w-5 h-5 inline" />
                                            </button>
                                            <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <Trash2 className="w-5 h-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                                            Aucun client enregistré pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-xl shadow-premium w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingClient ? 'Modifier le Client' : 'Ajouter un Client'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Prénom</label>
                                    <input type="text" value={data.prenom} onChange={e => setData('prenom', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nom</label>
                                    <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
                                <input type="text" value={data.telephone} onChange={e => setData('telephone', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" />
                                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                            </div>

                            {!editingClient && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date d'inscription</label>
                                    <input type="date" value={data.date_inscription} onChange={e => setData('date_inscription', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                    {errors.date_inscription && <p className="text-red-500 text-xs mt-1">{errors.date_inscription}</p>}
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-800 mb-4">Mot de passe</h4>
                                
                                {editingClient && (
                                    <p className="text-xs text-slate-500 mb-4">
                                        Laissez les champs vides si vous ne souhaitez pas modifier le mot de passe actuel.
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            {editingClient ? 'Nouveau mot de passe' : 'Mot de passe'} {editingClient ? '' : <span className="text-red-500">*</span>}
                                        </label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={e => setData('password', e.target.value)} 
                                            className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" 
                                            required={!editingClient}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            Confirmer le mot de passe {editingClient ? '' : <span className="text-red-500">*</span>}
                                        </label>
                                        <input 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={e => setData('password_confirmation', e.target.value)} 
                                            className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" 
                                            required={!editingClient}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={closeModal} className="btn-premium-secondary">
                                    Annuler
                                </button>
                                <button type="submit" className="btn-premium">
                                    {editingClient ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}
        </AppLayout>
    );
}
