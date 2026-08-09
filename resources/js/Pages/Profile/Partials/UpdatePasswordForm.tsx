import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdatePasswordForm({ className = '' }: any) {
    const { t } = useTrans();
    const passwordInput = useRef<any>(null);
    const currentPasswordInput = useRef<any>(null);

    const {
        data, setData, errors, put, reset, processing, recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e: any) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) { reset('password', 'password_confirmation'); passwordInput.current.focus(); }
                if (errors.current_password) { reset('current_password'); currentPasswordInput.current.focus(); }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-forest font-display">{t('update_password_form.title')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('update_password_form.description')}</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="current_password" value={t('update_password_form.current_password_label')} />
                    <TextInput id="current_password" ref={currentPasswordInput} value={data.current_password} onChange={(e: any) => setData('current_password', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="current-password" />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('update_password_form.new_password_label')} />
                    <TextInput id="password" ref={passwordInput} value={data.password} onChange={(e: any) => setData('password', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="new-password" />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('update_password_form.confirm_password_label')} />
                    <TextInput id="password_confirmation" value={data.password_confirmation} onChange={(e: any) => setData('password_confirmation', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="new-password" />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('update_password_form.save_button')}</PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-forest font-medium">{t('update_password_form.saved_message')}</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}