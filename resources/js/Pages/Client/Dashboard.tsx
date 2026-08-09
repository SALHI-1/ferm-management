import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Coins, Info } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import { useTrans } from '@/Hooks/useTrans';

interface Props {
    investissements: Array<{
        id: number;
        type_investissement: string;
        part_possedee: number;
        date_investissement: string;
        vache: {
            id: number;
            numero_ticket: string;
            sexe: string;
            productions: Array<{ quantite_litres: number; periode_mois: string }>;
            costs: Array<{ type: string; price: number; date_facture: string }>;
        };
        pivot?: { part_possedee: number };
    }>;
}

export default function ClientDashboard({ investissements }: Props) {
    const { t } = useTrans();
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

    const [selectedCows, setSelectedCows] = useState<number[]>([]);

    const calculatedChartData = useMemo(() => {
        const monthlyData: Record<string, { name: string; benefits: number; food_costs: number; health_costs: number }> = {};
        const filteredInvestments = selectedCows.length > 0
            ? investissements.filter(inv => selectedCows.includes(inv.vache.id))
            : investissements;

        filteredInvestments.forEach(inv => {
            const part = inv.pivot?.part_possedee ?? inv.part_possedee;
            const vache = inv.vache;

            const months = new Set<string>();
            vache.productions?.forEach(p => months.add(p.periode_mois.substring(0, 7)));
            vache.costs?.forEach(c => months.add(c.date_facture.substring(0, 7)));

            months.forEach(month => {
                if (!monthlyData[month]) monthlyData[month] = { name: month, benefits: 0, food_costs: 0, health_costs: 0 };

                const rawProd = vache.productions?.filter(p => p.periode_mois.startsWith(month)).reduce((s, p) => s + Number(p.quantite_litres), 0) || 0;
                const consumed = vache.costs?.filter(c => c.date_facture.startsWith(month) && c.type === 'lait_consomme').reduce((s, c) => s + Number(c.price), 0) || 0;
                const netProd = Math.max(0, rawProd - consumed);

                monthlyData[month].benefits += (netProd * 4) * part;
            });

            vache.costs?.filter(c => c.type !== 'lait_consomme').forEach(cost => {
                const month = cost.date_facture.substring(0, 7);
                const price = Number(cost.price) * part;
                if (cost.type === 'food') {
                    monthlyData[month].food_costs += price;
                } else if (cost.type === 'veterinaire') {
                    monthlyData[month].health_costs += price;
                }
            });
        });

        return Object.values(monthlyData).sort((a, b) => a.name.localeCompare(b.name));
    }, [investissements, selectedCows]);

    const chartData = investissements.map((inv, index) => ({
        name: t('client_dashboard.cattle_ticket', { ticket: inv.vache.numero_ticket }),
        value: inv.part_possedee * 100,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <AppLayout title={t('client_dashboard.app_layout_title')}>
            <Head title={t('client_dashboard.head_title')} />

            <div className="flex items-start gap-3 bg-brand-50/60 border border-brand-100 rounded-2xl p-5 mb-8">
                <Info className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-brand-800">
                    {t('client_dashboard.welcome_banner')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-indigo-50 ring-1 ring-indigo-200/60">
                        <Coins className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{t('client_dashboard.active_contracts')}</p>
                        <p className="text-2xl font-bold text-forest mt-0.5">{investissements.length} {t('client_dashboard.contracts_unit')}</p>
                    </div>
                </div>
            </div>

            {investissements.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card-premium">
                        <h3 className="text-lg font-bold text-forest font-display mb-6">{t('client_dashboard.portfolio_distribution')}</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [t('client_dashboard.owned_share_percent', { value: String(value) }), t('client_dashboard.owned_share')]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {chartData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-sm text-slate-600 font-medium">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium">
                        <h3 className="text-lg font-bold text-forest font-display mb-4">{t('client_dashboard.financial_evolution')}</h3>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                onClick={() => setSelectedCows([])}
                                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors ${selectedCows.length === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {t('client_dashboard.all_cattle')}
                            </button>
                            {investissements.map(inv => (
                                <button
                                    key={inv.vache.id}
                                    onClick={() => {
                                        if (selectedCows.includes(inv.vache.id)) {
                                            setSelectedCows(selectedCows.filter(id => id !== inv.vache.id));
                                        } else {
                                            setSelectedCows([...selectedCows, inv.vache.id]);
                                        }
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full font-medium transition-colors ${selectedCows.includes(inv.vache.id) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {t('client_dashboard.cattle_ticket', { ticket: inv.vache.numero_ticket })}
                                </button>
                            ))}
                        </div>

                        <div className="h-80">
                            {calculatedChartData && calculatedChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={calculatedChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Line type="monotone" name={t('client_dashboard.gains_net')} dataKey="benefits" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name={t('client_dashboard.food_costs')} dataKey="food_costs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name={t('client_dashboard.health_costs')} dataKey="health_costs" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                    {t('client_dashboard.no_financial_data')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}