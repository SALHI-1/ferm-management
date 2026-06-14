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

    return (
        <>
            <Head title="Bienvenue" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 font-sans flex flex-col md:flex-row">
                {/* Left Side - Info & Branding */}
                <div className="w-full md:w-1/2 lg:w-7/12 relative overflow-hidden flex flex-col p-8 md:p-16 justify-between bg-white/40 border-r border-slate-100">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-100/20 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3 mb-12">
                        <div className="p-2 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl shadow-sm">
                            <Milestone className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold text-slate-800 tracking-tight">Ferm Project</span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center self-start gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ring-1 ring-brand-200/60">
                            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                            Plateforme de gestion agricole
                        </div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                            Gérez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">exploitation</span> avec précision
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
                            Suivi du cheptel, traçabilité, investissements et rentabilité — le tout dans une interface moderne et sécurisée.
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                            {[
                                { icon: Shield, color: 'emerald', title: 'Sécurité & Traçabilité' },
                                { icon: BarChart3, color: 'brand', title: 'Rentabilité en temps réel' },
                                { icon: Users, color: 'violet', title: 'Multi-rôles sécurisés' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`p-3 bg-${feature.color === 'brand' ? 'brand' : feature.color}-50 rounded-xl ring-1 ring-${feature.color === 'brand' ? 'brand' : feature.color}-200/60`}>
                                        <feature.icon className={`h-5 w-5 text-${feature.color === 'brand' ? 'brand' : feature.color}-600`} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 font-display">{feature.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="relative z-10 mt-12">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} Ferm Project — Tous droits réservés.
                        </p>
                    </footer>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8 md:p-12 bg-white/60 backdrop-blur-sm relative z-10">
                    <div className="w-full max-w-md card-premium shadow-xl shadow-brand-100/30 border-0 ring-1 ring-slate-100">
                        {auth.user ? (
                            <div className="text-center py-8">
                                <h2 className="text-2xl font-bold text-slate-800 font-display mb-4">Vous êtes déjà connecté</h2>
                                <Link href={route('dashboard')} className="btn-premium w-full flex justify-center items-center gap-2">
                                    Aller au Dashboard <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-800 font-display">Bon retour 👋</h2>
                                    <p className="text-sm text-slate-500 mt-1">Connectez-vous à votre espace sécurisé</p>
                                </div>

                                {status && (
                                    <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <InputLabel htmlFor="email" value="Adresse email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1.5 block w-full input-premium"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password" value="Mot de passe" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1.5 block w-full input-premium"
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
                                            <span className="text-sm text-slate-500">
                                                Se souvenir de moi
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors duration-200"
                                            >
                                                Mot de passe oublié ?
                                            </Link>
                                        )}
                                    </div>

                                    <PrimaryButton className="w-full justify-center !py-3.5 !text-sm mt-2" disabled={processing}>
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
