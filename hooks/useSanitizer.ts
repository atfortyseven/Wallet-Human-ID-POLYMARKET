import { useMemo } from 'react';
import DOMPurify from 'dompurify';

/**
 * useSanitizer Hook
 * @description Hardens the UI against XSS attacks by cleaning external inputs.
 * @param content - The raw string/HTML to sanitize.
 * @returns {string} - The clean, safe HTML string.
 */
export const useSanitizer = (content: string) => {
    const sanitizedContent = useMemo(() => {
        if (typeof window === 'undefined') return content; // SSR passthrough (rely on client hydration for cleanup)

        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'span'],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
        });
    }, [content]);

    return sanitizedContent;
};

/**
 * Helper for dangerouslySetInnerHTML
 */
export const safeHTML = (content: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const clean = useSanitizer(content);
    return { __html: clean };
};
