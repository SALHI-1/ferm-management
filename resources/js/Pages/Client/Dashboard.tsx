import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Coins, Info } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface Props {
    investissements: Array<{ id: number; type_investissement: string; part_possedee: number; date_investissement: string; vache: { numero_ticket: string; sexe: string } }>;
    financialChartData?: Array<{ name: string; benefits: number; food_costs: number; health_costs: number }>;
}

export default function ClientDashboard({ investissements, financialChartData }: Props) {
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    
    const chartData = investissements.map((inv, index) => ({
        name: `Bovin ${inv.vache.numero_ticket}`,
        value: inv.part_possedee * 100,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <AppLayout title="Espace Partenaire — Tableau de Bord">
            <Head title="Mon Tableau de Bord" />

            <div className="flex items-start gap-3 bg-brand-50/60 border border-brand-100 rounded-2xl p-5 mb-8">
                <Info className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-brand-800">
                    👋 Bienvenue dans votre espace sécurisé. Vos actifs sont présentés sous forme de statistiques synthétiques.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-indigo-50 ring-1 ring-indigo-200/60">
                        <Coins className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Contrats d'investissements actifs</p>
                        <p className="text-2xl font-bold text-slate-800 mt-0.5">{investissements.length} Contrats</p>
                    </div>
                </div>
            </div>

            {investissements.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card-premium">
                        <h3 className="text-lg font-bold text-slate-800 font-display mb-6">Répartition de votre portefeuille</h3>
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
                                    <Tooltip formatter={(value) => [`${value}% des parts`, 'Part possédée']} />
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
                        <h3 className="text-lg font-bold text-slate-800 font-display mb-6">Évolution Financière (Gains vs Coûts)</h3>
                        <div className="h-80">
                            {financialChartData && financialChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={financialChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Line type="monotone" name="Gains (Net)" dataKey="benefits" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Coût (Nourriture)" dataKey="food_costs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Coût (Santé)" dataKey="health_costs" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                    Aucune donnée financière disponible.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}