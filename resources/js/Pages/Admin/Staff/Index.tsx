import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import AppLayout from '@/Layouts/AppLayout';
import { Shield, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

interface StaffUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    userable_type: string;
    userable: {
        id: number;
        role?: string;
    };
}

interface Props {
    staff: StaffUser[];
}

export default function StaffIndex({ staff }: Props) {
    const { t } = useTrans();
    const { auth } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        type: 'manager', // 'manager', 'admin', 'super_admin'
        password: '',
        password_confirmation: ''
    });

    const openModal = (member: StaffUser | null = null) => {
        clearErrors();
        if (member) {
            setEditingStaff(member);
            let userType = 'manager';
            if (member.userable_type === 'App\\Models\\Admin') {
                userType = member.userable.role || 'admin';
            }

            setData({
                nom: member.nom,
                prenom: member.prenom,
                email: member.email,
                telephone: member.telephone || '',
                type: userType,
                password: '',
                password_confirmation: ''
            });
        } else {
            setEditingStaff(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            put(route('admin.staff.update', editingStaff.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('admin.staff.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id: number) => {
        if (id === auth.user.id) {
            alert(t('staff_management.alerts.cannot_delete_self'));
            return;
        }
        if (confirm(t('staff_management.alerts.confirm_archive'))) {
            router.delete(route('admin.staff.destroy', id));
        }
    };

    const getRoleBadge = (type: string, role?: string) => {
        if (type === 'App\\Models\\Manager') {
            return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide">{t('staff_management.roles.manager')}</span>;
        }
        if (role === 'super_admin') {
            return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold tracking-wide">{t('staff_management.roles.super_admin')}</span>;
        }
        return <span className="px-3 py-1 bg-emerald-100 text-forest rounded-full text-xs font-bold tracking-wide">{t('staff_management.roles.admin')}</span>;
    };

    return (
        <AppLayout title={t('staff_management.app_layout_title')}>
            <Head title={t('staff_management.head_title')} />

            <div className="space-y-8">
                <div className="card-premium">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-brand-100 p-2 rounded-lg">
                                <Shield className="h-6 w-6 text-brand-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-forest tracking-tight">{t('staff_management.section_title')}</h2>
                        </div>
                        <button onClick={() => openModal()} className="btn-premium flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {t('staff_management.new_member_button')}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-y border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold">
                                    <th className="p-4 rounded-tl-lg">{t('staff_management.table.full_name')}</th>
                                    <th className="p-4">{t('staff_management.table.role')}</th>
                                    <th className="p-4">{t('staff_management.table.email')}</th>
                                    <th className="p-4">{t('staff_management.table.phone')}</th>
                                    <th className="p-4 text-right rounded-tr-lg">{t('staff_management.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {staff.length > 0 ? staff.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                                        <td className="p-4 font-semibold text-slate-800">
                                            {member.prenom} {member.nom}
                                            {member.id === auth.user.id && <span className="ml-2 text-xs text-slate-400 font-normal">{t('staff_management.you')}</span>}
                                        </td>
                                        <td className="p-4">
                                            {getRoleBadge(member.userable_type, member.userable.role)}
                                        </td>
                                        <td className="p-4 text-slate-600">{member.email}</td>
                                        <td className="p-4 text-slate-600">{member.telephone || '-'}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button onClick={() => openModal(member)} className="text-brand-600 hover:text-brand-800 transition-colors">
                                                <Edit2 className="w-5 h-5 inline" />
                                            </button>
                                            {member.id !== auth.user.id && (
                                                <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                                    <Trash2 className="w-5 h-5 inline" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                                            {t('staff_management.empty_state')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-xl shadow-premium w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-forest">
                                {editingStaff ? t('staff_management.modal.edit_title') : t('staff_management.modal.add_title')}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t('staff_management.modal.first_name')}</label>
                                    <input type="text" value={data.prenom} onChange={e => setData('prenom', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t('staff_management.modal.last_name')}</label>
                                    <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('staff_management.modal.email')}</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('staff_management.modal.phone')}</label>
                                <input type="text" value={data.telephone} onChange={e => setData('telephone', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500" />
                                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('staff_management.modal.role')}</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500"
                                    disabled={!!(editingStaff && editingStaff.userable_type !== 'App\\Models\\Admin')}
                                >
                                    <option value="manager">{t('staff_management.roles.manager')}</option>
                                    <option value="admin">{t('staff_management.roles.admin')}</option>
                                    <option value="super_admin">{t('staff_management.roles.super_admin')}</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-forest mb-4">{t('staff_management.modal.password_section')}</h4>

                                {editingStaff && (
                                    <p className="text-xs text-slate-500 mb-4">
                                        {t('staff_management.modal.password_help')}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            {editingStaff ? t('staff_management.modal.new_password') : t('staff_management.modal.password')} {editingStaff ? '' : <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500"
                                            required={!editingStaff}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            {t('staff_management.modal.confirm_password')} {editingStaff ? '' : <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 focus:ring-brand-500 focus:border-brand-500"
                                            required={!editingStaff}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={closeModal} className="btn-premium-secondary">
                                    {t('staff_management.modal.cancel')}
                                </button>
                                <button type="submit" className="btn-premium">
                                    {editingStaff ? t('staff_management.modal.update_button') : t('staff_management.modal.create_button')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}
        </AppLayout>
    );
}