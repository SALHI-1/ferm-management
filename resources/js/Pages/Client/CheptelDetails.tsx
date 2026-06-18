import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { X, Heart, DollarSign, Baby, TrendingUp } from 'lucide-react';

interface Client { id: number; user: { nom: string; prenom: string; }; pivot: { part_possedee: number; }; }
interface Cost { id: number; type: string; price: number; date_facture: string; }
interface Production { id: number; quantite_litres: number; periode_mois: string; }
interface HealthStatus { id: number; type: string; date_debut: string; date_fin: string | null; }
interface Vache { id: number; numero_ticket: string; image: string | null; statut_sante: string; statut_vente: string; sexe: 'male' | 'female'; origine: string; date_naissance: string | null; age: number | null; clients: Client[]; costs: Cost[]; productions: Production[]; health_statuses: HealthStatus[]; enfants: Vache[]; pivot?: { part_possedee: number; }; prix_vente?: number; date_vente?: string; }
interface Props { vache: Vache; }

export default function CheptelDetails({ vache }: Props) {
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showFinancialModal, setShowFinancialModal] = useState(false);
    const isSold = vache.statut_vente === 'vendue';
    const partPossedee = vache.pivot?.part_possedee || 0;

    const months = new Set<string>();
    vache.costs.forEach(c => months.add(c.date_facture.substring(0, 7)));
    vache.productions.forEach(p => months.add(p.periode_mois.substring(0, 7)));
    const monthlyStats = Array.from(months).sort((a, b) => b.localeCompare(a)).map(month => {
        const costs = vache.costs.filter(c => c.date_facture.startsWith(month)).reduce((s, c) => s + parseFloat(c.price.toString()), 0);
        const production = vache.productions.filter(p => p.periode_mois.startsWith(month)).reduce((s, p) => s + parseFloat(p.quantite_litres.toString()), 0);
        return { month, costs, production };
    });

    const healthBadge = (s: string) => { if (s === 'healthy') return <span className="badge-success">En bonne santé</span>; if (s === 'pregnancy') return <span className="badge-info">Gestation</span>; return <span className="badge-danger">Malade</span>; };

    return (
        <AppLayout title={`Détails du bovin ${vache.numero_ticket}`}>
            <Head title={`Bovin ${vache.numero_ticket}`} />
            <div className="space-y-8">
                {/* Header */}
                <div className="card-premium flex flex-col md:flex-row items-start gap-6">
                    <div className="w-28 h-28 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vache.image ? <img src={vache.image} alt={vache.numero_ticket} className="w-full h-full object-cover" /> : <span className="text-slate-400 text-sm">Pas de photo</span>}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800 font-display flex items-center gap-3 mb-2">
                            Ticket: {vache.numero_ticket}
                            {isSold && <span className="badge-danger">VENDUE</span>}
                        </h1>
                        {isSold && vache.prix_vente && (
                            <div className="mb-2 text-sm text-slate-600 font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                Vendu à {vache.prix_vente} DH le {new Date(vache.date_vente).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                        <div className="space-y-2 mb-3">{healthBadge(vache.statut_sante)}
                            {vache.date_naissance && <p className="text-slate-500 text-sm"><strong>Née le :</strong> {new Date(vache.date_naissance).toLocaleDateString('fr-FR')}{vache.age !== null ? ` (${vache.age} ans)` : ''}</p>}
                            <p className="text-slate-500 text-sm"><strong>Origine :</strong> {vache.origine === 'ne_sur_ferme' ? 'Née à la ferme' : 'Achetée'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 mb-1">Propriétaire(s) :</h3>
                            {vache.clients.length > 0 ? <ul className="text-sm text-slate-600 space-y-0.5">{vache.clients.map(c => <li key={c.id}>• {c.user?.nom} {c.user?.prenom} ({(c.pivot.part_possedee * 100).toFixed(0)}%)</li>)}</ul> : <p className="text-slate-400 text-sm">Appartient à la ferme</p>}
                        </div>
                    </div>
                </div>

                {/* Monthly Benefits */}
                {vache.sexe !== 'male' && (
                    <div className="card-premium">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-500" /> Rentabilité Mensuelle</h2>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600">Prix du litre :</span>
                                <span className="text-sm font-bold text-brand-600">4 DH/L</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">Bénéfices nets estimés : <strong>(Production × 4 DH) - Coûts</strong>. Après 50% pour la ferme, votre part nette est de <strong>{((partPossedee * 0.5) * 100).toFixed(0)}%</strong> des bénéfices.</p>
                        <div className="overflow-x-auto">
                            <table className="table-premium">
                                <thead><tr><th>Mois</th><th className="text-right">Production</th><th className="text-right">Revenu Brut</th><th className="text-right">Coûts</th><th className="text-right">Bénéfice Net</th><th className="text-right">Votre Part</th></tr></thead>
                                <tbody>
                                    {monthlyStats.length > 0 ? monthlyStats.map(stat => {
                                        const rev = stat.production * 4; const ben = rev - stat.costs; const part = ben > 0 ? ben * 0.5 * partPossedee : ben * partPossedee;
                                        return (<tr key={stat.month}><td className="font-medium text-slate-700">{new Date(stat.month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td><td className="text-right text-slate-600">{stat.production} L</td><td className="text-right text-emerald-600">+{rev.toFixed(2)} DH</td><td className="text-right text-rose-600">-{stat.costs.toFixed(2)} DH</td><td className={`text-right font-semibold ${ben >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{ben > 0 ? '+' : ''}{ben.toFixed(2)} DH</td><td className={`text-right font-bold ${part >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{part > 0 ? '+' : ''}{part.toFixed(2)} DH</td></tr>);
                                    }) : <tr><td colSpan={6} className="text-center text-slate-400 py-8">Aucune donnée disponible.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><DollarSign className="h-5 w-5 text-brand-500" /> Frais</h2>
                            <button onClick={() => setShowFinancialModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">Archive →</button>
                        </div>
                    </div>
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500" /> Santé</h2>
                            <button onClick={() => setShowHealthModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">Archive →</button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-600 mb-2">Derniers Événements</h3>
                            {vache.health_statuses.length > 0 ? <ul className="text-sm space-y-2">{vache.health_statuses.slice(0, 4).map(h => <li key={h.id} className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-700">{h.type === 'sickness' ? 'Maladie' : h.type === 'pregnancy' ? 'Gestation' : 'Visite routine'}</span><span className="text-slate-400 text-xs">{h.date_debut}</span></li>)}</ul> : <p className="text-xs text-slate-400">Aucun événement enregistré</p>}
                        </div>
                    </div>
                </div>

                {vache.sexe !== 'male' && (
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><Baby className="h-5 w-5 text-brand-500" /> Descendance ({vache.enfants.length})</h2>
                        </div>
                        {vache.enfants.length > 0 ? <div className="space-y-2">{vache.enfants.map(e => <a key={e.id} href={`/investisseur/cheptel/${e.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-600 font-semibold text-sm transition-colors">{e.numero_ticket}</a>)}</div> : <p className="text-slate-400 italic text-sm">Aucune descendance.</p>}
                    </div>
                )}
            </div>

            {showFinancialModal && (() => {
                // Grouping costs by month
                const groupedCosts = vache.costs.reduce((acc, curr) => {
                    const month = curr.date_facture.substring(0, 7); // YYYY-MM
                    if (!acc[month]) acc[month] = { month, total: 0 };
                    acc[month].total += Number(curr.price);
                    return acc;
                }, {} as Record<string, { month: string, total: number }>);
                const costsArray = Object.values(groupedCosts).sort((a, b) => b.month.localeCompare(a.month));

                // Grouping productions by month
                const groupedProds = vache.productions.reduce((acc, curr) => {
                    const month = curr.periode_mois.substring(0, 7); // YYYY-MM
                    if (!acc[month]) acc[month] = { month, total: 0 };
                    acc[month].total += Number(curr.quantite_litres);
                    return acc;
                }, {} as Record<string, { month: string, total: number }>);
                const prodsArray = Object.values(groupedProds).sort((a, b) => b.month.localeCompare(a.month));

                return createPortal(
                    <div className="modal-overlay"><div className="modal-panel max-w-2xl max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Archive Financière</h3><button onClick={() => setShowFinancialModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-6"><div><h4 className="text-sm font-bold text-slate-700 mb-3">Coûts</h4><table className="table-premium"><thead><tr><th>Mois</th><th>Montant Total</th></tr></thead><tbody>{costsArray.map((c, i) => <tr key={i}><td>{c.month}</td><td className="text-rose-600 font-semibold">-{c.total.toFixed(2)} DH</td></tr>)}</tbody></table></div>{vache.sexe !== 'male' && <div><h4 className="text-sm font-bold text-slate-700 mb-3">Productions</h4><table className="table-premium"><thead><tr><th>Mois</th><th>Quantité Totale</th></tr></thead><tbody>{prodsArray.map((p, i) => <tr key={i}><td>{p.month}</td><td className="text-emerald-600 font-semibold">{p.total.toFixed(2)} L</td></tr>)}</tbody></table></div>}</div></div></div>,
                    document.body
                );
            })()}
            {showHealthModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-2xl max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Archive Santé</h3><button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><div className="p-6"><table className="table-premium"><thead><tr><th>Statut</th><th>Début</th><th>Fin</th></tr></thead><tbody>{vache.health_statuses.map(h => <tr key={h.id}><td>{h.type === 'sickness' ? 'Maladie' : h.type === 'pregnancy' ? 'Gestation' : 'Visite routine'}</td><td>{h.date_debut}</td><td>{h.date_fin || 'En cours'}</td></tr>)}</tbody></table></div></div></div>, document.body)}
        </AppLayout>
    );
}
