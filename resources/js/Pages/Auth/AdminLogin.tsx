import { useEffect, FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Envoie vers la même route POST 'login'
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Connexion Administration" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ferm Project — Portail Staff
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Réservé aux Administrateurs, Super-Admins et Managers.
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Adresse Email Professionnelle" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <PrimaryButton className="w-full justify-center bg-amber-600 hover:bg-amber-700" disabled={processing}>
                        Se connecter au Backoffice
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}