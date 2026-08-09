import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function UpdateProfileInformation({
    mustVerifyEmail, status, className = '' }: any) {
    const { t } = useTrans();
    const user = (usePage().props as any).auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e: any) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-forest font-display">
                    {t('update_profile_information.title')}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {t('update_profile_information.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="name" value={t('update_profile_information.name_label')} />
                    <TextInput
                        id="name"
                        className="mt-1.5 block w-full"
                        value={data.name}
                        onChange={(e: any) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('update_profile_information.email_label')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1.5 block w-full"
                        value={data.email}
                        onChange={(e: any) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-700">
                            {t('update_profile_information.unverified_email')}{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                            >
                                {t('update_profile_information.resend_verification_link')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-forest">
                                {t('update_profile_information.verification_link_sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('update_profile_information.save_button')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-forest font-medium">
                            {t('update_profile_information.saved_message')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}