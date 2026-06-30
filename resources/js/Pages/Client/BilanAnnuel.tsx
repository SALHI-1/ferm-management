import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Ensure this is imported properly based on other files. If it fails, I'll remove it.
// Actually, looking at other files, useTranslation is probably a custom hook or not used.
// Let's use standard static text or whatever CheptelDetails uses.
// CheptelDetails uses `const { t: __ } = useTranslation();`
import { useTranslation as useLaravelTranslation } from 'react-i18next'; // wait, what package is it? Let's just mock it or not use it for now and use hardcoded French since the app seems mostly French.

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
    return (
        <AppLayout title="Bilan Annuel">
            <Head title="Bilan Annuel" />

            <div className="space-y-6">
                <div className="flex items-start gap-3 bg-brand-50/60 border border-brand-100 rounded-2xl p-5 mb-8">
                    <CalendarDays className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-brand-800">
                        Retrouvez ici le bilan annuel de vos investissements. L'année en cours ne s'affiche qu'à sa clôture (le 1er janvier de l'année suivante).
                    </p>
                </div>

                {bilans.length === 0 ? (
                    <div className="card-premium py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarDays className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 font-display mb-2">Aucun historique disponible</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto">
                            Les bilans annuels s'afficheront ici une fois qu'une année complète aura été clôturée.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bilans.map(bilan => (
                            <div key={bilan.year} className="card-premium">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                    <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
                                        Année {bilan.year}
                                    </h2>
                                    {bilan.has_error && (
                                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm font-semibold">
                                            <AlertTriangle className="h-4 w-4" />
                                            Erreur de calculs
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Coûts Totaux</p>
                                        <p className="text-lg font-bold text-rose-600">-{bilan.total_costs.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Revenu Laitier Net</p>
                                        <p className="text-lg font-bold text-emerald-600">+{bilan.net_milk_revenue.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Revenu des Ventes</p>
                                        <p className="text-lg font-bold text-emerald-600">+{bilan.sales_revenue.toFixed(2)} DH</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bénéfice Global</p>
                                        <p className={`text-lg font-bold ${bilan.net_benefit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {bilan.net_benefit > 0 ? '+' : ''}{bilan.net_benefit.toFixed(2)} DH
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-brand-50 to-indigo-50 rounded-xl p-5 border border-brand-100/50">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-center md:text-left">
                                            <p className="text-sm font-semibold text-slate-500 mb-1">Part de la Ferme (50%)</p>
                                            <p className="text-xl font-bold text-slate-700">{bilan.farm_part.toFixed(2)} DH</p>
                                        </div>

                                        <div className="hidden md:block h-12 w-px bg-brand-200"></div>

                                        <div className="text-center md:text-right">
                                            <p className="text-sm font-semibold text-brand-600 mb-1">Votre Part Nette</p>
                                            <p className={`text-2xl font-black ${bilan.client_part >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {bilan.client_part > 0 ? '+' : ''}{bilan.client_part.toFixed(2)} DH
                                            </p>
                                        </div>
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
