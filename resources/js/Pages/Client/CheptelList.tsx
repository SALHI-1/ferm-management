import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';

interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string; statut_vente: string }>;
}

export default function CheptelList({ vaches }: Props) {
    const { t } = useTrans();

    return (
        <AppLayout title={t('cheptel_list.app_layout_title')}>
            <Head title={t('cheptel_list.head_title')} />

            <div className="card-premium">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-forest">{t('cheptel_list.section_title')}</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-y border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold">
                                <th className="p-4 rounded-tl-lg">{t('cheptel_list.table.ear_tag_number')}</th>
                                <th className="p-4">{t('cheptel_list.table.weight')}</th>
                                <th className="p-4">{t('cheptel_list.table.health_status')}</th>
                                <th className="p-4 text-right rounded-tr-lg">{t('cheptel_list.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vaches.length > 0 ? vaches.map(vache => (
                                <tr key={vache.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                    <td className="p-4 font-semibold text-slate-800">{vache.numero_ticket}</td>
                                    <td className="p-4 text-slate-600">{vache.poids || t('cheptel_list.not_available')} kg</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${vache.statut_sante === 'healthy' ? 'bg-emerald-100 text-forest' :
                                            vache.statut_sante === 'pregnancy' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {vache.statut_sante === 'healthy' ? t('cheptel_list.health_status.healthy') :
                                                vache.statut_sante === 'pregnancy' ? t('cheptel_list.health_status.pregnancy') : t('cheptel_list.health_status.sick')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <a
                                            href={`/investisseur/cheptel/${vache.id}`}
                                            className="inline-flex font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors duration-200"
                                        >
                                            {t('cheptel_list.view_details')}
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                                        {t('cheptel_list.empty_state')}
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