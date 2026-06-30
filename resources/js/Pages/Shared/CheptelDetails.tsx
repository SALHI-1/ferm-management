import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { X, Heart, DollarSign, Baby, Edit2 } from 'lucide-react';

interface Client { id: number; user: { nom: string; prenom: string; }; pivot: { part_possedee: number; }; }
interface Cost { id: number; type: string; price: number; date_facture: string; }
interface Production { id: number; quantite_litres: number; periode_mois: string; }
interface HealthStatus { id: number; type: string; date_debut: string; date_fin: string | null; }
interface Vache { id: number; numero_ticket: string; image: string | null; fichier_documents: string | null; statut_sante: string; statut_vente: string; sexe: 'male' | 'female'; origine: string; date_naissance: string | null; age: number | null; clients: Client[]; costs: Cost[]; productions: Production[]; health_statuses: HealthStatus[]; enfants: Vache[]; prix_vente?: number; date_vente?: string; }
interface Props { vache: Vache; canEdit: boolean; coordonneesEspace: 'admin' | 'manager'; }

export default function CheptelDetails({ vache, canEdit, coordonneesEspace }: Props) {
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showFinancialModal, setShowFinancialModal] = useState(false);
    const [showAddChildModal, setShowAddChildModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const isSold = vache.statut_vente === 'vendue';

    const { data: finData, setData: setFinData, post: postFin, processing: finProcessing, reset: resetFin, errors: finErrors } = useForm({ annee: new Date().getFullYear(), mois: new Date().getMonth() + 1, price: '', type: 'food' });
    const { data: healthData, setData: setHealthData, post: postHealth, processing: healthProcessing, reset: resetHealth, errors: healthErrors } = useForm({ type: 'sickness', date_debut: new Date().toISOString().split('T')[0], date_fin: '' });
    const { data: childData, setData: setChildData, post: postChild, processing: childProcessing, reset: resetChild, errors: childErrors } = useForm({ numero_ticket: '', sexe: 'female', origine: 'ne_sur_ferme', date_naissance: '', date_entree: new Date().toISOString().split('T')[0], mother_id: vache.id, image: null as File | null });
    const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing, errors: editErrors, clearErrors: clearEditErrors } = useForm({ numero_ticket: vache.numero_ticket, sexe: vache.sexe, date_naissance: vache.date_naissance ? vache.date_naissance.substring(0, 10) : '', image: null as File | null, fichier_documents: null as File | null });
    const { data: statusData, setData: setStatusData, put: putStatus, processing: statusProcessing } = useForm({ statut_sante: vache.statut_sante });
    const { data: sellData, setData: setSellData, put: putSell, processing: sellProcessing, errors: sellErrors } = useForm({ statut_vente: 'vendue', prix_vente: vache.prix_vente || '', date_vente: vache.date_vente || new Date().toISOString().split('T')[0] });

    const handleFinancialSubmit = (e: React.FormEvent) => { e.preventDefault(); postFin(`/${coordonneesEspace}/cheptel/${vache.id}/financial`, { onSuccess: () => resetFin('price') }); };
    const handleHealthSubmit = (e: React.FormEvent) => { e.preventDefault(); postHealth(`/${coordonneesEspace}/cheptel/${vache.id}/health`, { onSuccess: () => resetHealth('date_fin') }); };
    const handleChildSubmit = (e: React.FormEvent) => { e.preventDefault(); postChild(`/${coordonneesEspace}/cheptel`, { onSuccess: () => { setShowAddChildModal(false); resetChild('numero_ticket', 'date_naissance'); } }); };
    const handleEditSubmit = (e: React.FormEvent) => { e.preventDefault(); postEdit(`/${coordonneesEspace}/cheptel/${vache.id}`, { onSuccess: () => setShowEditModal(false) }); };
    const handleStatusSubmit = (e: React.FormEvent) => { e.preventDefault(); putStatus(`/${coordonneesEspace}/cheptel/${vache.id}/sante`, { onSuccess: () => setShowChangeStatusModal(false) }); };
    const handleSellSubmit = (e: React.FormEvent) => { e.preventDefault(); putSell(`/${coordonneesEspace}/cheptel/${vache.id}/vente`, { onSuccess: () => setShowSellModal(false) }); };
    const toggleVente = () => { if (isSold) { if (confirm(`Marquer comme non vendu ?`)) router.put(`/${coordonneesEspace}/cheptel/${vache.id}/vente`, { statut_vente: 'non_vendue' }); } else { setShowSellModal(true); } };

    const healthBadge = (s: string) => { if (s === 'healthy') return <span className="badge-success">En bonne santé</span>; if (s === 'pregnancy') return <span className="badge-info">Gestation</span>; return <span className="badge-danger">Malade</span>; };

    return (
        <AppLayout title={`Détails du bovin ${vache.numero_ticket}`}>
            <Head title={`Bovin ${vache.numero_ticket}`} />
            <div className="space-y-6">
                {/* Header */}
                <div className="card-premium flex flex-col md:flex-row items-start gap-6">
                    <div className="w-28 h-28 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {vache.image ? <img src={vache.image} alt={vache.numero_ticket} className="w-full h-full object-cover" /> : <span className="text-slate-400 text-sm">Pas de photo</span>}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-800 font-display flex items-center gap-3 mb-2">
                                    Ticket: {vache.numero_ticket}
                                    {isSold && <span className="badge-danger">VENDUE</span>}
                                </h1>
                                {isSold && vache.prix_vente && (
                                    <div className="mb-2 text-sm text-slate-600 font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                        Vendu à {vache.prix_vente} DH le {new Date(vache.date_vente!).toLocaleDateString('fr-FR')}
                                    </div>
                                )}
                                <div className="space-y-2 mb-3">{healthBadge(vache.statut_sante)}
                                    {vache.date_naissance && <p className="text-slate-500 text-sm"><strong>Née le :</strong> {new Date(vache.date_naissance).toLocaleDateString('fr-FR')}{vache.age !== null ? ` (${vache.age} ans)` : ''}</p>}
                                    <p className="text-slate-500 text-sm"><strong>Origine :</strong> {vache.origine === 'ne_sur_ferme' ? 'Née à la ferme' : 'Achetée'}</p>
                                    {vache.fichier_documents && (
                                        <p className="text-slate-500 text-sm mt-2">
                                            <strong>Fichier :</strong>{' '}
                                            <a href={vache.fichier_documents} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 underline">Voir le document</a>
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-600 mb-1">Propriétaire(s) :</h3>
                                    {vache.clients.length > 0 ? <ul className="text-sm text-slate-600 space-y-0.5">{vache.clients.map(c => <li key={c.id}>• {c.user?.nom} {c.user?.prenom} ({(c.pivot.part_possedee * 100).toFixed(0)}%)</li>)}</ul> : <p className="text-slate-400 text-sm">Appartient à la ferme</p>}
                                </div>
                            </div>
                            {canEdit && (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => {
                                        setEditData({
                                            numero_ticket: vache.numero_ticket,
                                            sexe: vache.sexe,
                                            date_naissance: vache.date_naissance ? vache.date_naissance.substring(0, 10) : '',
                                            image: null,
                                            fichier_documents: null
                                        });
                                        clearEditErrors();
                                        setShowEditModal(true);
                                    }} className="btn-premium-secondary text-xs flex items-center justify-center gap-1.5"><Edit2 className="h-3.5 w-3.5" /> Modifier infos</button>
                                    <button onClick={() => setShowChangeStatusModal(true)} className="btn-premium-secondary text-xs flex items-center justify-center gap-1.5"><Heart className="h-3.5 w-3.5" /> Changer statut santé</button>
                                    <button onClick={toggleVente} className={`btn-premium-secondary text-xs ${isSold ? '' : '!text-red-500 !border-red-200 hover:!bg-red-50'}`}>{isSold ? 'Annuler la vente' : 'Marquer comme vendue'}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Financial */}
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><DollarSign className="h-5 w-5 text-brand-500" /> Finances</h2>
                            <button onClick={() => setShowFinancialModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">Archive →</button>
                        </div>
                        {canEdit && !isSold ? (
                            <form onSubmit={handleFinancialSubmit} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3"><div><label className="label-premium">Année</label><input type="number" value={finData.annee} onChange={e => setFinData('annee', parseInt(e.target.value))} className="input-premium" required /></div><div><label className="label-premium">Mois</label><input type="number" min="1" max="12" value={finData.mois} onChange={e => setFinData('mois', parseInt(e.target.value))} className="input-premium" required /></div></div>
                                <div><label className="label-premium">Type</label><select value={finData.type} onChange={e => setFinData('type', e.target.value)} className="select-premium"><option value="food">Nourriture</option><option value="veterinaire">Vétérinaire</option>{vache.sexe !== 'male' && <option value="gain">Production lait (L)</option>}<option value="lait_consomme">Lait consommé (L)</option></select></div>
                                <div><label className="label-premium">{finData.type === 'gain' || finData.type === 'lait_consomme' ? 'Quantité (L)' : 'Montant (DH)'}</label><input type="number" step="0.01" value={finData.price} onChange={e => setFinData('price', e.target.value)} className="input-premium" required /></div>
                                <button type="submit" disabled={finProcessing} className="btn-premium w-full">Enregistrer</button>
                            </form>
                        ) : <p className="text-slate-400 italic text-sm">{isSold ? 'Actions désactivées (animal vendu).' : 'Droits insuffisants.'}</p>}
                    </div>
                    {/* Health */}
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500" /> Santé</h2>
                            <button onClick={() => setShowHealthModal(true)} className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">Archive →</button>
                        </div>
                        {canEdit && !isSold ? (
                            <form onSubmit={handleHealthSubmit} className="space-y-3">
                                <div><label className="label-premium">Statut</label><select value={healthData.type} onChange={e => setHealthData('type', e.target.value)} className="select-premium"><option value="sickness">Maladie</option>{vache.sexe !== 'male' && <option value="pregnancy">Gestation</option>}</select></div>
                                <div><label className="label-premium">Date début</label><input type="date" value={healthData.date_debut} onChange={e => setHealthData('date_debut', e.target.value)} className="input-premium" required /></div>
                                <div><label className="label-premium">Date fin (optionnel)</label><input type="date" value={healthData.date_fin} onChange={e => setHealthData('date_fin', e.target.value)} className="input-premium" /></div>
                                <button type="submit" disabled={healthProcessing} className="btn-premium w-full">Enregistrer</button>
                            </form>
                        ) : <p className="text-slate-400 italic text-sm">{isSold ? 'Actions désactivées (animal vendu).' : 'Droits insuffisants.'}</p>}
                    </div>
                </div>

                {/* Lineage */}
                {vache.sexe !== 'male' && (
                    <div className="card-premium">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2"><Baby className="h-5 w-5 text-brand-500" /> Descendance ({vache.enfants.length})</h2>
                            {canEdit && !isSold && <button onClick={() => setShowAddChildModal(true)} className="btn-premium text-xs flex items-center gap-1.5">+ Descendance</button>}
                        </div>
                        {vache.enfants.length > 0 ? (
                            <div className="space-y-2">{vache.enfants.map(e => <a key={e.id} href={`/${coordonneesEspace}/cheptel/${e.id}`} className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-brand-600 font-semibold text-sm transition-colors">{e.numero_ticket}</a>)}</div>
                        ) : <p className="text-slate-400 italic text-sm">Aucune descendance enregistrée.</p>}
                    </div>
                )}
            </div>

            {/* Financial Modal */}
            {showFinancialModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-2xl max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Archive Financière</h3><button onClick={() => setShowFinancialModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-6"><div><h4 className="text-sm font-bold text-slate-700 mb-3">Coûts</h4><table className="table-premium"><thead><tr><th>Date</th><th>Type</th><th>Montant / Quantité</th></tr></thead><tbody>{vache.costs.map(c => <tr key={c.id}><td>{c.date_facture}</td><td>{c.type === 'lait_consomme' ? 'Lait Consommé' : c.type}</td><td className={c.type === 'lait_consomme' ? 'text-blue-600 font-semibold' : ''}>{c.price} {c.type === 'lait_consomme' ? 'L' : 'DH'}</td></tr>)}</tbody></table></div><div><h4 className="text-sm font-bold text-slate-700 mb-3">Productions</h4><table className="table-premium"><thead><tr><th>Période</th><th>Quantité</th></tr></thead><tbody>{vache.productions.map(p => <tr key={p.id}><td>{p.periode_mois}</td><td>{p.quantite_litres} L</td></tr>)}</tbody></table></div></div></div></div>, document.body)}
            {/* Health Modal */}
            {showHealthModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-2xl max-h-[80vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Archive Santé</h3><button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><div className="p-6"><table className="table-premium"><thead><tr><th>Statut</th><th>Début</th><th>Fin</th></tr></thead><tbody>{vache.health_statuses.map(h => <tr key={h.id}><td>{h.type === 'sickness' ? 'Maladie' : h.type === 'pregnancy' ? 'Gestation' : 'Visite routine'}</td><td>{h.date_debut}</td><td>{h.date_fin || 'En cours'}</td></tr>)}</tbody></table></div></div></div>, document.body)}
            {/* Child Modal */}
            {showAddChildModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-md max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Ajouter une descendance</h3><button onClick={() => setShowAddChildModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><form onSubmit={handleChildSubmit} className="p-6 space-y-4"><div><label className="label-premium">Sexe</label><select value={childData.sexe} onChange={e => setChildData('sexe', e.target.value as 'male' | 'female')} className="select-premium"><option value="female">Femelle</option><option value="male">Mâle</option></select></div><div><label className="label-premium">Date naissance</label><input type="date" value={childData.date_naissance} onChange={e => setChildData('date_naissance', e.target.value)} className="input-premium" required /></div><div><label className="label-premium">Date d'entrée</label><input type="date" value={childData.date_entree} onChange={e => setChildData('date_entree', e.target.value)} className="input-premium" required /></div><div><label className="label-premium">Photo (optionnel)</label><div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setChildData('image', e.dataTransfer.files[0]) }} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1" onClick={() => document.getElementById('image-upload-child')?.click()}><input type="file" id="image-upload-child" className="hidden" accept="image/*" onChange={e => setChildData('image', e.target.files ? e.target.files[0] : null)} /><p className="text-sm text-slate-500 font-medium">{childData.image ? childData.image.name : 'Glissez-déposez une image ou cliquez ici'}</p></div>{childErrors.image && <p className="text-rose-500 text-xs mt-1">{childErrors.image}</p>}</div><div className="pt-4 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={() => setShowAddChildModal(false)} className="btn-premium-secondary">Annuler</button><button type="submit" disabled={childProcessing} className="btn-premium">Ajouter</button></div></form></div></div>, document.body)}
            {/* Edit Modal */}
            {showEditModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-md max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Modifier les informations</h3><button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><form onSubmit={handleEditSubmit} className="p-6 space-y-4"><div><label className="label-premium">Numéro de boucle</label><input type="text" value={editData.numero_ticket} onChange={e => setEditData('numero_ticket', e.target.value)} className="input-premium" required />{editErrors.numero_ticket && <p className="text-rose-500 text-xs mt-1">{editErrors.numero_ticket}</p>}</div><div><label className="label-premium">Sexe</label><select value={editData.sexe} onChange={e => setEditData('sexe', e.target.value as 'male' | 'female')} className="select-premium"><option value="female">Femelle</option><option value="male">Mâle</option></select></div><div><label className="label-premium">Date naissance</label><input type="date" value={editData.date_naissance} onChange={e => setEditData('date_naissance', e.target.value)} className="input-premium" required /></div><div><label className="label-premium">Photo (optionnel)</label>{vache.image && !editData.image && (<div className="mb-2"><p className="text-xs text-slate-500 mb-1">Image actuelle :</p><img src={vache.image} alt="Actuelle" className="h-16 w-16 object-cover rounded-lg border border-slate-200" /></div>)}<div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setEditData('image', e.dataTransfer.files[0]) }} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1" onClick={() => document.getElementById('image-upload-edit')?.click()}><input type="file" id="image-upload-edit" className="hidden" accept="image/*" onChange={e => setEditData('image', e.target.files ? e.target.files[0] : null)} /><p className="text-sm text-slate-500 font-medium">{editData.image ? editData.image.name : 'Glissez-déposez une image ou cliquez ici pour remplacer'}</p></div>{editErrors.image && <p className="text-rose-500 text-xs mt-1">{editErrors.image}</p>}</div><div><label className="label-premium">Fichier Animal (optionnel)</label>{vache.fichier_documents && !editData.fichier_documents && (<div className="mb-2"><p className="text-xs text-slate-500 mb-1">Fichier actuel :</p><a href={vache.fichier_documents} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 underline text-sm block truncate w-full">Voir le fichier actuel</a></div>)}<div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setEditData('fichier_documents', e.dataTransfer.files[0]) }} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1" onClick={() => document.getElementById('fichier-upload-edit')?.click()}><input type="file" id="fichier-upload-edit" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setEditData('fichier_documents', e.target.files ? e.target.files[0] : null)} /><p className="text-sm text-slate-500 font-medium">{editData.fichier_documents ? editData.fichier_documents.name : 'Glissez-déposez un fichier ou cliquez ici pour remplacer'}</p></div>{editErrors.fichier_documents && <p className="text-rose-500 text-xs mt-1">{editErrors.fichier_documents}</p>}</div><div className="pt-4 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={() => setShowEditModal(false)} className="btn-premium-secondary">Annuler</button><button type="submit" disabled={editProcessing} className="btn-premium">Mettre à jour</button></div></form></div></div>, document.body)}
            {/* Status Modal */}
            {showChangeStatusModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-md max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Changer le statut de santé</h3><button onClick={() => setShowChangeStatusModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><form onSubmit={handleStatusSubmit} className="p-6 space-y-4"><div><label className="label-premium">Statut</label><select value={statusData.statut_sante} onChange={e => setStatusData('statut_sante', e.target.value)} className="select-premium"><option value="healthy">En bonne santé</option><option value="sickness">Malade</option>{vache.sexe !== 'male' && <option value="pregnancy">Gestation</option>}</select></div><div className="pt-4 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={() => setShowChangeStatusModal(false)} className="btn-premium-secondary">Annuler</button><button type="submit" disabled={statusProcessing} className="btn-premium">Mettre à jour</button></div></form></div></div>, document.body)}
            {/* Sell Modal */}
            {showSellModal && createPortal(<div className="modal-overlay"><div className="modal-panel max-w-md max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center p-6 border-b border-slate-100"><h3 className="text-lg font-bold font-display">Vendre l'animal</h3><button onClick={() => setShowSellModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button></div><form onSubmit={handleSellSubmit} className="p-6 space-y-4"><div><label className="label-premium">Prix de vente (DH)</label><input type="number" step="0.01" min="0" value={sellData.prix_vente} onChange={e => setSellData('prix_vente', e.target.value)} className="input-premium" required />{sellErrors.prix_vente && <p className="text-rose-500 text-xs mt-1">{sellErrors.prix_vente}</p>}</div><div><label className="label-premium">Date de vente</label><input type="date" value={sellData.date_vente} onChange={e => setSellData('date_vente', e.target.value)} className="input-premium" required />{sellErrors.date_vente && <p className="text-rose-500 text-xs mt-1">{sellErrors.date_vente}</p>}</div><div className="pt-4 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={() => setShowSellModal(false)} className="btn-premium-secondary">Annuler</button><button type="submit" disabled={sellProcessing} className="btn-premium !bg-emerald-600 hover:!bg-emerald-700">Confirmer la vente</button></div></form></div></div>, document.body)}
        </AppLayout>
    );
}
