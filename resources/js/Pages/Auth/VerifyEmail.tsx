import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

export default function VerifyEmail({ status }: any) {
    const { t } = useTrans();

    const { post, processing } = useForm({});

    const submit = (e: any) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={t('verify_email.head_title')} />

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 ring-1 ring-brand-200/60 mb-4">
                    <MailCheck className="h-7 w-7 text-brand-600" />
                </div>
                <h1 className="text-xl font-bold text-forest font-display">{t('verify_email.title')}</h1>
            </div>

            <p className="mb-6 text-sm text-slate-500 text-center leading-relaxed">
                {t('verify_email.description')}
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-6 text-sm font-medium text-forest bg-forest/10 border border-emerald-100 rounded-xl px-4 py-3 text-center">
                    {t('verify_email.link_sent_status')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <PrimaryButton className="w-full justify-center !py-3 !text-sm" disabled={processing}>
                    {t('verify_email.resend_button')}
                </PrimaryButton>

                <div className="text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors duration-200"
                    >
                        {t('verify_email.logout_button')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}