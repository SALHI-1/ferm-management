export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <img src="/images/logo.png" alt="Ferm Project Logo" className="w-8 h-8 object-contain" />
            <span className="font-display text-lg font-bold text-slate-800 tracking-tight">
                Ferm Project
            </span>
        </div>
    );
}
