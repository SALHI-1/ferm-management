import { Head, Link, useForm } from '@inertiajs/react';
import { Milestone, ArrowRight, Shield, BarChart3, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Welcome({ auth, status, canResetPassword }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const features = [
        { icon: Shield, title: 'Sécurité & Traçabilité', desc: 'Données protégées et historisées' },
        { icon: BarChart3, title: 'Rentabilité en temps réel', desc: 'Indicateurs financiers actualisés' },
        { icon: Users, title: 'Multi-rôles sécurisés', desc: 'Accès adaptés à chaque utilisateur' },
    ];

    return (
        <>
            <Head title="Bienvenue" />
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
                {/* Left Side - Info & Branding */}
                <div className="w-full md:w-1/2 lg:w-7/12 relative overflow-hidden flex flex-col p-8 md:p-16 justify-between bg-slate-900">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3 mb-12">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                            <Milestone className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-semibold text-white tracking-tight">Ferm Project</span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center self-start gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ring-1 ring-indigo-500/20">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                            Plateforme de gestion agricole
                        </div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
                            Gérez votre <span className="text-indigo-400">exploitation</span> avec précision
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed mb-12 max-w-lg">
                            Suivi du cheptel, traçabilité, investissements et rentabilité — le tout dans une interface moderne et sécurisée.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="p-2.5 bg-slate-800/80 rounded-lg ring-1 ring-slate-700/60 shrink-0">
                                        <feature.icon className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                                        <p className="text-sm text-slate-400 mt-0.5">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="relative z-10 mt-12">
                        <p className="text-sm text-slate-500">
                            © {new Date().getFullYear()} Ferm Project — Tous droits réservés.
                        </p>
                    </footer>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8 md:p-12 bg-slate-50">
                    <div className="w-full max-w-md bg-white border border-slate-100 shadow-sm rounded-xl p-8">
                        {auth.user ? (
                            <div className="text-center py-8 space-y-6">
                                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Vous êtes déjà connecté</h2>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex w-full justify-center items-center gap-2 px-4 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 active:scale-95"
                                >
                                    Aller au Dashboard <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8 space-y-1">
                                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Bon retour</h2>
                                    <p className="text-sm text-slate-600">Connectez-vous à votre espace sécurisé</p>
                                </div>

                                {status && (
                                    <div className="mb-6 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="email" value="Adresse email" className="text-slate-700" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1.5 block w-full rounded-lg border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-700" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1.5 block w-full rounded-lg border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 ease-in-out"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e: any) =>
                                                    setData('remember', e.target.checked)
                                                }
                                            />
                                            <span className="text-sm text-slate-600">
                                                Se souvenir de moi
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-all duration-200"
                                            >
                                                Mot de passe oublié ?
                                            </Link>
                                        )}
                                    </div>

                                    <PrimaryButton
                                        className="w-full justify-center !py-3 !text-sm !rounded-lg !bg-indigo-600 hover:!bg-indigo-700 transition-all duration-200 active:scale-95"
                                        disabled={processing}
                                    >
                                        Se connecter
                                    </PrimaryButton>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}