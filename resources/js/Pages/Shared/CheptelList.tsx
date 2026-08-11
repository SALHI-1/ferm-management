import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import imageCompression from 'browser-image-compression';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { Plus, Eye, Scale, FileDown, X } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

interface Client { id: number; is_ferme?: boolean; user: { nom: string; prenom: string; }; }
interface Props {
    vaches: Array<{ id: number; numero_ticket: string; poids: number; statut_sante: string; statut_vente: string; origine: string }>;
    coordonneesEspace: 'admin' | 'manager';
    canEdit?: boolean;
    clientsDisponibles: Client[];
}

export default function CheptelList({ vaches, coordonneesEspace, canEdit, clientsDisponibles }: Props) {
    const { t } = useTrans();
    const [showAddModal, setShowAddModal] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        numero_ticket: '', sexe: 'female', origine: 'achete', date_naissance: '',
        date_entree: new Date().toISOString().split('T')[0], mother_id: '',
        type_investissement: 'complet', client_1_id: '', client_2_id: '',
        part_ferme_net: '0.5', prix_achat: '',
        image: null as File | null, fichier_documents: null as File | null
    });

    const isFarmSelected = () => {
        const client1 = clientsDisponibles?.find(c => c.id.toString() === data.client_1_id);
        const client2 = clientsDisponibles?.find(c => c.id.toString() === data.client_2_id);
        return (client1?.is_ferme) || (client2?.is_ferme);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${coordonneesEspace}/cheptel`, { onSuccess: () => { setShowAddModal(false); reset(); } });
    };

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setData('image', null);
            return;
        }
        try {
            const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/jpeg' };
            const compressedFile = await imageCompression(file, options);
            setData('image', compressedFile as File);
        } catch (error) {
            console.error('Erreur de compression:', error);
            setData('image', file);
        }
    };

    const healthBadge = (s: string) => {
        if (s === 'healthy') return <span className="badge-success">{t('admin_cheptel_list.health_status.healthy')}</span>;
        if (s === 'pregnancy') return <span className="badge-info">{t('admin_cheptel_list.health_status.pregnancy')}</span>;
        return <span className="badge-danger">{t('admin_cheptel_list.health_status.sick')}</span>;
    };

    return (
        <AppLayout title={t('admin_cheptel_list.app_layout_title')}>
            <Head title={t('admin_cheptel_list.head_title')} />
            <div className="card-premium">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-forest font-display">{t('admin_cheptel_list.section_title')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {canEdit && (
                            <button onClick={() => setShowAddModal(true)} className="btn-premium flex items-center gap-2 text-xs">
                                <Plus className="h-4 w-4" /> {t('admin_cheptel_list.add_button')}
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-premium">
                        <thead>
                            <tr>
                                <th>{t('admin_cheptel_list.table.ear_tag_number')}</th>
                                <th>{t('admin_cheptel_list.table.origin')}</th>
                                <th>{t('admin_cheptel_list.table.weight')}</th>
                                <th>{t('admin_cheptel_list.table.health_status')}</th>
                                <th>{t('admin_cheptel_list.table.sale_status')}</th>
                                <th className="text-right">{t('admin_cheptel_list.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaches.map(v => (
                                <tr key={v.id}>
                                    <td className="font-semibold text-slate-800">{v.numero_ticket}</td>
                                    <td className="text-slate-600 font-medium">
                                        {v.origine === 'ne_sur_ferme' ? t('admin_cheptel_list.origin_types.farm') : t('admin_cheptel_list.origin_types.purchased')}
                                    </td>
                                    <td className="text-slate-600">{v.poids || t('admin_cheptel_list.not_available')} kg</td>
                                    <td>{healthBadge(v.statut_sante)}</td>
                                    <td>
                                        {v.statut_vente === 'vendue' ? (
                                            <span className="badge-danger">{t('admin_cheptel_list.sale_status.sold')}</span>
                                        ) : (
                                            <span className="text-slate-400 text-xs font-medium uppercase">{t('admin_cheptel_list.sale_status.in_herd')}</span>
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <a href={`/${coordonneesEspace}/cheptel/${v.id}`} className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-800 transition-colors text-sm">
                                            <Eye className="h-4 w-4" /> {t('admin_cheptel_list.view_details')}
                                        </a>
                                    </td>
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
                            <h3 className="text-lg font-bold text-forest font-display">{t('admin_cheptel_list.add_modal.title')}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.ear_tag')}</label>
                                <input type="text" value={data.numero_ticket} onChange={e => setData('numero_ticket', e.target.value)} className="input-premium" required />
                                {errors.numero_ticket && <p className="text-rose-500 text-xs mt-1">{errors.numero_ticket}</p>}
                            </div>
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.sex')}</label>
                                <select value={data.sexe} onChange={e => setData('sexe', e.target.value)} className="select-premium">
                                    <option value="female">{t('admin_cheptel_list.add_modal.female')}</option>
                                    <option value="male">{t('admin_cheptel_list.add_modal.male')}</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label-premium">{t('admin_cheptel_list.add_modal.birth_date')}</label>
                                    <input type="date" value={data.date_naissance} onChange={e => setData('date_naissance', e.target.value)} className="input-premium" required />
                                </div>
                                <div>
                                    <label className="label-premium">{t('admin_cheptel_list.add_modal.entry_date')}</label>
                                    <input type="date" value={data.date_entree} onChange={e => setData('date_entree', e.target.value)} className="input-premium" required />
                                </div>
                            </div>
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.purchase_price')}</label>
                                <input type="number" step="0.01" min="0" value={data.prix_achat} onChange={e => setData('prix_achat', e.target.value)} className="input-premium" required />
                                {errors.prix_achat && <p className="text-rose-500 text-xs mt-1">{errors.prix_achat}</p>}
                            </div>
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.photo_optional')}</label>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageChange(e.dataTransfer.files[0]); }}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1"
                                    onClick={() => document.getElementById('image-upload-add')?.click()}
                                >
                                    <input type="file" id="image-upload-add" className="hidden" accept="image/*" onChange={e => handleImageChange(e.target.files ? e.target.files[0] : null)} />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {data.image ? data.image.name : t('admin_cheptel_list.add_modal.image_drag_drop')}
                                    </p>
                                </div>
                                {errors.image && <p className="text-rose-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.file_optional')}</label>
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files[0]) setData('fichier_documents', e.dataTransfer.files[0]) }}
                                    className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer mt-1"
                                    onClick={() => document.getElementById('fichier-upload-add')?.click()}
                                >
                                    <input type="file" id="fichier-upload-add" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e => setData('fichier_documents', e.target.files ? e.target.files[0] : null)} />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {data.fichier_documents ? data.fichier_documents.name : t('admin_cheptel_list.add_modal.file_drag_drop')}
                                    </p>
                                </div>
                                {errors.fichier_documents && <p className="text-rose-500 text-xs mt-1">{errors.fichier_documents}</p>}
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.ownership_type')}</label>
                                <select value={data.type_investissement} onChange={e => setData('type_investissement', e.target.value)} className="select-premium">
                                    <option value="complet">{t('admin_cheptel_list.add_modal.ownership_full')}</option>
                                    <option value="demi">{t('admin_cheptel_list.add_modal.ownership_half')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-premium">{t('admin_cheptel_list.add_modal.owner_1')}</label>
                                <select value={data.client_1_id} onChange={e => setData('client_1_id', e.target.value)} className="select-premium" required>
                                    <option value="">{t('admin_cheptel_list.add_modal.choose_owner')}</option>
                                    {clientsDisponibles?.map(c => <option key={c.id} value={c.id}>{c.user?.nom} {c.user?.prenom}</option>)}
                                </select>
                            </div>
                            {data.type_investissement === 'demi' && (
                                <div>
                                    <label className="label-premium">{t('admin_cheptel_list.add_modal.owner_2')}</label>
                                    <select value={data.client_2_id} onChange={e => setData('client_2_id', e.target.value)} className="select-premium" required>
                                        <option value="">{t('admin_cheptel_list.add_modal.choose_owner')}</option>
                                        {clientsDisponibles?.map(c => <option key={c.id} value={c.id}>{c.user?.nom} {c.user?.prenom}</option>)}
                                    </select>
                                </div>
                            )}
                            {!isFarmSelected() && (
                                <div className="border-t border-slate-100 pt-4">
                                    <label className="label-premium">Commission de la ferme sur le bénéfice Net (0.1 à 0.6)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0.1" 
                                        max="0.6" 
                                        value={data.part_ferme_net} 
                                        onChange={e => setData('part_ferme_net', e.target.value)} 
                                        className="input-premium" 
                                        required 
                                    />
                                    {errors.part_ferme_net && <p className="text-rose-500 text-xs mt-1">{errors.part_ferme_net}</p>}
                                </div>
                            )}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-premium-secondary">
                                    {t('admin_cheptel_list.add_modal.cancel')}
                                </button>
                                <button type="submit" disabled={processing} className="btn-premium">
                                    {t('admin_cheptel_list.add_modal.add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </AppLayout>
    );
}