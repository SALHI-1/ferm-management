import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Milk, Activity, DollarSign } from 'lucide-react';

interface Props {
    totalVaches: number;
    productionDuMois: number;
}

export default function ManagerDashboard({ totalVaches, productionDuMois }: Props) {
    return (
        <AppLayout title="Portail d'Exploitation Agricole (Manager)">
            <Head title="Manager Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-md"><Milk /></div>
                    <div>
                        <p className="text-sm text-gray-500">Production Laitière Globale</p>
                        <p className="text-2xl font-bold text-emerald-600">{productionDuMois} Litres</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-md"><Activity /></div>
                    <div>
                        <p className="text-sm text-gray-500">Tête de Bétail Suivies</p>
                        <p className="text-2xl font-bold text-blue-600">{totalVaches} Bovins</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Actions Rapides du Manager</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-md hover:bg-emerald-700 transition">Enregistrer une Production de Lait</button>
                    <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">Déclarer un Incident Sanitaire</button>
                </div>
            </div>
        </AppLayout>
    );
}