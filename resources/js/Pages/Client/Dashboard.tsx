import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { TrendingUp, Coins } from 'lucide-react';

interface Props {
    investissements: Array<{ id: number; type_investissement: string; part_possedee: number; date_investissement: string; vache: { numero_ticket: string; sexe: string } }>;
}

export default function ClientDashboard({ investissements }: Props) {
    return (
        <AppLayout title="Espace Partenaire — Mes Investissements">
            <Head title="Mon Tableau de Bord" />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-sm text-blue-800 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-200">
                👋 Bienvenue dans votre espace sécurisé. Les données ci-dessous sont présentées en temps réel et en <strong>lecture seule</strong>.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-700 rounded-md"><Coins /></div>
                    <div>
                        <p className="text-sm text-gray-500">Contrats d'investissements actifs</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{investissements.length} Contrats</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Détails de mes actifs</h3>
                </div>
                <div className="p-5 space-y-4">
                    {investissements.map((inv) => (
                        <div key={inv.id} className="border border-gray-100 dark:border-gray-700 rounded-md p-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Bovin Rattaché</span>
                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Ticket n° {inv.vache.numero_ticket}</p>
                                <span className="text-xs text-gray-500">Date d'engagement : {inv.date_investissement}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded">
                                    Type : {inv.type_investissement === 'complet' ? 'Plein (100%)' : 'Demi-part (50%)'}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Quote-part : {inv.part_possedee * 100}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}