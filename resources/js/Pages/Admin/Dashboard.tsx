import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Users, TrendingUp, Package } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTrans } from '@/Hooks/useTrans';

interface Props {
    stats: { total_users: number; total_vaches: number; total_investissements: number };
    users: Array<{ id: number; nom: string; prenom: string; email: string; userable_type: string }>;
}

export default function AdminDashboard({ stats, users }: Props) {
    const { t } = useTrans();

    const roleData = [
        { name: t('admin_dashboard.roles.admins'), value: users.filter(u => u.userable_type.includes('Admin')).length, color: '#3b82f6' },
        { name: t('admin_dashboard.roles.managers'), value: users.filter(u => u.userable_type.includes('Manager')).length, color: '#10b981' },
        { name: t('admin_dashboard.roles.clients'), value: users.filter(u => u.userable_type.includes('Client')).length, color: '#8b5cf6' },
    ].filter(d => d.value > 0);

    const platformStats = [
        { name: t('admin_dashboard.chart_labels.users'), total: stats.total_users },
        { name: t('admin_dashboard.chart_labels.cattle'), total: stats.total_vaches },
        { name: t('admin_dashboard.chart_labels.investments'), total: stats.total_investissements },
    ];

    return (
        <AppLayout title={t('admin_dashboard.app_layout_title')}>
            <Head title={t('admin_dashboard.head_title')} />

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="stat-card">
                    <div className="stat-card-icon bg-amber-50 ring-1 ring-amber-200/60"><Users className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" /></div>
                    <div><p className="text-xs sm:text-sm text-slate-500 font-medium">{t('admin_dashboard.stat_users')}</p><p className="text-xl sm:text-2xl font-bold text-forest mt-0.5">{stats.total_users}</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-forest/10 ring-1 ring-emerald-200/60"><Package className="h-5 w-5 sm:h-6 sm:w-6 text-forest" /></div>
                    <div><p className="text-xs sm:text-sm text-slate-500 font-medium">{t('admin_dashboard.stat_total_cattle')}</p><p className="text-xl sm:text-2xl font-bold text-forest mt-0.5">{stats.total_vaches}</p></div>
                </div>
                <div className="stat-card sm:col-span-2 md:col-span-1">
                    <div className="stat-card-icon bg-brand-50 ring-1 ring-brand-200/60"><TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" /></div>
                    <div><p className="text-xs sm:text-sm text-slate-500 font-medium">{t('admin_dashboard.stat_investments')}</p><p className="text-xl sm:text-2xl font-bold text-forest mt-0.5">{stats.total_investissements}</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="card-premium">
                    <h3 className="text-base sm:text-lg font-bold text-forest font-display mb-4 sm:mb-6">{t('admin_dashboard.user_distribution_title')}</h3>
                    <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                                    {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} ${t('admin_dashboard.tooltip_users')}`, t('admin_dashboard.tooltip_quantity')]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
                        {roleData.map(r => (
                            <div key={r.name} className="flex items-center gap-1.5 sm:gap-2"><span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }}></span><span className="text-xs sm:text-sm text-slate-600">{r.name}</span></div>
                        ))}
                    </div>
                </div>

                <div className="card-premium">
                    <h3 className="text-base sm:text-lg font-bold text-forest font-display mb-4 sm:mb-6">{t('admin_dashboard.platform_overview_title')}</h3>
                    <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platformStats} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                                <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={45} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}