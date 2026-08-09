import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Activity, Clock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useTrans } from '@/Hooks/useTrans';

interface TraceabilityLog {
    id: number;
    action_type: string;
    description: string;
    created_at: string;
    manager: {
        id: number;
        nom: string;
        prenom: string;
    };
}

interface PaginatedData {
    data: TraceabilityLog[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
}

interface Props {
    initialLogs: PaginatedData;
}

export default function Traceability({ initialLogs }: Props) {
    const { t } = useTrans();
    const { locale } = usePage().props as any;

    const [logs, setLogs] = useState<TraceabilityLog[]>(initialLogs.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialLogs.next_page_url);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (!nextPageUrl) return;
        setLoading(true);
        try {
            const response = await axios.get(nextPageUrl, {
                headers: { Accept: 'application/json' }
            });
            setLogs(prev => [...prev, ...response.data.data]);
            setNextPageUrl(response.data.next_page_url);
        } catch (error) {
            console.error("Erreur lors du chargement des notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', options);
    };

    return (
        <AppLayout title={t('traceability.app_layout_title')}>
            <Head title={t('traceability.head_title')} />

            <div className="space-y-8">
                <div className="card-premium">
                    <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="bg-brand-100 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-brand-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-forest tracking-tight">{t('traceability.section_title')}</h2>
                    </div>

                    <div className="space-y-6">
                        {logs.length > 0 ? (
                            <>
                                <div className="relative border-l border-slate-200 ml-4 space-y-8">
                                    {logs.map((log) => (
                                        <div key={log.id} className="relative pl-8">
                                            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-brand-500 bg-white ring-4 ring-white"></div>
                                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                                                <h3 className="text-base font-bold text-forest">
                                                    {log.manager?.nom} {log.manager?.prenom}
                                                    <span className="text-sm font-normal text-slate-500 ml-2">({log.action_type})</span>
                                                </h3>
                                                <time className="flex items-center text-xs font-medium text-slate-500 mt-1 sm:mt-0">
                                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                                    {formatDate(log.created_at)}
                                                </time>
                                            </div>
                                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                                                {log.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {nextPageUrl && (
                                    <div className="pt-6 flex justify-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="btn-premium-secondary flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {t('traceability.loading')}
                                                </>
                                            ) : (
                                                t('traceability.load_more')
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-slate-900">{t('traceability.empty_title')}</h3>
                                <p className="mt-1 text-slate-500">{t('traceability.empty_description')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}