import { HTMLAttributes } from 'react';

export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-rose-500 font-medium animate-slide-down ' + className}
        >
            {message}
        </p>
    ) : null;
}
