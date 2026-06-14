export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children, ...props }: any) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btn-premium-secondary ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
