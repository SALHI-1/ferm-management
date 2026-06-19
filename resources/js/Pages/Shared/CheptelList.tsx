import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { Plus, Eye, Scale, FileDown, X } from 'lucide-react';

interface Client { id: number; user: { nom: string; prenom: string; }; }
interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string; statut_vente: string; origine: string }>;
    coordonneesEspace: 'admin' | 'manager';
    canEdit?: boolean;
    clientsDisponibles: Client[];
}

export default function CheptelList({ vaches, coordonneesEspace, canEdit, clientsDisponibles }: Props) {
    const [showAddModal, setShowAddModal] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        numero_ticket: '', sexe: 'female', origine: 'achete', date_naissance: '',
        date_entree: new Date().toISOString().split('T')[0], mother_id: '',
        type_investissement: 'complet', client_1_id: '', client_2_id: '',
        image: null as File | null, fichier_documents: null as File | null
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${coordonneesEspace}/cheptel`, { onSuccess: () => { setShowAddModal(false); reset(); } });
    };

    const healthBadge = (s: string) => {
        if (s === 'healthy') return <span className="badge-success">En bonne santé</span>;
        if (s === 'pregnancy') return <span className="badge-info">Gestation</span>;
        return <span className="badge-danger">Malade</span>;
    };

    return (
        <AppLayout title="Gestion du Cheptel (Espace Partagé)">
            <Head title="Liste des Bovins" />
            <div className="card-premium">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 font-display">Suivi des Animaux</h2>
                    <div className="flex flex-wrap gap-2">
                        {canEdit && <button onClick={() => setShowAddModal(true)} className="btn-premium flex items-center gap-2 text-xs"><Plus className="h-4 w-4" /> Ajouter</button>}
                        {/* {coordonneesEspace === 'manager' && <button className="btn-premium-secondary flex items-center gap-2 text-xs"><Scale className="h-4 w-4" /> Peser</button>} */}
                        {/* {coordonneesEspace === 'admin' && <button className="btn-premium-secondary flex items-center gap-2 text-xs"><FileDown className="h-4 w-4" /> Exporter</button>} */}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-premium">
                        <thead><tr><th>Numéro Boucle</th><th>Origine</th><th>Poids (kg)</th><th>Statut Santé</th><th>Vente</th><th className="text-right">Actions</th></tr></thead>
                        <tbody>
                            {vaches.map(v => (
                                <tr key={v.id}>
                                    <td className="font-semibold text-slate-800">{v.numero_ticket}</td>
                                    <td className="text-slate-600 font-medium">{v.origine === 'ne_sur_ferme' ? 'Née à la ferme' : 'Achetée'}</td>
                                    <td className="text-slate-600">{v.poids || 'N/A'} kg</td>
                                    <td>{healthBadge(v.statut_sante)}</td>
                                    <td>{v.statut_vente === 'vendue' ? <span className="badge-danger">Vendue</span> : <span className="text-slate-400 text-xs font-medium uppercase">Au cheptel</span>}</td>
                                    <td className="text-right"><a href={`/${coordonneesEspace}/cheptel/${v.id}`} className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-800 transition-colors text-sm"><Eye className="h-4 w-4" /> Détails</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && createPortal(
                <div className="modal-overlay">
                    <div className="modal-panel max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 font-display">Ajouter une nouvelle bête</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div><label className="label-premium">Numéro de boucle</label><input type="text" value={data.numero_ticket} onChange={e => setData('numero_ticket', e.target.value)} className="input-premium" required />{errors.numero_ticket && <p className="text-rose-500 text-xs mt-1">{errors.numero_ticket}</p>}</div>
                            <div><label className="label-premium">Sexe</label><select value={data.sexe} onChange={e => setData('sexe', e.target.value)} className="select-premium"><option value="female">Femelle</option><option value="male">Mâle</option></select></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label-premium">Date de naissance</label><input type="date" value={data.date_naissance} onChange={e => setData('date_naissance', e.target.value)} className="input-premium" required /></div>
                                <div><label className="label-premium">Date d'entrée</label><input type="date" value={data.date_entree} onChange={e => setData('date_entree', e.target.value)} className="input-premium" required /></div>
                            </div>
                            <div>
                                <label className="label-premium">Photo (optionnel)</label>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setData('image', e.dataTransfer.files[0]) }}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1"
                                    onClick={() => document.getElementById('image-upload-add')?.click()}
                                >
                                    <input type="file" id="image-upload-add" className="hidden" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {data.image ? data.image.name : 'Glissez-déposez une image ou cliquez ici'}
                                    </p>
                                </div>
                                {errors.image && <p className="text-rose-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                            <div>
                                <label className="label-premium">Fichier Animal (optionnel)</label>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setData('fichier_documents', e.dataTransfer.files[0]) }}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1"
                                    onClick={() => document.getElementById('fichier-upload-add')?.click()}
                                >
                                    <input type="file" id="fichier-upload-add" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setData('fichier_documents', e.target.files ? e.target.files[0] : null)} />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {data.fichier_documents ? data.fichier_documents.name : 'Glissez-déposez un fichier ou cliquez ici'}
                                    </p>
                                </div>
                                {errors.fichier_documents && <p className="text-rose-500 text-xs mt-1">{errors.fichier_documents}</p>}
                            </div>
                            <div className="border-t border-slate-100 pt-4"><label className="label-premium">Type de Propriété</label><select value={data.type_investissement} onChange={e => setData('type_investissement', e.target.value)} className="select-premium"><option value="complet">Complet (1)</option><option value="demi">Demi (0.5)</option></select></div>
                            <div><label className="label-premium">Propriétaire 1</label><select value={data.client_1_id} onChange={e => setData('client_1_id', e.target.value)} className="select-premium" required><option value="">-- Choisir --</option>{clientsDisponibles?.map(c => <option key={c.id} value={c.id}>{c.user?.nom} {c.user?.prenom}</option>)}</select></div>
                            {data.type_investissement === 'demi' && <div><label className="label-premium">Propriétaire 2</label><select value={data.client_2_id} onChange={e => setData('client_2_id', e.target.value)} className="select-premium" required><option value="">-- Choisir --</option>{clientsDisponibles?.map(c => <option key={c.id} value={c.id}>{c.user?.nom} {c.user?.prenom}</option>)}</select></div>}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100"><button type="button" onClick={() => setShowAddModal(false)} className="btn-premium-secondary">Annuler</button><button type="submit" disabled={processing} className="btn-premium">Ajouter</button></div>
                        </form>
                    </div>
                </div>, document.body
            )}
        </AppLayout>
    );
}