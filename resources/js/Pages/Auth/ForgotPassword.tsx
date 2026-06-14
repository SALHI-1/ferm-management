import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }: any) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 ring-1 ring-brand-200/60 mb-4">
                    <Mail className="h-7 w-7 text-brand-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 font-display">Mot de passe oublié ?</h1>
            </div>

            <p className="mb-6 text-sm text-slate-500 text-center leading-relaxed">
                Indiquez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {status && (
                <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="block w-full"
                    isFocused={true}
                    placeholder="votre@email.com"
                    onChange={(e: any) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />

                <PrimaryButton className="w-full justify-center !py-3 !text-sm" disabled={processing}>
                    Envoyer le lien de réinitialisation
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
