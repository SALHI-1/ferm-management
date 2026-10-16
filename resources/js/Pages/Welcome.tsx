import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect, useRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';
import { 
    Globe, Check, AlertCircle, CheckCircle2, TrendingUp, ShieldCheck, 
    Activity, Award, Users, ChevronRight, Sparkles, Sliders, Calendar, 
    ArrowRight, Phone, Mail, MapPin, Eye, Zap, Lock, Star, ChevronDown,
    Menu, X
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import VideoWithLoader from '@/Components/VideoWithLoader';

/* ── Luxury Organic Palette & Brand Tokens ── */
const C = {
    cream:     '#f8f4ec',       // Warm organic parchment
    cream50:   '#fdfcf9',       // Pure warm surface
    cream100:  '#eee7d7',       // Refined borders
    ink:       '#221d19',       // Obsidian deep warm text
    ink900:    '#171411',       // Pure dark footer
    forest:    '#25382a',       // Deep Moroccan racing forest green
    forestHover: '#2e4534',
    forestSurface: '#1f2e23',
    copper:    '#b45d34',       // Terracotta copper accent
    copperHover: '#9e4e29',
    copper300: '#cf8f6a',
    copperLight: 'rgba(180, 93, 52, 0.1)',
    gold:      '#d4a259',       // Moroccan amber gold
    goldLight: 'rgba(212, 162, 89, 0.15)',
    muted:     '#5c5348',       // Secondary warm text
    muted400:  '#8f8679',       // Subtle captions
    muted500:  '#73695c',       // Muted text
    onForest:  '#c5cfc0',
    onForest2: '#dce3d9',
};

/* ── Typography & Micro-Animations ── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Spline+Sans+Mono:wght@500;600&display=swap');

.cf-eyebrow {
    font-family: 'Spline Sans Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
}
.cf-serif {
    font-family: 'Spectral', Georgia, serif;
}
.cf-sans {
    font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
}

/* Animations */
@keyframes cfRise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes cfPulseDot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
}

.cf-rise { animation: cfRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
.cf-rise-2 { animation: cfRise 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both; }
.cf-pulse-dot { animation: cfPulseDot 2s infinite ease-in-out; }

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: ${C.cream};
}
::-webkit-scrollbar-thumb {
    background: ${C.copper300};
    border-radius: 9999px;
    border: 2px solid ${C.cream};
}
::-webkit-scrollbar-thumb:hover {
    background: ${C.copper};
}

/* Nav links custom hover */
.nav-link {
    color: ${C.muted500};
    font-size: 15px;
    font-weight: 600;
    position: relative;
    transition: color 0.25s ease;
}
.nav-link:hover {
    color: ${C.ink};
}
.nav-link::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: ${C.copper};
    transition: width 0.3s ease, transform 0.3s ease;
    transform: translateX(-50%);
    border-radius: 2px;
}
.nav-link:hover::after {
    width: 100%;
}

/* Range input styling for simulator */
.cf-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 9999px;
    background: ${C.cream100};
    outline: none;
    transition: background 0.2s;
}
.cf-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${C.copper};
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(180, 93, 52, 0.35);
    border: 3px solid #fff;
    transition: transform 0.15s ease;
}
.cf-slider::-webkit-slider-thumb:hover, .cf-slider::-webkit-slider-thumb:active {
    transform: scale(1.15);
}
.cf-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${C.copper};
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(180, 93, 52, 0.35);
    border: 3px solid #fff;
}

