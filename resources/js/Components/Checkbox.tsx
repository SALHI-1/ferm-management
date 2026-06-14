export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-md border-slate-300 text-brand-600 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 hover:border-slate-400 ' +
                className
            }
        />
    );
}
