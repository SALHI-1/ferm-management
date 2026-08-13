import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Shield, BarChart3, Users, Globe, Check } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import Dropdown from '@/Components/Dropdown';

import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login({ auth, status, canResetPassword }: any) {
    const { locale } = usePage().props as any;
    const { t } = useTrans();
    
    const toggleLocale = locale === 'en' ? 'fr' : 'en';
    const toggleLabel = locale === 'en' ? 'FR' : 'EN';
    
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
        { icon: Shield, title: t('login.feature_1_title'), desc: t('login.feature_1_desc') },
        { icon: BarChart3, title: t('login.feature_2_title'), desc: t('login.feature_2_desc') },
        { icon: Users, title: t('login.feature_3_title'), desc: t('login.feature_3_desc') },
    ];

    return (
        <>
            <Head title={t('login.title')} />
            <div className="min-h-screen bg-cream-50 font-sans flex flex-col md:flex-row relative">
                
                {/* Language Switcher */}
                <div className="absolute top-6 right-6 z-50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-full p-2 text-ink-900 bg-cream-50 hover:bg-cream border border-ink/10 shadow-sm transition-all duration-200"
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
                </div>

                {/* Left Side - Info & Branding */}
                <div className="w-full md:w-1/2 lg:w-7/12 relative overflow-hidden flex flex-col p-8 md:p-16 justify-between bg-ink">
                    {/* Background Video */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src="/videos/ferm-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Dark Overlay for readability */}
                    <div className="absolute inset-0 bg-ink/75" />

                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/10 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-3 mb-12">
                        <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-2xl font-semibold text-cream tracking-tight font-display">CoFarm & Partners</span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <div className="inline-flex items-center self-start gap-2 bg-forest/10 text-onForest px-4 py-1.5 rounded-full text-sm font-medium mb-6 ring-1 ring-forest/20">
                            <span className="w-2 h-2 bg-copper rounded-full" />
                            {t('login.badge')}
                        </div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-cream leading-[1.1] tracking-tight mb-6 font-display" dangerouslySetInnerHTML={{ __html: t('login.heading') }}>
                        </h1>
                        <p className="text-lg text-onForest-2 leading-relaxed mb-12 max-w-lg">
                            {t('login.subheading')}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="p-2.5 bg-ink-900/80 rounded-lg ring-1 ring-ink/60 shrink-0">
                                        <feature.icon className="h-5 w-5 text-copper" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-cream">{feature.title}</h3>
                                        <p className="text-sm text-onForest mt-0.5">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="relative z-10 mt-12">
                        <p className="text-sm text-onForest">
                            {t('login.footer', { year: new Date().getFullYear() })}
                        </p>
                    </footer>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8 md:p-12 bg-cream-50">
                    <div className="w-full max-w-md bg-cream border border-ink/10 shadow-sm rounded-xl p-8">
                        {auth.user ? (
                            <div className="text-center py-8 space-y-6">
                                <h2 className="text-2xl font-semibold text-ink-900 tracking-tight font-display">{t('login.already_logged_in')}</h2>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex w-full justify-center items-center gap-2 px-4 py-3 rounded-lg font-medium bg-forest text-cream hover:bg-forest-600 transition-all duration-200 active:scale-95"
                                >
                                    {t('login.go_to_dashboard')} <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8 space-y-1">
                                    <h2 className="text-2xl font-semibold text-ink-900 tracking-tight font-display">{t('login.welcome_back')}</h2>
                                    <p className="text-sm text-ink/70">{t('login.login_desc')}</p>
                                </div>

                                {status && (
                                    <div className="mb-6 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="email" value={t('login.email')} className="text-ink/80" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1.5 block w-full rounded-lg border-ink/20 text-ink-900 bg-cream-50/50 focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none transition-all duration-200 ease-in-out"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password" value={t('login.password')} className="text-ink/80" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1.5 block w-full rounded-lg border-ink/20 text-ink-900 bg-cream-50/50 focus:ring-2 focus:ring-forest/20 focus:border-forest outline-none transition-all duration-200 ease-in-out"
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
                                            <span className="text-sm text-ink/70">
                                                {t('login.remember_me')}
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-copper hover:text-copper-300 transition-all duration-200"
                                            >
                                                {t('login.forgot_password')}
                                            </Link>
                                        )}
                                    </div>

                                    <PrimaryButton
                                        className="w-full justify-center !py-3 !text-sm !rounded-lg !bg-forest hover:!bg-forest-600 transition-all duration-200 active:scale-95"
                                        disabled={processing}
                                    >
                                        {t('login.submit')}
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