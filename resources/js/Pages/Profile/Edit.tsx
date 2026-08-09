import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useTrans } from '@/Hooks/useTrans';

export default function Edit({ mustVerifyEmail, status }: any) {
    const { t } = useTrans();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-forest font-display">
                    {t('profile_edit.app_layout_title')}
                </h2>
            }
        >
            <Head title={t('profile_edit.head_title')} />

            <div className="py-10">
                <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">
                    <div className="card-premium">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="card-premium">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="card-premium !border-red-100/80">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}