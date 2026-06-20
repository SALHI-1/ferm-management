import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Clock, CheckCircle, XCircle, Ban, Filter, 
    ChevronDown, Mail, Phone, Calendar, Search
} from 'lucide-react';

interface RequestData {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    status: 'en attente' | 'confirmé' | 'refusé' | 'annulé';
    created_at: string;
}

export default function InvestmentRequests({ requests }: { requests: RequestData[] }) {
    const { flash } = usePage().props as any;
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        const searchString = `${req.prenom} ${req.nom} ${req.email} ${req.telephone}`.toLowerCase();
        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const updateStatus = (id: number, newStatus: string) => {
        router.patch(route('admin.investment-requests.status', id), {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'en attente':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'confirmé':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'refusé':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'annulé':
                return 'bg-slate-100 text-slate-700 border-slate-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'en attente': return <Clock className="w-4 h-4 mr-1.5" />;
            case 'confirmé': return <CheckCircle className="w-4 h-4 mr-1.5" />;
            case 'refusé': return <XCircle className="w-4 h-4 mr-1.5" />;
            case 'annulé': return <Ban className="w-4 h-4 mr-1.5" />;
            default: return null;
        }
    };

    return (
        <AppLayout title="Demandes d'Investissement">
            <Head title="Demandes d'Investissement" />

            {flash?.success && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    {flash.success}
                </div>
            )}

            {/* Header / Filters */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Toutes les demandes</h2>
                    <p className="text-sm text-slate-500 mt-1">Gérez les demandes de participation au programme CoFarm Dairy Partners.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-64 transition-all"
                        />
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none w-full sm:w-auto cursor-pointer"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="en attente">En attente</option>
                            <option value="confirmé">Confirmé</option>
                            <option value="refusé">Refusé</option>
                            <option value="annulé">Annulé</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Investisseur</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Date de demande</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-800">{req.prenom} {req.nom}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {req.email}</div>
                                                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {req.telephone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(req.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(req.status)}`}>
                                                {getStatusIcon(req.status)}
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {req.status === 'en attente' && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateStatus(req.id, 'confirmé')}
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Confirmer"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(req.id, 'refusé')}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Refuser"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {req.status !== 'annulé' && req.status !== 'en attente' && (
                                                     <button 
                                                     onClick={() => updateStatus(req.id, 'annulé')}
                                                     className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                                                     title="Annuler"
                                                 >
                                                     <Ban className="w-5 h-5" />
                                                 </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p>Aucune demande trouvée.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