/* Glassmorphism utility */
.cf-glass {
    background: rgba(253, 251, 247, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
}
`;

export default function Welcome({ auth }: any) {
    const { flash, locale } = usePage().props as any;
    const [openFaq, setOpenFaq] = useState<number>(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [immersionTab, setImmersionTab] = useState<'herd' | 'iot' | 'market'>('herd');
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cowsCount, setCowsCount] = useState<number>(2); // Default to 2 cows in simulator
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollYRef = useRef(0);
    const { t } = useTrans();

    // Lock body scroll when mobile drawer modal is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessModal(true);
        }
    }, [flash]);

    // Handle scroll: sticky bottom bar & smart header show/hide on scroll direction (Headroom)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Sticky bottom bar
            if (currentScrollY > 450) {
                setShowStickyBar(true);
            } else {
                setShowStickyBar(false);
            }

            // Headroom navbar: always show at the top or when scrolling up, hide on scroll down
            if (currentScrollY <= 60) {
                setIsHeaderVisible(true);
            } else if (currentScrollY > lastScrollYRef.current + 10) {
                // Scrolling DOWN
                setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollYRef.current - 10) {
                // Scrolling UP
                setIsHeaderVisible(true);
            }

            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    /* ── Simulator Calculations (Real Agri-Tech Model) ── */
    const PRICE_PER_COW = 39000; // MAD
    const capitalInvested = cowsCount * PRICE_PER_COW;
    const milkAnnualEst = cowsCount * 13500; // Part nette investisseur ~13 500 MAD/vache/an
    const calfAnnualEst = cowsCount * 5500;  // Part annuelle vente veau ~5 500 MAD
    const totalAnnualCashflow = milkAnnualEst + calfAnnualEst; // ~19 000 MAD/vache/an
    const totalReturn5y = Math.round(capitalInvested * 2.4); // Projection x2.4 sur 5 ans
    const monthlyMilkEst = Math.round(milkAnnualEst / 12);

    const steps = [
        { 
            n: '01', 
            icon: ShieldCheck,
            t: t('welcome.model_step_1_title'), 
            d: t('welcome.model_step_1_desc') 
        },
        { 
            n: '02', 
            icon: Activity,
            t: t('welcome.model_step_2_title'), 
            d: t('welcome.model_step_2_desc') 
        },
        { 
            n: '03', 
            icon: TrendingUp,
            t: t('welcome.model_step_3_title'), 
            d: t('welcome.model_step_3_desc') 
        },
    ];

    const returnCards = [
        { v: t('welcome.hero_stat_1_val'), u: t('welcome.hero_stat_1_unit'), l: t('welcome.hero_stat_1_label') },
        { v: t('welcome.hero_stat_2_val'), u: t('welcome.hero_stat_2_unit'), l: t('welcome.hero_stat_2_label') },
        { v: '~19.5', u: '% CAGR', l: locale === 'en' ? 'Estimated Annual Return' : 'Rendement annualisé estimé' },
        { v: '27–31', u: t('welcome.hero_stat_3_unit'), l: t('welcome.hero_stat_3_label') },
    ];

    const marketPoints = [
        { 
            v: '32 M+', 
            l: locale === 'en' 
                ? 'Liters produced annually across partner farms — continuous local demand growth.' 
                : "Litres produits annuellement dans les fermes partenaires — demande locale en croissance constante." 
        },
        { 
            v: '×2.6',  
            l: locale === 'en'
                ? 'Average farmgate milk price increase in Morocco over the last decade.'
                : 'Hausse du prix moyen du lait au Maroc sur les 10 dernières années.' 
        },
        { 
            v: '< 5 %', 
            l: locale === 'en'
                ? 'National dairy self-sufficiency — large structural deficit to bridge.'
                : 'Auto-suffisance laitière nationale — fort déficit structurel à combler.' 
        },
    ];

    const faqs = [
        { 
            q: locale === 'en' ? 'What happens if a cow falls ill?' : 'Que se passe-t-il si la vache tombe malade ?', 
            a: locale === 'en' 
                ? "Every cow is fully covered by comprehensive livestock insurance included in the investment amount. In the event of total loss, the replacement indemnity is paid directly." 
                : "Chaque vache est couverte par une assurance bétail complète incluse dans le montant de participation. En cas de perte totale, la valeur de remplacement de l'animal est garantie." 
        },
        { 
            q: locale === 'en' ? 'Can I physically visit the farm?' : 'Puis-je visiter la ferme ?', 
            a: locale === 'en' 
                ? "Yes, absolutely. We organize quarterly on-site visits for our co-investors in Chaouia. Furthermore, you receive a detailed monthly digital report with photos, weights, and daily milk yields." 
                : "Oui, tout à fait. Nous organisons des visites trimestrielles pour nos investisseurs dans la région de la Chaouia. De plus, vous recevez un rapport mensuel illustré avec les données réelles de production." 
        },
        { 
            q: locale === 'en' ? 'What is the minimum commitment period?' : "Quelle est la durée minimum d'engagement ?", 
            a: locale === 'en' 
                ? "12 months minimum. Beyond that cycle, you can choose to renew, withdraw, or assign your share through our internal marketplace." 
                : "12 mois minimum. À l'issue de chaque cycle annuel, vous pouvez choisir de renouveler, de percevoir votre capital ou de céder votre part à un autre investisseur." 
        },
        { 
            q: locale === 'en' ? 'How and when are profits distributed?' : 'Comment et quand sont versés les dividendes ?', 
            a: locale === 'en' 
                ? "Milk dividends are audited and distributed quarterly directly to your bank account. The calf sale proceeds are distributed at the close of each annual cycle." 
                : "Les dividendes issus de la vente quotidienne du lait sont versés trimestriellement sur votre compte bancaire. La plus-value de la vente du veau est versée à la clôture de chaque cycle annuel." 
        },
    ];

    const testimonials = [
        {
            name: t('welcome.testi_1_name'),
            role: t('welcome.testi_1_role'),
            text: t('welcome.testi_1_text'),
            cows: '2 vaches',
            initials: 'KB',
        },
        {
            name: t('welcome.testi_2_name'),
            role: t('welcome.testi_2_role'),
            text: t('welcome.testi_2_text'),
            cows: '3 vaches',
            initials: 'SE',
        },
        {
            name: t('welcome.testi_3_name'),
            role: t('welcome.testi_3_role'),
            text: t('welcome.testi_3_text'),
            cows: '5 vaches',
            initials: 'YM',
        },
    ];

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 120);
    };

    return (
        <>
            <style>{STYLES}</style>
            <Head title={t('welcome.title')} />

            <div className="cf-sans min-h-screen relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900" 
                 style={{ background: C.cream, color: C.ink }}>

                {/* Subtle Ambient Radial Glows */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                    <div className="absolute -top-40 -right-40 h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full opacity-30 blur-[100px]"
                         style={{ background: 'radial-gradient(circle, #e9c996 0%, rgba(233,201,150,0) 70%)' }} />
                    <div className="absolute top-[40%] -left-32 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] rounded-full opacity-20 blur-[90px]"
                         style={{ background: 'radial-gradient(circle, #8ea38a 0%, rgba(142,163,138,0) 70%)' }} />
                </div>

                {/* ── TOP ANNOUNCEMENT BAR ── */}
                <aside aria-label="Announcement" className="relative z-50 text-[11px] sm:text-xs font-medium py-2 px-3 sm:px-4 border-b border-white/20"
                     style={{ background: C.forestSurface, color: C.onForest2 }}>
                    <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 cf-pulse-dot" />
                            <span className="font-semibold tracking-wide text-white truncate">
                                {t('welcome.hero_campaign_badge')}
                            </span>
                            <span className="hidden sm:inline text-white/40">•</span>
                            <span className="hidden sm:inline text-white/80 truncate">
                                {t('welcome.hero_campaign_desc')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-[11.5px] text-white/70">
                            <span className="hidden md:flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 text-amber-400" />
                                {t('welcome.hero_pilot_farm')}
                            </span>
                            <a href="#demande" className="text-amber-300 hover:text-white font-semibold underline underline-offset-2">
                                {locale === 'en' ? 'Join →' : 'Rejoindre →'}
                            </a>
                        </div>
                    </div>
                </aside>

                {/* ── NAVBAR ── */}
                <nav style={{ background: `${C.cream}f2`, borderBottom: `1px solid ${C.ink}14` }}
                     className={`sticky top-0 z-40 backdrop-blur-md shadow-[0_2px_15px_-4px_rgba(34,29,25,0.04)] transition-transform duration-300 ease-in-out ${
                         isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
                     }`}>
                    <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                        
                        {/* Left: Mobile Menu Button (lg:hidden) + Logo */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-1">
                            {/* Mobile Hamburger Button on the Left */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Ouvrir le menu de navigation"
                                aria-expanded={mobileMenuOpen}
                                className="lg:hidden p-1.5 sm:p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 border border-stone-300/50 transition-colors flex items-center justify-center shrink-0"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Logo */}
                            <a href="#top" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                                <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-stone-200/60 overflow-hidden p-1 transition-transform group-hover:scale-105">
                                    <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="cf-serif text-[15px] xs:text-[17px] sm:text-[21px] font-bold tracking-tight leading-none truncate" style={{ color: C.ink }}>
                                        CoFarm <span style={{ color: C.copper }}>&amp;</span> Partners
                                    </span>
                                    <span className="cf-eyebrow text-[8px] sm:text-[9px] text-stone-500 tracking-widest mt-0.5 hidden xs:block">
                                        Dairy Co-Investment
                                    </span>
                                </div>
                            </a>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden items-center gap-7 lg:flex">
                            {[
                                ['#simulation', t('welcome.nav_simulation')],
                                ['#fonctionnement', t('welcome.nav_how_it_works')],
                                ['#ferme', t('welcome.nav_immersion')],
                                ['#rendements', t('welcome.nav_returns')],
                                ['#avis', t('welcome.nav_testimonials')],
                                ['#faq', t('welcome.nav_faq')],
                            ].map(([href, label]) => (
                                <a key={href} href={href} className="nav-link">
                                    {label}
                                </a>
                            ))}
                        </div>

                        {/* Right CTA, Lang & Mobile Menu Button */}
                        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        aria-label="Changer de langue"
                                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200/50 border border-stone-300/70 transition-all duration-200"
                                    >
                                        <Globe className="h-3.5 w-3.5 text-stone-500" />
                                        <span>{locale === 'en' ? 'EN' : 'FR'}</span>
                                        <ChevronDown className="h-3 w-3 text-stone-400" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content 
                                    align="right" 
                                    width="32"
                                    containerClasses="rounded-2xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] bg-white/95 backdrop-blur-2xl"
                                    contentClasses="p-1.5 space-y-1"
                                >
                                    <a
                                        href={route('language.switch', { locale: 'fr' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-xs font-bold tracking-wider transition-all duration-200 rounded-xl ${
                                            locale === 'fr' 
                                                ? 'bg-forest/10 text-forest font-black' 
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>Français (FR)</span>
                                        {locale === 'fr' && <Check className="h-3.5 w-3.5 text-forest" />}
                                    </a>
                                    <a
                                        href={route('language.switch', { locale: 'en' })}
                                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-xs font-bold tracking-wider transition-all duration-200 rounded-xl ${
                                            locale === 'en' 
                                                ? 'bg-forest/10 text-forest font-black' 
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <span>English (EN)</span>
                                        {locale === 'en' && <Check className="h-3.5 w-3.5 text-forest" />}
                                    </a>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* Direct button on sm+ */}
                            {auth.user ? (
                                <Link href={route('dashboard')}
                                      className="hidden sm:inline-flex rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg items-center gap-1.5"
                                      style={{ background: C.forest, color: C.cream50, boxShadow: `0 4px 14px ${C.forest}30` }}>
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{t('welcome.nav_dashboard')}</span>
                                </Link>
                            ) : (
                                <Link href={route('login')}
                                      className="hidden sm:inline-flex rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg border border-stone-800/10"
                                      style={{ background: C.forest, color: C.cream50, boxShadow: `0 4px 14px ${C.forest}30` }}>
                                    {t('welcome.nav_login')}
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── MOBILE SLIDE-OVER MODAL (LEFT SIDE, ~3/4 WIDTH, FIXED ON SCROLL) ── */}
                <div 
                    className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
                        mobileMenuOpen ? 'visible' : 'invisible delay-300 pointer-events-none'
                    }`}
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Dark Blurred Backdrop covering remaining width (on the right) and background */}
                    <div 
                        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 ${
                            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Left Slide-over Modal (Takes ~78% width, strictly fixed on scroll) */}
                    <div 
                        className={`fixed inset-y-0 left-0 z-50 w-[78%] sm:w-[340px] max-w-[360px] bg-stone-50 border-r border-stone-200/90 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
                            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                        style={{ height: '100dvh' }}
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-stone-200/80 bg-white/90 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-xs"
                                     style={{ background: C.forest, color: C.gold }}>
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="cf-serif text-base font-bold tracking-tight block leading-tight" style={{ color: C.forest }}>
                                        CoFarm
                                    </span>
                                    <span className="text-[9px] font-semibold uppercase tracking-wider block text-stone-500">
                                        Menu Navigation
                                    </span>
                                </div>
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="Fermer le menu"
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 border border-stone-200 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable Navigation Body */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {/* Account Action (Dashboard / Login) */}
                            <div className="pb-3 border-b border-stone-200/80">
                                {auth.user ? (
                                    <Link 
                                        href={route('dashboard')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:brightness-110"
                                        style={{ background: C.forest }}
                                    >
                                        <Users className="h-4 w-4 text-emerald-400" />
                                        <span>{t('welcome.nav_dashboard')}</span>
                                    </Link>
                                ) : (
                                    <Link 
                                        href={route('login')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:brightness-110"
                                        style={{ background: C.forest }}
                                    >
                                        <Lock className="h-3.5 w-3.5 text-amber-300" />
                                        <span>{t('welcome.nav_login')}</span>
                                    </Link>
                                )}
                            </div>

                            {/* Section Navigation Links with Icons */}
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                                    Navigation
                                </div>
                                {[
                                    { id: 'simulation', label: t('welcome.nav_simulation'), icon: Sliders },
                                    { id: 'fonctionnement', label: t('welcome.nav_how_it_works'), icon: Activity },
                                    { id: 'ferme', label: t('welcome.nav_immersion'), icon: Eye },
                                    { id: 'rendements', label: t('welcome.nav_returns'), icon: TrendingUp },
                                    { id: 'avis', label: t('welcome.nav_testimonials'), icon: Star },
                                    { id: 'faq', label: t('welcome.nav_faq'), icon: AlertCircle },
                                ].map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => scrollToSection(item.id)}
                                            className="w-full text-left py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200/80 transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-stone-200/60 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                                                    <IconComponent className="h-3.5 w-3.5" />
                                                </div>
                                                <span>{item.label}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 group-hover:text-amber-800 transition-all" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drawer Footer CTA */}
                        <div className="p-4 border-t border-stone-200/80 bg-white/70 backdrop-blur-sm shrink-0 space-y-2">
                            <button
                                type="button"
                                onClick={() => scrollToSection('demande')}
                                className="w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:brightness-110 flex items-center justify-center gap-2"
                                style={{ background: C.copper }}
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>{t('welcome.hero_btn_invest')}</span>
                            </button>
                            <p className="text-[10px] text-center text-stone-500 font-medium">
                                Places limitées • Contrat notarié garanti
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── HERO SECTION ── */}
                <header id="top" className="relative z-10 pt-6 sm:pt-12 lg:pt-16 pb-12 sm:pb-20 lg:pb-24">
                    <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 sm:gap-12 px-4 sm:px-6 lg:grid-cols-12">
                        
                        {/* Left Column (7 cols) */}
                        <div className="cf-rise lg:col-span-7">
                            
                            {/* Live Cohort Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 mb-5 sm:mb-6 border shadow-xs max-w-full flex-wrap"
                                 style={{ background: C.cream50, borderColor: `${C.copper}40` }}>
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 cf-pulse-dot shrink-0" />
                                <span className="cf-eyebrow text-[10px] sm:text-[11px] font-bold" style={{ color: C.copper }}>
                                    {t('welcome.hero_eyebrow')}
                                </span>
                                <span className="hidden sm:inline text-stone-300">|</span>
                                <span className="text-[11px] sm:text-xs font-semibold text-stone-600">
                                    30 Vaches / Cohorte
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="cf-serif mb-4 sm:mb-6 text-[34px] xs:text-[40px] sm:text-[52px] lg:text-[62px] font-bold leading-[1.08] tracking-tight text-stone-900 break-words"
                                style={{ color: C.ink }}>
                                CoFarm Dairy<br />
                                <span style={{ color: C.forest }}>Partners</span>
                                <span className="text-amber-600">.</span>
                            </h1>

                            <p className="mb-6 sm:mb-8 max-w-[32em] text-[16px] sm:text-[19px] leading-relaxed text-stone-700">
                                {t('welcome.hero_desc')}
                            </p>

                            {/* Quote with Luxury Card Style */}
                            <div className="mb-6 sm:mb-9 rounded-2xl p-4 sm:p-5 border shadow-xs relative overflow-hidden"
                                 style={{ background: `${C.cream50}cc`, borderColor: `${C.copper}30` }}>
                                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ background: C.copper }} />
                                <p className="italic text-stone-700 text-[14.5px] sm:text-[16px] pl-2 font-medium">
                                    "{t('welcome.hero_quote')}"
                                </p>
                                <div className="mt-2 pl-2 flex flex-col xs:flex-row xs:items-center justify-between text-xs font-semibold gap-1">
                                    <span style={{ color: C.copper }}>— Y. Manyani, Fondateur</span>
                                    <span className="text-stone-400">Ferme Pilote Chaouia</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
                                <a href="#demande"
                                   className="group flex items-center justify-center gap-2.5 rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center"
                                   style={{ 
                                       background: `linear-gradient(135deg, ${C.copper} 0%, #c96e3e 100%)`, 
                                       color: C.cream50, 
                                       boxShadow: '0 8px 25px rgba(180,93,52,0.35)' 
                                   }}>
                                    <span>{t('welcome.hero_btn_invest')}</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>

                                <button onClick={() => scrollToSection('simulation')}
                                   className="flex items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-[14.5px] sm:text-[15.5px] font-semibold transition-all hover:bg-stone-200/60"
                                   style={{ border: `1.5px solid ${C.forest}55`, color: C.forest }}>
                                    <Sliders className="h-4 w-4 text-emerald-700" />
                                    <span>{locale === 'en' ? 'Simulate Returns' : 'Simuler mes rendements'}</span>
                                </button>
                            </div>

                            {/* Key Performance Indicators */}
                            <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-5 border-t pt-6 sm:pt-8" style={{ borderColor: `${C.ink}18` }}>
                                {[
                                    { v: t('welcome.hero_stat_1_val'), u: t('welcome.hero_stat_1_unit'), l: t('welcome.hero_stat_1_label') },
                                    { v: t('welcome.hero_stat_2_val'), u: t('welcome.hero_stat_2_unit'), l: t('welcome.hero_stat_2_label'), accent: true },
                                    { v: t('welcome.hero_stat_3_val'), u: t('welcome.hero_stat_3_unit'), l: t('welcome.hero_stat_3_label') },
                                ].map(({ v, u, l, accent }) => (
                                    <div key={l} className="flex flex-col">
                                        <div className="cf-serif text-[22px] xs:text-[26px] sm:text-[34px] font-bold leading-none" style={{ color: C.forest }}>
                                            {v}
                                            {u && (
                                                <span className="ml-1 text-[11px] sm:text-[14px] font-bold tracking-normal"
                                                      style={{ color: accent ? C.copper : C.muted400 }}>
                                                    {u}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1.5 sm:mt-2 text-[11px] sm:text-[13px] font-medium leading-tight text-stone-600">
                                            {l}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right Column (5 cols) — Video with Floating Badges */}
                        <div className="cf-rise-2 lg:col-span-5 relative mt-4 lg:mt-0">
                            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden rounded-[22px] sm:rounded-[26px] shadow-2xl border-2 sm:border-4 border-white/80">
                                <VideoWithLoader
                                    className="h-full w-full object-cover"
                                    src="/videos/ferm-video.mp4"
                                    autoPlay loop muted playsInline
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/10 pointer-events-none" />

                                {/* Top Floating Badge: Quality Certification */}
                                <div className="absolute top-3 right-3 sm:top-5 sm:right-5 cf-glass rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-md border border-white/60 flex items-center gap-2">
                                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 shrink-0" />
                                    <div>
                                        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-800">ONSSA &amp; MAMDA</div>
                                        <div className="text-[9px] sm:text-[11px] text-stone-600">Cheptel 100% certifié</div>
                                    </div>
                                </div>

                                {/* Bottom Floating Card: Real Asset (no negative margin on mobile!) */}
                                <div className="absolute left-3 sm:left-4 bottom-3 sm:bottom-6 max-w-[calc(100%-24px)] sm:max-w-[240px] rounded-xl sm:rounded-2xl border px-3.5 py-3 sm:px-5 sm:py-4 shadow-xl backdrop-blur-md"
                                     style={{ background: 'rgba(253, 251, 247, 0.94)', borderColor: `${C.ink}15` }}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.copper }} />
                                        <p className="cf-eyebrow text-[9.5px] sm:text-[10.5px] font-bold" style={{ color: C.copper }}>
                                            {t('welcome.hero_badge_title')}
                                        </p>
                                    </div>
                                    <p className="text-[12px] sm:text-[13.5px] font-medium leading-snug text-stone-800">
                                        {t('welcome.hero_badge_desc')}
                                    </p>
                                    <div className="mt-2 pt-1.5 border-t border-stone-200/80 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500">
                                        <span>Rendement moyen</span>
                                        <strong className="text-emerald-700">31.4 L / jour</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                {/* ── INTERACTIVE ROI SIMULATOR SECTION ── */}
                <section id="simulation" className="relative z-10 py-14 sm:py-20 border-y"
                         style={{ background: C.cream50, borderColor: `${C.ink}10` }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                        
                        {/* Section Header */}
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                            <span className="cf-eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[10px] sm:text-xs"
                                  style={{ background: C.copperLight, color: C.copper }}>
                                <Sparkles className="h-3.5 w-3.5" />
                                {t('welcome.sim_eyebrow')}
                            </span>
                            <h2 className="cf-serif text-[28px] xs:text-[32px] sm:text-[44px] font-bold tracking-tight leading-tight"
                                style={{ color: C.ink }}>
                                {t('welcome.sim_title')}
                            </h2>
                            <p className="mt-2.5 text-[15px] sm:text-[17px] text-stone-600">
                                {t('welcome.sim_desc')}
                            </p>
                        </div>

                        {/* Interactive Calculator Card */}
                        <div className="rounded-[22px] sm:rounded-[28px] border shadow-xl overflow-hidden bg-white"
                             style={{ borderColor: `${C.ink}14` }}>
                            
                            <div className="grid lg:grid-cols-12">
                                
                                {/* Left Side: Controls & Sliders (7 cols) */}
                                <div className="p-5 sm:p-8 lg:p-12 lg:col-span-7 flex flex-col justify-between"
                                     style={{ background: C.cream50 }}>
                                    
                                    <div>
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                                                {t('welcome.sim_cows_label')}
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="cf-serif text-[32px] sm:text-[38px] font-black" style={{ color: C.forest }}>
                                                    {cowsCount}
                                                </span>
                                                <span className="text-stone-500 font-semibold text-xs sm:text-sm">
                                                    {cowsCount > 1 ? (locale === 'en' ? 'cows' : 'vaches') : (locale === 'en' ? 'cow' : 'vache')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Range Slider */}
                                        <div className="mb-5 sm:mb-6">
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                value={cowsCount}
                                                aria-label={t('welcome.sim_cows_label')}
                                                onChange={(e) => setCowsCount(parseInt(e.target.value) || 1)}
                                                className="cf-slider"
                                            />
                                            <div className="flex justify-between text-[10.5px] sm:text-xs font-semibold text-stone-400 mt-2">
                                                <span>1 vache</span>
                                                <span>3</span>
                                                <span>5</span>
                                                <span>7</span>
                                                <span>10 max</span>
                                            </div>
                                        </div>

                                        {/* Quick Pick Buttons */}
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
                                            <span className="text-xs font-semibold text-stone-400 mr-1 hidden xs:inline">Raccourcis :</span>
                                            {[1, 2, 3, 5, 10].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setCowsCount(num)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                                                        cowsCount === num
                                                            ? 'shadow-xs text-white'
                                                            : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300'
                                                    }`}
                                                    style={{
                                                        background: cowsCount === num ? C.forest : undefined,
                                                    }}
                                                >
                                                    {num} {num > 1 ? (locale === 'en' ? 'cows' : 'vaches') : (locale === 'en' ? 'cow' : 'vache')}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Breakdown Metrics Grid */}
                                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-stone-200/80">
                                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-stone-200/60 shadow-xs">
                                                <div className="text-[11px] sm:text-xs font-semibold text-stone-500">
                                                    {t('welcome.sim_capital_label')}
                                                </div>
                                                <div className="cf-serif text-[20px] sm:text-[24px] font-bold mt-0.5 sm:mt-1" style={{ color: C.ink }}>
                                                    {capitalInvested.toLocaleString()} <span className="text-[11px] sm:text-xs font-semibold text-stone-500">MAD</span>
                                                </div>
                                                <div className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">39 000 MAD / unité</div>
                                            </div>

                                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-stone-200/60 shadow-xs">
                                                <div className="text-[11px] sm:text-xs font-semibold text-stone-500">
                                                    {t('welcome.sim_milk_annual')}
                                                </div>
                                                <div className="cf-serif text-[20px] sm:text-[24px] font-bold mt-0.5 sm:mt-1 text-emerald-800">
                                                    +{milkAnnualEst.toLocaleString()} <span className="text-[11px] sm:text-xs font-semibold text-stone-500">MAD</span>
                                                </div>
                                                <div className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5">
                                                    ~{monthlyMilkEst.toLocaleString()} MAD / mois
                                                </div>
                                            </div>

                                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-stone-200/60 shadow-xs">
                                                <div className="text-[11px] sm:text-xs font-semibold text-stone-500">
                                                    {t('welcome.sim_calf_annual')}
                                                </div>
                                                <div className="cf-serif text-[20px] sm:text-[24px] font-bold mt-0.5 sm:mt-1" style={{ color: C.copper }}>
                                                    +{calfAnnualEst.toLocaleString()} <span className="text-[11px] sm:text-xs font-semibold text-stone-500">MAD</span>
                                                </div>
                                                <div className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">Partage 50/50 à la vente</div>
                                            </div>

                                            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-stone-200/60 shadow-xs">
                                                <div className="text-[11px] sm:text-xs font-semibold text-stone-500">
                                                    {t('welcome.sim_total_annual')}
                                                </div>
                                                <div className="cf-serif text-[20px] sm:text-[24px] font-bold mt-0.5 sm:mt-1" style={{ color: C.forest }}>
                                                    ~{totalAnnualCashflow.toLocaleString()} <span className="text-[11px] sm:text-xs font-semibold text-stone-500">MAD / an</span>
                                                </div>
                                                <div className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">Lait + Veaux cumulés</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security guarantee line */}
                                    <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[11px] sm:text-xs text-stone-500">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Couverture bétail totale &amp; traçabilité ONSSA incluse pour chaque animal.</span>
                                    </div>

                                </div>

                                {/* Right Side: 5-Year Return Synthesis (5 cols) */}
                                <div className="p-6 sm:p-8 lg:p-12 lg:col-span-5 flex flex-col justify-between text-white"
                                     style={{ background: `linear-gradient(145deg, ${C.forest} 0%, ${C.forestSurface} 100%)` }}>
                                    
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 bg-white/10 text-amber-300">
                                            <Award className="h-3.5 w-3.5" />
                                            {t('welcome.sim_cagr_badge')}
                                        </div>

                                        <p className="text-xs sm:text-sm font-medium text-white/70">
                                            {t('welcome.sim_total_5y')}
                                        </p>

                                        <div className="cf-serif text-[34px] xs:text-[40px] sm:text-[50px] font-extrabold tracking-tight text-white mt-1 leading-none break-all">
                                            {totalReturn5y.toLocaleString()} <span className="text-base sm:text-lg font-semibold text-amber-400">MAD</span>
                                        </div>

                                        <div className="mt-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 space-y-2 text-xs text-white/80">
                                            <div className="flex justify-between items-center">
                                                <span>Rendement estimé :</span>
                                                <strong className="text-amber-300 font-bold">~19.5% CAGR</strong>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Retour capital :</span>
                                                <strong className="text-white font-semibold">27 à 31 mois</strong>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Fréquence gains :</span>
                                                <strong className="text-white font-semibold">Trimestrielle</strong>
                                            </div>
                                        </div>

                                        {/* Visual Progress Payback Bar (Clean compact on mobile) */}
                                        <div className="mt-5 sm:mt-6">
                                            <div className="flex justify-between text-[10px] sm:text-[11px] text-white/60 mb-1.5 font-medium">
                                                <span>Mois 0</span>
                                                <span className="text-amber-300 font-bold">Mois 27 (Seuil)</span>
                                                <span>Année 5</span>
                                            </div>
                                            <div className="h-2 sm:h-2.5 w-full bg-white/20 rounded-full overflow-hidden p-0.5">
                                                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 w-[55%]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => scrollToSection('demande')}
                                            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 sm:py-4 text-sm sm:text-base font-bold text-stone-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                                            style={{ background: C.gold }}
                                        >
                                            <span>{t('welcome.sim_cta')} ({cowsCount})</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                        <p className="text-center text-[10.5px] sm:text-[11px] text-white/50 mt-2">
                                            Sans aucun paiement en ligne • Réservation prioritaire
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section id="fonctionnement" style={{ background: C.cream, borderBottom: `1px solid ${C.ink}10` }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
                        <div className="max-w-2xl mb-10 sm:mb-14">
                            <p className="cf-eyebrow mb-2 sm:mb-3" style={{ color: C.copper }}>{t('welcome.model_eyebrow')}</p>
                            <h2 className="cf-serif mb-3 sm:mb-4 text-[28px] xs:text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight"
                                style={{ color: C.ink }}>
                                {t('welcome.model_title')}
                            </h2>
                            <p className="text-[16px] sm:text-[18px] text-stone-600">
                                {t('welcome.model_desc')}
                            </p>
                        </div>

                        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
                            {steps.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.n} 
                                         className="group rounded-[20px] sm:rounded-[24px] border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-white"
                                         style={{ borderColor: `${C.ink}14` }}>
                                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                                            <div className="cf-serif flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-sm sm:text-base font-bold shadow-xs transition-transform group-hover:scale-110"
                                                 style={{ background: C.forest, color: C.cream }}>
                                                {s.n}
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <h3 className="cf-serif mb-2.5 text-[21px] sm:text-[24px] font-bold tracking-tight text-stone-900">
                                            {s.t}
                                        </h3>
                                        <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-600">
                                            {s.d}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="cf-serif mt-8 sm:mt-10 max-w-[48em] text-[13px] sm:text-[14px] italic leading-relaxed text-stone-500">
                            {t('welcome.model_disclaimer')}
                        </p>
                    </div>
                </section>

                {/* ── IMMERSION & HIGH-TECH FARM GALLERY ── */}
                <section id="ferme" className="py-14 sm:py-20 lg:py-24 relative" style={{ background: C.cream50 }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                        
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6">
                            <div className="max-w-2xl">
                                <span className="cf-eyebrow inline-block mb-2 sm:mb-3" style={{ color: C.copper }}>
                                    {t('welcome.immersion_eyebrow')}
                                </span>
                                <h2 className="cf-serif text-[28px] xs:text-[34px] sm:text-[44px] font-bold tracking-tight leading-tight"
                                    style={{ color: C.ink }}>
                                    {t('welcome.immersion_title')}
                                </h2>
                                <p className="mt-2.5 text-[15px] sm:text-[17px] text-stone-600">
                                    {t('welcome.immersion_desc')}
                                </p>
                            </div>

                            {/* Responsive Tabs (Grid on mobile, flex on desktop) */}
                            <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-stone-200/60 border border-stone-300/60">
                                <button
                                    type="button"
                                    onClick={() => setImmersionTab('herd')}
                                    className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                                        immersionTab === 'herd'
                                            ? 'bg-white shadow-xs text-stone-900'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <span>🐄 </span>
                                    <span className="hidden sm:inline">{t('welcome.immersion_tab_1')}</span>
                                    <span className="sm:hidden">Cheptel</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImmersionTab('iot')}
                                    className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                                        immersionTab === 'iot'
                                            ? 'bg-white shadow-xs text-stone-900'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <span>📡 </span>
                                    <span className="hidden sm:inline">{t('welcome.immersion_tab_2')}</span>
                                    <span className="sm:hidden">IoT Tech</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImmersionTab('market')}
                                    className={`px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                                        immersionTab === 'market'
                                            ? 'bg-white shadow-xs text-stone-900'
                                            : 'text-stone-600 hover:text-stone-900'
                                    }`}
                                >
                                    <span>🥛 </span>
                                    <span className="hidden sm:inline">{t('welcome.immersion_tab_3')}</span>
                                    <span className="sm:hidden">Laiterie</span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Tab Content Display */}
                        <div className="rounded-[22px] sm:rounded-[28px] overflow-hidden border shadow-xl bg-white grid lg:grid-cols-12"
                             style={{ borderColor: `${C.ink}14` }}>
                            
                            {/* Visual Asset Side (7 cols) */}
                            <div className="lg:col-span-7 relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100 min-h-[220px] sm:min-h-[340px]">
                                {immersionTab === 'herd' && (
                                    <img
                                        src="/images/modern_dairy_farm.jpg"
                                        alt="Modern sustainable dairy farm in Morocco"
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                )}
                                {immersionTab === 'iot' && (
                                    <img
                                        src="/images/smart_farm_traceability.jpg"
                                        alt="Smart farming IoT cow ear tag and telemetry"
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                )}
                                {immersionTab === 'market' && (
                                    <div className="h-full w-full relative min-h-[260px] sm:min-h-[360px] flex items-center justify-center p-6 sm:p-8 text-white"
                                         style={{ background: `linear-gradient(135deg, ${C.forest} 0%, #152018 100%)` }}>
                                        <div className="text-center max-w-md">
                                            <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/10 text-amber-300 mb-4 sm:mb-6">
                                                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
                                            </div>
                                            <h3 className="cf-serif text-[22px] sm:text-[28px] font-bold mb-2 sm:mb-3">
                                                {t('welcome.immersion_tab_3_title')}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4 sm:mb-6">
                                                {t('welcome.immersion_tab_3_desc')}
                                            </p>
                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-[11px] sm:text-xs font-semibold">
                                                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                                                <span>Enlèvement quotidien réfrigéré garanti</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Badge on Image */}
                                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 cf-glass rounded-xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-md border border-white/60 text-[10.5px] sm:text-xs font-semibold text-stone-800">
                                    📍 Chaouia-Ouardigha, Maroc
                                </div>
                            </div>

                            {/* Informational Text Side (5 cols) */}
                            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between"
                                 style={{ background: C.cream50 }}>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4"
                                         style={{ color: C.copper }}>
                                        <Zap className="h-3.5 w-3.5" />
                                        {immersionTab === 'herd' && t('welcome.immersion_tab_1')}
                                        {immersionTab === 'iot' && t('welcome.immersion_tab_2')}
                                        {immersionTab === 'market' && t('welcome.immersion_tab_3')}
                                    </div>

                                    <h3 className="cf-serif text-[22px] sm:text-[26px] font-bold text-stone-900 mb-3 sm:mb-4 leading-snug">
                                        {immersionTab === 'herd' && t('welcome.immersion_tab_1_title')}
                                        {immersionTab === 'iot' && t('welcome.immersion_tab_2_title')}
                                        {immersionTab === 'market' && t('welcome.immersion_tab_3_title')}
                                    </h3>

                                    <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-600 mb-5 sm:mb-6">
                                        {immersionTab === 'herd' && t('welcome.immersion_tab_1_desc')}
                                        {immersionTab === 'iot' && t('welcome.immersion_tab_2_desc')}
                                        {immersionTab === 'market' && t('welcome.immersion_tab_3_desc')}
                                    </p>

                                    {/* Bullet Features */}
                                    <div className="space-y-2.5 sm:space-y-3 pt-5 sm:pt-6 border-t border-stone-200 text-xs font-semibold text-stone-700">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <span>Alimentation saine &amp; locale (luzerne, ensilage)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <span>Rapports photographiques &amp; métriques chaque mois</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <span>Visites guidées trimestrielles pour investisseurs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-200">
                                    <a
                                        href="#demande"
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-800 transition-colors"
                                    >
                                        <span>Participer à cette exploitation</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* ── RETURNS & MACRO MARKET STATS ── */}
                <section id="rendements" style={{ background: C.cream }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
                        <div className="max-w-2xl mb-10 sm:mb-12">
                            <p className="cf-eyebrow mb-2 sm:mb-3" style={{ color: C.copper }}>{t('welcome.returns_eyebrow')}</p>
                            <h2 className="cf-serif mb-3 sm:mb-4 text-[28px] xs:text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight"
                                style={{ color: C.ink }}>
                                {t('welcome.returns_title')}
                            </h2>
                            <p className="text-[16px] sm:text-[18px] text-stone-600">
                                {t('welcome.returns_desc')}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
                            {returnCards.map((c) => (
                                <div key={c.l} 
                                     className="group rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" 
                                     style={{ background: C.forest, color: C.cream }}>
                                    <div className="cf-serif text-[32px] sm:text-[36px] font-bold leading-none tracking-tight">
                                        {c.v}
                                        {c.u && (
                                            <span className="text-[13px] sm:text-[14px] font-medium ml-1" style={{ color: C.onForest }}>
                                                {c.u}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2.5 sm:mt-3 text-[13px] sm:text-[14px] font-medium leading-snug" style={{ color: C.onForest2 }}>
                                        {c.l}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── MOROCCAN MARKET CONTEXT ── */}
                <section id="marche" style={{ background: C.forest, color: C.cream }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
                        <p className="cf-eyebrow mb-2 sm:mb-3" style={{ color: C.gold }}>{t('welcome.market_eyebrow')}</p>
                        <h2 className="cf-serif mb-3 sm:mb-4 max-w-[18em] text-[28px] xs:text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight">
                            {t('welcome.market_title')}
                        </h2>
                        <p className="mb-10 sm:mb-14 max-w-[38em] text-[16px] sm:text-[18px]" style={{ color: C.onForest2 }}>
                            {t('welcome.market_desc')}
                        </p>
                        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                            {marketPoints.map((pt) => (
                                <div key={pt.v} className="border-t-2 pt-5 sm:pt-6" style={{ borderColor: `${C.gold}70` }}>
                                    <div className="cf-serif mb-2 sm:mb-3 text-[38px] sm:text-[46px] font-bold leading-none" style={{ color: C.gold }}>
                                        {pt.v}
                                    </div>
                                    <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed" style={{ color: C.onForest2 }}>
                                        {pt.l}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TRUST & INVESTOR PROTECTION PILLARS ── */}
                <section id="securite" className="py-14 sm:py-20 lg:py-24 border-b" style={{ background: C.cream50, borderColor: `${C.ink}10` }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                            <span className="cf-eyebrow inline-block mb-2 sm:mb-3" style={{ color: C.copper }}>
                                {t('welcome.trust_eyebrow')}
                            </span>
                            <h2 className="cf-serif text-[28px] xs:text-[34px] sm:text-[42px] font-bold tracking-tight text-stone-900 leading-tight">
                                {t('welcome.trust_title')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: t('welcome.trust_item_1_title'),
                                    desc: t('welcome.trust_item_1_desc'),
                                },
                                {
                                    icon: Award,
                                    title: t('welcome.trust_item_2_title'),
                                    desc: t('welcome.trust_item_2_desc'),
                                },
                                {
                                    icon: Activity,
                                    title: t('welcome.trust_item_3_title'),
                                    desc: t('welcome.trust_item_3_desc'),
                                },
                                {
                                    icon: Calendar,
                                    title: t('welcome.trust_item_4_title'),
                                    desc: t('welcome.trust_item_4_desc'),
                                },
                            ].map((pillar, i) => {
                                const Icon = pillar.icon;
                                return (
                                    <div key={i} className="p-5 sm:p-7 rounded-[18px] sm:rounded-[22px] bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
                                             style={{ background: C.copperLight, color: C.copper }}>
                                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <h3 className="cf-serif text-[18px] sm:text-[19px] font-bold text-stone-900 mb-2 leading-snug">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-xs text-stone-600 leading-relaxed">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS / CO-INVESTOR REVIEWS ── */}
                <section id="avis" className="py-14 sm:py-20 lg:py-24" style={{ background: C.cream }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                            <span className="cf-eyebrow inline-block mb-2 sm:mb-3" style={{ color: C.copper }}>
                                {t('welcome.testimonials_eyebrow')}
                            </span>
                            <h2 className="cf-serif text-[28px] xs:text-[34px] sm:text-[42px] font-bold tracking-tight text-stone-900 leading-tight">
                                {t('welcome.testimonials_title')}
                            </h2>
                            <p className="mt-2.5 text-[15px] sm:text-[17px] text-stone-600">
                                {t('welcome.testimonials_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                            {testimonials.map((item, idx) => (
                                <div key={idx} 
                                     className="rounded-[20px] sm:rounded-[22px] p-6 sm:p-8 bg-white border shadow-xs flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md"
                                     style={{ borderColor: `${C.ink}12` }}>
                                    <div>
                                        {/* Stars */}
                                        <div className="flex items-center gap-1 text-amber-500 mb-4 sm:mb-5">
                                            {[...Array(5)].map((_, s) => (
                                                <Star key={s} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>

                                        <p className="text-[14px] sm:text-[15px] leading-relaxed text-stone-700 italic mb-5 sm:mb-6">
                                            "{item.text}"
                                        </p>
                                    </div>

                                    <div className="pt-4 sm:pt-5 border-t border-stone-100 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
                                                 style={{ background: C.forest, color: C.cream }}>
                                                {item.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</div>
                                                <div className="text-[11px] text-stone-500 truncate">{item.role}</div>
                                            </div>
                                        </div>
                                        <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200/60">
                                            {item.cows}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section id="faq" style={{ background: C.cream50, borderBottom: `1px solid ${C.ink}10` }}>
                    <div className="mx-auto w-full max-w-[880px] px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
                        <p className="cf-eyebrow mb-2 sm:mb-3 text-center" style={{ color: C.copper }}>{t('welcome.faq_eyebrow')}</p>
                        <h2 className="cf-serif mb-8 sm:mb-12 text-center text-[28px] xs:text-[34px] sm:text-[42px] font-bold leading-tight tracking-tight"
                            style={{ color: C.ink }}>
                            {t('welcome.faq_title')}
                        </h2>
                        <div className="flex flex-col gap-3 sm:gap-3.5">
                            {faqs.map((item, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div key={i} className="overflow-hidden rounded-[16px] sm:rounded-[18px] border bg-white transition-all shadow-xs"
                                         style={{ borderColor: isOpen ? `${C.copper}40` : `${C.ink}12` }}>
                                        <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : i)}
                                                className="flex w-full cursor-pointer items-center justify-between gap-3 sm:gap-4 px-5 py-4 sm:px-7 sm:py-6 text-left"
                                                style={{ color: C.ink }}>
                                            <span className="cf-serif text-[16.5px] sm:text-[19px] font-bold tracking-tight">{item.q}</span>
                                            <span className="cf-serif shrink-0 text-[22px] sm:text-[26px] leading-none transition-transform duration-200" 
                                                  style={{ color: C.copper }}>
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <div className="max-w-[48em] px-5 sm:px-7 pb-5 sm:pb-6 text-[14px] sm:text-[15.5px] leading-relaxed text-stone-600 border-t border-stone-100 pt-3.5 sm:pt-4">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── INVESTMENT REQUEST FORM (FINTECH LUXE RELOOKING) ── */}
                <section id="demande" style={{ background: C.cream }}>
                    <div className="mx-auto w-full max-w-[1020px] px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
                        
                        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
                            <p className="cf-eyebrow mb-2 sm:mb-3" style={{ color: C.copper }}>{t('welcome.invest_eyebrow')}</p>
                            <h2 className="cf-serif mb-2 sm:mb-3 text-[28px] xs:text-[34px] sm:text-[44px] font-bold leading-tight tracking-tight"
                                style={{ color: C.ink }}>
                                {t('welcome.invest_title')}
                            </h2>
                            <p className="text-[15px] sm:text-[17px] text-stone-600">
                                {t('welcome.invest_desc')}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[22px] sm:rounded-[26px] border shadow-2xl md:flex bg-white"
                             style={{ borderColor: `${C.ink}14`, boxShadow: '0 30px 70px rgba(34,29,25,0.12)' }}>

                            {/* Left panel */}
                            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 md:w-5/12"
                                 style={{ background: `linear-gradient(155deg, ${C.forest} 0%, #1a271e 100%)`, color: C.cream }}>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6 bg-white/10 text-amber-300">
                                        <Lock className="h-3 w-3" />
                                        Dossier Confidentiel
                                    </div>

                                    <h3 className="cf-serif mb-3 sm:mb-4 text-[22px] sm:text-[26px] font-bold text-white leading-snug">
                                        {t('welcome.invest_why_title')}
                                    </h3>
                                    <p className="mb-6 sm:mb-8 text-[14px] sm:text-[15px] leading-relaxed" style={{ color: C.onForest2 }}>
                                        {t('welcome.invest_why_desc')}
                                    </p>
                                </div>

                                <div className="space-y-3 sm:space-y-4 text-[13.5px] sm:text-[14px]" style={{ color: C.onForest }}>
                                    {[t('welcome.invest_point_1'), t('welcome.invest_point_2'), t('welcome.invest_point_3')].map((point) => (
                                        <div key={point} className="flex items-center gap-2.5 sm:gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                                                  style={{ background: C.copper, color: C.cream }}>✓</span>
                                            <span className="font-medium text-white/90">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 text-xs text-white/60">
                                    Réponse personnalisée assurée par notre équipe sous 24h ouvrées.
                                </div>
                            </div>

                            {/* Right panel — Form */}
                            <div className="p-6 sm:p-8 md:p-10 md:w-7/12" style={{ background: C.cream50 }}>
                                
                                {/* Notification of selected simulation context */}
                                <div className="mb-5 sm:mb-6 p-3 sm:p-3.5 rounded-xl border flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-xs"
                                     style={{ background: '#fdf8f4', borderColor: `${C.copper}30`, color: C.ink }}>
                                    <div className="flex items-center gap-2 truncate">
                                        <Sliders className="h-4 w-4 shrink-0" style={{ color: C.copper }} />
                                        <span className="truncate">Quota simulé : <strong>{cowsCount} {cowsCount > 1 ? 'vaches' : 'vache'}</strong> (~{(cowsCount * 39000).toLocaleString()} MAD)</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => scrollToSection('simulation')}
                                        className="font-bold underline text-amber-800 hover:text-amber-950 shrink-0 self-end xs:self-auto"
                                    >
                                        Modifier
                                    </button>
                                </div>

                                {errors.email && (
                                    <div className="mb-5 sm:mb-6 rounded-[14px] p-3.5 sm:p-4 flex items-start gap-3 border shadow-xs"
                                         style={{ background: '#fdf4f4', borderColor: '#fca5a5', color: '#991b1b' }}>
                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                                        <div className="text-[13.5px] sm:text-[14px] font-medium leading-relaxed">
                                            {t(errors.email)}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                        <div>
                                            <label htmlFor="prenom" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                                                {t('welcome.form_firstname')}
                                            </label>
                                            <TextInput
                                                id="prenom"
                                                type="text"
                                                name="prenom"
                                                value={data.prenom}
                                                className="w-full rounded-xl border-stone-300 text-stone-900 shadow-xs focus:border-[#b45d34] focus:ring-2 focus:ring-[#b45d34]/20 py-2.5 px-3.5 text-sm"
                                                onChange={(e) => setData('prenom', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.prenom} className="mt-1" />
                                        </div>
                                        <div>
                                            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                                                {t('welcome.form_lastname')}
                                            </label>
                                            <TextInput
                                                id="nom"
                                                type="text"
                                                name="nom"
                                                value={data.nom}
                                                className="w-full rounded-xl border-stone-300 text-stone-900 shadow-xs focus:border-[#b45d34] focus:ring-2 focus:ring-[#b45d34]/20 py-2.5 px-3.5 text-sm"
                                                onChange={(e) => setData('nom', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.nom} className="mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                                            {t('welcome.form_email')}
                                        </label>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className={`w-full rounded-xl border-stone-300 text-stone-900 shadow-xs focus:border-[#b45d34] focus:ring-2 focus:ring-[#b45d34]/20 py-2.5 px-3.5 text-sm ${
                                                errors.email ? '!border-red-400 bg-red-50/30' : ''
                                            }`}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                                            {t('welcome.form_phone')}
                                        </label>
                                        <TextInput
                                            id="telephone"
                                            type="tel"
                                            name="telephone"
                                            placeholder="+212 6..."
                                            value={data.telephone}
                                            className="w-full rounded-xl border-stone-300 text-stone-900 shadow-xs focus:border-[#b45d34] focus:ring-2 focus:ring-[#b45d34]/20 py-2.5 px-3.5 text-sm"
                                            onChange={(e) => setData('telephone', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.telephone} className="mt-1" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 mt-4 cursor-pointer"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${C.copper} 0%, #cb703f 100%)`,
                                            boxShadow: '0 8px 24px rgba(180, 93, 52, 0.3)'
                                        }}
                                    >
                                        <span>{t('welcome.form_submit')}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>

                                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 text-[10.5px] sm:text-[11px] text-stone-500 font-medium text-center">
                                        <span className="flex items-center gap-1">
                                            <Lock className="h-3 w-3 text-stone-400" />
                                            Chiffrement 256-bit
                                        </span>
                                        <span className="hidden xs:inline">•</span>
                                        <span>Sans engagement immédiat</span>
                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer style={{ background: C.ink900, color: '#c9c1b4' }}>
                    <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 pt-12 sm:pt-16 pb-10 sm:pb-12">
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-white/10">
                            
                            {/* Brand Info (5 cols) */}
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
                                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 p-1.5">
                                        <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                                    </div>
                                    <span className="cf-serif text-[20px] sm:text-[22px] font-bold tracking-tight text-white">
                                        CoFarm <span style={{ color: C.copper }}>&amp;</span> Partners
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mb-5">
                                    Plateforme d'investissement participatif dans le cheptel laitier au Maroc. Connecter les investisseurs à l'économie agricole réelle avec transparence et rigueur.
                                </p>
                                <div className="cf-serif italic text-sm sm:text-base text-stone-300">
                                    "{t('welcome.footer_quote')}"
                                </div>
                            </div>

                            {/* Quick Navigation (3 cols) */}
                            <div className="md:col-span-3">
                                <h4 className="cf-eyebrow text-[11px] sm:text-xs font-bold text-amber-400 mb-3 sm:mb-4">Navigation</h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
                                    <li><a href="#simulation" className="hover:text-white transition-colors">Simulateur de Rendement</a></li>
                                    <li><a href="#fonctionnement" className="hover:text-white transition-colors">Modèle de Co-Investissement</a></li>
                                    <li><a href="#ferme" className="hover:text-white transition-colors">La Ferme &amp; Traçabilité</a></li>
                                    <li><a href="#securite" className="hover:text-white transition-colors">Garanties &amp; Assurance</a></li>
                                    <li><a href="#faq" className="hover:text-white transition-colors">Foire Aux Questions</a></li>
                                </ul>
                            </div>

                            {/* Contact & Legal (4 cols) */}
                            <div className="md:col-span-4">
                                <h4 className="cf-eyebrow text-[11px] sm:text-xs font-bold text-amber-400 mb-3 sm:mb-4">Contact &amp; Établissement</h4>
                                <div className="space-y-2.5 text-xs sm:text-sm text-stone-400">
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="h-4 w-4 text-stone-400 mt-0.5 shrink-0" />
                                        <span>Ferme Chaouia • Siège Casablanca, Maroc</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                                        <span>contact@cofarm-partners.ma</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Phone className="h-4 w-4 text-stone-400 shrink-0" />
                                        <span>+212 (0) 5 22 00 00 00</span>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-2.5">
                                    <Link href={route('login')} className="text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                                        Espace Client
                                    </Link>
                                    <Link href={route('admin.login')} className="text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                                        Accès Staff
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* Copyright bottom line */}
                        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-stone-500 font-mono gap-3 text-center sm:text-left">
                            <div>
                                {t('welcome.footer_rights', { year: new Date().getFullYear() })}
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 text-stone-500">
                                <span>Protection ONSSA</span>
                                <span>•</span>
                                <span>Assurance MAMDA</span>
                                <span>•</span>
                                <span>Transparence Totale</span>
                            </div>
                        </div>

                    </div>
                </footer>

                {/* ── STICKY QUICK-BAR AT BOTTOM UPON SCROLLING ── */}
                <div className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[680px] transition-all duration-500 ${
                    showStickyBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
                }`}>
                    <div className="cf-glass rounded-full px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-2xl border border-white/70 flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 truncate">
                            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 cf-pulse-dot shrink-0" />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 truncate">
                                <span className="text-[11.5px] sm:text-xs font-bold text-stone-900 truncate">
                                    39 000 MAD <span className="font-normal text-stone-500">/ vache</span>
                                </span>
                                <span className="hidden sm:inline text-stone-400">•</span>
                                <span className="text-[10.5px] sm:text-[11px] font-semibold text-emerald-700">
                                    ~19.5% CAGR
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => scrollToSection('simulation')}
                                className="hidden md:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full text-stone-700 hover:bg-stone-200/60 transition-colors"
                            >
                                <Sliders className="h-3 w-3" />
                                <span>Simuler</span>
                            </button>
                            <a
                                href="#demande"
                                className="rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-[11.5px] sm:text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                                style={{ background: C.copper }}
                            >
                                {locale === 'en' ? 'Invest' : 'Participer'}
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── SUCCESS SUBMISSION MODAL ── */}
            <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} maxWidth="md">
                <div className="p-6 sm:p-10 text-center flex flex-col items-center bg-white rounded-3xl">
                    <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-inner">
                        <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <h3 className="cf-serif text-[24px] sm:text-[28px] font-bold text-stone-900 mb-2 sm:mb-3 tracking-tight">
                        {t('welcome.invest_success_modal_title')}
                    </h3>
                    <p className="text-stone-600 text-[14px] sm:text-[15.5px] leading-relaxed mb-6 sm:mb-8 max-w-[320px]">
                        {t('welcome.invest_success_modal_desc')}
                    </p>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full rounded-xl py-3 sm:py-3.5 text-sm sm:text-[15px] font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                        style={{ background: C.copper, boxShadow: '0 8px 25px rgba(180,93,52,0.3)' }}
                    >
                        {t('welcome.invest_success_modal_btn')}
                    </button>
                </div>
            </Modal>
        </>
    );
}