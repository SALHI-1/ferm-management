import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { X, Heart, DollarSign, Baby, TrendingUp } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';
import ImageWithLoader from '@/Components/ImageWithLoader';

interface Client { id: number; user: { nom: string; prenom: string; }; pivot: { part_possedee: number; }; }
interface Cost { id: number; type: string; price: number; date_facture: string; }
interface Production { id: number; quantite_litres: number; periode_mois: string; }
interface HealthStatus { id: number; type: string; date_debut: string; date_fin: string | null; }
interface Vache { id: number; numero_ticket: string; image: string | null; fichier_documents: string | null; statut_sante: string; statut_vente: string; sexe: 'male' | 'female'; origine: string; date_naissance: string | null; age: number | null; clients: Client[]; costs: Cost[]; productions: Production[]; health_statuses: HealthStatus[]; enfants: Vache[]; pivot?: { part_possedee: number; }; prix_vente?: number; date_vente?: string; part_ferme_net?: string | null; prix_achat?: number | null; }
interface Props { vache: Vache; }

export default function CheptelDetails({ vache }: Props) {
    const { t } = useTrans();
    const { locale } = usePage().props as any;

    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showFinancialModal, setShowFinancialModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const isSold = vache.statut_vente === 'vendue';
    const partPossedee = vache.pivot?.part_possedee || 0;
    const partFermeNet = vache.part_ferme_net ? parseFloat(vache.part_ferme_net) : 0;
    const clientNetMultiplier = 1 - partFermeNet;

    const yearsSet = new Set<string>();
    vache.costs.forEach(c => yearsSet.add(c.date_facture.substring(0, 4)));
    vache.productions.forEach(p => yearsSet.add(p.periode_mois.substring(0, 4)));
    if (yearsSet.size === 0) yearsSet.add(new Date().getFullYear().toString());
    const availableYears = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));

    const months = new Set<string>();
    vache.costs.forEach(c => months.add(c.date_facture.substring(0, 7)));
    vache.productions.forEach(p => months.add(p.periode_mois.substring(0, 7)));
    const monthlyStats = Array.from(months).filter(month => month.startsWith(selectedYear)).sort((a, b) => b.localeCompare(a)).map(month => {
        const costs = vache.costs.filter(c => c.date_facture.startsWith(month) && c.type !== 'lait_consomme').reduce((s, c) => s + parseFloat(c.price.toString()), 0);
        const rawProduction = vache.productions.filter(p => p.periode_mois.startsWith(month)).reduce((s, p) => s + parseFloat(p.quantite_litres.toString()), 0);
        const consumedMilk = vache.costs.filter(c => c.date_facture.startsWith(month) && c.type === 'lait_consomme').reduce((s, c) => s + parseFloat(c.price.toString()), 0);
        const production = Math.max(0, rawProduction - consumedMilk);
        return { month, costs, production, rawProduction, consumedMilk };
    });

    const healthBadge = (s: string) => {
        if (s === 'healthy') return <span className="badge-success">{t('cheptel_details.health_status.healthy')}</span>;
        if (s === 'pregnancy') return <span className="badge-info">{t('cheptel_details.health_status.pregnancy')}</span>;
        return <span className="badge-danger">{t('cheptel_details.health_status.sick')}</span>;
    };

    return (
        <AppLayout title={t('cheptel_details.app_layout_title', { ticket: vache.numero_ticket })}>
            <Head title={t('cheptel_details.head_title', { ticket: vache.numero_ticket })} />
            <div className="space-y-8">
                {/* Header */}
                <div className="card-premium flex flex-col md:flex-row items-start gap-6">
                    <div className="w-28 h-28 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vache.image ? <ImageWithLoader src={vache.image} alt={vache.numero_ticket} className="w-full h-full object-cover" /> : <span className="text-slate-400 text-sm">{t('cheptel_details.no_photo')}</span>}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-forest font-display flex items-center gap-3 mb-2">
                            {t('cheptel_details.ticket')} {vache.numero_ticket}
                            {isSold && <span className="badge-danger">{t('cheptel_details.sold_badge')}</span>}
                        </h1>
                        {isSold && vache.prix_vente && (
                            <div className="mb-2 text-sm text-slate-600 font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                {t('cheptel_details.sold_info', {
                                    price: String(vache.prix_vente),
                                    date: new Date(vache.date_vente!).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')
                                })}
                            </div>
                        )}
                        <div className="space-y-2 mb-3">{healthBadge(vache.statut_sante)}
                            {vache.date_naissance && (
                                <p className="text-slate-500 text-sm">
                                    <strong>{t('cheptel_details.born_date')}</strong> {new Date(vache.date_naissance).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                                    {vache.age !== null ? ` (${t('cheptel_details.years_old', { age: String(vache.age) })})` : ''}
                                </p>
                            )}
                            <p className="text-slate-500 text-sm">
                                <strong>{t('cheptel_details.origin_label')}</strong> {vache.origine === 'ne_sur_ferme' ? t('cheptel_details.origin_farm') : t('cheptel_details.origin_purchased')}
                            </p>
                            {vache.prix_achat && (
                                <p className="text-slate-500 text-sm">
                                    <strong>{t('cheptel_details.purchase_price_label')}</strong> {vache.prix_achat} DH
                                </p>
                            )}
                            {vache.fichier_documents && (
                                <p className="text-slate-500 text-sm mt-2">
                                    <strong>{t('cheptel_details.file_label')}</strong>{' '}
                                    <a href={vache.fichier_documents} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 underline">{t('cheptel_details.view_document')}</a>
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 mb-1">{t('cheptel_details.owners_label')}</h3>
                            {vache.clients.length > 0 ? (
                                <ul className="text-sm text-slate-600 space-y-0.5">
                                    {vache.clients.map(c => <li key={c.id}>• {c.user?.nom} {c.user?.prenom} ({(c.pivot.part_possedee * 100).toFixed(0)}%)</li>)}
                                </ul>
                            ) : (
                                <p className="text-slate-400 text-sm">{t('cheptel_details.owned_by_farm')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Benefits */}
                {vache.sexe !== 'male' && (
                    <div className="card-premium">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-forest font-display flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-brand-500" /> {t('cheptel_details.monthly_profitability')}
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="ml-2 select-premium py-1 px-3 text-sm bg-white border-slate-200"
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </h2>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600">{t('cheptel_details.liter_price_label')}</span>
                                <span className="text-sm font-bold text-brand-600">{t('cheptel_details.liter_price_value')}</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">
                            {t('cheptel_details.net_profit_prefix')} <strong>{t('cheptel_details.net_profit_formula')}</strong>. {t('cheptel_details.net_profit_middle')} <strong>{((partPossedee * clientNetMultiplier) * 100).toFixed(0)}%</strong> {t('cheptel_details.net_profit_suffix')}
                        </p>
                        <div className="overflow-x-auto">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>{t('cheptel_details.table.month')}</th>
                                        <th className="text-right">{t('cheptel_details.table.milk_produced')}</th>
                                        <th className="text-right">{t('cheptel_details.table.milk_consumed')}</th>
                                        <th className="text-right">{t('cheptel_details.table.net_production')}</th>
                                        <th className="text-right">{t('cheptel_details.table.gross_revenue')}</th>
                                        <th className="text-right">{t('cheptel_details.table.costs')}</th>
                                        <th className="text-right">{t('cheptel_details.table.net_profit')}</th>
                                        <th className="text-right">{t('cheptel_details.table.your_share')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyStats.length > 0 ? monthlyStats.map(stat => {
                                        const rev = stat.production * 4;
                                        const ben = rev - stat.costs;
                                        const part = ben > 0 ? ben * clientNetMultiplier * partPossedee : ben * partPossedee;
                                        return (
                                            <tr key={stat.month}>
                                                <td className="font-medium text-slate-700">
                                                    {new Date(stat.month + '-01').toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', { month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="text-right text-slate-600">{stat.rawProduction} L</td>
                                                <td className="text-right text-rose-500">-{stat.consumedMilk} L</td>
                                                <td className="text-right text-forest font-semibold">{stat.production} L</td>
                                                <td className="text-right text-forest">+{rev.toFixed(2)} DH</td>
                                                <td className="text-right text-rose-600">-{stat.costs.toFixed(2)} DH</td>
                                                <td className={`text-right font-semibold ${ben >= 0 ? 'text-forest' : 'text-rose-600'}`}>{ben > 0 ? '+' : ''}{ben.toFixed(2)} DH</td>
                                                <td className={`text-right font-bold ${part >= 0 ? 'text-forest' : 'text-rose-700'}`}>{part > 0 ? '+' : ''}{part.toFixed(2)} DH</td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={8} className="text-center text-slate-400 py-8">{t('cheptel_details.table.no_data')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-forest font-display flex items-center gap-2"><DollarSign className="h-5 w-5 text-brand-500" /> {t('cheptel_details.costs_section')}</h2>
                            <button onClick={() => setShowFinancialModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">{t('cheptel_details.archive_link')}</button>
                        </div>
                    </div>
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-forest font-display flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500" /> {t('cheptel_details.health_section')}</h2>
                            <button onClick={() => setShowHealthModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">{t('cheptel_details.archive_link')}</button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-600 mb-2">{t('cheptel_details.latest_events')}</h3>
                            {vache.health_statuses.length > 0 ? (
                                <ul className="text-sm space-y-2">
                                    {vache.health_statuses.slice(0, 4).map(h => (
                                        <li key={h.id} className="flex justify-between border-b border-slate-100 pb-1.5">
                                            <span className="text-slate-700">
                                                {h.type === 'sickness' ? t('cheptel_details.health_types.sickness') : h.type === 'pregnancy' ? t('cheptel_details.health_types.pregnancy') : t('cheptel_details.health_types.routine')}
                                            </span>
                                            <span className="text-slate-400 text-xs">{h.date_debut}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-400">{t('cheptel_details.no_events')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {vache.sexe !== 'male' && (
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-forest font-display flex items-center gap-2">
                                <Baby className="h-5 w-5 text-brand-500" /> {t('cheptel_details.offspring_section', { count: String(vache.enfants.length) })}
                            </h2>
                        </div>
                        {vache.enfants.length > 0 ? (
                            <div className="space-y-2">
                                {vache.enfants.map(e => (
                                    <a key={e.id} href={`/investisseur/cheptel/${e.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-600 font-semibold text-sm transition-colors">
                                        {e.numero_ticket}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-sm">{t('cheptel_details.no_offspring')}</p>
                        )}
                    </div>
                )}
            </div>

            {showFinancialModal && (() => {
                const groupedCosts = vache.costs.filter(c => c.type !== 'lait_consomme').reduce((acc, curr) => {
                    const month = curr.date_facture.substring(0, 7);
                    if (!acc[month]) acc[month] = { month, total: 0, food: 0, health: 0, autre: 0 };

                    const price = Number(curr.price);
                    acc[month].total += price;

                    if (curr.type === 'food') {
                        acc[month].food += price;
                    } else if (curr.type === 'veterinaire') {
                        acc[month].health += price;
                    } else {
                        acc[month].autre += price;
                    }

                    return acc;
                }, {} as Record<string, { month: string, total: number, food: number, health: number, autre: number }>);
                const costsArray = Object.values(groupedCosts).sort((a, b) => b.month.localeCompare(a.month));

                const groupedMilkConsumed = vache.costs.filter(c => c.type === 'lait_consomme').reduce((acc, curr) => {
                    const month = curr.date_facture.substring(0, 7);
                    if (!acc[month]) acc[month] = { month, total: 0 };
                    acc[month].total += Number(curr.price);
                    return acc;
                }, {} as Record<string, { month: string, total: number }>);
                const milkConsumedArray = Object.values(groupedMilkConsumed).sort((a, b) => b.month.localeCompare(a.month));

                const groupedProds = vache.productions.reduce((acc, curr) => {
                    const month = curr.periode_mois.substring(0, 7);
                    if (!acc[month]) acc[month] = { month, total: 0 };
                    acc[month].total += Number(curr.quantite_litres);
                    return acc;
                }, {} as Record<string, { month: string, total: number }>);
                const prodsArray = Object.values(groupedProds).sort((a, b) => b.month.localeCompare(a.month));

                return createPortal(
                    <div className="modal-overlay">
                        <div className="modal-panel max-w-4xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold font-display">{t('cheptel_details.financial_archive_modal.title')}</h3>
                                <button onClick={() => setShowFinancialModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-3">{t('cheptel_details.financial_archive_modal.costs_title')}</h4>
                                    <table className="table-premium">
                                        <thead>
                                            <tr>
                                                <th>{t('cheptel_details.table.month')}</th>
                                                <th className="text-right">{t('cheptel_details.financial_archive_modal.food')}</th>
                                                <th className="text-right">{t('cheptel_details.financial_archive_modal.health')}</th>
                                                <th className="text-right">{t('cheptel_details.financial_archive_modal.other')}</th>
                                                <th className="text-right">{t('cheptel_details.financial_archive_modal.total')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {costsArray.map((c, i) => (
                                                <tr key={i}>
                                                    <td>{c.month}</td>
                                                    <td className="text-right text-rose-600 font-medium">-{c.food.toFixed(2)} DH</td>
                                                    <td className="text-right text-rose-600 font-medium">-{c.health.toFixed(2)} DH</td>
                                                    <td className="text-right text-rose-600 font-medium">-{c.autre.toFixed(2)} DH</td>
                                                    <td className="text-right text-rose-600 font-bold">-{c.total.toFixed(2)} DH</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {milkConsumedArray.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 mb-3">{t('cheptel_details.financial_archive_modal.consumed_milk_title')}</h4>
                                        <table className="table-premium">
                                            <thead>
                                                <tr>
                                                    <th>{t('cheptel_details.table.month')}</th>
                                                    <th className="text-right">{t('cheptel_details.financial_archive_modal.total_quantity')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {milkConsumedArray.map((m, i) => (
                                                    <tr key={i}>
                                                        <td>{m.month}</td>
                                                        <td className="text-right text-blue-600 font-semibold">{m.total.toFixed(2)} L</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {vache.sexe !== 'male' && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 mb-3">{t('cheptel_details.financial_archive_modal.productions_title')}</h4>
                                        <table className="table-premium">
                                            <thead>
                                                <tr>
                                                    <th>{t('cheptel_details.table.month')}</th>
                                                    <th className="text-right">{t('cheptel_details.financial_archive_modal.total_quantity')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prodsArray.map((p, i) => (
                                                    <tr key={i}>
                                                        <td>{p.month}</td>
                                                        <td className="text-right text-forest font-semibold">{p.total.toFixed(2)} L</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                );
            })()}

            {showHealthModal && createPortal(
                <div className="modal-overlay">
                    <div className="modal-panel max-w-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold font-display">{t('cheptel_details.health_archive_modal.title')}</h3>
                            <button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>{t('cheptel_details.health_archive_modal.status')}</th>
                                        <th>{t('cheptel_details.health_archive_modal.start')}</th>
                                        <th>{t('cheptel_details.health_archive_modal.end')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vache.health_statuses.map(h => (
                                        <tr key={h.id}>
                                            <td>
                                                {h.type === 'sickness' ? t('cheptel_details.health_types.sickness') : h.type === 'pregnancy' ? t('cheptel_details.health_types.pregnancy') : t('cheptel_details.health_types.routine')}
                                            </td>
                                            <td>{h.date_debut}</td>
                                            <td>{h.date_fin || t('cheptel_details.health_archive_modal.ongoing')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AppLayout>
    );
}