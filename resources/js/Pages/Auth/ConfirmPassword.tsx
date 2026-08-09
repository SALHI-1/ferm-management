import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

export default function ConfirmPassword() {
    const { t } = useTrans();

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('confirm_password.head_title')} />

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 ring-1 ring-amber-200/60 mb-4">
                    <Lock className="h-7 w-7 text-amber-600" />
                </div>
                <h1 className="text-xl font-bold text-forest font-display">{t('confirm_password.title')}</h1>
            </div>

            <p className="mb-6 text-sm text-slate-500 text-center leading-relaxed">
                {t('confirm_password.description')}
            </p>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value={t('confirm_password.password_label')} />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full"
                        isFocused={true}
                        onChange={(e: any) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <PrimaryButton className="w-full justify-center !py-3 !text-sm" disabled={processing}>
                    {t('confirm_password.submit_button')}
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}