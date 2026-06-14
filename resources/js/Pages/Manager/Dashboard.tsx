import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Milk, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    totalVaches: number;
    productionDuMois: number;
    monthlyProductions: Array<{ periode_mois: string; total_litres: number }>;
}

export default function ManagerDashboard({ totalVaches, productionDuMois, monthlyProductions }: Props) {
    const formattedData = monthlyProductions.map(p => ({
        month: p.periode_mois,
        production: parseFloat(p.total_litres.toString())
    }));

    return (
        <AppLayout title="Portail d'Exploitation Agricole (Manager)">
            <Head title="Manager Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-emerald-50 ring-1 ring-emerald-200/60">
                        <Milk className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Production Laitière Globale</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-0.5">{productionDuMois} Litres</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon bg-brand-50 ring-1 ring-brand-200/60">
                        <Activity className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Tête de Bétail Suivies</p>
                        <p className="text-2xl font-bold text-brand-600 mt-0.5">{totalVaches} Bovins</p>
                    </div>
                </div>
            </div>

            <div className="card-premium">
                <h3 className="text-lg font-bold text-slate-800 font-display mb-6 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" /> Evolution de la Production (L)
                </h3>
                <div className="h-80">
                    {formattedData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`${value} L`, 'Production']} />
                                <Area type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            Aucune donnée de production récente.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}