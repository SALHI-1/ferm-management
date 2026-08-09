import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { CheckCircle2, XCircle, Clock3, Search, Calendar as CalendarIcon, User, MessageSquare } from 'lucide-react';
import Modal from '@/Components/Modal';
import { useTrans } from '@/Hooks/useTrans';

export default function AdminVisites({ visites }: { visites: any[] }) {
    const { t } = useTrans();
    const { flash, locale } = usePage().props as any;

    const [selectedVisite, setSelectedVisite] = useState<any>(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, put, processing, errors, reset } = useForm({
        motif_refus_option: '',
        commentaire_refus: '',
    });

    const rejectReasonKeys = [
        "staff_unavailable",
        "farm_closed",
        "capacity_reached",
        "bad_weather",
        "other"
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
        if (confirm(t('admin_visites.confirm_accept'))) {
            router.put(route('admin.visites.accept', id));
        }
    };

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'en_attente':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                        <Clock3 className="w-3.5 h-3.5" />
                        {t('admin_visites.status.pending')}
                    </span>
                );
            case 'acceptee':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-forest/10 text-forest rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('admin_visites.status.accepted')}
                    </span>
                );
            case 'refusee':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        {t('admin_visites.status.rejected')}
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
        <AppLayout title={t('admin_visites.title')}>
            <Head title={t('admin_visites.title')} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-forest">{t('admin_visites.subtitle')}</h2>
                    <p className="text-sm text-slate-500">{t('admin_visites.description')}</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('admin_visites.search_placeholder')}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 rounded-xl bg-forest/10 p-4 border border-emerald-200">
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
                                    {t('admin_visites.table.client')}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t('admin_visites.table.date_time')}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t('admin_visites.table.status')}
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {t('admin_visites.table.actions')}
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
                                                {new Date(visite.date_visite).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
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
                                                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-forest hover:bg-forest/10 transition-colors"
                                                        title={t('admin_visites.actions.accept')}
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(visite)}
                                                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                        title={t('admin_visites.actions.reject')}
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                            {visite.statut === 'refusee' && (
                                                <button
                                                    onClick={() => openRejectModal(visite)}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                                    title={t('admin_visites.actions.view_reason')}
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
                                        {t('admin_visites.empty_state')}
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
                            {selectedVisite?.statut === 'refusee' ? t('admin_visites.modal.reason_title') : t('admin_visites.modal.reject_title')}
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
                                <h4 className="text-sm font-semibold text-slate-700 mb-1">{t('admin_visites.modal.main_reason')}</h4>
                                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {selectedVisite.motif_refus_option}
                                </p>
                            </div>
                            {selectedVisite.commentaire_refus && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-1">{t('admin_visites.modal.additional_comment')}</h4>
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
                                    {t('admin_visites.modal.close')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submitReject} className="space-y-4">
                            <div>
                                <label htmlFor="motif_refus_option" className="block text-sm font-medium text-slate-700 mb-1">
                                    {t('admin_visites.modal.reason_label')}
                                </label>
                                <select
                                    id="motif_refus_option"
                                    className={`block w-full rounded-xl border-slate-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${errors.motif_refus_option ? 'border-red-300' : ''}`}
                                    value={data.motif_refus_option}
                                    onChange={(e) => setData('motif_refus_option', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>{t('admin_visites.modal.select_reason')}</option>
                                    {rejectReasonKeys.map((key) => (
                                        <option key={key} value={t(`admin_visites.reject_reasons.${key}`)}>
                                            {t(`admin_visites.reject_reasons.${key}`)}
                                        </option>
                                    ))}
                                </select>
                                {errors.motif_refus_option && <p className="mt-1 text-sm text-red-600">{errors.motif_refus_option}</p>}
                            </div>

                            <div>
                                <label htmlFor="commentaire_refus" className="block text-sm font-medium text-slate-700 mb-1">
                                    {t('admin_visites.modal.comment_label')}
                                </label>
                                <textarea
                                    id="commentaire_refus"
                                    rows={3}
                                    className={`block w-full rounded-xl border-slate-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm ${errors.commentaire_refus ? 'border-red-300' : ''}`}
                                    value={data.commentaire_refus}
                                    onChange={(e) => setData('commentaire_refus', e.target.value)}
                                    placeholder={t('admin_visites.modal.comment_placeholder')}
                                />
                                {errors.commentaire_refus && <p className="mt-1 text-sm text-red-600">{errors.commentaire_refus}</p>}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    {t('admin_visites.modal.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                                >
                                    {processing ? t('admin_visites.modal.rejecting') : t('admin_visites.modal.confirm_reject')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AppLayout>
    );
}