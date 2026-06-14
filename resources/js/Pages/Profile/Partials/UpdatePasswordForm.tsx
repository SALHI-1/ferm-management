import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }: any) {
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
                <h2 className="text-lg font-bold text-slate-800 font-display">Modifier le mot de passe</h2>
                <p className="mt-1 text-sm text-slate-500">Utilisez un mot de passe long et aléatoire pour rester en sécurité.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="current_password" value="Mot de passe actuel" />
                    <TextInput id="current_password" ref={currentPasswordInput} value={data.current_password} onChange={(e: any) => setData('current_password', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="current-password" />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />
                    <TextInput id="password" ref={passwordInput} value={data.password} onChange={(e: any) => setData('password', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="new-password" />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                    <TextInput id="password_confirmation" value={data.password_confirmation} onChange={(e: any) => setData('password_confirmation', e.target.value)} type="password" className="mt-1.5 block w-full" autoComplete="new-password" />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Sauvegarder</PrimaryButton>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm text-emerald-600 font-medium">✓ Enregistré</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
