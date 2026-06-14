export default function DangerButton({
    className = '',
    disabled,
    children, ...props }: any) {
    return (
        <button
            {...props}
            className={
                `btn-premium-danger ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
