import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { CheckCircle2, XCircle, Clock3, Search, Calendar as CalendarIcon, User, MessageSquare } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function AdminVisites({ visites }: { visites: any[] }) {
    const { flash } = usePage().props as any;
    const [selectedVisite, setSelectedVisite] = useState<any>(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, put, processing, errors, reset } = useForm({
        motif_refus_option: '',
        commentaire_refus: '',
    });

    const rejectReasons = [
        "Indisponibilité du personnel",
        "Ferme fermée à cette date",
        "Capacité d'accueil atteinte",
        "Conditions météorologiques défavorables",
        "Autre"
    ];

    const openRejectModal = (visite: any) => {
        setSelectedVisite(visite);
        reset();
        setIsRejectModalOpen(true);
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.visites.reject', selectedVisite.id), {
            onSuccess: () => {
                setIsRejectModalOpen(false);
                setSelectedVisite(null);
            },
        });
    };

    const handleAccept = (id: number) => {
        if (confirm("Voulez-vous vraiment accepter cette visite ?")) {
            router.put(route('admin.visites.accept', id));
        }
    };

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'en_attente':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                        <Clock3 className="w-3.5 h-3.5" />
                        En attente
                    </span>
                );
            case 'acceptee':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acceptée
                    </span>
                );
            case 'refusee':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Refusée
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredVisites = visites.filter(visite => {
        const clientName = `${visite.client?.user?.prenom} ${visite.client?.user?.nom}`.toLowerCase();
        return clientName.includes(searchTerm.toLowerCase());
    });

    return (
        <AppLayout title="Gestion des Visites">
            <Head title="Gestion des Visites" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Demandes de visites</h2>
                    <p className="text-sm text-slate-500">Gérez les demandes de visites des clients</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-emerald-800">{flash.success}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Date & Heure
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredVisites.length > 0 ? (
                                filteredVisites.map((visite) => (
                                    <tr key={visite.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-4 w-4 text-brand-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {visite.client?.user?.prenom} {visite.client?.user?.nom}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {visite.client?.user?.telephone || visite.client?.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="text-sm text-slate-900 flex items-center gap-1.5">
                                                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(visite.date_visite).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                                                {visite.heure_visite.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            {getStatusBadge(visite.statut)}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                            {visite.statut === 'en_attente' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAccept(visite.id)}
                                                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                        title="Accepter"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(visite)}
                                                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Refuser"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                            {visite.statut === 'refusee' && (
                                                <button
                                                    onClick={() => openRejectModal(visite)}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                                    title="Voir le motif"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                                        Aucune demande de visite trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-slate-900">
                            {selectedVisite?.statut === 'refusee' ? 'Motif du refus' : 'Refuser la visite'}
                        </h3>
                        <button
                            onClick={() => setIsRejectModalOpen(false)}
                            className="text-slate-400 hover:text-slate-500 transition-colors"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>

                    {selectedVisite?.statut === 'refusee' ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-1">Raison principale</h4>
                                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {selectedVisite.motif_refus_option}
                                </p>
                            </div>
                            {selectedVisite.commentaire_refus && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Commentaire supplémentaire</h4>
                                    <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                                        {selectedVisite.commentaire_refus}
                                    </p>
                                </div>
                            )}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submitReject} className="space-y-4">
                            <div>
                                <label htmlFor="motif_refus_option" className="block text-sm font-medium text-slate-700 mb-1">
                                    Raison du refus (obligatoire)
                                </label>
                                <select
                                    id="motif_refus_option"
                                    className={`block w-full rounded-xl border-slate-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${errors.motif_refus_option ? 'border-red-300' : ''}`}
                                    value={data.motif_refus_option}
                                    onChange={(e) => setData('motif_refus_option', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Sélectionnez une raison</option>
                                    {rejectReasons.map((reason, index) => (
                                        <option key={index} value={reason}>{reason}</option>
                                    ))}
                                </select>
                                {errors.motif_refus_option && <p className="mt-1 text-sm text-red-600">{errors.motif_refus_option}</p>}
                            </div>

                            <div>
                                <label htmlFor="commentaire_refus" className="block text-sm font-medium text-slate-700 mb-1">
                                    Commentaire supplémentaire (optionnel)
                                </label>
                                <textarea
                                    id="commentaire_refus"
                                    rows={3}
                                    className={`block w-full rounded-xl border-slate-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${errors.commentaire_refus ? 'border-red-300' : ''}`}
                                    value={data.commentaire_refus}
                                    onChange={(e) => setData('commentaire_refus', e.target.value)}
                                    placeholder="Ajoutez des détails si nécessaire..."
                                />
                                {errors.commentaire_refus && <p className="mt-1 text-sm text-red-600">{errors.commentaire_refus}</p>}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Refus...' : 'Confirmer le refus'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AppLayout>
    );
}
