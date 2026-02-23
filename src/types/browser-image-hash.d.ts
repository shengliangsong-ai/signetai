declare module 'browser-image-hash' {
    export function dHash(image: HTMLImageElement, bits: number): Promise<string>;
}
