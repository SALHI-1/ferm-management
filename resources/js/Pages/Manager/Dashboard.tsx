import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Milk, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrans } from '@/Hooks/useTrans';

interface Props {
    totalVaches: number;
    productionDuMois: number;
    monthlyProductions: Array<{ periode_mois: string; total_litres: number }>;
}

export default function ManagerDashboard({ totalVaches, productionDuMois, monthlyProductions }: Props) {
    const { t } = useTrans();

    const formattedData = monthlyProductions.map(p => ({
        month: p.periode_mois,
        production: parseFloat(p.total_litres.toString())
    }));

    return (
        <AppLayout title={t('manager_dashboard.app_layout_title')}>
            <Head title={t('manager_dashboard.head_title')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-forest/10 ring-1 ring-emerald-200/60">
                        <Milk className="h-5 w-5 sm:h-6 sm:w-6 text-forest" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{t('manager_dashboard.global_milk_production')}</p>
                        <p className="text-xl sm:text-2xl font-bold text-forest mt-0.5">{productionDuMois} {t('manager_dashboard.liters_unit')}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon bg-brand-50 ring-1 ring-brand-200/60">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{t('manager_dashboard.monitored_livestock')}</p>
                        <p className="text-xl sm:text-2xl font-bold text-brand-600 mt-0.5">{totalVaches} {t('manager_dashboard.cattle_unit')}</p>
                    </div>
                </div>
            </div>

            <div className="card-premium">
                <h3 className="text-base sm:text-lg font-bold text-forest font-display mb-4 sm:mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" /> {t('manager_dashboard.production_evolution_title')}
                </h3>
                <div className="h-64 sm:h-80">
                    {formattedData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} formatter={(value) => [`${value} L`, t('manager_dashboard.tooltip_production')]} />
                                <Area type="monotone" dataKey="production" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-xs sm:text-sm">
                            {t('manager_dashboard.no_recent_data')}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}