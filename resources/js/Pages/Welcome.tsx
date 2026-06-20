import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Milestone, ArrowRight, Shield, BarChart3, Users, Sprout, HandCoins, Droplet, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Welcome({ auth, laravelVersion, phpVersion }: any) {
    const { flash } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('investment.store'), {
            onSuccess: () => reset(),
        });
    };

    const steps = [
        {
            icon: Sprout,
            title: "1. Vous investissez",
            desc: "39,000 MAD financent l'achat d'une vache Holstein (actif réel et assurable)."
        },
        {
            icon: Droplet,
            title: "2. Nous exploitons",
            desc: "Nous fournissons la terre, la nourriture, la main-d'œuvre et les soins vétérinaires."
        },
        {
            icon: HandCoins,
            title: "3. Nous partageons",
            desc: "Le profit net issu du lait et de la vente annuelle du veau est partagé à 50/50."
        }
    ];

    return (
        <>
            <Head title="CoFarm Dairy Partners - Opportunité d'Investissement" />
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                {/* Navbar */}
                <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                                <Milestone className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">CoFarm</span>
                        </div>
                        <div>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all duration-200"
                                >
                                    Mon Espace Client
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-200"
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src="/videos/ferm-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <div className="absolute inset-0 bg-slate-900/80" />

                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full filter blur-[100px] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-16">

                        <div className="lg:w-3/5 text-center lg:text-left mt-16 lg:mt-0">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8 ring-1 ring-indigo-500/20">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                                CO-INVESTMENT OPPORTUNITY 2026
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                                CoFarm Dairy <span className="text-indigo-400">Partners</span>
                            </h1>

                            <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                                Devenez propriétaire d'une vache laitière productive. Nous l'élevons, vendons le lait et partageons les bénéfices avec vous.
                            </p>

                            <blockquote className="border-l-4 border-indigo-500 pl-6 my-8 text-lg italic text-slate-400">
                                "You don't need a farm to be a farmer"
                                <footer className="mt-2 text-sm text-indigo-400 font-semibold">— Y. Manyani</footer>
                            </blockquote>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#demande" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25">
                                    Je souhaite investir <ArrowRight className="h-5 w-5" />
                                </a>
                                <a href="#fonctionnement" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300">
                                    Comment ça marche ?
                                </a>
                            </div>
                        </div>

                        {/* Key Metrics Cards */}
                        <div className="lg:w-2/5 flex flex-col gap-4 w-full max-w-md">
                            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-slate-800/70 transition-all duration-300 group">
                                <div className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">Participation</div>
                                <div className="text-3xl font-bold text-white group-hover:scale-105 origin-left transition-transform">39,000 MAD</div>
                                <div className="text-slate-400 text-sm mt-1">par vache laitière</div>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-slate-800/70 transition-all duration-300 group">
                                <div className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">Rendement</div>
                                <div className="text-3xl font-bold text-white group-hover:scale-105 origin-left transition-transform">2.4x <span className="text-xl text-slate-300 font-medium">sur 5 ans</span></div>
                                <div className="text-slate-400 text-sm mt-1">Rendement annualisé ~19.5% CAGR</div>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-slate-800/70 transition-all duration-300 group">
                                <div className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">Récupération estimée</div>
                                <div className="text-3xl font-bold text-white group-hover:scale-105 origin-left transition-transform">27 à 31 mois</div>
                                <div className="text-slate-400 text-sm mt-1">pour récupérer l'investissement initial</div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Comment ça fonctionne */}
                <section id="fonctionnement" className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Le Modèle de Co-Investissement</h2>
                            <p className="text-lg text-slate-600">Un partenariat gagnant-gagnant où chaque partie apporte sa valeur ajoutée.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Line connecting steps */}
                            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100" />

                            {steps.map((step, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500 shadow-sm ring-8 ring-white">
                                        <step.icon className="h-10 w-10 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Formulaire d'investissement */}
                <section id="demande" className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full filter blur-[100px] pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100">

                            <div className="md:w-5/12 bg-indigo-600 p-10 text-white flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Rejoignez l'Aventure</h3>
                                    <p className="text-indigo-100 leading-relaxed mb-8">
                                        Remplissez ce formulaire pour nous faire part de votre intérêt. Notre équipe vous contactera dans les plus brefs délais pour discuter des détails.
                                    </p>
                                </div>
                                <div className="space-y-4 text-indigo-200 text-sm">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-300" /> Sans engagement initial
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-300" /> Informations confidentielles
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-300" /> Accompagnement personnalisé
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-7/12 p-10">
                                {flash?.success ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in py-12">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">Demande Envoyée !</h3>
                                        <p className="text-slate-600 max-w-xs">{flash.success}</p>
                                        <button onClick={() => window.location.reload()} className="mt-8 text-indigo-600 font-medium hover:text-indigo-700">Soumettre une autre demande</button>
                                    </div>
                                ) : (
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="prenom" value="Prénom" className="text-slate-700 font-semibold" />
                                                <TextInput
                                                    id="prenom"
                                                    type="text"
                                                    name="prenom"
                                                    value={data.prenom}
                                                    className="mt-2 block w-full rounded-xl border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                                                    onChange={(e) => setData('prenom', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.prenom} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="nom" value="Nom" className="text-slate-700 font-semibold" />
                                                <TextInput
                                                    id="nom"
                                                    type="text"
                                                    name="nom"
                                                    value={data.nom}
                                                    className="mt-2 block w-full rounded-xl border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                                                    onChange={(e) => setData('nom', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.nom} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Adresse Email" className="text-slate-700 font-semibold" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-2 block w-full rounded-xl border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="telephone" value="Téléphone" className="text-slate-700 font-semibold" />
                                            <TextInput
                                                id="telephone"
                                                type="tel"
                                                name="telephone"
                                                value={data.telephone}
                                                className="mt-2 block w-full rounded-xl border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                                                onChange={(e) => setData('telephone', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.telephone} className="mt-2" />
                                        </div>

                                        <PrimaryButton
                                            className="w-full justify-center !py-4 !text-base !rounded-xl !bg-slate-900 hover:!bg-indigo-600 transition-colors duration-300 mt-4 shadow-lg shadow-slate-900/10"
                                            disabled={processing}
                                        >
                                            Soumettre ma demande d'investissement
                                        </PrimaryButton>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-slate-900 border-t border-white/10 py-12 text-center text-slate-400">
                    <p className="text-sm">
                        © {new Date().getFullYear()} CoFarm Dairy Partners par Ferm Project. Tous droits réservés.
                    </p>
                </footer>
            </div>
        </>
    );
}