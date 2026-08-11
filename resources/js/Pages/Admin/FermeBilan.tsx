import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CalendarDays } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

interface Bilan {
    month: string;
    farm_costs_cas2: number;
    farm_milk_cas2: number;
    farm_sales_cas2: number;
    farm_net_cas2: number;
    farm_net_cas1: number;
    total_farm_profit: number;
}

interface Props {
    bilans: Bilan[];
}

export default function FermeBilan({ bilans }: Props) {
    const { t } = useTrans();
    const { locale } = usePage().props as any;

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout title={t('ferme_bilan.title')}>
            <Head title={t('ferme_bilan.title')} />

            <div className="space-y-6">
                <div className="flex items-start gap-3 bg-brand-50/60 border border-brand-100 rounded-2xl p-5 mb-8">
                    <CalendarDays className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-brand-800">
                        {t('ferme_bilan.description')}
                    </p>
                </div>

                <div className="card-premium py-24 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-black text-forest mb-4">Coming Soon 🚀</h2>
                    <p className="text-slate-500">{t('farm_financials.coming_soon')}</p>
                </div>

                {/* 
                {bilans.length === 0 ? (
                    <div className="card-premium py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-forest font-display mb-2">{t('bilan_annuel.empty_title')}</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            {t('ferme_bilan.empty_description')}
                        </p>
                    </div>
                ) : (
                    <div className="card-premium overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                                        <th className="p-4 rounded-tl-lg">{t('ferme_bilan.table.month')}</th>
                                        <th className="p-4 text-right">{t('ferme_bilan.table.costs_cas2')}</th>
                                        <th className="p-4 text-right">{t('ferme_bilan.table.milk_cas2')}</th>
                                        <th className="p-4 text-right">{t('ferme_bilan.table.sales_cas2')}</th>
                                        <th className="p-4 text-right bg-slate-100/50">{t('ferme_bilan.table.net_cas2')}</th>
                                        <th className="p-4 text-right bg-brand-50/30">{t('ferme_bilan.table.net_cas1')}</th>
                                        <th className="p-4 text-right rounded-tr-lg font-black text-brand-700 bg-brand-50/50">{t('ferme_bilan.table.total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bilans.map((bilan, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors duration-200">
                                            <td className="p-4 font-bold text-slate-800 capitalize">
                                                {formatMonth(bilan.month)}
                                            </td>
                                            <td className="p-4 text-right text-rose-500 font-medium">
                                                {bilan.farm_costs_cas2 > 0 ? `-${bilan.farm_costs_cas2.toFixed(2)} DH` : '-'}
                                            </td>
                                            <td className="p-4 text-right text-forest font-medium">
                                                {bilan.farm_milk_cas2 > 0 ? `+${bilan.farm_milk_cas2.toFixed(2)} DH` : '-'}
                                            </td>
                                            <td className="p-4 text-right text-forest font-medium">
                                                {bilan.farm_sales_cas2 > 0 ? `+${bilan.farm_sales_cas2.toFixed(2)} DH` : '-'}
                                            </td>
                                            <td className={`p-4 text-right font-bold bg-slate-50/30 ${bilan.farm_net_cas2 >= 0 ? 'text-forest' : 'text-rose-600'}`}>
                                                {bilan.farm_net_cas2 > 0 ? '+' : ''}{bilan.farm_net_cas2.toFixed(2)} DH
                                            </td>
                                            <td className={`p-4 text-right font-bold bg-brand-50/10 ${bilan.farm_net_cas1 >= 0 ? 'text-forest' : 'text-rose-600'}`}>
                                                {bilan.farm_net_cas1 > 0 ? '+' : ''}{bilan.farm_net_cas1.toFixed(2)} DH
                                            </td>
                                            <td className={`p-4 text-right text-lg font-black bg-brand-50/30 ${bilan.total_farm_profit >= 0 ? 'text-forest' : 'text-rose-600'}`}>
                                                {bilan.total_farm_profit > 0 ? '+' : ''}{bilan.total_farm_profit.toFixed(2)} DH
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                */}
            </div>
        </AppLayout>
    );
}
