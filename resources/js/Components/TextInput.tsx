import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full rounded-xl border-slate-200 bg-slate-50/50 text-slate-700 text-sm placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:bg-white hover:border-slate-300 ' +
                className
            }
            ref={localRef}
        />
    );
});
