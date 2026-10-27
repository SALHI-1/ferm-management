import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import Dropdown from '@/Components/Dropdown';
import { useTrans } from '@/Hooks/useTrans';
import { 
    ShieldCheck, Lock, Mail, Eye, EyeOff, Globe, Check, 
    ArrowRight, ArrowLeft, Activity, Users, Award, AlertCircle, Loader2 
} from 'lucide-react';

/* ── Luxury Organic Palette & Brand Tokens (Identical to Staff Portal) ── */
const C = {
    cream: '#f8f4ec',
    cream50: '#fdfcf9',
    forest: '#25382a',
    forestHover: '#2e4534',
    forestSurface: '#162319',
    copper: '#b45d34',
    ink: '#221d19',
    ink900: '#14120f',
};

export default function Login({ auth, status, canResetPassword }: any) {
    const { locale } = usePage().props as any;
    const { t } = useTrans();
    const [showPassword, setShowPassword] = useState(false);

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
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={locale === 'en' ? 'Investor Sign In — CoFarm & Partners' : 'Connexion Investisseur — CoFarm & Partners'} />

            <div className="min-h-screen bg-stone-50 font-sans flex flex-col lg:flex-row relative selection:bg-amber-100 selection:text-amber-900">

                {/* ══════════════════════════════════════════════════════════
                    LEFT PANEL — DESKTOP ONLY (Large Screens: Investor Immersion)
                    Hidden completely on small screens (< lg)
                ══════════════════════════════════════════════════════════ */}
                <div 
                    className="w-full lg:w-7/12 xl:w-7/12 relative overflow-hidden hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white"
                    style={{ background: `linear-gradient(155deg, ${C.forest} 0%, ${C.forestSurface} 50%, ${C.ink900} 100%)` }}
                >
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full filter blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full filter blur-[100px] pointer-events-none" />

                    {/* Top Header Bar on Left */}
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 rounded-xl bg-white/10 p-1.5 border border-white/20 backdrop-blur-md transition-transform group-hover:scale-105 shadow-xs">
                                <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-bold tracking-tight text-white leading-tight">
                                    CoFarm <span style={{ color: C.copper }}>&amp;</span> Partners
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-semibold">
                                    {locale === 'en' ? 'Investor Portal' : 'Espace Investisseur'}
                                </span>
                            </div>
                        </Link>

                        <Link 
                            href="/" 
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>{locale === 'en' ? 'Public Website' : 'Site Public'}</span>
                        </Link>
                    </div>

                    {/* Central Portfolio Overview on Left */}
                    <div className="relative z-10 my-auto py-8 max-w-xl">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border bg-emerald-500/10 border-emerald-500/25 text-emerald-300">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{locale === 'en' ? 'PORTFOLIO DESK ONLINE • SECURE ACCESS' : 'BUREAU INVESTISSEUR EN LIGNE • ACCÈS SÉCURISÉ'}</span>
                        </div>

                        <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-[1.15] tracking-tight text-stone-100 mb-5">
                            {locale === 'en' 
                                ? 'Herd Telemetry & Dividend Distribution'
                                : 'Suivi du Cheptel & Dividendes en Direct'}
                        </h1>

                        <p className="text-stone-300 text-base leading-relaxed mb-10 max-w-lg">
                            {locale === 'en'
                                ? 'Encrypted co-investment environment to track daily milk collection, animal veterinary telemetry, and audited quarterly cashflow.'
                                : 'Environnement sécurisé dédié aux investisseurs partenaires : suivi de production laitière, carnet vétérinaire ONSSA et relevés de gains trimestriels.'}
                        </p>

                        {/* Investor Pillars */}
                        <div className="space-y-4">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: locale === 'en' ? 'RFID Biometric Tracking & Health' : 'Traçabilité RFID & Suivi Vétérinaire',
                                    desc: locale === 'en' 
                                        ? 'Real-time weight logs, calving alerts, and ONSSA sanitary verification for your cows.' 
                                        : 'Alertes vêlage, pesées régulières et carnet sanitaire certifié ONSSA pour chaque animal.',
                                },
                                {
                                    icon: Activity,
                                    title: locale === 'en' ? 'Milking Automation & Cashflow' : 'Production Laitière & Dividendes',
                                    desc: locale === 'en'
                                        ? 'Daily volume tracking and audited quarterly distributions credited directly to your bank account.'
                                        : 'Volumes collectés au jour le jour et dividendes audités versés trimestriellement.',
                                },
                                {
                                    icon: Users,
                                    title: locale === 'en' ? 'MAMDA Insurance & Notarized Act' : 'Garantie MAMDA & Acte Notarié',
                                    desc: locale === 'en'
                                        ? 'Authentic notarized property deed + comprehensive livestock mortality insurance.'
                                        : 'Acte authentique notarié attestant de votre propriété exclusive avec couverture bétail totale.',
                                },
                            ].map((pillar, i) => {
                                const Icon = pillar.icon;
                                return (
                                    <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white tracking-wide">{pillar.title}</h3>
                                            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{pillar.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Legal Mention */}
                    <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                        <span>© {new Date().getFullYear()} CoFarm &amp; Partners. {locale === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</span>
                        <span className="text-[11px] font-mono text-stone-500">Agrément ONSSA n° 2024/CHAOUIA</span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    RIGHT PANEL — LOGIN FORM (Formulaire identique au Staff)
                    On small screens: occupies 100% of the viewport seamlessly.
                ══════════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-stone-50 min-h-screen relative overflow-y-auto">
                    
                    {/* Top Navigation Row */}
                    <div className="w-full max-w-md mx-auto flex items-center justify-between gap-3 pt-2 sm:pt-0 mb-6 sm:mb-8">
                        {/* Mobile Logo (Visible on mobile, hidden on lg where left panel shows it) */}
                        <div className="lg:hidden flex items-center min-w-0 pr-2">
                            <Link href="/" className="flex items-center gap-2 group min-w-0">
                                <img src="/images/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-serif text-sm sm:text-base font-bold text-stone-900 truncate">
                                        CoFarm Dairy
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Link (on desktop right panel, shows link to staff login) */}
                        <div className="hidden lg:block">
                            <Link 
                                href={route('admin.login')} 
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                            >
                                <span>{locale === 'en' ? 'Staff Portal →' : 'Portail Staff →'}</span>
                            </Link>
                        </div>

                        {/* Language Switcher Dropdown */}
                        <div className="shrink-0">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        aria-label="Changer de langue"
                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 shadow-xs transition-all duration-200"
                                    >
                                        <Globe className="h-3.5 w-3.5 text-stone-500" />
                                        <span>{locale === 'en' ? 'EN' : 'FR'}</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content 
                                    align="right" 
                                    width="32" 
                                    containerClasses="rounded-2xl border border-stone-200 shadow-xl bg-white/95 backdrop-blur-xl"
                                    contentClasses="p-1.5 space-y-1"
                                >
                                    <a
                                        href={route('language.switch', { locale: 'fr' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-xs font-bold tracking-wider transition-all duration-200 rounded-xl ${
                                            locale === 'fr' 
                                                ? 'bg-emerald-50 text-emerald-900 font-black' 
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>Français (FR)</span>
                                        {locale === 'fr' && <Check className="h-3.5 w-3.5 text-emerald-700" />}
                                    </a>
                                    <a
                                        href={route('language.switch', { locale: 'en' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-xs font-bold tracking-wider transition-all duration-200 rounded-xl ${
                                            locale === 'en' 
                                                ? 'bg-emerald-50 text-emerald-900 font-black' 
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>English (EN)</span>
                                        {locale === 'en' && <Check className="h-3.5 w-3.5 text-emerald-700" />}
                                    </a>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Central Form Card */}
                    <div className="w-full max-w-md mx-auto my-auto">
                        <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl shadow-xl p-5 xs:p-7 sm:p-9 transition-all">
                            
                            {/* Card Header */}
                            <div className="mb-6 sm:mb-8 text-center sm:text-left">
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 mb-4 shadow-xs">
                                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-700" />
                                </div>
                                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                                    {t('login.welcome_back')}
                                </h2>
                                <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                                    {t('login.login_desc')}
                                </p>
                            </div>

                            {/* Status banner */}
                            {status && (
                                <div className="mb-5 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 flex items-start gap-2.5 text-xs sm:text-sm font-medium">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{status}</span>
                                </div>
                            )}

                            {/* Already logged in state */}
                            {auth?.user ? (
                                <div className="text-center py-4 space-y-4">
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900">
                                        <p className="font-bold">{locale === 'en' ? 'Already Authenticated' : 'Session active'}</p>
                                        <p className="text-stone-600 mt-1">{auth.user.email}</p>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-white shadow-md transition-all hover:brightness-110"
                                        style={{ background: C.forest }}
                                    >
                                        <span>{locale === 'en' ? 'Go to Dashboard' : 'Accéder au Tableau de Bord'}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Error Banner */}
                                    {errors.email && (
                                        <div className="mb-5 p-3.5 rounded-xl border border-red-200 bg-red-50/70 text-red-800 flex items-start gap-2.5 text-xs sm:text-sm">
                                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                                            <div className="font-medium leading-relaxed">
                                                {errors.email}
                                            </div>
                                        </div>
                                    )}

                                    {/* Authentication Form */}
                                    <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                        
                                        {/* Client Email */}
                                        <div>
                                            <InputLabel 
                                                htmlFor="email" 
                                                value={t('login.email')} 
                                                className="!text-xs sm:!text-sm !font-bold text-stone-700 mb-1.5"
                                            />
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    autoComplete="username"
                                                    autoFocus
                                                    required
                                                    placeholder={locale === 'en' ? 'investor@example.com' : 'karim@exemple.com'}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-stone-300 text-stone-900 bg-stone-50/40 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all duration-200 ${
                                                        errors.email ? '!border-red-400 bg-red-50/30' : ''
                                                    }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Password with Eye Toggle */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <InputLabel 
                                                    htmlFor="password" 
                                                    value={t('login.password')} 
                                                    className="!text-xs sm:!text-sm !font-bold text-stone-700"
                                                />
                                                {canResetPassword && (
                                                    <Link
                                                        href={route('password.request')}
                                                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                                                    >
                                                        {t('login.forgot_password')}
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                                    <Lock className="h-4 w-4" />
                                                </div>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    autoComplete="current-password"
                                                    required
                                                    placeholder="••••••••••••"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm rounded-xl border border-stone-300 text-stone-900 bg-stone-50/40 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all duration-200 ${
                                                        errors.password ? '!border-red-400 bg-red-50/30' : ''
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} className="mt-1.5" />
                                        </div>

                                        {/* Options Row (Remember me + TLS badge) */}
                                        <div className="pt-1 flex items-center justify-between gap-2 text-xs">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e: any) => setData('remember', e.target.checked)}
                                                    className="rounded-md border-stone-300 text-emerald-800 focus:ring-emerald-600"
                                                />
                                                <span className="font-medium text-stone-600 whitespace-nowrap">
                                                    {t('login.remember_me')}
                                                </span>
                                            </label>

                                            <span className="hidden xs:inline-flex items-center gap-1 text-[11px] text-stone-400 shrink-0">
                                                <Lock className="h-3 w-3 text-emerald-600" />
                                                <span>Session TLS</span>
                                            </span>
                                        </div>

                                        {/* Submit Button (Identical to staff button) */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                                            style={{ background: C.forest }}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                                                    <span>{locale === 'en' ? 'Signing in...' : 'Connexion en cours...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                                    <span>{t('login.submit')}</span>
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Alternate Portal & Public Links */}
                                    <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
                                        <div className="text-center text-xs text-stone-500">
                                            <span>{locale === 'en' ? 'Are you a team member or farm manager?' : 'Vous faites partie de l\'équipe CoFarm ?'}</span>
                                            <Link 
                                                href={route('admin.login')} 
                                                className="font-bold text-emerald-800 hover:text-emerald-950 ml-1.5 underline underline-offset-2"
                                            >
                                                {locale === 'en' ? 'Staff Portal →' : 'Portail Staff →'}
                                            </Link>
                                        </div>

                                        <div className="text-center">
                                            <Link 
                                                href="/" 
                                                className="text-[11px] sm:text-xs text-stone-400 hover:text-stone-700 transition-colors inline-flex items-center gap-1"
                                            >
                                                <ArrowLeft className="h-3 w-3" />
                                                <span>{locale === 'en' ? 'Back to home' : 'Retour à l\'accueil'}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom Status / Copyright */}
                    <div className="w-full max-w-md mx-auto text-center pt-6 pb-2 text-xs text-stone-400 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="font-medium text-stone-600">{locale === 'en' ? 'Production Gateway' : 'Passerelle Sécurisée'}</span>
                        </span>
                        <span>v2.4.0</span>
                    </div>

                </div>

            </div>
        </>
    );
}