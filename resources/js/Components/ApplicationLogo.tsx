import { Milestone } from 'lucide-react';

export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="p-1.5 bg-brand-600 rounded-lg">
                <Milestone className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-slate-800 tracking-tight">
                Ferm Project
            </span>
        </div>
    );
}
