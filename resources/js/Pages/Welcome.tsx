import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';
import { Globe, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';

/* ── inline brand tokens (no Tailwind config change needed) ── */
const C = {
    cream:     '#f4eddf',
    cream50:   '#fbf6ec',
    ink:       '#2a2521',
    ink900:    '#211d19',
    forest:    '#2d3f31',
    forest600: '#3e5641',
    copper:    '#bc6b43',
    copper300: '#c99360',
    gold:      '#d9a968',
    muted:     '#52493e',
    muted400:  '#8a8174',
    muted500:  '#6e6557',
    onForest:  '#c5cfc0',
    onForest2: '#d8e0d4',
};

/* ── font import (injected once via <style>) ── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;0,700;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Spline+Sans+Mono:wght@500&display=swap');
.cf-eyebrow{font-family:'Spline Sans Mono',monospace;font-size:0.77rem;letter-spacing:0.22em;text-transform:uppercase;}
.cf-serif{font-family:'Spectral',Georgia,serif;}
.cf-sans{font-family:'Hanken Grotesk',system-ui,sans-serif;}
@keyframes cfRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.cf-rise{animation:cfRise 0.75s ease both;}
.cf-rise-2{animation:cfRise 0.85s 0.1s ease both;}
`;

export default function Welcome({ auth }: any) {
    const { flash, locale } = usePage().props as any;
    const [openFaq, setOpenFaq] = useState<number>(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { t } = useTrans();

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessModal(true);
        }
    }, [flash]);

    const toggleLocale = locale === 'en' ? 'fr' : 'en';
    const toggleLabel = locale === 'en' ? 'FR' : 'EN';

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('investment.store'), { 
            preserveScroll: true,
            onSuccess: () => reset() 
        });
    };

    const steps = [
        { n: '01', t: t('welcome.model_step_1_title'), d: t('welcome.model_step_1_desc') },
        { n: '02', t: t('welcome.model_step_2_title'), d: t('welcome.model_step_2_desc') },
        { n: '03', t: t('welcome.model_step_3_title'), d: t('welcome.model_step_3_desc') },
    ];

    const returnCards = [
        { v: t('welcome.hero_stat_1_val'),   u: t('welcome.hero_stat_1_unit'),    l: t('welcome.hero_stat_1_label') },
        { v: t('welcome.hero_stat_2_val'),  u: t('welcome.hero_stat_2_unit'), l: t('welcome.hero_stat_2_label') },
        { v: '~19.5', u: '% CAGR', l: 'Rendement annualisé estimé' },
        { v: '27–31', u: t('welcome.hero_stat_3_unit'),   l: t('welcome.hero_stat_3_label') },
    ];

    const marketPoints = [
        { v: '32 M+', l: "Litres produits annuellement dans les fermes partenaires — demande locale en croissance constante." },
        { v: '×2.6',  l: 'Hausse du prix moyen du lait au Maroc sur les 10 dernières années.' },
        { v: '< 5 %', l: 'Auto-suffisance laitière nationale — fort déficit structurel à combler.' },
    ];

    const faqs = [
        { q: 'Que se passe-t-il si la vache tombe malade ?', a: "Chaque vache est couverte par une assurance bétail incluse dans le montant de participation. En cas de perte totale, la valeur de remplacement vous est versée." },
        { q: 'Puis-je visiter la ferme ?', a: "Oui. Nous organisons des visites trimestrielles pour nos investisseurs et vous envoyons un rapport mensuel illustré avec photos et données de production." },
        { q: "Quelle est la durée minimum d'engagement ?", a: "12 mois. Au-delà, vous pouvez renouveler ou céder votre part à un autre investisseur via notre plateforme interne." },
        { q: 'Les bénéfices sont-ils garantis ?', a: "Les projections sont fondées sur les données réelles de nos fermes. Comme tout investissement, les rendements peuvent varier — nous visons la transparence totale." },
    ];

    return (
        <>
            <style>{FONTS}</style>
            <Head title={t('welcome.title')} />

            <div className="cf-sans min-h-screen" style={{ background: C.cream, color: C.ink }}>

                {/* ── NAV ── */}
                <nav style={{ background: `${C.cream}dd`, borderBottom: `1px solid ${C.ink}18` }}
                     className="sticky top-0 z-50 backdrop-blur-md">
                    <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-7 py-5">
                        {/* Logo */}
                        <a href="#top" className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
                            <span className="cf-serif text-[20px] font-semibold tracking-tight" style={{ color: C.ink }}>
                                CoFarm <span style={{ color: C.copper }}>&amp;</span> Partners
                            </span>
                        </a>

                        <div className="flex items-center gap-5">
                            <div className="hidden items-center gap-7 lg:flex">
                                {[['#fonctionnement',t('welcome.nav_how_it_works')],['#rendements',t('welcome.nav_returns')],['#marche',t('welcome.nav_market')],['#faq',t('welcome.nav_faq')]].map(([href,label]) => (
                                    <a key={href} href={href}
                                       style={{ color: C.muted500, fontSize: 15 }}
                                       className="transition-colors hover:text-ink">{label}</a>
                                ))}
                            </div>
                            
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-full p-2 text-ink/70 hover:bg-ink/5 hover:text-ink border border-transparent transition-all duration-200"
                                    >
                                        <Globe className="h-5 w-5" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content 
                                    align="right" 
                                    width="32"
                                    containerClasses="rounded-2xl border border-white/40 shadow-[0_24px_40px_-12px_rgba(0,0,0,0.15)] bg-white/50 backdrop-blur-2xl"
                                    contentClasses="p-1.5 space-y-1"
                                >
                                    <a
                                        href={route('language.switch', { locale: 'fr' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-sm font-bold tracking-widest transition-all duration-300 rounded-xl ${
                                            locale === 'fr' 
                                                ? 'bg-forest/10 text-forest shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                                                : 'text-ink/60 hover:bg-white/60 hover:text-ink'
                                        }`}
                                    >
                                        <span>FR</span>
                                        {locale === 'fr' && <Check className="h-4 w-4 text-forest drop-shadow-sm" />}
                                    </a>
                                    <a
                                        href={route('language.switch', { locale: 'en' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-sm font-bold tracking-widest transition-all duration-300 rounded-xl ${
                                            locale === 'en' 
                                                ? 'bg-forest/10 text-forest shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                                                : 'text-ink/60 hover:bg-white/60 hover:text-ink'
                                        }`}
                                    >
                                        <span>EN</span>
                                        {locale === 'en' && <Check className="h-4 w-4 text-forest drop-shadow-sm" />}
                                    </a>
                                </Dropdown.Content>
                            </Dropdown>

                            {auth.user ? (
                                <Link href={route('dashboard')}
                                      className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                                      style={{ background: C.forest, color: C.cream }}>
                                    {t('welcome.nav_dashboard')}
                                </Link>
                            ) : (
                                <Link href={route('login')}
                                      className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
                                      style={{ background: C.forest, color: C.cream }}>
                                    {t('welcome.nav_login')}
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── HERO ── */}
                <header id="top">
                    <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-7 py-16 lg:grid-cols-2 lg:py-24">
                        {/* Left */}
                        <div className="cf-rise">
                            <p className="cf-eyebrow mb-5" style={{ color: C.copper }}>{t('welcome.hero_eyebrow')}</p>
                            <h1 className="cf-serif mb-5 text-[42px] font-bold leading-[1.05] tracking-tight sm:text-[56px]"
                                style={{ color: C.ink }}>
                                CoFarm Dairy<br />
                                <span style={{ color: C.forest }}>Partners</span>
                            </h1>
                            <p className="mb-8 max-w-[30em] text-[19px] leading-relaxed" style={{ color: C.muted }}>
                                {t('welcome.hero_desc')}
                            </p>
                            <blockquote className="mb-8 border-l-4 pl-5 italic" style={{ borderColor: C.copper, color: C.muted500 }}>
                                "{t('welcome.hero_quote')}"
                                <footer className="mt-1 text-sm not-italic font-semibold" style={{ color: C.copper }}>— Y. Manyani</footer>
                            </blockquote>
                            <div className="flex flex-wrap gap-3">
                                <a href="#demande"
                                   className="rounded-full px-7 py-4 text-[15.5px] font-semibold transition-transform hover:-translate-y-0.5"
                                   style={{ background: C.copper, color: C.cream50, boxShadow: '0 6px 20px rgba(188,107,67,0.28)' }}>
                                    {t('welcome.hero_btn_invest')}
                                </a>
                                <a href="#fonctionnement"
                                   className="rounded-full px-6 py-4 text-[15.5px] font-semibold transition-colors"
                                   style={{ border: `1px solid ${C.forest}44`, color: C.forest }}>
                                    {t('welcome.hero_btn_how')}
                                </a>
                            </div>

                            {/* Stats row */}
                            <div className="mt-10 grid grid-cols-3 gap-4 border-t pt-7" style={{ borderColor: `${C.ink}1a` }}>
                                {[
                                    { v: t('welcome.hero_stat_1_val'), u: t('welcome.hero_stat_1_unit'), l: t('welcome.hero_stat_1_label') },
                                    { v: t('welcome.hero_stat_2_val'), u: t('welcome.hero_stat_2_unit'), l: t('welcome.hero_stat_2_label'), accent: true },
                                    { v: t('welcome.hero_stat_3_val'), u: t('welcome.hero_stat_3_unit'), l: t('welcome.hero_stat_3_label') },
                                ].map(({ v, u, l, accent }) => (
                                    <div key={l}>
                                        <div className="cf-serif text-[28px] font-bold leading-none" style={{ color: C.forest }}>
                                            {v}
                                            {u && <span style={{ color: accent ? C.copper : C.muted400, fontSize: accent ? undefined : 13, fontWeight: 500 }}>{accent ? u : ` ${u}`}</span>}
                                        </div>
                                        <div className="mt-1.5 text-[13px]" style={{ color: C.muted500 }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — video / image */}
                        <div className="cf-rise-2 relative aspect-[4/5] overflow-hidden rounded-[20px] shadow-2xl">
                            <video
                                className="h-full w-full object-cover"
                                src="/videos/ferm-video.mp4"
                                autoPlay loop muted playsInline
                            />
                            <div className="absolute inset-0" style={{ background: `${C.forest}22` }} />
                            {/* Badge */}
                            <div className="absolute -left-4 bottom-8 max-w-[200px] rounded-2xl border px-5 py-4 shadow-xl"
                                 style={{ background: C.cream50, borderColor: `${C.ink}14` }}>
                                <p className="cf-eyebrow mb-1 text-[11px]" style={{ color: C.copper }}>{t('welcome.hero_badge_title')}</p>
                                <p className="text-[13.5px] leading-snug" style={{ color: C.ink }}>{t('welcome.hero_badge_desc')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── HOW IT WORKS ── */}
                <section id="fonctionnement" style={{ background: C.cream50, borderTop: `1px solid ${C.ink}0d`, borderBottom: `1px solid ${C.ink}0d` }}>
                    <div className="mx-auto w-full max-w-[1180px] px-7 py-[90px]">
                        <p className="cf-eyebrow mb-4" style={{ color: C.copper }}>{t('welcome.model_eyebrow')}</p>
                        <h2 className="cf-serif mb-3 max-w-[16em] text-[32px] font-bold leading-[1.08] tracking-tight sm:text-[42px]">
                            {t('welcome.model_title')}
                        </h2>
                        <p className="mb-12 max-w-[34em] text-[18px]" style={{ color: C.muted }}>
                            {t('welcome.model_desc')}
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                            {steps.map((s) => (
                                <div key={s.n} className="rounded-[18px] border px-7 pb-8 pt-8"
                                     style={{ borderColor: `${C.ink}14`, background: C.cream }}>
                                    <div className="cf-serif mb-6 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                                         style={{ background: C.forest, color: C.cream }}>
                                        {s.n}
                                    </div>
                                    <h3 className="cf-serif mb-2.5 text-[23px] font-semibold tracking-tight">{s.t}</h3>
                                    <p className="text-[15.5px] leading-relaxed" style={{ color: C.muted }}>{s.d}</p>
                                </div>
                            ))}
                        </div>
                        <p className="cf-serif mt-8 max-w-[48em] text-[14.5px] italic leading-relaxed" style={{ color: C.muted400 }}>
                            {t('welcome.model_disclaimer')}
                        </p>
                    </div>
                </section>

                {/* ── RETURNS ── */}
                <section id="rendements" style={{ background: C.cream }}>
                    <div className="mx-auto w-full max-w-[1180px] px-7 py-[90px]">
                        <p className="cf-eyebrow mb-4" style={{ color: C.copper }}>{t('welcome.returns_eyebrow')}</p>
                        <h2 className="cf-serif mb-3 max-w-[18em] text-[32px] font-bold leading-[1.08] tracking-tight sm:text-[42px]">
                            {t('welcome.returns_title')}
                        </h2>
                        <p className="mb-12 max-w-[40em] text-[18px]" style={{ color: C.muted }}>
                            {t('welcome.returns_desc')}
                        </p>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {returnCards.map((c) => (
                                <div key={c.l} className="rounded-2xl px-6 py-7" style={{ background: C.forest, color: C.cream }}>
                                    <div className="cf-serif text-[34px] font-bold leading-none">
                                        {c.v}
                                        {c.u && <span className="text-[14px] font-medium" style={{ color: C.onForest }}> {c.u}</span>}
                                    </div>
                                    <div className="mt-2.5 text-[13.5px] leading-snug" style={{ color: C.onForest2 }}>{c.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── MARKET ── */}
                <section id="marche" style={{ background: C.forest, color: C.cream }}>
                    <div className="mx-auto w-full max-w-[1180px] px-7 py-[88px]">
                        <p className="cf-eyebrow mb-4" style={{ color: C.gold }}>{t('welcome.market_eyebrow')}</p>
                        <h2 className="cf-serif mb-3 max-w-[16em] text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[42px]">
                            {t('welcome.market_title')}
                        </h2>
                        <p className="mb-12 max-w-[36em] text-[18px]" style={{ color: C.onForest2 }}>
                            {t('welcome.market_desc')}
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                            {marketPoints.map((pt) => (
                                <div key={pt.v} className="border-t-2 pt-6" style={{ borderColor: `${C.gold}80` }}>
                                    <div className="cf-serif mb-3 text-[46px] font-bold leading-none" style={{ color: C.gold }}>{pt.v}</div>
                                    <p className="text-[15.5px] leading-relaxed" style={{ color: C.onForest2 }}>{pt.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section id="faq" style={{ background: C.cream50, borderBottom: `1px solid ${C.ink}0d` }}>
                    <div className="mx-auto w-full max-w-[880px] px-7 py-[90px]">
                        <p className="cf-eyebrow mb-4 text-center" style={{ color: C.copper }}>{t('welcome.faq_eyebrow')}</p>
                        <h2 className="cf-serif mb-11 text-center text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px]">
                            {t('welcome.faq_title')}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {faqs.map((item, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div key={i} className="overflow-hidden rounded-[14px] border"
                                         style={{ borderColor: `${C.ink}14`, background: C.cream }}>
                                        <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : i)}
                                                className="flex w-full cursor-pointer items-center justify-between gap-4 px-7 py-6 text-left"
                                                style={{ color: C.ink }}>
                                            <span className="cf-serif text-[19px] font-semibold tracking-tight">{item.q}</span>
                                            <span className="cf-serif shrink-0 text-[26px] leading-none" style={{ color: C.copper }}>
                                                {isOpen ? '–' : '+'}
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="max-w-[46em] px-7 pb-6 text-[15.5px] leading-relaxed" style={{ color: C.muted }}>
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── INVESTMENT FORM ── */}
                <section id="demande" style={{ background: C.cream }}>
                    <div className="mx-auto w-full max-w-[1000px] px-7 py-[90px]">
                        <p className="cf-eyebrow mb-4" style={{ color: C.copper }}>{t('welcome.invest_eyebrow')}</p>
                        <h2 className="cf-serif mb-2 text-[32px] font-bold leading-[1.08] tracking-tight sm:text-[42px]">
                            {t('welcome.invest_title')}
                        </h2>
                        <p className="mb-10 max-w-[34em] text-[18px]" style={{ color: C.muted }}>
                            {t('welcome.invest_desc')}
                        </p>

                        <div className="overflow-hidden rounded-[20px] border shadow-xl md:flex"
                             style={{ borderColor: `${C.ink}14`, boxShadow: '0 24px 60px rgba(42,37,33,0.12)' }}>

                            {/* Left panel */}
                            <div className="flex flex-col justify-between p-10 md:w-5/12"
                                 style={{ background: C.forest, color: C.cream }}>
                                <div>
                                    <h3 className="cf-serif mb-4 text-[24px] font-bold">{t('welcome.invest_why_title')}</h3>
                                    <p className="mb-8 text-[15.5px] leading-relaxed" style={{ color: C.onForest2 }}>
                                        {t('welcome.invest_why_desc')}
                                    </p>
                                </div>
                                <div className="space-y-4 text-[14.5px]" style={{ color: C.onForest }}>
                                    {[t('welcome.invest_point_1'), t('welcome.invest_point_2'), t('welcome.invest_point_3')].map((point) => (
                                        <div key={point} className="flex items-center gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                                                  style={{ background: C.copper300, color: C.cream }}>✓</span>
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right panel — form */}
                            <div className="p-10 md:w-7/12" style={{ background: C.cream50 }}>
                                {errors.email && (
                                    <div className="mb-6 rounded-[14px] p-4 flex items-start gap-3.5 border shadow-sm animate-fade-in"
                                         style={{ background: '#fdf4f4', borderColor: '#fca5a5', color: '#991b1b' }}>
                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                                        <div className="text-[14.5px] font-medium leading-relaxed">
                                            {t(errors.email)}
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="prenom" value={t('welcome.form_firstname')} className="text-slate-700 font-semibold" />
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
                                            <InputLabel htmlFor="nom" value={t('welcome.form_lastname')} className="text-slate-700 font-semibold" />
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
                                        <InputLabel htmlFor="email" value={t('welcome.form_email')} className="text-slate-700 font-semibold" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className={`mt-2 block w-full rounded-xl border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-colors ${errors.email ? '!border-red-400 focus:!ring-red-500/20 focus:!border-red-500 bg-red-50/30' : ''}`}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="telephone" value={t('welcome.form_phone')} className="text-slate-700 font-semibold" />
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
                                        {t('welcome.form_submit')}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer style={{ background: C.ink900, color: '#c9c1b4' }}>
                    <div className="mx-auto w-full max-w-[1180px] px-7 pb-12 pt-16">
                        <div className="mb-5 flex items-center gap-3">
                            <img src="/images/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
                            <span className="cf-serif text-[20px] font-semibold tracking-tight" style={{ color: C.cream }}>
                                CoFarm <span style={{ color: C.copper }}>&amp;</span> Partners
                            </span>
                        </div>
                        <p className="cf-serif mb-8 max-w-[20em] text-[24px] leading-[1.35] tracking-tight" style={{ color: C.cream }}>
                            {t('welcome.footer_quote')}
                        </p>
                        <div className="border-t pt-6 font-mono text-[12px] tracking-widest" style={{ borderColor: 'rgba(255,255,255,0.1)', color: C.muted400 }}>
                            {t('welcome.footer_rights', { year: new Date().getFullYear() })}
                        </div>
                    </div>
                </footer>

            </div>

            <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} maxWidth="md">
                <div className="p-10 text-center flex flex-col items-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] bg-emerald-50 text-emerald-500 shadow-inner">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="cf-serif text-[28px] font-bold text-slate-900 mb-3 tracking-tight">
                        {t('welcome.invest_success_modal_title')}
                    </h3>
                    <p className="text-slate-600 text-[16px] leading-relaxed mb-8 max-w-[280px]">
                        {t('welcome.invest_success_modal_desc')}
                    </p>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full rounded-xl py-3.5 text-[15px] font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        style={{ background: C.copper, boxShadow: '0 8px 25px rgba(188,107,67,0.25)' }}
                    >
                        {t('welcome.invest_success_modal_btn')}
                    </button>
                </div>
            </Modal>
        </>
    );
}