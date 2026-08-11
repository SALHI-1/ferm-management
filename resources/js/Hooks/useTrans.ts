import { usePage } from '@inertiajs/react';

export function useTrans() {
    const { translations } = usePage().props as any;
    
    const t = (key: string, replace?: Record<string, string | number>) => {
        let translation = key.split('.').reduce((obj, k) => (obj || {})[k], translations);
        
        if (translation === undefined) {
            return key;
        }

        if (replace && typeof translation === 'string') {
            Object.keys(replace).forEach(replaceKey => {
                translation = (translation as string)
                    .replace(new RegExp('{{' + replaceKey + '}}', 'g'), String(replace[replaceKey]))
                    .replace(new RegExp(':' + replaceKey + '\\b', 'g'), String(replace[replaceKey]));
            });
        }

        return translation;
    };

    return { t };
}
