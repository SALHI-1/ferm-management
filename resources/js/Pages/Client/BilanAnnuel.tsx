import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

interface Bilan {
    year: string;
    total_costs: number;
    net_milk_revenue: number;
    sales_revenue: number;
    net_benefit: number;
    farm_part: number;
    client_part: number;
    has_error: boolean;
}

interface Props {
    bilans: Bilan[];
}

export default function BilanAnnuel({ bilans }: Props) {
    const { t } = useTrans();

    return (
        <AppLayout title={t('bilan_annuel.app_layout_title')}>
            <Head title={t('bilan_annuel.head_title')} />

            <div className="space-y-6">
                <div className="flex items-start gap-3 bg-brand-50/60 border border-brand-100 rounded-2xl p-5 mb-8">
                    <CalendarDays className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-brand-800">
                        {t('bilan_annuel.banner_info')}
                    </p>
                </div>

                {bilans.length === 0 ? (
                    <div className="card-premium py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-forest font-display mb-2">{t('bilan_annuel.empty_title')}</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            {t('bilan_annuel.empty_description')}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bilans.map(bilan => (
                            <div key={bilan.year} className="card-premium">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                    <h2 className="text-xl font-bold text-forest font-display flex items-center gap-2">
                                        {t('bilan_annuel.year_title', { year: bilan.year })}
                                    </h2>
                                    {bilan.has_error && (
                                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm font-semibold">
                                            <AlertTriangle className="h-4 w-4" />
                                            {t('bilan_annuel.calculation_error')}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('bilan_annuel.total_costs')}</p>
                                        <p className="text-lg font-bold text-rose-600">-{bilan.total_costs.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('bilan_annuel.net_milk_revenue')}</p>
                                        <p className="text-lg font-bold text-forest">+{bilan.net_milk_revenue.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('bilan_annuel.sales_revenue')}</p>
                                        <p className="text-lg font-bold text-forest">+{bilan.sales_revenue.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('bilan_annuel.global_benefit')}</p>
                                        <p className={`text-lg font-bold ${bilan.net_benefit >= 0 ? 'text-forest' : 'text-rose-600'}`}>
                                            {bilan.net_benefit > 0 ? '+' : ''}{bilan.net_benefit.toFixed(2)} DH
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-brand-50 to-indigo-50 rounded-xl p-5 border border-brand-100/50">
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <p className="text-sm font-semibold text-brand-600 mb-1">{t('bilan_annuel.your_net_part')}</p>
                                        <p className={`text-3xl font-black ${bilan.client_part >= 0 ? 'text-forest' : 'text-rose-600'}`}>
                                            {bilan.client_part > 0 ? '+' : ''}{bilan.client_part.toFixed(2)} DH
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}