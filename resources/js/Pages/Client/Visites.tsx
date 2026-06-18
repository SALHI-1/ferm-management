import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Info, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Visites({ visites }: { visites: any[] }) {
    const { flash } = usePage().props as any;
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        date_visite: '',
        heure_visite: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('client.visites.store'), {
            onSuccess: () => {
                reset();
                setIsFormOpen(false);
            },
        });
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

    return (
        <AppLayout title="Mes Visites">
            <Head title="Mes Visites" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Historique de vos visites</h2>
                    <p className="text-sm text-slate-500">Gérez vos demandes de visite à la ferme</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver une visite
                </button>
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
                                    Date
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Heure
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Détails / Motif
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {visites.length > 0 ? (
                                visites.map((visite) => (
                                    <tr key={visite.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-slate-900">
                                            {new Date(visite.date_visite).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                            {visite.heure_visite.substring(0, 5)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            {getStatusBadge(visite.statut)}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-500">
                                            {visite.statut === 'refusee' ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-slate-700">{visite.motif_refus_option}</span>
                                                    {visite.commentaire_refus && (
                                                        <span className="text-xs italic text-slate-500">"{visite.commentaire_refus}"</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                                        Vous n'avez pas encore fait de demande de visite.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isFormOpen} onClose={() => setIsFormOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-slate-900">Demande de visite</h3>
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="text-slate-400 hover:text-slate-500 transition-colors"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                        <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                        <p>Votre demande sera étudiée par l'administration. Vous serez notifié de son acceptation ou refus.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="date_visite" className="block text-sm font-medium text-slate-700 mb-1">
                                Date souhaitée
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="date"
                                    id="date_visite"
                                    className={`block w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm ${errors.date_visite ? 'border-red-300' : ''}`}
                                    value={data.date_visite}
                                    onChange={(e) => setData('date_visite', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            {errors.date_visite && <p className="mt-1 text-sm text-red-600">{errors.date_visite}</p>}
                        </div>

                        <div>
                            <label htmlFor="heure_visite" className="block text-sm font-medium text-slate-700 mb-1">
                                Heure souhaitée
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="time"
                                    id="heure_visite"
                                    className={`block w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm ${errors.heure_visite ? 'border-red-300' : ''}`}
                                    value={data.heure_visite}
                                    onChange={(e) => setData('heure_visite', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.heure_visite && <p className="mt-1 text-sm text-red-600">{errors.heure_visite}</p>}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Envoi...' : 'Confirmer la demande'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
