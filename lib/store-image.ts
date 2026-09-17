/** Catalog photos that live on this site, or on the WhatsApp app host. */
const AI_ORIGIN = 'https://ai.greencup4u.com';

export function storeImageSrc(url: string | null | undefined): string {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith(`${AI_ORIGIN}/products/`)) {
        return trimmed.slice(AI_ORIGIN.length);
    }
    return trimmed;
}

export function isRemoteStoreImage(url: string): boolean {
    return /^https?:\/\//i.test(url) && !url.includes('greencup4u.com/products/');
}
