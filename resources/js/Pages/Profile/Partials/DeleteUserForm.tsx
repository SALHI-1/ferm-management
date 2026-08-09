import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

export default function DeleteUserForm({ className = '' }: any) {
    const { t } = useTrans();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<any>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e: any) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => { setConfirmingUserDeletion(false); clearErrors(); reset(); };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-red-600 font-display flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> {t('delete_user_form.title')}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {t('delete_user_form.description')}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {t('delete_user_form.delete_button')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-bold text-forest font-display">
                        {t('delete_user_form.modal.title')}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {t('delete_user_form.modal.description')}
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value={t('delete_user_form.modal.password_label')} className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e: any) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder={t('delete_user_form.modal.password_placeholder')}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>{t('delete_user_form.modal.cancel_button')}</SecondaryButton>
                        <DangerButton disabled={processing}>{t('delete_user_form.modal.confirm_button')}</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}