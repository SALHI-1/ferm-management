import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, TrendingUp, Package } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
    stats: { total_users: number; total_vaches: number; total_investissements: number };
    users: Array<{ id: number; nom: string; prenom: string; email: string; userable_type: string }>;
}

export default function AdminDashboard({ stats, users }: Props) {
    const roleData = [
        { name: 'Admins', value: users.filter(u => u.userable_type.includes('Admin')).length, color: '#3b82f6' },
        { name: 'Managers', value: users.filter(u => u.userable_type.includes('Manager')).length, color: '#10b981' },
        { name: 'Clients', value: users.filter(u => u.userable_type.includes('Client')).length, color: '#8b5cf6' },
    ].filter(d => d.value > 0);

    const platformStats = [
        { name: 'Utilisateurs', total: stats.total_users },
        { name: 'Bovins', total: stats.total_vaches },
        { name: 'Investissements', total: stats.total_investissements },
    ];

    return (
        <AppLayout title="Panneau d'Administration - Statistiques">
            <Head title="Admin Dashboard" />

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-amber-50 ring-1 ring-amber-200/60"><Users className="h-6 w-6 text-amber-600" /></div>
                    <div><p className="text-sm text-slate-500 font-medium">Utilisateurs</p><p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total_users}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-emerald-50 ring-1 ring-emerald-200/60"><Package className="h-6 w-6 text-emerald-600" /></div>
                    <div><p className="text-sm text-slate-500 font-medium">Total bovins</p><p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total_vaches}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-brand-50 ring-1 ring-brand-200/60"><TrendingUp className="h-6 w-6 text-brand-600" /></div>
                    <div><p className="text-sm text-slate-500 font-medium">Investissements</p><p className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total_investissements}</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-premium">
                    <h3 className="text-lg font-bold text-slate-800 font-display mb-6">Répartition des Utilisateurs</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} Utilisateurs`, 'Quantité']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {roleData.map(r => (
                            <div key={r.name} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }}></span><span className="text-sm text-slate-600">{r.name}</span></div>
                        ))}
                    </div>
                </div>

                <div className="card-premium">
                    <h3 className="text-lg font-bold text-slate-800 font-display mb-6">Vue d'ensemble de la plateforme</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platformStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}