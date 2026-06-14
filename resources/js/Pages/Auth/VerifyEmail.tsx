import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }: any) {
    const { post, processing } = useForm({});

    const submit = (e: any) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Vérification Email" />

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 ring-1 ring-brand-200/60 mb-4">
                    <MailCheck className="h-7 w-7 text-brand-600" />
                </div>
                <h1 className="text-xl font-bold text-slate-800 font-display">Vérifiez votre email</h1>
            </div>

            <p className="mb-6 text-sm text-slate-500 text-center leading-relaxed">
                Merci pour votre inscription ! Cliquez sur le lien que nous venons de vous envoyer par email pour vérifier votre adresse.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center">
                    Un nouveau lien de vérification a été envoyé.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <PrimaryButton className="w-full justify-center !py-3 !text-sm" disabled={processing}>
                    Renvoyer l'email de vérification
                </PrimaryButton>

                <div className="text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors duration-200"
                    >
                        Se déconnecter
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
